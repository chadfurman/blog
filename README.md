# Chad's Website Management

An interactive management tool for the Next.js + Strapi website.

## Quick Start

### Interactive Mode
```bash
./manage.js -i
```

### Default Workflow (Non-interactive)
```bash
./manage.js
```

This runs the complete workflow:
1. Export posts from Strapi (backup)
2. Manage tags (normalize & remove duplicates)
3. Import posts to Strapi
4. Build frontend

## Features

- 🚀 **One-command workflow** - Complete export → tags → import → build process
- 🏷️ **Smart tag management** - Normalize tags and remove duplicates automatically
- 📦 **Strapi integration** - Auto-start Strapi server if needed
- 🔨 **Frontend building** - Build Next.js static export with image optimization
- 📊 **Status checking** - View project status and health
- 🎯 **Interactive menu** - User-friendly interface for all operations

## Menu Options

1. **Run Default Workflow** - Complete export→tags→import→build process
2. **Export posts** - Backup Strapi articles to markdown files
3. **Manage tags** - Normalize tags and remove duplicates
4. **Import posts** - Import markdown files to Strapi
5. **Build frontend** - Generate static Next.js site
6. **Start/Check Strapi** - Ensure Strapi server is running
7. **Show project status** - Display current project state
8. **Exit** - Quit the management tool

## Prerequisites

- Node.js installed
- Strapi configured with admin credentials in `backend/.env`
- Public permissions enabled for Tag and Article content types

## Project Structure

```
.
├── manage.js              # Management script
├── backend/               # Strapi CMS
│   ├── scripts/          # Import/export scripts
│   └── .env              # Admin credentials
├── frontend/             # Next.js application
└── posts/                # Markdown blog posts
```

## Environment Setup

Ensure `backend/.env` contains:
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
```

## Troubleshooting

- **Strapi not accessible**: Run `./manage.js` option 6 to start Strapi
- **Permission errors**: Enable public access for Tag/Article in Strapi admin
- **Build failures**: Check that posts are imported to Strapi first
- **Tag errors**: Run tag management to normalize and fix duplicates