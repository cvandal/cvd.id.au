// Hack to prevent Hugo from showing a card for the 'Search Results' page
$(".card").remove(":contains('Search Results')");

$.getJSON("/index.json").done(function (data) {
    var urlSearchParams = new URLSearchParams(window.location.search);
    var query = urlSearchParams.get('q');

    if (query != null) {
        $(".form-control").val(query);

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
                if (post.item.title != "Search Results") {
                    $(".search-results").append('<div class="col mb-4"><a class="card h-100" href="' + post.item.permalink + '"><img class="card-img-top" src="' + post.item.image + '" alt="' + post.item.title + '"><div class="card-body"><h5 class="card-title">' + post.item.title + '</h5></div></a></div>');
                }
            });
        }
        else {
            $(".no-search-results").append('<p>Your search - <strong>' + query + '</strong> - did not match any blog post.</p>');
        }
    }
});
