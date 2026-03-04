# Charts

## Introduction to Chart Blocks

Greenshift supports creating interactive chart visualizations using ApexCharts.js library. Charts provide a powerful way to display data visually through various chart types including line, area, bar, pie, radar, and candlestick charts.

Chart blocks use a special configuration structure and require specific parameters to render properly.

## Chart Block Structure

Chart blocks use the following key parameters:

### Required Parameters

- `type: "chart"` - Identifies the block as containing chart data
- `isVariation: "chart"` - Specifies the chart variation
- `chartData` - Object containing chart configuration with an `options` property

### chartData Parameter Structure

The `chartData` parameter contains chart configuration as a JSON string in the `options` property:

```json
{
  "options": "{\n  \"chart\": {...},\n  \"series\": [...],\n  ...\n}"
}
```

Key points about `chartData`:
- Must have `options` parameter like `chartData:{options: {chart: {...}}}`
- Do not use double slashes in options
- The options string contains escaped JSON with chart configuration

### HTML Attributes

Chart blocks render as `<div>` elements with:
- `class` - Contains the localId value (e.g., `gsbp-6a376a3`)
- `data-chart-data` - Contains the escaped chart options JSON
- `data-chart-id` - Contains the chart's unique ID

## Chart Types and Examples

### Line Chart

