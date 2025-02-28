// Place this in your _data folder (named reviews.js)
export default function (collection) {
  // We need to access the collection directly here
  // Note: In 11ty data files, collection is passed as an argument

  if (!collection || !collection.getAll) {
    console.log("Collection not available in data file");
    return [];
  }

  try {
    const reviews = collection.getFilteredByTag("reviews") || [];
    console.log(`Found ${reviews.length} reviews in data file`);

    // Extract only the data we need for the table
    return reviews;
  } catch (error) {
    console.error("Error processing reviews in data file:", error);
    return [];
  }
}
