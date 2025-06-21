const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Configuration
const STRAPI_API_URL = process.env.STRAPI_API_URL || 'http://localhost:1337/api';
const POSTS_DIR = path.join(__dirname, '../../posts');

async function exportPosts() {
  try {
    console.log('🚀 Starting export of Strapi articles to markdown...');

    // Ensure posts directory exists
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
      console.log(`✅ Created posts directory: ${POSTS_DIR}`);
    }

    // Fetch reference data first
    console.log('📚 Fetching reference data...');
    const [authorsRes, categoriesRes, tagsRes, projectsRes] = await Promise.all([
      axios.get(`${STRAPI_API_URL}/authors`).catch(err => ({ data: { data: [] } })),
      axios.get(`${STRAPI_API_URL}/categories`).catch(err => ({ data: { data: [] } })),
      axios.get(`${STRAPI_API_URL}/tags`).catch(err => ({ data: { data: [] } })),
      axios.get(`${STRAPI_API_URL}/projects`).catch(err => ({ data: { data: [] } }))
    ]);

    const referenceData = {
      authors: authorsRes.data.data || [],
      categories: categoriesRes.data.data || [],
      tags: tagsRes.data.data || [],
      projects: projectsRes.data.data || []
    };

    console.log(`📋 Found: ${referenceData.authors.length} authors, ${referenceData.categories.length} categories, ${referenceData.tags.length} tags, ${referenceData.projects.length} projects`);

    // Export reference data to a separate file for easy reference
    await exportReferenceData(referenceData);

    // Fetch all articles with populated relationships
    const response = await axios.get(`${STRAPI_API_URL}/articles`, {
      params: {
        populate: '*'
      }
    });

    const articles = response.data.data;
    console.log(`📝 Found ${articles.length} articles to export`);

    for (const article of articles) {
      await exportArticle(article, referenceData);
    }

    console.log('✅ Export completed successfully!');
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.error('Full error:', error);
    process.exit(1);
  }
}

async function exportReferenceData(referenceData) {
  const referenceFile = path.join(POSTS_DIR, '_reference.json');
  const formattedData = {
    authors: referenceData.authors.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email
    })),
    categories: referenceData.categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug
    })),
    tags: referenceData.tags.map(t => ({
      id: t.id,
      tag: t.tag
    })),
    projects: referenceData.projects.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description
    }))
  };
  
  fs.writeFileSync(referenceFile, JSON.stringify(formattedData, null, 2));
  console.log(`📋 Exported reference data to: _reference.json`);
}

async function exportArticle(article, referenceData) {
  // Generate filename from slug
  const filename = `${article.slug || article.id}.md`;
  const filepath = path.join(POSTS_DIR, filename);

  // Build frontmatter
  const frontmatter = {
    title: article.title || '',
    description: article.description || '',
    slug: article.slug || '',
    published: article.publishedAt ? true : false
  };

  // Handle dates
  if (article.createdAt) {
    frontmatter.createdAt = new Date(article.createdAt).toISOString();
  }
  if (article.updatedAt) {
    frontmatter.updatedAt = new Date(article.updatedAt).toISOString();
  }
  if (article.publishedAt) {
    frontmatter.publishedAt = new Date(article.publishedAt).toISOString();
  }

  // Handle author
  if (article.author) {
    frontmatter.author = article.author.name || article.author.username;
  }

  // Handle category
  if (article.category) {
    frontmatter.category = article.category.slug || article.category.name;
  }

  // Handle tags
  if (article.tags && article.tags.length > 0) {
    frontmatter.tags = article.tags.map(tag => tag.tag);
  }

  // Handle cover image
  if (article.cover) {
    frontmatter.cover = article.cover.url;
  }

  // Handle project
  if (article.project) {
    frontmatter.project = article.project.slug || article.project.title;
  }

  // Extract content from blocks
  let content = '';
  if (article.blocks && article.blocks.length > 0) {
    content = extractContentFromBlocks(article.blocks);
  }

  // Build markdown file
  const yamlFrontmatter = Object.entries(frontmatter)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
      }
      return `${key}: "${value}"`;
    })
    .join('\n');

  const markdownContent = `---\n${yamlFrontmatter}\n---\n\n${content}`;

  // Write file
  fs.writeFileSync(filepath, markdownContent);
  console.log(`📄 Exported: ${filename}`);
}

function extractContentFromBlocks(blocks) {
  let content = '';
  
  for (const block of blocks) {
    switch (block.__component) {
      case 'shared.rich-text':
        if (block.body) {
          content += block.body + '\n\n';
        }
        break;
      case 'shared.quote':
        if (block.body) {
          content += `> ${block.body}\n\n`;
          if (block.author) {
            content += `> — ${block.author}\n\n`;
          }
        }
        break;
      case 'shared.media':
        if (block.file?.data) {
          const file = block.file.data.attributes;
          content += `![${file.alternativeText || file.name}](${file.url})\n\n`;
        }
        break;
      case 'shared.slider':
        if (block.files?.data) {
          block.files.data.forEach(file => {
            const fileAttr = file.attributes;
            content += `![${fileAttr.alternativeText || fileAttr.name}](${fileAttr.url})\n\n`;
          });
        }
        break;
      default:
        console.warn(`⚠️  Unknown block component: ${block.__component}`);
    }
  }
  
  return content.trim();
}

// Run the export
if (require.main === module) {
  exportPosts();
}

module.exports = { exportPosts };