# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a personal website/blog built with a **Next.js frontend** and **Strapi CMS backend** architecture:

- **`frontend/`** - Next.js 15 application with static export capability
- **`backend/`** - Strapi 5.4.0 CMS with TypeScript
- **`posts/`** - Markdown files for blog posts

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm run dev          # Start development server with Turbopack
npm run build        # Build for production + optimize images
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (Strapi)
```bash
cd backend
npm run develop      # Start development server with auto-reload
npm run build        # Build admin panel
npm run start        # Start production server
npm run seed:example # Seed database with example data
```

## Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + SCSS modules + Styled Components
- **Content**: MDX support for rich content + Strapi CMS integration
- **Fonts**: Google Fonts (Roboto, Work Sans)
- **Image Optimization**: next-image-export-optimizer for static export
- **Analytics**: Google Analytics integration
- **Deployment**: Static export (`output: 'export'`)

Key frontend components:
- `src/app/layout.tsx` - Root layout with header navigation and theme toggle
- `src/app/_components/LightDarkToggle/` - Dark/light mode toggle
- `src/api/` - Strapi CMS integration (getPosts, getProjects)
- `src/resources/` - TypeScript types for Strapi content types

### Backend Architecture
- **CMS**: Strapi 5.4.0 with TypeScript
- **Database**: SQLite (better-sqlite3)
- **Content Types**: Article, Author, Category, Project, Tag, About, Global
- **API Structure**: RESTful endpoints with customizable controllers/services
- **File Storage**: Local uploads with image processing
- **Documentation**: Auto-generated API docs available

Content types are organized in `src/api/` with standard Strapi structure:
- `content-types/` - Schema definitions
- `controllers/` - Request handlers
- `routes/` - URL routing
- `services/` - Business logic

### Data Flow
1. Content managed through Strapi admin panel
2. Frontend fetches data via Strapi REST API
3. Static pages generated at build time
4. Images optimized and served statically

## Key Configuration

### Next.js Configuration
- Static export with custom image loader
- MDX support for markdown content
- Remote image patterns for Strapi integration
- Image optimization with WEBP conversion

### Strapi Configuration
- TypeScript enabled
- SQLite database
- File uploads configured
- Documentation plugin enabled
- Cloud plugin for deployment

## Content Management

### Blog Posts - Markdown-Driven Workflow
- **Source of truth**: Markdown files in `posts/` directory with frontmatter
- **CMS Integration**: Strapi stores articles but can be synced from markdown
- **Workflow**: Write in markdown → Import to Strapi → Deploy frontend

#### Blog Post Commands
```bash
cd backend
npm run export-posts    # Export Strapi articles to markdown files
npm run manage-tags     # Create missing tags from markdown files
npm run import-posts    # Import markdown files to Strapi CMS
```

#### Tag Management Workflow
**Before importing posts with new tags:**
1. Write your markdown files with tags in frontmatter
2. Run `npm run manage-tags` to analyze and create missing tags
3. The script will prompt you to confirm tag creation
4. Then run `npm run import-posts` to import posts

**Tag Requirements:**
- Import script requires all tags to exist in Strapi first
- Use `npm run manage-tags` to create missing tags
- Script shows helpful warnings for missing tags
- Tags are automatically normalized to kebab-case (lowercase with hyphens)

**Tag Drift Prevention:**
- Check `backend/scripts/suggested-tags.md` for recommended tags before creating new ones
- Tag management script suggests similar existing tags to prevent duplicates
- Use 3-7 tags per post, favoring reusable general tags over one-off specific tags
- Tags are normalized: "Technical Analysis" → "technical-analysis"

#### Markdown File Structure
```yaml
---
title: "Post Title"
description: "Brief description (max 80 chars)"
slug: "custom-slug"
author: "Chad"  # defaults to "Chad" if not specified
category: "category-name"  
tags: ["tag1", "tag2", "tag3"]
cover: "/path/to/image.jpg"
project: "project-slug"
publishedAt: "2024-01-15T10:30:00.000Z"  # custom publication date
createdAt: "2024-01-15T10:30:00.000Z"    # custom creation date
updatedAt: "2024-01-15T10:30:00.000Z"    # custom update date
autoCreatedAt: "2024-01-15T10:30:00.000Z"  # auto-set by script if createdAt missing
autoUpdatedAt: "2024-01-15T10:30:00.000Z"  # auto-set by script if updatedAt missing
published: true
---

# Your markdown content here
```

#### Import Script Features
- **Smart date handling**: Auto-generates timestamps if not provided
- **Smart author matching**: "Chad" → "Chad Furman", uses existing authors
- **Tag management**: Requires existing tags, shows warnings for missing ones
- **Category matching**: Auto-creates missing categories or uses existing ones
- **Collision detection**: Updates existing posts based on slug matching
- **Rich content**: Converts markdown to Strapi's rich-text blocks

### Projects
- Stored in Strapi as "Project" content type
- Portfolio/showcase items
- Rich content with images and descriptions

