# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a personal academic website built using the **al-folio** Jekyll theme. It serves as a portfolio for a PhD student at CUHK-Shenzhen, featuring publications, blog posts, projects, and news updates.

## Development Commands

### Local Development with Docker (Recommended)

```bash
# Pull and run the site (first time or after updates)
docker compose pull
docker compose up

# Build from scratch
docker compose up --build

# Use slim version (faster, smaller image)
docker compose -f docker-compose-slim.yml up
```

The site will be available at `http://localhost:8080`.

### Local Development without Docker (Legacy)

```bash
# Install dependencies
bundle install
pip install jupyter  # if working with Jupyter notebooks

# Serve the site locally
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`.

### Build the Static Site

```bash
# Generate static files in _site/
bundle exec jekyll build
```

## Architecture

### Jekyll Theme: al-folio

This repository is based on [al-folio](https://github.com/alshedivat/al-folio), a Jekyll theme designed for academics. The theme has been customized for this specific portfolio.

### Key Directory Structure

- `_config.yml` - Main Jekyll configuration (site settings, plugins, social links, etc.)
- `_pages/` - Static pages (About, Publications, Projects, News, etc.)
- `_posts/` - Blog posts in Markdown format (uses distill layout for academic-style posts)
- `_bibliography/` - BibTeX files for publications (managed by jekyll-scholar plugin)
- `_news/` - News items displayed on the homepage
- `_projects/` - Project descriptions and portfolio items
- `_layouts/` - HTML templates for different page types
- `_includes/` - Reusable HTML components
- `_sass/` - Stylesheets (SCSS)
- `_plugins/` - Custom Jekyll plugins (Ruby scripts for extended functionality)
- `assets/` - Static assets (images, PDFs, JSON data, bibliography files)
- `_site/` - Generated static site (auto-generated, not committed)

### Critical Plugins

The site uses several Jekyll plugins defined in `_config.yml`:

- **jekyll-scholar**: Manages academic publications from BibTeX files
- **jekyll-jupyter-notebook**: Enables embedding Jupyter notebooks in posts
- **jekyll-archives**: Creates archive pages for years, tags, categories
- **jekyll-minifier**: Minifies HTML/CSS/JS for production
- **jekyll-paginate-v2**: Handles pagination for blog posts

Custom plugins in `_plugins/`:
- `google-scholar-citations.rb` - Fetches citation counts from Google Scholar
- `download-3rd-party.rb` - Downloads third-party libraries locally
- `external-posts.rb` - Integrates external blog posts

### Content Management

**Blog Posts** (`_posts/`):
- Use naming convention: `YYYY-MM-DD-title-slug.md`
- Front matter must include: `layout`, `title`, `date`, `description`
- Recommended layout: `distill` for academic-style posts with citations
- Can reference bibliography files: `bibliography: YYYY-MM-DD-title-slug.bib`
- Bibliography files should be placed in `assets/bibliography/`

**Publications** (`_bibliography/papers.bib`):
- Add new publications as BibTeX entries
- Supported custom fields: `preview`, `selected`, `abstract`, `pdf`, `code`, `website`, `slides`, `poster`
- Set `selected={true}` to feature on the homepage
- Preview images should be in `assets/img/publication_preview/`

**News Items** (`_news/`):
- Short announcements displayed on homepage
- Automatically sorted by date
- Keep concise (1-3 sentences)

**Projects** (`_projects/`):
- Project descriptions with optional images
- Displayed on the projects page in a grid layout

**Media Coverage** (`_data/media.yml`):
- Contains media appearances, talks, and coverage
- Format:
  ```yaml
  - name: "Media Name"
    logo: "logo-filename.png"
    url: "https://media-url.com"
    alt: "Alt text description"
  ```
- Logo images should be placed in `assets/img/media/`
- Displayed on the about page in a responsive grid layout

### Configuration

Main settings in `_config.yml`:

- **Site metadata**: Lines 5-19 (title, name, email, URLs)
- **Social links**: Lines 66-104 (GitHub, LinkedIn, Google Scholar, etc.)
- **Blog settings**: Lines 122-156 (pagination, related posts, comments)
- **Collections**: Lines 166-184 (news, projects configurations)
- **Jekyll Scholar**: Lines 288-350 (publication formatting, BibTeX filters)

**Important**: When adding social media links, use the username/ID format without full URLs (e.g., `github_username: username` not `https://github.com/username`).

### Deployment

The site uses GitHub Actions for automatic deployment to GitHub Pages:

1. Push changes to `master` branch
2. GitHub Actions workflow builds the site
3. Static files are deployed to `gh-pages` branch
4. GitHub Pages serves from `gh-pages` branch

The workflow is configured to run automatically on push (since v0.3.5).

### Theme Customization

- Theme colors: Edit `_sass/_themes.scss` (variable: `--global-theme-color`)
- Layout dimensions: `_config.yml` line 49 (`max_width: 800px`)
- Dark mode: Automatically enabled, toggle behavior in `_config.yml` line 405

## Working with Bibliography

When adding new blog posts with citations:

1. Create the blog post markdown file in `_posts/`
2. Create a corresponding `.bib` file in `assets/bibliography/` with the same base name
3. Reference the bibliography in the post's front matter: `bibliography: YYYY-MM-DD-title.bib`
4. Use `{% cite key %}` to cite entries and `{% bibliography %}` to generate the reference list

See existing posts in `_posts/` for examples of the distill layout with citations.

## Common Patterns

### Adding a New Publication

1. Add BibTeX entry to `_bibliography/papers.bib`
2. Add preview image to `assets/img/publication_preview/` (if applicable)
3. Include custom fields: `preview`, `selected`, `abstract`, etc.

### Adding a New Blog Post

1. Create `_posts/YYYY-MM-DD-title-slug.md`
2. Use `distill` layout for academic posts
3. Create `assets/bibliography/YYYY-MM-DD-title-slug.bib` for citations
4. Add preview/thumbnail images to `assets/img/`

### Adding a News Item

1. Create `_news/short-name.md`
2. Include date in front matter
3. Keep content brief

## Dependencies

Ruby gems are managed via `Gemfile`. Key dependencies:

- Jekyll and related plugins (see `Gemfile` for full list)
- `jekyll-scholar` for bibliography management
- `jekyll-jupyter-notebook` for notebook support
- `mini_racer` for JavaScript runtime

## Recent Refactoring Changes

### Awards and Services Data Refactoring

The awards and services content has been moved from hardcoded HTML to centralized YAML data files for better maintainability.

**New Data Files:**
- `_data/awards.yml` - Contains all awards and honors
  ```yaml
  - year: "2024, 2025"
    title: "Award Name"
    description: "Award description"
  ```
- `_data/services.yml` - Contains teaching and reviewing services
  ```yaml
  teaching:
    - semester: "Fall 2025"
      institution: "CUHK-Shenzhen"
      course: "CIE6007 Machine Learning"
      url: "https://www.cuhk.edu.cn/en/course/11167"

  reviewing:
    - name: "Conference/Journal Name"
      url: "https://example.com"
  ```
- `_data/media.yml` - Contains media coverage, talks, and appearances
  ```yaml
  - name: "Media Name"
    logo: "logo-filename.png"
    url: "https://media-url.com"
    alt: "Alt text description"
  ```

**Files Using This Data:**
- `_layouts/about.liquid` - Uses loops for `site.data.awards`, `site.data.services.teaching`, `site.data.services.reviewing`, `site.data.media`
- `_pages/services.md` - Uses loops for teaching and reviewing data
- `_pages/awards.md` - Uses loops for awards data

**Benefits:**
- Single source of truth for content
- No duplication across pages
- Easy updates through YAML files
- Clean separation of content and presentation

### Styling and Script Refactoring

The `about.liquid` layout has been refactored to remove all inline styles and scripts.

**New Files Created:**
- `_sass/_about.scss` - All about page styles including:
  - Layout & container settings
  - Typography & title styles
  - Profile section styling
  - Services & awards card layouts
  - Award expand/collapse styles
  - Media coverage grid layout
  - Dark mode overrides
  - Responsive breakpoints
- `assets/js/awards-expand.js` - Award card expand/collapse functionality

**Files Updated:**
- `assets/css/main.scss` - Added `@import "about"`
- `_layouts/about.liquid` - Cleaned from 389 lines to 167 lines (removed ~200 lines of inline CSS/JS)

**Benefits:**
- Proper separation of concerns
- Styles can be cached by browsers
- SCSS nesting and theme variables
- Easier maintenance and debugging
- Better version control tracking

### Maintenance Guidelines

**Adding Awards:**
```yaml
# Edit _data/awards.yml
- year: "2026"
  title: "New Award Name"
  description: "Award description for the expandable section"
```

**Adding Teaching:**
```yaml
# Edit _data/services.yml under teaching:
  - semester: "Spring 2026"
    institution: "CUHK-Shenzhen"
    course: "New Course Name"
    url: "https://course-url.com"
```

**Adding Reviewing Services:**
```yaml
# Edit _data/services.yml under reviewing:
  - name: "New Conference or Journal"
    url: "https://conference-url.com"
```

**Modifying About Page Styles:**
- Edit `_sass/_about.scss` (not the layout file)
- File is organized with section comments for easy navigation

**Modifying Award Expand Behavior:**
- Edit `assets/js/awards-expand.js` (not inline in layout)

**Adding Media Coverage:**
```yaml
# Edit _data/media.yml
- name: "New Media Outlet"
  logo: "new-logo.png"
  url: "https://media-url.com"
  alt: "Description of the media appearance"
```
- Place logo images in `assets/img/media/`
- Logos should be optimized PNG files with transparent backgrounds
- Recommended max height: 80px for consistent display

**Modifying Media Coverage Styles:**
- Edit `_sass/_about.scss` under the "Media Coverage Section" comment
- Adjust grid layout, card styling, or hover effects as needed

## Notes

- The repository is configured for deployment to `<username>.github.io`
- The site URL is set to `https://richardcsuwandi.github.io`
- Google Analytics is enabled (tracking ID in `_config.yml`)
- Comments are enabled via Giscus (GitHub Discussions-based)
- The theme supports responsive images via ImageMagick (requires local installation for development)
