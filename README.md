# jquery.longread

Turns long HTML block to a collapsible element.

Load plugin and its' dependencies.
```HTML
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="jquery.longread.js"></script>
<style>
@import "jquery.longread.css";
</style>
```

## Examples
### Simple read more
Create your HTML and mark it with your custom class.
```HTML
<div class="long-read">
  <img src="http://placehold.it/300x300" /><br/>
  <img src="http://placehold.it/300x300" /><br/>
  <img src="http://placehold.it/300x300" /><br/>
</div> 
```

Use your class to init long-read on page load.
```JavaScript
$(document).ready(function() {
  $('.long-read').longread();
});
```

## Config through attributes…
```HTML
<div class="long-read" data-long-read-height="200" data-long-read-moretxt="Show more" data-long-read-lesstxt="Show less">
  <img src="http://placehold.it/300x300" /><br/>
  <img src="http://placehold.it/300x300" /><br/>
  <img src="http://placehold.it/300x300" /><br/>
</div>
```

```JavaScript
$(document).ready(function() {
  $('.long-read').longread();
});
```
## … or configure through options
```HTML
<div class="long-read">
  <img src="http://placehold.it/300x300" /><br/>
  <img src="http://placehold.it/300x300" /><br/>
  <img src="http://placehold.it/300x300" /><br/>
</div>
```

```JavaScript
$(document).ready(function() {
  $('.long-read').longread({
    height: 180,
    cover_class: 'custom-cover-class custom-cover-class--state-open'
  });
});
```

## Additional trigger element.
```HTML
<a data-toggle="long-read" aria-expanded="false" data-target="#long-read-element">Read more</a>
<div id="long-read-element" class="long-read">
 <img src="http://placehold.it/300x300" /><br/>
 <img src="http://placehold.it/300x300" /><br/>
 <img src="http://placehold.it/300x300" /><br/>
</div>
```
```JavaScript
$(document).ready(function() {
  $('.long-read').longread();
});
```

## Multiple additional trigger element through option.
```HTML
<a class="additional-trigger" aria-expanded="false" data-target="#long-read-element">Read more 1</a>
<div id="long-read-element" class="long-read">
 <img src="http://placehold.it/300x300" /><br/>
 <img src="http://placehold.it/300x300" /><br/>
 <img src="http://placehold.it/300x300" /><br/>
</div>
<a class="additional-trigger" aria-expanded="false" data-target="#long-read-element">Read more 2</a>
```
```JavaScript
$(document).ready(function() {
  $('.long-read').longread({
    additional_trigger: '.additional-trigger[data-target="#long-read-element"]'
  });
});
```

## Settings
| setting | data attribute | type | default | description |
|---------|----------------|------|---------|-------------|
| `height` | `data-long-read-height` | `number` | `100`  | Default collapsed height. |
| `read_more_text` | `data-long-read-moretxt` | `string` | `Read more`  | Text for "Read more" switch. |
| `read_less_text` | `data-long-read-lesstxt` | `string` | `Read less`  | Text for "Read less" switch. |
| `read_less` | `data-long-read-less` | `bool` | `true` | Set this `false` to disable closing already opened items. |
| `icon` | `data-long-read-icon` | `string` | `null` | Icon element classes. |
| `icon_position` | `data-long-read-icon-position` | `string` `[prepend|append]` | `append` | Position of icon element. If you would like to display icon before trigger text set this to `prepend`. |
| `trigger_class` | `data-long-read-trigger-class` | `string` | `null` | Additional class names for trigger element. |
| `trigger_cover_class` | `data-long-read-trigger-cover-class` | `string` | `null` | Additional class names for trigger cover element. |
| `line_height` | - | `number` | `1` | Base line height. Use it with `show_lines` to auto calculate closed height. |
| `show_lines` | `data-long-read-lines` | `number` | `30` | Set the number of line we should display on closed-state. Use it with `line_height` to auto calculate closed height. |
| `cover_class` | `data-long-read-height` | `string` | `null` | Additional class names for cover element. |
| `additional_trigger` | `data-long-read-height` | jQuery element or selector | `null` | Custom trigger element. |

## Methods
### destroy
You can destroy the plugin instance.

```JavaScript
$('.long-read').longread('destroy');
```

## Events
| Event name | description |
|------------|-------------|
| `longread:get_height` | On default height calculation but before any change was made on DOM. |
| `longread:before_prepare` | When every option calculated but before any change was made on DOM. |
| `longread:prepared` | After DOM was changed. Element will be covered with additional `div` element and trigger element append after long-read element. |
| `longread:ready` | When plugin is ready. |
| `longread:click` | Fired when user clicks on (additional)triggering element. |
| `longread:open` | Before opening animation. |
| `longread:opened` | After opening animation. |
| `longread:close` | Before closing animation. |
| `longread:closed` | After closing animation. |
