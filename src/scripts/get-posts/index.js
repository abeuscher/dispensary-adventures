var parseHTML = require("../utils/parse-html.js");
var forEach = require("lodash/forEach");
var activateImages = require("../utils/data-bg");
var templates = {
    "postBlock": require("./post-block.pug")
}

function GetPosts() {
    updateGallery();
    window.addEventListener("hashchange", updateGallery);
    function updateGallery() {
        const moreButton = document.getElementById("more-posts");
        const maxPages = parseInt(moreButton.getAttribute("data-max-pages"));
        if (window.location.hash.indexOf("page-") > -1) {
            const bucket = document.getElementById("post-bucket");
            let nextPage = parseInt(window.location.hash.split("-")[1]);
            if (nextPage <= maxPages) {
                fetch(
                    (window.location.hostname.indexOf(".local") > -1 ?
                        "http://" : "https://") + window.location.hostname + "/wp-json/wp/v2/posts?acf_format=standard&per_page=9&page=" + nextPage)
                    .then(data => {
                        return data.json();
                    })
                    .then(function (data) {
                        forEach(data, function (thisPost) {
                            bucket.appendChild(parseHTML(templates.postBlock(thisPost)));
                        });
                        var extraSpace = 3 - data.length % 3 > 2 ? 0 : 3 - data.length % 3;
                        for (i = 0; i < extraSpace; i++) {
                            bucket.appendChild(parseHTML("<div class='blog-spacer'></div>"));
                        }
                        activateImages(document.querySelectorAll("[data-bg]"));
                    });
                if (nextPage < maxPages) {
                    moreButton.href = "#page-" + (nextPage + 1);
                }
                else {
                    moreButton.style.display = "none";
                }
            }
        }
    }

}
module.exports = GetPosts;