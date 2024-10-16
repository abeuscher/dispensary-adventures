const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

module.exports = async () => {
  return client
    .getEntries({ content_type: "reviewPost", order: "sys.createdAt" })
    .then(function (response) {
      const reviewPosts = response.items.map(function (reviewPost) {
        return reviewPost.fields;
      });
      return reviewPosts;
    })
    .catch(console.error);
};
