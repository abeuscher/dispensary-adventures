const contentful = require("contentful");
const dateFilter = require("nunjucks-date");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");
const { BLOCKS } = require("@contentful/rich-text-types");

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title, description } = node.data.target.fields;
      const imageUrl = file.url.startsWith("//") ? `https:${file.url}` : file.url;

      return `<figure>
                  <img src="${imageUrl}" alt="${description || title}" />
                </figure>`;
    },
  },
};

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const getFields = (eleventyConfig) => {
  eleventyConfig.addCollection("reviewPost", async () => {
    const entries = await client.getEntries({
      content_type: "reviewPost",
      order: "sys.createdAt",
    });

    return entries.items.map((item) => {
      const formattedDate = dateFilter(item.fields.date, "yyyy/MM/DD");
      const cleanSlug = item.fields.slug
        .replace(/&#39;/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();

      // Add the permalink field to the item
      return {
        ...item.fields,
        permalink: `/${formattedDate}/${cleanSlug}/`,
      };
    });
  });
  eleventyConfig.addCollection("page", async () => {
    const entries = await client.getEntries({
      content_type: "page",
    });

    return entries.items.map((item) => {
      const fields = item.fields;

      if (fields.date) {
        fields.date = new Date(fields.date);
      }
      if (fields.pageContent) {
        fields.pageContentHtml = documentToHtmlString(fields.pageContent, options);
      }
      return fields;
    });
  });
};

module.exports = { getFields };
