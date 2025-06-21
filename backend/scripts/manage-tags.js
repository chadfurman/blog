const axios = require('axios');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const readline = require('readline');
require('dotenv').config();

// Configuration
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337/api';
const POSTS_DIR = path.join(__dirname, '../../posts');

// Authentication
let authToken = null;

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

async function authenticateWithStrapi() {
  try {
    const authUrl = `${STRAPI_API_URL.replace('/api', '')}/admin/login`;
    console.log(`🔐 Attempting authentication at: ${authUrl}`);
    console.log(`🔐 Using email: ${process.env.ADMIN_EMAIL}`);
    
    const response = await axios.post(authUrl, {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });
    
    if (response.data && response.data.data && response.data.data.token) {
      authToken = response.data.data.token;
      console.log('🔐 Successfully authenticated with Strapi');
      return true;
    } else {
      console.error('❌ No token in response:', response.data);
    }
  } catch (error) {
    console.error('❌ Failed to authenticate with Strapi:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    return false;
  }
  return false;
}

async function manageTags() {
  try {
    console.log('🏷️  Tag Management Tool\n');

    // Authenticate with Strapi first
    const authenticated = await authenticateWithStrapi();
    if (!authenticated) {
      console.error('❌ Authentication failed. Cannot proceed.');
      process.exit(1);
    }

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
    const { uniqueTags: strapiTags, allTags } = await getTagsFromStrapi();
    console.log(`\n🌐 Found ${strapiTags.size} unique tags in Strapi:`);
    console.log(Array.from(strapiTags).map(tag => `   - ${tag}`).join('\n'));

    // Check for and handle duplicate tags
    const duplicates = findDuplicateTags(allTags);
    if (duplicates.size > 0) {
      console.log(`\n⚠️  Found ${duplicates.size} duplicate tags:`);
      for (const [tagName, instances] of duplicates) {
        console.log(`   - "${tagName}": ${instances.length} instances (IDs: ${instances.map(t => t.id).join(', ')})`);
      }
      
      const removeDuplicatesAnswer = await prompt('\nDo you want to remove duplicate tags? (yes/no): ');
      
      if (removeDuplicatesAnswer.toLowerCase() === 'yes' || removeDuplicatesAnswer.toLowerCase() === 'y') {
        console.log('\n🧹 Removing duplicate tags...');
        await removeDuplicateTags(duplicates);
        console.log('\n✅ Duplicate removal completed!');
        
        // Refresh tag list after cleanup
        const { uniqueTags: updatedStrapiTags } = await getTagsFromStrapi();
        console.log(`\n🔄 Updated tag count: ${updatedStrapiTags.size} unique tags`);
      }
    }

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
    const createAnswer = await prompt('\nDo you want to create these tags in Strapi? (yes/no): ');
    
    if (createAnswer.toLowerCase() === 'yes' || createAnswer.toLowerCase() === 'y') {
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

    // Ask if user wants to normalize tags in markdown files
    if (tagMappings.size > 0) {
      const normalizeAnswer = await prompt('\nDo you want to normalize tags in markdown files? (yes/no): ');
      
      if (normalizeAnswer.toLowerCase() === 'yes' || normalizeAnswer.toLowerCase() === 'y') {
        console.log('\n📝 Normalizing tags in markdown files...');
        await normalizeTagsInMarkdownFiles(tagMappings);
        console.log('\n✅ Tag normalization completed!');
      } else {
        console.log('\n⏭️  Tag normalization skipped.');
      }
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
  let allTags = [];
  
  try {
    // Use public API directly since it's working
    console.log(`🔍 Fetching tags from: ${STRAPI_API_URL}/tags`);
    const response = await axios.get(`${STRAPI_API_URL}/tags`);
    
    if (response.data && response.data.data) {
      allTags = response.data.data;
      allTags.forEach(tag => {
        if (tag.tag) {
          tags.add(tag.tag);
        }
      });
      console.log(`✅ Found ${response.data.data.length} total tags (${tags.size} unique) in Strapi`);
    }
  } catch (error) {
    console.warn('⚠️  Could not fetch tags from Strapi:', error.message);
    if (error.response) {
      console.warn('⚠️  Response status:', error.response.status);
      console.warn('⚠️  Response data:', error.response.data);
    }
  }
  
  return { uniqueTags: tags, allTags };
}

async function createTag(tagName) {
  try {
    console.log(`🏷️  Creating tag "${tagName}" via public API`);
    
    const response = await axios.post(`${STRAPI_API_URL}/tags`, {
      data: { 
        tag: tagName,
        publishedAt: new Date().toISOString()
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

function findDuplicateTags(allTags) {
  const tagGroups = new Map();
  
  // Group tags by their tag name
  allTags.forEach(tag => {
    if (!tagGroups.has(tag.tag)) {
      tagGroups.set(tag.tag, []);
    }
    tagGroups.get(tag.tag).push(tag);
  });
  
  // Filter to only duplicates (more than 1 instance)
  const duplicates = new Map();
  for (const [tagName, instances] of tagGroups) {
    if (instances.length > 1) {
      duplicates.set(tagName, instances);
    }
  }
  
  return duplicates;
}

async function removeDuplicateTags(duplicates) {
  for (const [tagName, instances] of duplicates) {
    // Keep the first instance (oldest), remove the rest
    const [keepTag, ...removeTags] = instances.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    console.log(`   🔄 Keeping "${tagName}" (ID: ${keepTag.id}), removing ${removeTags.length} duplicates`);
    
    for (const removeTag of removeTags) {
      try {
        await axios.delete(`${STRAPI_API_URL}/tags/${removeTag.documentId}`);
        console.log(`   ✅ Removed duplicate "${tagName}" (ID: ${removeTag.id})`);
      } catch (error) {
        console.error(`   ❌ Failed to remove duplicate "${tagName}" (ID: ${removeTag.id}):`, error.message);
      }
    }
  }
}

async function normalizeTagsInMarkdownFiles(tagMappings) {
  const markdownFiles = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  
  for (const filename of markdownFiles) {
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    let hasChanges = false;
    
    // Normalize tags in frontmatter
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      const originalTags = [...frontmatter.tags];
      const normalizedTags = frontmatter.tags.map(tag => {
        if (tagMappings.has(tag)) {
          hasChanges = true;
          return tagMappings.get(tag);
        }
        return tag;
      });
      
      if (hasChanges) {
        frontmatter.tags = normalizedTags;
        
        // Reconstruct the file with normalized tags
        const newContent = matter.stringify(content, frontmatter);
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        console.log(`   ✅ Updated tags in: ${filename}`);
        
        // Show the changes
        const changedTags = [];
        originalTags.forEach((originalTag, index) => {
          const newTag = normalizedTags[index];
          if (originalTag !== newTag) {
            changedTags.push(`"${originalTag}" → "${newTag}"`);
          }
        });
        
        if (changedTags.length > 0) {
          console.log(`      ${changedTags.join(', ')}`);
        }
      }
    }
    
    if (!hasChanges) {
      console.log(`   ⏭️  No changes needed in: ${filename}`);
    }
  }
}

// Run the tag management
if (require.main === module) {
  manageTags();
}

module.exports = { manageTags };