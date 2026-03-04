# Dynamic Loops

You can create loops with all parameters for WP Query class of WordPress. For this you need to use greenshift-blocks/querygrid block and data_source attribute set to "query". In query_filters attribute use any of WP Query class arguments

## Syntax of Dynamic Loops

Dynamic placeholders can be used in query arguments and text content.

```html
<!-- wp:greenshift-blocks/querygrid {"data_source":"query","query_filters":{"post_type":"post","posts_per_page":"3","tax_query":[{"taxonomy":"category","field":"slug","terms":"red,blue","operator":"IN"}]}} -->

<!-- wp:greenshift-blocks/element {"tag":"a","type":"inner","href":"{{POST_URL}}"} -->
<a href="{{POST_URL}}">
   <!-- wp:greenshift-blocks/element {"tag":"img","src":"{{THUMBNAIL_URL}}","alt":"{{POST_TITLE}}"} -->
       <img src="{{THUMBNAIL_URL}}" alt="{{POST_TITLE}}" loading="lazy"/>
    <!-- /wp:greenshift-blocks/element -->
</a>
<!-- /wp:greenshift-blocks/element -->

<!-- wp:greenshift-blocks/element {"textContent":"{{POST_TITLE}}","tag":"a","href":"{{POST_URL}}"} -->
<a href="{{POST_URL}}">{{POST_TITLE}}</a>
<!-- /wp:greenshift-blocks/element -->

<!-- wp:greenshift-blocks/element {"textContent":"{{AUTHOR_NAME}}", "tag":"div"} -->
<div>{{AUTHOR_NAME}}</div>
<!-- /wp:greenshift-blocks/element -->

<!-- wp:greenshift-blocks/element {"textContent":"{{POST_DATE_MODIFIED}}", "tag":"div"} -->
<div>{{POST_DATE_MODIFIED}}</div>
<!-- /wp:greenshift-blocks/element -->

<!-- /wp:greenshift-blocks/querygrid -->
```

greenshift-blocks/querygrid block works as container, content of this container will be represented as item card of loop. 