### Content Workflow
1. Write blog posts as markdown files in `posts/` directory
2. Run `npm run import-posts` to sync to Strapi CMS
3. Frontend automatically fetches from Strapi API
4. Use `npm run export-posts` to backup Strapi content to markdown

## Claude Code Learnings

### Authentication & Permissions Issues (Dec 2025)
**Problem**: Scripts failing with 401/403 errors when accessing Strapi API
**Root Cause**: Users-permissions plugin requires public access for API endpoints
**Solution**: 
- Enable public access in Strapi admin: Settings → Users & Permissions → Roles → Public → Tag/Article permissions
- Scripts use admin authentication but API endpoints need public permissions for create/read operations
- For local development, enabling public access is acceptable

### API Validation Issues (Dec 2025)
**Problem**: Import-posts script failing with ValidationError on `createdAt`/`updatedAt` fields
**Root Cause**: Strapi v5 automatically manages timestamp fields and rejects API attempts to set them
**Solution**: 
- Remove `createdAt`/`updatedAt` from API payloads - Strapi manages these automatically
- Keep timestamp logic for markdown file management but don't send to API
- Use `documentId` instead of `id` for updates in Strapi v5

### Tag Normalization & Duplicates (Dec 2025)
**Problem**: Inconsistent tag naming between markdown and Strapi causing import failures
**Enhancement**: Added comprehensive tag management to `manage-tags` script:
- **Automatic normalization**: "Technical Analysis" → "technical-analysis"
- **Duplicate detection**: Find and remove duplicate tags keeping oldest instance
- **Markdown synchronization**: Update markdown files with normalized tag names
- **Validation**: Check all required tags exist before import

### Build Pipeline Dependencies (Dec 2025)
**Problem**: Frontend build failing due to missing posts/data in Strapi
**Root Cause**: Static generation requires all content to be available at build time
**Solution**: Ensure proper workflow sequence:
1. Export posts from Strapi (backup)
2. Manage tags (normalize and create missing)
3. Import posts to Strapi (with all tags available)
4. Build frontend (can now fetch complete data)

### Environment Configuration
**Required Setup**:
- `.env` file in `backend/` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` for script authentication
- Strapi must be running (`npm run develop`) before running import/export scripts
- Public permissions enabled for Tag and Article content types

### Script Enhancements Made
1. **Enhanced `manage-tags.js`**:
   - Added duplicate tag detection and removal
   - Added markdown file tag normalization
   - Improved error handling and user prompts
   - Uses public API for better reliability

2. **Fixed `import-posts.js`**:
   - Removed invalid timestamp fields from API calls
   - Added proper Strapi v5 `documentId` support for updates
   - Enhanced debugging output
   - Improved authentication with admin login

3. **Authentication Flow**:
   - Scripts authenticate via `/admin/login` endpoint
   - Use admin token for authenticated operations
   - Fall back gracefully when auth fails

### Recommended Workflow
For smooth content management:
```bash
# From backend directory:
npm run export-posts    # Backup current Strapi content
npm run manage-tags     # Normalize tags and remove duplicates
npm run import-posts    # Import markdown files to Strapi

# From frontend directory:
npm run build          # Build static site with updated content
```

### Syntax Highlighting Implementation (Dec 2025)
**Problem**: Code blocks with poor readability, especially C macros and preprocessor directives
**Solution**: Implemented Prism.js with custom theme optimized for technical content
**Key Features**:
- **Enhanced C/C++ macro highlighting**: Distinct colors for `#define`, `#if`, preprocessor directives
- **Dual theme support**: Dark mode (One Dark Pro inspired) and light mode (GitHub inspired)
- **Language-specific optimizations**: C, C++, Rust, JavaScript, TypeScript, Bash, YAML, JSON
- **Infinite loop prevention**: Fixed MutationObserver causing build hangs
- **Accessibility**: Proper contrast ratios and readable colors in both themes

**Technical Implementation**:
- Prism.js core with language components
- Custom CSS with `!important` flags for theme overrides
- PrismLoader component for client-side highlighting
- Comprehensive color scheme with fallbacks
- Language labels on code blocks
- Custom scrollbar styling for long code blocks

**Color Optimizations**:
- **Dark theme**: Bright, glowing colors for macros with text shadows
- **Light theme**: Deep, contrasting colors (`#8b3500`, `#7c3500`) for readability
- **Problem solved**: Removed harsh orange `#ffa657` that clashed with light backgrounds

### Interactive Management Tool (Dec 2025)
**Created**: `manage.js` - Interactive CLI tool for complete workflow management
**Features**:
- **One-command workflow**: Complete export→tags→import→build process
- **Interactive menu**: User-friendly interface for all operations  
- **Automatic Strapi management**: Start/check server status
- **Status monitoring**: Project health and build state
- **Error handling**: Graceful failure recovery with user prompts
- **Flexible execution**: Interactive mode (`-i`) or direct workflow execution

**Usage**:
```bash
./manage.js -i          # Interactive mode with menu
./manage.js             # Run default workflow directly
```