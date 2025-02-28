import markdownIt from "markdown-it";

const markdownLib = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const addFilters = (eleventyConfig) => {
  eleventyConfig.addFilter("date", function (dateString, format = "yyyy-MM-dd") {
    //console.log("dateString:", dateString);
    //console.log("format:", format);
    let dateObj;
    if (dateString instanceof Date && !isNaN(dateString)) {
      dateObj = dateString;
    } else if (typeof dateString === "string") {
      const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);

      if (match) {
        const [, year, month, day] = match;
        dateObj = new Date(Date.UTC(year, month - 1, day));
      } else {
        dateObj = new Date(dateString);
      }

      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }
    } else {
      return "Invalid Date";
    }

    const formatDate = (date, format) => {
      if (!(date instanceof Date) || isNaN(date)) {
        return "err";
      }

      const formatter = new Intl.DateTimeFormat("en-US", {
        year: format.includes("yyyy") ? "numeric" : undefined,
        month: format.includes("MMMM") ? "long" : format.includes("MM") ? "2-digit" : "numeric",
        day: format.includes("dd") ? "2-digit" : format.includes("d") ? "numeric" : undefined,
        timeZone: "UTC", // This is the key addition to fix the timezone issue
      });

      const parts = formatter.formatToParts(date);
      const mapped = {};

      parts.forEach(({ type, value }) => {
        mapped[type] = value;
      });

      return format
        .replace("yyyy", mapped.year)
        .replace("MMMM", mapped.month)
        .replace("MM", String(mapped.month).padStart(2, "0"))
        .replace("dd", String(mapped.day).padStart(2, "0"))
        .replace("d", mapped.day);
    };

    const result = formatDate(dateObj, format);
    return result;
  });

  eleventyConfig.addFilter("prettyjson", (data) => {
    return JSON.stringify(data, undefined, 2);
  });

  // Filter to clean content for JSON-LD
  eleventyConfig.addFilter("cleanContent", function (content) {
    if (!content) return "";

    try {
      // First decode HTML entities
      let decoded = content
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");

      // Then strip all HTML tags
      let stripped = decoded.replace(/<[^>]*>/g, " ");

      // Clean up whitespace
      let cleaned = stripped
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .replace(/\n+/g, " ") // Replace newlines with spaces
        .replace(/^\s+|\s+$/g, "") // Trim whitespace from start and end
        .trim();

      // Escape special JSON characters
      cleaned = cleaned
        .replace(/\\/g, "\\\\") // Escape backslashes
        .replace(/"/g, '\\"') // Escape double quotes
        .replace(/\n/g, "\\n") // Escape newlines
        .replace(/\r/g, "\\r") // Escape carriage returns
        .replace(/\t/g, "\\t"); // Escape tabs

      // Limit length to avoid excessively long strings
      const maxLength = 500;
      if (cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + "...";
      }

      return cleaned;
    } catch (error) {
      console.error("Error cleaning content for JSON-LD:", error);
      return "";
    }
  });

  eleventyConfig.addFilter("divideScore", function (score) {
    return (score / 3).toFixed(0);
  });

  eleventyConfig.addFilter("markdownify", (content) => {
    return content;
  });

  eleventyConfig.addNunjucksFilter("imgResize", function (url, width, height) {
    return url ? `${url}` : ``;
  });

  // JSON filter for properly handling circular references
  eleventyConfig.addFilter("json", function (value) {
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return undefined; // Remove circular reference
          }
          seen.add(value);
        }
        return value;
      };
    };

    try {
      return JSON.stringify(value, getCircularReplacer());
    } catch (error) {
      console.error("JSON stringify error:", error);
      return "[]";
    }
  });

  // Filter to set a property on an object
  eleventyConfig.addFilter("setAttribute", function (obj, key, value) {
    // Create a new object to avoid mutating the original
    const newObj = { ...obj };
    newObj[key] = value;
    return newObj;
  });

  eleventyConfig.addFilter("getPrevNext", function (data, current) {
    let previousEntry = null;
    let nextEntry = null;

    let currentSlug = null;
    if (current) {
      if (current.slug) {
        currentSlug = current.slug;
      } else if (current.data && current.data.slug) {
        currentSlug = current.data.slug;
      } else if (current.fileSlug) {
        currentSlug = current.fileSlug;
      } else if (current.url) {
        const urlParts = current.url.split("/").filter(Boolean);
        currentSlug = urlParts[urlParts.length - 1];
      }
    }

    if (!data || !Array.isArray(data) || !currentSlug) {
      return { previousEntry, nextEntry };
    }

    let currentIndex = -1;

    currentIndex = data.findIndex((item) => {
      const itemSlug = item.data ? item.data.slug : item.slug;
      return itemSlug === currentSlug;
    });

    if (currentIndex === -1) {
      currentIndex = data.findIndex((item) => {
        const itemUrl = item.url || (item.data ? item.data.permalink : null);
        const currentUrl = current.url || current.permalink;
        return itemUrl && currentUrl && itemUrl === currentUrl;
      });
    }

    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        nextEntry = data[currentIndex - 1];
      }
      if (currentIndex < data.length - 1) {
        previousEntry = data[currentIndex + 1];
      }
    }

    return { previousEntry, nextEntry };
  });

  eleventyConfig.addFilter("extractReviewSections", function (content) {
    if (!content) return {};

    // Create an object to store our extracted sections
    const sections = {};

    // Main content is everything before the first <h2>
    const mainParts = content.split(/<h2[^>]*>/i);
    sections.main = mainParts[0] ? mainParts[0].trim() : "";

    // Extract sections by looking for <h2> tags
    const sectionMatches = content.matchAll(/<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi);

    for (const match of sectionMatches) {
      const heading = match[1].trim();
      const content = match[2].trim();

      // Convert heading to key
      const key = heading
        .toLowerCase()
        .replace(/notes/i, "_notes")
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      sections[key] = content;
    }

    return sections;
  });
};

export default addFilters;