Line charts display data as a series of points connected by straight line segments.

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-6a376a3","type":"chart","localId":"gsbp-6a376a3","styleAttributes":{"height":["350px"]},"chartData":{"options":"{\n  \"chart\": {\n    \"height\": \"350px\",\n    \"type\": \"line\",\n    \"stacked\": false\n  },\n  \"colors\": [\n    \"#FF1654\",\n    \"#247BA0\"\n  ],\n  \"series\": [\n    {\n      \"name\": \"Series A\",\n      \"data\": [\n        14,\n        20,\n        25,\n        15,\n        25,\n        28,\n        38,\n        46\n      ]\n    },\n    {\n      \"name\": \"Series B\",\n      \"data\": [\n        20,\n        29,\n        37,\n        36,\n        44,\n        45,\n        50,\n        58\n      ]\n    }\n  ],\n  \"stroke\": {\n    \"width\": [\n      4,\n      4\n    ]\n  },\n  \"plotOptions\": {\n    \"bar\": {\n      \"columnWidth\": \"20%\"\n    }\n  },\n  \"xaxis\": {\n    \"categories\": [\n      2009,\n      2010,\n      2011,\n      2012,\n      2013,\n      2014,\n      2015,\n      2016\n    ]\n  }\n}"},"isVariation":"chart"} -->
<div class="gsbp-6a376a3" data-chart-data="&quot;{\n  \&quot;chart\&quot;: {\n    \&quot;height\&quot;: \&quot;350px\&quot;,\n    \&quot;type\&quot;: \&quot;line\&quot;,\n    \&quot;stacked\&quot;: false\n  },\n  \&quot;colors\&quot;: [\n    \&quot;#FF1654\&quot;,\n    \&quot;#247BA0\&quot;\n  ],\n  \&quot;series\&quot;: [\n    {\n      \&quot;name\&quot;: \&quot;Series A\&quot;,\n      \&quot;data\&quot;: [\n        14,\n        20,\n        25,\n        15,\n        25,\n        28,\n        38,\n        46\n      ]\n    },\n    {\n      \&quot;name\&quot;: \&quot;Series B\&quot;,\n      \&quot;data\&quot;: [\n        20,\n        29,\n        37,\n        36,\n        44,\n        45,\n        50,\n        58\n      ]\n    }\n  ],\n  \&quot;stroke\&quot;: {\n    \&quot;width\&quot;: [\n      4,\n      4\n    ]\n  },\n  \&quot;plotOptions\&quot;: {\n    \&quot;bar\&quot;: {\n      \&quot;columnWidth\&quot;: \&quot;20%\&quot;\n    }\n  },\n  \&quot;xaxis\&quot;: {\n    \&quot;categories\&quot;: [\n      2009,\n      2010,\n      2011,\n      2012,\n      2013,\n      2014,\n      2015,\n      2016\n    ]\n  }\n}&quot;" data-chart-id="gsbp-6a376a3"></div>
<!-- /wp:greenshift-blocks/element -->
```

### Area Chart

Area charts are similar to line charts but fill the area below the line with color. They're ideal for showing trends over time.

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-6a376a3","type":"chart","localId":"gsbp-6a376a3","dynamicAttributes":[{"name":"data-series-0","value":"","dynamicEnable":false},{"name":"data-series","value":"","dynamicEnable":false},{"name":"data-xaxis-categories","value":"","dynamicEnable":false}],"styleAttributes":{"height":["350px"]},"chartData":{"options":"{\n  \"chart\": {\n    \"height\": \"350px\",\n    \"type\": \"area\"\n  },\n  \"dataLabels\": {\n    \"enabled\": false\n  },\n  \"series\": [\n    {\n      \"name\": \"Series 1\",\n      \"data\": [\n        45,\n        52,\n        38,\n        45,\n        19,\n        23,\n        2\n      ]\n    }\n  ],\n  \"fill\": {\n    \"type\": \"gradient\",\n    \"gradient\": {\n      \"shadeIntensity\": 1,\n      \"opacityFrom\": 0.7,\n      \"opacityTo\": 0.9,\n      \"stops\": [\n        0,\n        90,\n        100\n      ]\n    }\n  },\n  \"xaxis\": {\n    \"categories\": [\n      \"01 Jan\",\n      \"02 Jan\",\n      \"03 Jan\",\n      \"04 Jan\",\n      \"05 Jan\",\n      \"06 Jan\",\n      \"07 Jan\"\n    ]\n  }\n}","init":true},"isVariation":"chart"} -->
<div class="gsbp-6a376a3" data-chart-data="&quot;{\n  \&quot;chart\&quot;: {\n    \&quot;height\&quot;: \&quot;350px\&quot;,\n    \&quot;type\&quot;: \&quot;area\&quot;\n  },\n  \&quot;dataLabels\&quot;: {\n    \&quot;enabled\&quot;: false\n  },\n  \&quot;series\&quot;: [\n    {\n      \&quot;name\&quot;: \&quot;Series 1\&quot;,\n      \&quot;data\&quot;: [\n        45,\n        52,\n        38,\n        45,\n        19,\n        23,\n        2\n      ]\n    }\n  ],\n  \&quot;fill\&quot;: {\n    \&quot;type\&quot;: \&quot;gradient\&quot;,\n    \&quot;gradient\&quot;: {\n      \&quot;shadeIntensity\&quot;: 1,\n      \&quot;opacityFrom\&quot;: 0.7,\n      \&quot;opacityTo\&quot;: 0.9,\n      \&quot;stops\&quot;: [\n        0,\n        90,\n        100\n      ]\n    }\n  },\n  \&quot;xaxis\&quot;: {\n    \&quot;categories\&quot;: [\n      \&quot;01 Jan\&quot;,\n      \&quot;02 Jan\&quot;,\n      \&quot;03 Jan\&quot;,\n      \&quot;04 Jan\&quot;,\n      \&quot;05 Jan\&quot;,\n      \&quot;06 Jan\&quot;,\n      \&quot;07 Jan\&quot;\n    ]\n  }\n}&quot;" data-chart-id="gsbp-6a376a3" data-series-0="" data-series="" data-xaxis-categories=""></div>
<!-- /wp:greenshift-blocks/element -->
```

### Bar Chart

