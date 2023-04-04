# LazyLoad

### Example to use render
Html
``` html
<div id="content"></div>
```
JavaScript 
``` js
const lazy = new Lazy("content");
lazy.render( ['img1.jpg', 'img2.jpg'] )

```

### Example to use lazy
Html 
``` html
<div id="content">
    <img data-src="your-image.url" alt="img">
</div>
```
JavaScript 
``` js
const lazy = new Lazy("content");
// Dataset name example ( data-src )
lazy.lazy("src")
```
