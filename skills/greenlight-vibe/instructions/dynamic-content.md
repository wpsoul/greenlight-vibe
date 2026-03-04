# Dynamic Content

Dynamic blocks allow you to display content that changes based on post data, user information, site data, and more. Dynamic placeholders can be used inside content of blocks and in specific attributes like src, alt, href.

## Dynamic Placeholders

Dynamic placeholders can be used in query arguments and text content.

### Basic Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{{POST_ID}}` | Current post ID |
| `{{POST_TITLE}}` | Current post title |
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

### Advanced Placeholders

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

---

## Data Formatting (`postprocessor`)

This is used for further processing returned data.

```json
{
  "dynamictext": {
    "dynamicEnable": true,
    "dynamicType": "postdata",
    "dynamicPostData": "post_date",
    "postprocessor": "datecustom",
    "dateformat": "F j, Y"
  }
}
```

### Available Formatting Options

| Value | Description |
|-------|-------------|
| `textformat` | Use if returned data has WYSIWYG formatting |
| `mailto` | Email links |
| `tel` | Convert to Phone links |
| `postlink` | Post links |
| `idtofile` | Convert ID of file to file link |
| `idtofileurl` | Convert ID of file to file URL |
| `idtoimageurl` | ID to image URL (full size) |
| `idtoimageurlthumb` | ID to image URL (thumbnail) |
| `ymd` | Date YYYYMMDD to WordPress date |
| `ytmd` | Date yyyy-mm-dd to WordPress date |
| `unixtowp` | Unix time to WordPress date |
| `ymdhis` | Date Y-m-d H:i:s to WordPress date |
| `ymdtodiff` | Date difference with current |
| `datecustom` | Custom date format (requires `dateformat`) |
| `numberformat` | Number formatting |
| `numberformatenglish` | English number formatting |
| `numeric` | Only numeric values |
| `json` | Array to JSON |