Bar charts display data using vertical bars, making them excellent for comparing values across categories.

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-9413efa","inlineCssStyles":".gsbp-9413efa{height:350px;}","type":"chart","localId":"gsbp-9413efa","dynamicAttributes":[{"name":"data-series-0","value":"","dynamicEnable":false},{"name":"data-series","value":"","dynamicEnable":false},{"name":"data-xaxis-categories","value":"","dynamicEnable":false},{"name":"data-series-1","value":"","dynamicEnable":false},{"name":"data-series-2","value":"","dynamicEnable":false}],"styleAttributes":{"height":["350px"]},"chartData":{"options":"{\n  \"series\": [\n    {\n      \"name\": \"Inflation\",\n      \"data\": [\n        2.3,\n        3.1,\n        4,\n        10.1\n      ]\n    }\n  ],\n  \"chart\": {\n    \"height\": \"350px\",\n    \"type\": \"bar\"\n  },\n  \"plotOptions\": {\n    \"bar\": {\n      \"borderRadius\": 10,\n      \"dataLabels\": {\n        \"position\": \"top\"\n      }\n    }\n  },\n  \"dataLabels\": {\n    \"enabled\": true,\n    \"offsetY\": -20,\n    \"style\": {\n      \"fontSize\": \"12px\",\n      \"colors\": [\n        \"#304758\"\n      ]\n    }\n  },\n  \"xaxis\": {\n    \"categories\": [\n      \"Jan\",\n      \"Feb\",\n      \"Mar\",\n      \"Apr\"\n    ],\n    \"position\": \"top\",\n    \"axisBorder\": {\n      \"show\": false\n    },\n    \"axisTicks\": {\n      \"show\": false\n    },\n    \"crosshairs\": {\n      \"fill\": {\n        \"type\": \"gradient\",\n        \"gradient\": {\n          \"colorFrom\": \"#D8E3F0\",\n          \"colorTo\": \"#BED1E6\",\n          \"stops\": [\n            0,\n            100\n          ],\n          \"opacityFrom\": 0.4,\n          \"opacityTo\": 0.5\n        }\n      }\n    },\n    \"tooltip\": {\n      \"enabled\": true\n    }\n  },\n  \"yaxis\": {\n    \"axisBorder\": {\n      \"show\": false\n    },\n    \"axisTicks\": {\n      \"show\": false\n    }\n  },\n  \"title\": {\n    \"text\": \"Monthly Inflation in Argentina, 2002\",\n    \"floating\": true,\n    \"offsetY\": 330,\n    \"align\": \"center\",\n    \"style\": {\n      \"color\": \"#444\"\n    }\n  }\n}","init":false},"isVariation":"chart"} -->
<div class="gsbp-9413efa" data-chart-data="&quot;{\n  \&quot;series\&quot;: [\n    {\n      \&quot;name\&quot;: \&quot;Inflation\&quot;,\n      \&quot;data\&quot;: [\n        2.3,\n        3.1,\n        4,\n        10.1\n      ]\n    }\n  ],\n  \&quot;chart\&quot;: {\n    \&quot;height\&quot;: \&quot;350px\&quot;,\n    \&quot;type\&quot;: \&quot;bar\&quot;\n  },\n  \&quot;plotOptions\&quot;: {\n    \&quot;bar\&quot;: {\n      \&quot;borderRadius\&quot;: 10,\n      \&quot;dataLabels\&quot;: {\n        \&quot;position\&quot;: \&quot;top\&quot;\n      }\n    }\n  },\n  \&quot;dataLabels\&quot;: {\n    \&quot;enabled\&quot;: true,\n    \&quot;offsetY\&quot;: -20,\n    \&quot;style\&quot;: {\n      \&quot;fontSize\&quot;: \&quot;12px\&quot;,\n      \&quot;colors\&quot;: [\n        \&quot;#304758\&quot;\n      ]\n    }\n  },\n  \&quot;xaxis\&quot;: {\n    \&quot;categories\&quot;: [\n      \&quot;Jan\&quot;,\n      \&quot;Feb\&quot;,\n      \&quot;Mar\&quot;,\n      \&quot;Apr\&quot;\n    ],\n    \&quot;position\&quot;: \&quot;top\&quot;,\n    \&quot;axisBorder\&quot;: {\n      \&quot;show\&quot;: false\n    },\n    \&quot;axisTicks\&quot;: {\n      \&quot;show\&quot;: false\n    },\n    \&quot;crosshairs\&quot;: {\n      \&quot;fill\&quot;: {\n        \&quot;type\&quot;: \&quot;gradient\&quot;,\n        \&quot;gradient\&quot;: {\n          \&quot;colorFrom\&quot;: \&quot;#D8E3F0\&quot;,\n          \&quot;colorTo\&quot;: \&quot;#BED1E6\&quot;,\n          \&quot;stops\&quot;: [\n            0,\n            100\n          ],\n          \&quot;opacityFrom\&quot;: 0.4,\n          \&quot;opacityTo\&quot;: 0.5\n        }\n      }\n    },\n    \&quot;tooltip\&quot;: {\n      \&quot;enabled\&quot;: true\n    }\n  },\n  \&quot;yaxis\&quot;: {\n    \&quot;axisBorder\&quot;: {\n      \&quot;show\&quot;: false\n    },\n    \&quot;axisTicks\&quot;: {\n      \&quot;show\&quot;: false\n    }\n  },\n  \&quot;title\&quot;: {\n    \&quot;text\&quot;: \&quot;Monthly Inflation in Argentina, 2002\&quot;,\n    \&quot;floating\&quot;: true,\n    \&quot;offsetY\&quot;: 330,\n    \&quot;align\&quot;: \&quot;center\&quot;,\n    \&quot;style\&quot;: {\n      \&quot;color\&quot;: \&quot;#444\&quot;\n    }\n  }\n}&quot;" data-chart-id="gsbp-9413efa" data-series-0="" data-series="" data-xaxis-categories="" data-series-1="" data-series-2=""></div>
<!-- /wp:greenshift-blocks/element -->
```

### Horizontal Bar Chart

Horizontal bar charts display data using horizontal bars, useful for comparing values when category labels are long or when emphasizing ranking.

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-3c4d5e6","inlineCssStyles":".gsbp-3c4d5e6{height:350px;}","type":"chart","localId":"gsbp-3c4d5e6","dynamicAttributes":[{"name":"data-series-0","value":"","dynamicEnable":false},{"name":"data-series","value":"","dynamicEnable":false},{"name":"data-xaxis-categories","value":"","dynamicEnable":false},{"name":"data-series-1","value":"","dynamicEnable":false},{"name":"data-series-2","value":"","dynamicEnable":false}],"styleAttributes":{"height":["350px"]},"chartData":{"options":"{\n  \"series\": [\n    {\n      \"data\": [\n        400,\n        430,\n        448\n      ]\n    }\n  ],\n  \"chart\": {\n    \"type\": \"bar\",\n    \"height\": \"350px\"\n  },\n  \"plotOptions\": {\n    \"bar\": {\n      \"borderRadius\": 4,\n      \"borderRadiusApplication\": \"end\",\n      \"horizontal\": true\n    }\n  },\n  \"dataLabels\": {\n    \"enabled\": false\n  },\n  \"xaxis\": {\n    \"categories\": [\n      \"South Korea\",\n      \"Canada\",\n      \"United Kingdom\"\n    ]\n  }\n}","init":true},"isVariation":"chart"} -->
<div class="gsbp-3c4d5e6" data-chart-data="&quot;{\n  \&quot;series\&quot;: [\n    {\n      \&quot;data\&quot;: [\n        400,\n        430,\n        448\n      ]\n    }\n  ],\n  \&quot;chart\&quot;: {\n    \&quot;type\&quot;: \&quot;bar\&quot;,\n    \&quot;height\&quot;: \&quot;350px\&quot;\n  },\n  \&quot;plotOptions\&quot;: {\n    \&quot;bar\&quot;: {\n      \&quot;borderRadius\&quot;: 4,\n      \&quot;borderRadiusApplication\&quot;: \&quot;end\&quot;,\n      \&quot;horizontal\&quot;: true\n    }\n  },\n  \&quot;dataLabels\&quot;: {\n    \&quot;enabled\&quot;: false\n  },\n  \&quot;xaxis\&quot;: {\n    \&quot;categories\&quot;: [\n      \&quot;South Korea\&quot;,\n      \&quot;Canada\&quot;,\n      \&quot;United Kingdom\&quot;\n    ]\n  }\n}&quot;" data-chart-id="gsbp-3c4d5e6" data-series-0="" data-series="" data-xaxis-categories="" data-series-1="" data-series-2=""></div>
<!-- /wp:greenshift-blocks/element -->
```

