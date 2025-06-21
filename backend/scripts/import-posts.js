const axios = require('axios');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { format } = require('date-fns');

// Configuration
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337/api';
const POSTS_DIR = path.join(__dirname, '../../posts');
const DEFAULT_AUTHOR = 'Chad';

async function importPosts() {
  try {
    console.log('🚀 Starting import of markdown posts to Strapi...');

    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIR)) {
      console.error(`❌ Posts directory not found: ${POSTS_DIR}`);
      process.exit(1);
    }

    // Load reference data if available
    let referenceData = null;
    const referenceFile = path.join(POSTS_DIR, '_reference.json');
    if (fs.existsSync(referenceFile)) {
      referenceData = JSON.parse(fs.readFileSync(referenceFile, 'utf8'));
      console.log(`📚 Loaded reference data: ${referenceData.authors.length} authors, ${referenceData.categories.length} categories, ${referenceData.tags.length} tags, ${referenceData.projects.length} projects`);
    } else {
      console.log('📚 Fetching reference data from Strapi...');
      referenceData = await fetchReferenceData();
    }

    // Get all markdown files (excluding reference file)
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md') && !file.startsWith('_'));
    console.log(`📝 Found ${files.length} markdown files to import`);

    for (const file of files) {
      await importPost(path.join(POSTS_DIR, file), referenceData);
    }

    console.log('✅ Import completed successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

async function fetchReferenceData() {
  try {
    const [authorsRes, categoriesRes, tagsRes, projectsRes] = await Promise.all([
      axios.get(`${STRAPI_API_URL}/authors`),
      axios.get(`${STRAPI_API_URL}/categories`),
      axios.get(`${STRAPI_API_URL}/tags`),
      axios.get(`${STRAPI_API_URL}/projects`)
    ]);

    return {
      authors: authorsRes.data.data || [],
      categories: categoriesRes.data.data || [],
      tags: tagsRes.data.data || [],
      projects: projectsRes.data.data || []
    };
  } catch (error) {
    console.error('❌ Failed to fetch reference data:', error.message);
    return { authors: [], categories: [], tags: [], projects: [] };
  }
}

async function importPost(filepath, referenceData) {
  const filename = path.basename(filepath);
  console.log(`\n📄 Processing: ${filename}`);

  // Read and parse markdown file
  const fileContent = fs.readFileSync(filepath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);

  // Prepare article data with smart date handling
  const now = new Date();
  const articleData = {
    title: frontmatter.title || path.basename(filename, '.md'),
    description: frontmatter.description || '',
    slug: frontmatter.slug || generateSlug(frontmatter.title || path.basename(filename, '.md')),
  };

  // Handle dates with auto-generation
  if (frontmatter.createdAt) {
    articleData.createdAt = new Date(frontmatter.createdAt).toISOString();
  } else if (frontmatter.autoCreatedAt) {
    articleData.createdAt = new Date(frontmatter.autoCreatedAt).toISOString();
  } else {
    articleData.createdAt = now.toISOString();
    // Update the markdown file with autoCreatedAt
    await updateMarkdownWithAutoDate(filepath, 'autoCreatedAt', now.toISOString());
  }

  if (frontmatter.updatedAt) {
    articleData.updatedAt = new Date(frontmatter.updatedAt).toISOString();
  } else if (frontmatter.autoUpdatedAt) {
    articleData.updatedAt = new Date(frontmatter.autoUpdatedAt).toISOString();
  } else {
    articleData.updatedAt = now.toISOString();
    // Update the markdown file with autoUpdatedAt
    await updateMarkdownWithAutoDate(filepath, 'autoUpdatedAt', now.toISOString());
  }

  if (frontmatter.publishedAt) {
    articleData.publishedAt = new Date(frontmatter.publishedAt).toISOString();
  }

  // Handle author (default to Chad)
  const authorName = frontmatter.author || DEFAULT_AUTHOR;
  const author = findExistingAuthor(authorName, referenceData) || await findOrCreateAuthor(authorName);
  if (author) {
    articleData.author = author.id;
    console.log(`👤 Using author: ${author.name} (ID: ${author.id})`);
  }

  // Handle category
  if (frontmatter.category) {
    const category = findExistingCategory(frontmatter.category, referenceData) || await findOrCreateCategory(frontmatter.category);
    if (category) {
      articleData.category = category.id;
      console.log(`📂 Using category: ${category.name} (ID: ${category.id})`);
    }
  }

  // Handle tags - require existing tags only
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    const tagIds = [];
    const missingTags = [];
    
    for (const tagName of frontmatter.tags) {
      const tag = findExistingTag(tagName, referenceData);
      if (tag) {
        tagIds.push(tag.id);
        console.log(`🏷️  Using tag: ${tag.tag} (ID: ${tag.id})`);
      } else {
        missingTags.push(tagName);
      }
    }
    
    if (missingTags.length > 0) {
      console.warn(`⚠️  Warning: Missing tags for "${articleData.title}": ${missingTags.join(', ')}`);
      console.warn(`   Run 'npm run manage-tags' to create missing tags before importing.`);
    }
    
    if (tagIds.length > 0) {
      articleData.tags = tagIds;
    }
  }

  // Handle project
  if (frontmatter.project) {
    const project = findExistingProject(frontmatter.project, referenceData) || await findProject(frontmatter.project);
    if (project) {
      articleData.project = project.id;
      console.log(`🚀 Using project: ${project.title || project.slug} (ID: ${project.id})`);
    }
  }

  // Convert markdown content to rich text block
  if (content.trim()) {
    articleData.blocks = [
      {
        __component: 'shared.rich-text',
        body: content
      }
    ];
  }

  // Set published status
  const shouldPublish = frontmatter.published !== false;

  // Check if article already exists (by slug)
  const existingArticle = await findArticleBySlug(articleData.slug);
  
  if (existingArticle) {
    console.log(`🔄 Updating existing article: ${articleData.title}`);
    await updateArticle(existingArticle.id, articleData, shouldPublish);
  } else {
    console.log(`📝 Creating new article: ${articleData.title}`);
    await createArticle(articleData, shouldPublish);
  }
}

