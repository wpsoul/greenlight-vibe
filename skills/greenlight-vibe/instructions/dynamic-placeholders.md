# Dynamic Placeholders

Dynamic blocks allow you to display content that changes dynamically based on wordpress site data.

When preparing HTML for dynamic content, do not place dynamic values as final text or attributes. Add them via converter instructions:

- `data-gl-dynamic-text="{{PLACEHOLDER}}"`
- `data-gl-dynamic-href="{{PLACEHOLDER}}"`
- `data-gl-dynamic-src="{{PLACEHOLDER}}"`
- `data-gl-dynamic-alt="{{PLACEHOLDER}}"`
- `data-gl-dynamic-title="{{PLACEHOLDER}}"`

Keep fallback content and fallback attributes in the HTML so the structure stays readable before conversion.

Example:

```html
<a href="#" title="Read post" data-gl-dynamic-href="{{POST_URL}}" data-gl-dynamic-title="{{POST_TITLE}}">
    <img src="https://placehold.co/600x400" alt="Post image" data-gl-dynamic-src="{{THUMBNAIL_URL}}" data-gl-dynamic-alt="{{POST_TITLE}}" />
    <h3 data-gl-dynamic-text="{{POST_TITLE}}">Example post title</h3>
    <span data-gl-dynamic-text="{{AUTHOR_NAME}}">Author name</span>
</a>
```

## Basic Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{{POST_ID}}` | Current post ID |
| `{{POST_TITLE}}` | Current post title |
| `{{POST_EXCERPT}}` | Current post excerpt |
| `{{POST_URL}}` | Current post URL |
| `{{POST_DATE}}` | Current post publish date |
| `{{POST_DATE_MODIFIED}}` | Current post last modified date |
| `{{AUTHOR_ID}}` | Post author ID |
| `{{AUTHOR_NAME}}` | Post author name |
| `{{AUTHOR_AVATAR_URL}}` | Post author avatar image URL |
| `{{THUMBNAIL_URL}}` | Current post featured image (thumbnail) URL |
| `{{CURRENT_USER_ID}}` | Logged-in user ID |
| `{{CURRENT_USER_NAME}}` | Logged-in user name |
| `{{CURRENT_OBJECT_ID}}` | Current object ID |
| `{{CURRENT_OBJECT_NAME}}` | Current object name |
| `{{CURRENT_DATE_YMD}}` | Current date (YYYY-MM-DD) |
| `{{CURRENT_DATE_YMD_HMS}}` | Current date and time |
| `{{SITE_URL}}` | Site URL |

## Advanced Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{{TIMESTRING:today+10days}}` | Date calculations |
| `{{GET:get_name}}` | URL GET parameters |
| `{{META:meta_key}}` | Post meta |
| `{{AUTHOR_META:meta_key}}` | Post author meta (author of current post) |
| `{{TERM_META:meta_key}}` | Taxonomy term meta (from all taxonomies of current post) |
| `{{TERM_META:meta_key\|taxonomy}}` | Term meta for a specific taxonomy |
| `{{TERM_LINKS:taxonomy}}` | List of links for a post's terms |
| `{{USER_META:meta_key}}` | User meta |
| `{{COOKIE:cookie_name}}` | Cookie values |
| `{{RANDOM:0-100}}` | Random numbers |
| `{{RANDOM:red\|blue\|green}}` | Random selection |