### Pie Chart

Pie charts show proportional data as slices of a circle, perfect for displaying percentage distributions.

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-6a376a3","type":"chart","localId":"gsbp-6a376a3","dynamicAttributes":[{"name":"data-series-0","value":"","dynamicEnable":false},{"name":"data-series","value":"","dynamicEnable":false},{"name":"data-xaxis-categories","value":"","dynamicEnable":false},{"name":"data-series-1","value":"","dynamicEnable":false},{"name":"data-series-2","value":"","dynamicEnable":false},{"name":"data-series-numbers","value":"","dynamicEnable":false},{"name":"data-labels","value":"","dynamicEnable":false}],"styleAttributes":{"height":["350px"]},"chartData":{"options":"{\n  \"series\": [\n    44,\n    55,\n    13,\n    43,\n    22\n  ],\n  \"chart\": {\n    \"type\": \"pie\"\n  },\n  \"labels\": [\n    \"Team A\",\n    \"Team B\",\n    \"Team C\",\n    \"Team D\",\n    \"Team E\"\n  ],\n  \"responsive\": [\n    {\n      \"breakpoint\": 480,\n      \"options\": {\n        \"chart\": {\n          \"width\": 300\n        },\n        \"legend\": {\n          \"position\": \"bottom\"\n        }\n      }\n    }\n  ]\n}","init":false},"isVariation":"chart"} -->
<div class="gsbp-6a376a3" data-chart-data="&quot;{\n  \&quot;series\&quot;: [\n    44,\n    55,\n    13,\n    43,\n    22\n  ],\n  \&quot;chart\&quot;: {\n    \&quot;type\&quot;: \&quot;pie\&quot;\n  },\n  \&quot;labels\&quot;: [\n    \&quot;Team A\&quot;,\n    \&quot;Team B\&quot;,\n    \&quot;Team C\&quot;,\n    \&quot;Team D\&quot;,\n    \&quot;Team E\&quot;\n  ],\n  \&quot;responsive\&quot;: [\n    {\n      \&quot;breakpoint\&quot;: 480,\n      \&quot;options\&quot;: {\n        \&quot;chart\&quot;: {\n          \&quot;width\&quot;: 300\n        },\n        \&quot;legend\&quot;: {\n          \&quot;position\&quot;: \&quot;bottom\&quot;\n        }\n      }\n    }\n  ]\n}&quot;" data-chart-id="gsbp-6a376a3" data-series-0="" data-series="" data-xaxis-categories="" data-series-1="" data-series-2="" data-series-numbers="" data-labels=""></div>
<!-- /wp:greenshift-blocks/element -->
```

### Radar Chart

Radar charts display multivariate data on a two-dimensional chart with axes starting from the same point, ideal for comparing multiple variables.

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-6a376a3","type":"chart","localId":"gsbp-6a376a3","dynamicAttributes":[{"name":"data-series-0","value":"","dynamicEnable":false},{"name":"data-series","value":"","dynamicEnable":false},{"name":"data-xaxis-categories","value":"","dynamicEnable":false},{"name":"data-series-1","value":"","dynamicEnable":false},{"name":"data-series-2","value":"","dynamicEnable":false},{"name":"data-series-numbers","value":"","dynamicEnable":false},{"name":"data-labels","value":"","dynamicEnable":false}],"styleAttributes":{"height":["350px"]},"chartData":{"options":"{\n  \"series\": [\n    {\n      \"name\": \"Series 1\",\n      \"data\": [\n        80,\n        50,\n        30,\n        40,\n        100,\n        20\n      ]\n    }\n  ],\n  \"chart\": {\n    \"height\": \"350px\",\n    \"type\": \"radar\"\n  },\n  \"title\": {\n    \"text\": \"Basic Radar Chart\"\n  },\n  \"yaxis\": {\n    \"stepSize\": 20\n  },\n  \"xaxis\": {\n    \"categories\": [\n      \"January\",\n      \"February\",\n      \"March\",\n      \"April\",\n      \"May\",\n      \"June\"\n    ]\n  }\n}","init":false},"isVariation":"chart"} -->
<div class="gsbp-6a376a3" data-chart-data="&quot;{\n  \&quot;series\&quot;: [\n    {\n      \&quot;name\&quot;: \&quot;Series 1\&quot;,\n      \&quot;data\&quot;: [\n        80,\n        50,\n        30,\n        40,\n        100,\n        20\n      ]\n    }\n  ],\n  \&quot;chart\&quot;: {\n    \&quot;height\&quot;: \&quot;350px\&quot;,\n    \&quot;type\&quot;: \&quot;radar\&quot;\n  },\n  \&quot;title\&quot;: {\n    \&quot;text\&quot;: \&quot;Basic Radar Chart\&quot;\n  },\n  \&quot;yaxis\&quot;: {\n    \&quot;stepSize\&quot;: 20\n  },\n  \&quot;xaxis\&quot;: {\n    \&quot;categories\&quot;: [\n      \&quot;January\&quot;,\n      \&quot;February\&quot;,\n      \&quot;March\&quot;,\n      \&quot;April\&quot;,\n      \&quot;May\&quot;,\n      \&quot;June\&quot;\n    ]\n  }\n}&quot;" data-chart-id="gsbp-6a376a3" data-series-0="" data-series="" data-xaxis-categories="" data-series-1="" data-series-2="" data-series-numbers="" data-labels=""></div>
<!-- /wp:greenshift-blocks/element -->
```

