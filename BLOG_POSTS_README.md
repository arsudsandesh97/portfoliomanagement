# Blog Posts Feature

## Overview

The Blog Posts section allows you to create, manage, and publish blog articles for your portfolio website. This feature includes comprehensive content management, SEO optimization, and tagging capabilities.

## Database Schema

The `blog_posts` table includes the following fields:

### Core Fields
- **id**: UUID (Primary Key, Auto-generated)
- **title**: Text (Required) - The blog post title
- **slug**: Text (Required, Unique) - URL-friendly version of the title
- **excerpt**: Text (Optional) - Short description for listings
- **content**: Text (Required) - Main blog post content in Markdown format
- **cover_image**: Text (Optional) - URL to the cover image
- **author**: Text (Default: "Sandesh Arsud") - Post author name

### Publishing
- **published**: Boolean (Default: false) - Publication status
- **published_at**: Timestamp - Date/time when published
- **reading_time**: Integer - Estimated reading time in minutes
- **views**: Integer (Default: 0) - Number of views
- **is_featured**: Boolean (Default: false) - Featured post flag

### Categorization
- **tags**: Text Array - Array of tags for categorization
- **category**: Text - Primary category

### SEO
- **seo_title**: Text - Title for search engines
- **seo_description**: Text - Meta description
- **seo_keywords**: Text Array - SEO keywords

### Timestamps
- **created_at**: Timestamp (Auto) - Creation date
- **updated_at**: Timestamp (Auto) - Last update date

## Features

### 1. Blog Post Management
- **Create New Posts**: Write and save blog posts with markdown support
- **Edit Posts**: Update existing blog posts
- **Delete Posts**: Remove blog posts with confirmation
- **List View**: Browse all blog posts with filtering and search

### 2. Content Editor
- **Markdown Support**: Write content in Markdown format
- **Live Preview**: See how your content will look
- **Split View**: Edit and preview simultaneously
- **Word Count**: Track word count and estimated reading time
- **Auto-save Indicators**: Visual feedback for unsaved changes

### 3. SEO Optimization
- **Auto-generated Slugs**: URL-friendly slugs from titles
- **SEO Title**: Customizable title for search engines
- **Meta Description**: Search engine description
- **Keywords**: Tag your content for better discoverability

### 4. Organization
- **Categories**: Group posts by category
- **Tags**: Multiple tags per post
- **Featured Posts**: Highlight important posts
- **Search**: Filter posts by title, excerpt, or category

### 5. Publishing Controls
- **Draft/Published**: Toggle publication status
- **Featured Toggle**: Mark posts as featured
- **View Counter**: Track post popularity
- **Publish Date**: Automatic timestamp when published

## Usage

### Creating a New Blog Post

1. Navigate to **Blog Posts** in the sidebar
2. Click the **New Post** button
3. Fill in the required fields:
   - Title (required)
   - Content (required)
   - Excerpt (recommended)
   - Cover Image URL (optional)
4. Add metadata:
   - Category
   - Tags
   - SEO information
5. Toggle **Publish Post** when ready
6. Click **Create Post**

### Editing a Blog Post

1. In the list view, click the **Edit** icon on any post
2. Make your changes
3. Click **Update Post** to save

### Markdown Tips

The content editor supports standard Markdown syntax:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

[Link text](https://example.com)
![Image alt](https://example.com/image.jpg)

`Inline code`

- List item 1
- List item 2

1. Numbered item
2. Another item
```

### Filtering Posts

- **Search**: Use the search bar to find posts by title, excerpt, or category
- **Status Filter**: View all posts, published only, or drafts
- **Featured Filter**: Filter by featured status

## API Methods

The `blogPostsApi` provides the following methods:

### Public Methods
- `fetchPublished()` - Get all published posts
- `fetchFeatured()` - Get featured posts
- `fetchBySlug(slug)` - Get a post by slug
- `fetchByCategory(category)` - Get posts in a category
- `fetchByTag(tag)` - Get posts with a specific tag
- `search(query)` - Search posts

### Admin Methods
- `fetchAll()` - Get all posts (published and drafts)
- `fetchById(id)` - Get a post by ID
- `create(postData)` - Create a new post
- `update(postData)` - Update an existing post
- `delete(id)` - Delete a post
- `incrementViews(id)` - Increment view count

### Utility Methods
- `getCategories()` - Get all unique categories
- `getTags()` - Get all unique tags

## Row Level Security (RLS)

The blog_posts table has the following RLS policies:

- **Public Read**: Anyone can view published posts
- **Authenticated Read**: Authenticated users can view all posts
- **Authenticated Write**: Authenticated users can create, update, and delete posts

## Best Practices

1. **SEO**: Always fill in SEO fields for better search engine visibility
2. **Images**: Use high-quality cover images (recommended: 1200x630px)
3. **Excerpts**: Write compelling excerpts (150-200 characters)
4. **Tags**: Use 3-5 relevant tags per post
5. **Categories**: Use consistent category names
6. **Slugs**: Keep slugs short and descriptive
7. **Draft First**: Save as draft, review, then publish

## Indexes

For optimal performance, the following indexes are created:

- `idx_blog_posts_slug` - ON slug
- `idx_blog_posts_published` - ON (published, published_at DESC)
- `idx_blog_posts_tags` - GIN index for tag searching
- `idx_blog_posts_category` - ON category
- `idx_blog_posts_featured` - ON is_featured (partial index)

## Example Usage

```javascript
// Fetch all published posts
const posts = await blogPostsApi.fetchPublished();

// Get a specific post by slug
const post = await blogPostsApi.fetchBySlug('welcome-to-my-blog');

// Create a new post
const newPost = await blogPostsApi.create({
  title: 'My First Post',
  slug: 'my-first-post',
  content: '# Hello World\n\nThis is my first blog post!',
  excerpt: 'An introduction to my blog',
  category: 'General',
  tags: ['welcome', 'introduction'],
  published: true,
});

// Search posts
const results = await blogPostsApi.search('data analytics');
```

## Troubleshooting

**Issue**: Slug already exists
- **Solution**: Modify the slug to make it unique

**Issue**: Post not visible on public site
- **Solution**: Ensure the `published` toggle is enabled

**Issue**: Images not loading
- **Solution**: Verify image URLs are correct and publicly accessible

**Issue**: Markdown not rendering correctly
- **Solution**: Check markdown syntax and use the preview feature

## Future Enhancements

Potential improvements for the blog section:
- Rich text editor option
- Image upload integration
- Comment system
- Related posts
- Reading progress indicator
- Social sharing buttons
- RSS feed
- Article series/collections