async function updateMarkdownWithAutoDate(filepath, dateField, dateValue) {
  try {
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Add the auto date field
    frontmatter[dateField] = dateValue;
    
    // Rebuild the file
    const yamlFrontmatter = Object.entries(frontmatter)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    const newContent = `---\n${yamlFrontmatter}\n---\n\n${content}`;
    fs.writeFileSync(filepath, newContent);
    console.log(`📅 Updated ${dateField} in ${path.basename(filepath)}`);
  } catch (error) {
    console.warn(`⚠️  Could not update ${dateField} in ${filepath}:`, error.message);
  }
}

async function findArticleBySlug(slug) {
  try {
    const response = await axios.get(`${STRAPI_API_URL}/articles`, {
      params: {
        filters: { slug: { $eq: slug } }
      }
    });
    return response.data.data[0] || null;
  } catch (error) {
    console.warn(`⚠️  Error finding article by slug ${slug}:`, error.message);
    return null;
  }
}

async function createArticle(articleData, shouldPublish) {
  try {
    const response = await axios.post(`${STRAPI_API_URL}/articles`, {
      data: articleData
    });
    
    const articleId = response.data.data.id;
    
    if (shouldPublish) {
      await publishArticle(articleId);
    }
    
    console.log(`✅ Created article: ${articleData.title} (ID: ${articleId})`);
  } catch (error) {
    console.error(`❌ Failed to create article ${articleData.title}:`, error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function updateArticle(articleId, articleData, shouldPublish) {
  try {
    const response = await axios.put(`${STRAPI_API_URL}/articles/${articleId}`, {
      data: articleData
    });
    
    if (shouldPublish) {
      await publishArticle(articleId);
    }
    
    console.log(`✅ Updated article: ${articleData.title} (ID: ${articleId})`);
  } catch (error) {
    console.error(`❌ Failed to update article ${articleData.title}:`, error.message);
    if (error.response?.data) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function publishArticle(articleId) {
  try {
    await axios.post(`${STRAPI_API_URL}/articles/${articleId}/actions/publish`);
    console.log(`📢 Published article ID: ${articleId}`);
  } catch (error) {
    console.warn(`⚠️  Could not publish article ${articleId}:`, error.message);
  }
}

function findExistingAuthor(name, referenceData) {
  // Try exact name match first
  let author = referenceData.authors.find(a => a.name === name);
  if (author) return author;
  
  // Try case-insensitive match
  author = referenceData.authors.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (author) return author;
  
  // Try partial match (for "Chad" matching "Chad Furman")
  if (name.toLowerCase() === 'chad') {
    author = referenceData.authors.find(a => a.name.toLowerCase().includes('chad'));
    if (author) return author;
  }
  
  return null;
}

function findExistingCategory(name, referenceData) {
  // Try exact name match
  let category = referenceData.categories.find(c => c.name === name);
  if (category) return category;
  
  // Try slug match
  category = referenceData.categories.find(c => c.slug === name);
  if (category) return category;
  
  // Try case-insensitive match
  category = referenceData.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  return category || null;
}

function findExistingProject(slug, referenceData) {
  return referenceData.projects.find(p => p.slug === slug) || null;
}

function findExistingTag(tagName, referenceData) {
  return referenceData.tags.find(t => t.tag === tagName) || null;
}

async function findOrCreateAuthor(name) {
  try {
    // First, try to find existing author
    const response = await axios.get(`${STRAPI_API_URL}/authors`, {
      params: {
        filters: { name: { $eq: name } }
      }
    });
    
    if (response.data.data.length > 0) {
      return response.data.data[0];
    }
    
    // Create new author
    const createResponse = await axios.post(`${STRAPI_API_URL}/authors`, {
      data: { name: name }
    });
    
    console.log(`👤 Created new author: ${name}`);
    return createResponse.data.data;
  } catch (error) {
    console.error(`❌ Error handling author ${name}:`, error.message);
    return null;
  }
}

async function findOrCreateCategory(name) {
  try {
    // First, try to find existing category
    const response = await axios.get(`${STRAPI_API_URL}/categories`, {
      params: {
        filters: { name: { $eq: name } }
      }
    });
    
    if (response.data.data.length > 0) {
      return response.data.data[0];
    }
    
    // Create new category
    const createResponse = await axios.post(`${STRAPI_API_URL}/categories`, {
      data: { 
        name: name,
        slug: generateSlug(name)
      }
    });
    
    console.log(`📂 Created new category: ${name}`);
    return createResponse.data.data;
  } catch (error) {
    console.error(`❌ Error handling category ${name}:`, error.message);
    return null;
  }
}

async function findOrCreateTag(tagName) {
  try {
    // First, try to find existing tag
    const response = await axios.get(`${STRAPI_API_URL}/tags`, {
      params: {
        filters: { tag: { $eq: tagName } }
      }
    });
    
    if (response.data.data.length > 0) {
      return response.data.data[0];
    }
    
    // Create new tag
    const createResponse = await axios.post(`${STRAPI_API_URL}/tags`, {
      data: { tag: tagName }
    });
    
    console.log(`🏷️  Created new tag: ${tagName}`);
    return createResponse.data.data;
  } catch (error) {
    console.error(`❌ Error handling tag ${tagName}:`, error.message);
    return null;
  }
}

async function findProject(projectSlug) {
  try {
    const response = await axios.get(`${STRAPI_API_URL}/projects`, {
      params: {
        filters: { slug: { $eq: projectSlug } }
      }
    });
    return response.data.data[0] || null;
  } catch (error) {
    console.warn(`⚠️  Error finding project ${projectSlug}:`, error.message);
    return null;
  }
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Run the import
if (require.main === module) {
  importPosts();
}

module.exports = { importPosts };