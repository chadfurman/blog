const axios = require('axios');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const readline = require('readline');

// Configuration
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337/api';
const POSTS_DIR = path.join(__dirname, '../../posts');

// Create readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function normalizeTag(tag) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

function findSimilarTags(newTag, existingTags) {
  const similarities = [];
  
  for (const existingTag of existingTags) {
    // Check for substring matches
    if (existingTag.includes(newTag) || newTag.includes(existingTag)) {
      similarities.push(existingTag);
      continue;
    }
    
    // Check for similar words (split on hyphens/spaces)
    const newWords = newTag.split(/[-\s]+/);
    const existingWords = existingTag.split(/[-\s]+/);
    
    // Check if any words overlap
    const commonWords = newWords.filter(word => existingWords.includes(word));
    if (commonWords.length > 0) {
      similarities.push(existingTag);
      continue;
    }
    
    // Simple Levenshtein distance for close matches
    if (calculateSimilarity(newTag, existingTag) > 0.7) {
      similarities.push(existingTag);
    }
  }
  
  return similarities.slice(0, 3); // Limit to top 3 suggestions
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

async function manageTags() {
  try {
    console.log('🏷️  Tag Management Tool\n');

    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIR)) {
      console.error(`❌ Posts directory not found: ${POSTS_DIR}`);
      process.exit(1);
    }

    // Get all tags from markdown files
    const { normalizedTags: markdownTags, tagMappings } = await getTagsFromMarkdown();
    console.log(`📝 Found ${markdownTags.size} unique normalized tags in markdown files:`);
    console.log(Array.from(markdownTags).map(tag => `   - ${tag}`).join('\n'));
    
    if (tagMappings.size > 0) {
      console.log(`\n🔄 Tag normalizations applied:`);
      for (const [original, normalized] of tagMappings) {
        console.log(`   "${original}" → "${normalized}"`);
      }
    }

    // Get existing tags from Strapi
    const strapiTags = await getTagsFromStrapi();
    console.log(`\n🌐 Found ${strapiTags.size} tags in Strapi:`);
    console.log(Array.from(strapiTags).map(tag => `   - ${tag}`).join('\n'));

    // Find missing tags and suggest similar existing ones
    const missingTags = Array.from(markdownTags).filter(tag => !strapiTags.has(tag));
    
    if (missingTags.length === 0) {
      console.log('\n✅ All tags from markdown files already exist in Strapi!');
      rl.close();
      return;
    }

    console.log(`\n⚠️  Found ${missingTags.length} tags that need to be created:`);
    
    // Check for similar existing tags to prevent drift
    const tagSuggestions = new Map();
    for (const missingTag of missingTags) {
      const suggestions = findSimilarTags(missingTag, Array.from(strapiTags));
      if (suggestions.length > 0) {
        tagSuggestions.set(missingTag, suggestions);
      }
    }
    
    // Display missing tags with suggestions
    for (const tag of missingTags) {
      console.log(`   - ${tag}`);
      const suggestions = tagSuggestions.get(tag);
      if (suggestions && suggestions.length > 0) {
        console.log(`     💡 Similar existing tags: ${suggestions.join(', ')}`);
      }
    }
    
    if (tagSuggestions.size > 0) {
      console.log(`\n💡 Consider using existing similar tags to reduce tag drift.`);
    }

    // Ask user if they want to create the missing tags
    const answer = await prompt('\nDo you want to create these tags in Strapi? (yes/no): ');
    
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      console.log('\n🚀 Creating tags in Strapi...');
      
      for (const tag of missingTags) {
        const created = await createTag(tag);
        if (created) {
          console.log(`✅ Created tag: ${tag}`);
        } else {
          console.log(`❌ Failed to create tag: ${tag}`);
        }
      }
      
      console.log('\n✅ Tag creation completed!');
    } else {
      console.log('\n❌ Tag creation cancelled.');
    }

    rl.close();
  } catch (error) {
    console.error('❌ Error in tag management:', error.message);
    rl.close();
    process.exit(1);
  }
}

async function getTagsFromMarkdown() {
  const normalizedTags = new Set();
  const tagMappings = new Map(); // Track original → normalized mappings
  
  // Get all markdown files
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md') && !file.startsWith('_'));
  
  for (const file of files) {
    const filepath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const { data: frontmatter } = matter(fileContent);
    
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      frontmatter.tags.forEach(originalTag => {
        const normalizedTag = normalizeTag(originalTag);
        if (normalizedTag) { // Only add non-empty normalized tags
          normalizedTags.add(normalizedTag);
          if (originalTag !== normalizedTag) {
            tagMappings.set(originalTag, normalizedTag);
          }
        }
      });
    }
  }
  
  return { normalizedTags, tagMappings };
}

async function getTagsFromStrapi() {
  const tags = new Set();
  
  try {
    // First check if the tags endpoint works
    const response = await axios.get(`${STRAPI_API_URL}/tags`);
    
    if (response.data && response.data.data) {
      response.data.data.forEach(tag => {
        if (tag.tag) {
          tags.add(tag.tag);
        }
      });
    }
  } catch (error) {
    console.warn('⚠️  Could not fetch tags from Strapi:', error.message);
    console.warn('   Tags endpoint might not be configured or accessible.');
  }
  
  return tags;
}

async function createTag(tagName) {
  try {
    const response = await axios.post(`${STRAPI_API_URL}/tags`, {
      data: { 
        tag: tagName,
        publishedAt: new Date().toISOString() // Auto-publish the tag
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error(`❌ Error creating tag "${tagName}":`, error.message);
    if (error.response && error.response.data) {
      console.error('   Details:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Run the tag management
if (require.main === module) {
  manageTags();
}

module.exports = { manageTags };