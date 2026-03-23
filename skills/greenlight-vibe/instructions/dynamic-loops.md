# Dynamic Loops

You can create loops with all available parameters of the WordPress `WP_Query` class.

When preparing HTML for dynamic loops, use `data-gl-query-arguments` on the loop wrapper.For inner repeated items, use placeholders from `dynamic-placeholders.md` and add them with `data-gl-dynamic-*` attributes.

## Syntax of Dynamic Loops

Use raw JSON in `data-gl-query-arguments` and include every relevant `WP_Query` argument requested by the user.

```html
<section
    class="query-loop-grid"
    data-gl-query-arguments='{"post_type":"post","posts_per_page":3,"orderby":"modified","order":"ASC","ignore_sticky_posts":true,"tax_query":[{"taxonomy":"category","field":"slug","terms":["red","blue"],"operator":"IN"}]}'
>
    <article class="query-loop-card">
        <a href="#" data-gl-dynamic-href="{{POST_URL}}" data-gl-dynamic-title="{{POST_TITLE}}">
            <img
                src="https://placehold.co/600x400"
                alt="Post image"
                data-gl-dynamic-src="{{THUMBNAIL_URL}}"
                data-gl-dynamic-alt="{{POST_TITLE}}"
            />
            <h3 data-gl-dynamic-text="{{POST_TITLE}}">Example post title</h3>
        </a>
        <div data-gl-dynamic-text="{{AUTHOR_NAME}}">Author name</div>
        <time data-gl-dynamic-text="{{POST_DATE_MODIFIED}}">Modified date</time>
    </article>
</section>
```