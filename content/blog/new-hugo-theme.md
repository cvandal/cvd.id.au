---
title: "New Hugo Theme"
date: 2020-01-26T20:37:00+11:00
tags: ["Hugo"]
image: "/images/hugo.png"
draft: false
---

### Homepage

{{< figure src="/images/new-hugo-theme-homepage.png" >}}

### Rainbow Icons

```css
.rainbow-text {
    background: linear-gradient(to right, #0074d9, #f012be, #2ecc40);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    animation: rainbow 2s ease-in-out infinite;
    transition: color .2s ease-in-out;
    color: rgba(0,0,0,1);
}

.rainbow-text:hover {
    color: rgba(0,0,0,0);
}

@keyframes rainbow { 
    0% {
        background-position: left
    }
    50% {
        background-position: right
    }
    100% {
        background-position:left
    }
}
```

{{< figure src="/images/new-hugo-theme-rainbow-icons.gif" >}}

### List of Blog Posts

{{< figure src="/images/new-hugo-theme-list.png" >}}

### Search Results

```javascript
// Requires jquery + fuse.js

// Hack to prevent Hugo from showing a card for the 'Search Results' page
$(".card").remove(":contains('Search Results')");

$.getJSON("/index.json").done(function (data) {
    var urlSearchParams = new URLSearchParams(window.location.search);
    var query = urlSearchParams.get('q');

    if (query != null) {
        $(".form-control").val(query);
    }

    var options = {
        shouldSort: true,
        threshold: 0.0,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "title",
            "tags",
            "image",
            "permalink"
        ]
    };

    var fuse = new Fuse(data, options);
    var result = fuse.search(query);

    if (result.length != 0) {
        result.forEach(post => {
            // Another hack to prevent Hugo from showing a card for the 'Search Results' page
            if (post.title != "Search Results") {
                $(".search-results").append('<div class="col mb-4"><a class="card h-100" href="' + post.permalink + '"><img class="card-img-top" src="' + post.image + '" alt="' + post.title + '"><div class="card-body"><h5 class="card-title">' + post.title + '</h5></div></a></div>');
            }
        });
    }
    else {
        $(".no-search-results").append('<p>Your search - <strong>' + query + '</strong> - did not match any blog post.</p>');
    }
});
```

#### Found

{{< figure src="/images/new-hugo-theme-search-results-1.png" >}}

#### Not Found

{{< figure src="/images/new-hugo-theme-search-results-2.png" >}}

### Blog Post

{{< figure src="/images/new-hugo-theme-single.png" >}}