### Candlestick Chart

Candlestick charts are commonly used for financial data, showing open, high, low, and close values for each time period.

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-6a376a3","type":"chart","localId":"gsbp-6a376a3","dynamicAttributes":[{"name":"data-series-0","value":"","dynamicEnable":false},{"name":"data-series","value":"","dynamicEnable":false},{"name":"data-xaxis-categories","value":"","dynamicEnable":false},{"name":"data-series-1","value":"","dynamicEnable":false},{"name":"data-series-2","value":"","dynamicEnable":false},{"name":"data-series-numbers","value":"","dynamicEnable":false},{"name":"data-labels","value":"","dynamicEnable":false}],"styleAttributes":{"height":["350px"]},"chartData":{"options":"{\n  \"series\": [\n    {\n      \"data\": [\n        {\n          \"x\": \"2018-10-05 20:30:00\",\n          \"y\": [\n            6629.81,\n            6650.5,\n            6623.04,\n            6633.33\n          ]\n        },\n        {\n          \"x\": \"2018-10-05 21:00:00\",\n          \"y\": [\n            6632.01,\n            6643.59,\n            6620,\n            6630.11\n          ]\n        },\n        {\n          \"x\": \"2018-10-05 21:30:00\",\n          \"y\": [\n            6630.71,\n            6648.95,\n            6623.34,\n            6635.65\n          ]\n        },\n        {\n          \"x\": \"2018-10-05 22:00:00\",\n          \"y\": [\n            6635.65,\n            6651,\n            6629.67,\n            6638.24\n          ]\n        },\n        {\n          \"x\": \"2018-10-05 22:30:00\",\n          \"y\": [\n            6638.24,\n            6640,\n            6620,\n            6624.47\n          ]\n        },\n        {\n          \"x\": \"2018-10-05 23:00:00\",\n          \"y\": [\n            6624.53,\n            6636.03,\n            6621.68,\n            6624.31\n          ]\n        },\n        {\n          \"x\": \"2018-10-05 23:30:00\",\n          \"y\": [\n            6624.61,\n            6632.2,\n            6617,\n            6626.02\n          ]\n        },\n        {\n          \"x\": \"2018-10-06 00:00:00\",\n          \"y\": [\n            6627,\n            6627.62,\n            6584.22,\n            6603.02\n          ]\n        },\n        {\n          \"x\": \"2018-10-06 00:30:00\",\n          \"y\": [\n            6605,\n            6608.03,\n            6598.95,\n            6604.01\n          ]\n        },\n        {\n          \"x\": \"2018-10-06 01:00:00\",\n          \"y\": [\n            6604.5,\n            6614.4,\n            6602.26,\n            6608.02\n          ]\n        },\n        {\n          \"x\": \"2018-10-06 01:30:00\",\n          \"y\": [\n            6608.02,\n            6610.68,\n            6601.99,\n            6608.91\n          ]\n        },\n        {\n          \"x\": \"2018-10-06 02:00:00\",\n          \"y\": [\n            6608.91,\n            6618.99,\n            6608.01,\n            6612\n          ]\n        },\n        {\n          \"x\": \"2018-10-06 02:30:00\",\n          \"y\": [\n            6612,\n            6615.13,\n            6605.09,\n            6612\n          ]\n        }\n      ]\n    }\n  ],\n  \"chart\": {\n    \"type\": \"candlestick\",\n    \"height\": \"350px\"\n  },\n  \"title\": {\n    \"text\": \"CandleStick Chart\",\n    \"align\": \"left\"\n  },\n  \"xaxis\": {\n    \"type\": \"datetime\"\n  },\n  \"yaxis\": {\n    \"tooltip\": {\n      \"enabled\": true\n    }\n  }\n}","init":true},"isVariation":"chart"} -->
<div class="gsbp-6a376a3" data-chart-data="&quot;{\n  \&quot;series\&quot;: [\n    {\n      \&quot;data\&quot;: [\n        {\n          \&quot;x\&quot;: \&quot;2018-10-05 20:30:00\&quot;,\n          \&quot;y\&quot;: [\n            6629.81,\n            6650.5,\n            6623.04,\n            6633.33\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-05 21:00:00\&quot;,\n          \&quot;y\&quot;: [\n            6632.01,\n            6643.59,\n            6620,\n            6630.11\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-05 21:30:00\&quot;,\n          \&quot;y\&quot;: [\n            6630.71,\n            6648.95,\n            6623.34,\n            6635.65\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-05 22:00:00\&quot;,\n          \&quot;y\&quot;: [\n            6635.65,\n            6651,\n            6629.67,\n            6638.24\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-05 22:30:00\&quot;,\n          \&quot;y\&quot;: [\n            6638.24,\n            6640,\n            6620,\n            6624.47\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-05 23:00:00\&quot;,\n          \&quot;y\&quot;: [\n            6624.53,\n            6636.03,\n            6621.68,\n            6624.31\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-05 23:30:00\&quot;,\n          \&quot;y\&quot;: [\n            6624.61,\n            6632.2,\n            6617,\n            6626.02\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-06 00:00:00\&quot;,\n          \&quot;y\&quot;: [\n            6627,\n            6627.62,\n            6584.22,\n            6603.02\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-06 00:30:00\&quot;,\n          \&quot;y\&quot;: [\n            6605,\n            6608.03,\n            6598.95,\n            6604.01\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-06 01:00:00\&quot;,\n          \&quot;y\&quot;: [\n            6604.5,\n            6614.4,\n            6602.26,\n            6608.02\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-06 01:30:00\&quot;,\n          \&quot;y\&quot;: [\n            6608.02,\n            6610.68,\n            6601.99,\n            6608.91\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-06 02:00:00\&quot;,\n          \&quot;y\&quot;: [\n            6608.91,\n            6618.99,\n            6608.01,\n            6612\n          ]\n        },\n        {\n          \&quot;x\&quot;: \&quot;2018-10-06 02:30:00\&quot;,\n          \&quot;y\&quot;: [\n            6612,\n            6615.13,\n            6605.09,\n            6612\n          ]\n        }\n      ]\n    }\n  ],\n  \&quot;chart\&quot;: {\n    \&quot;type\&quot;: \&quot;candlestick\&quot;,\n    \&quot;height\&quot;: \&quot;350px\&quot;\n  },\n  \&quot;title\&quot;: {\n    \&quot;text\&quot;: \&quot;CandleStick Chart\&quot;,\n    \&quot;align\&quot;: \&quot;left\&quot;\n  },\n  \&quot;xaxis\&quot;: {\n    \&quot;type\&quot;: \&quot;datetime\&quot;\n  },\n  \&quot;yaxis\&quot;: {\n    \&quot;tooltip\&quot;: {\n      \&quot;enabled\&quot;: true\n    }\n  }\n}&quot;" data-chart-id="gsbp-6a376a3" data-series-0="" data-series="" data-xaxis-categories="" data-series-1="" data-series-2="" data-series-numbers="" data-labels=""></div>
<!-- /wp:greenshift-blocks/element -->
```

## Common Chart Configuration Options

### Chart Type Configuration

All charts require a `chart` object with at minimum:
- `type`: The chart type (line, area, bar, pie, radar, candlestick, etc.)
- `height`: Height of the chart (should match `styleAttributes.height`)

### Series Data

Most charts use a `series` array containing data:
- For line, area, bar charts: Array of objects with `name` and `data` properties
- For pie charts: Array of numbers with corresponding `labels` array
- For candlestick charts: Array with complex data objects containing x and y values

### Axes Configuration

- `xaxis`: Configure x-axis with categories, type, position, styling
- `yaxis`: Configure y-axis with step size, tooltip, styling

### Styling Options

- `colors`: Array of color values for series
- `fill`: Configure fill type and gradients
- `stroke`: Configure line stroke width and style
- `plotOptions`: Chart-specific plot options (e.g., bar border radius, horizontal orientation)
- `dataLabels`: Enable/disable and style data labels
- `title`: Add chart title with positioning and styling

### Responsive Configuration

Charts can include `responsive` array with breakpoint-specific options:

```json
"responsive": [
  {
    "breakpoint": 480,
    "options": {
      "chart": {
        "width": 300
      },
      "legend": {
        "position": "bottom"
      }
    }
  }
]
```

## Dynamic Attributes

Charts can include `dynamicAttributes` for data binding:
- `data-series-0`, `data-series-1`, etc.: Dynamic series data
- `data-xaxis-categories`: Dynamic x-axis categories
- `data-series-numbers`: Dynamic numeric series
- `data-labels`: Dynamic labels for pie/donut charts

## Best Practices

1. Always set chart height in both `styleAttributes` and chart options
2. Use unique IDs for each chart (id and localId must match)
3. Properly escape JSON in both the JSON parameter and HTML data attribute
4. Follow ApexCharts.js documentation for advanced configuration options
5. Test responsive behavior with appropriate breakpoint configurations
6. Ensure data-chart-data HTML attribute contains properly escaped JSON
7. Use the `init` parameter in chartData to control initialization timing if needed
