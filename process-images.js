// process-images.js - Using Sharp for better performance

import fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import sharp from "sharp";

// Configuration
const inputDir = "./assets/images/";
const outputDir = "./dist/images/";
const widths = [400, 800, 1200, 2016];
const formats = ["webp", "jpeg"];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // Directory already exists or other error
    if (err.code !== "EEXIST") throw err;
  }
}

async function processImages() {
  console.log("Starting image processing with Sharp...");

  try {
    // Find all images using glob
    const imageFiles = await glob(`${inputDir}/**/*.{jpg,jpeg,png}`);
    console.log(`Found ${imageFiles.length} images to process`);

    // Process each image
    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const imagePath of imageFiles) {
      try {
        const relativePath = path.relative(inputDir, imagePath);
        const dirName = path.dirname(relativePath);
        const baseName = path.basename(imagePath, path.extname(imagePath));

        // Create output directory
        const outputPath = path.join(outputDir, dirName);
        await ensureDir(outputPath);

        // Check if already processed by looking for the smallest size
        const smallestWebp = path.join(outputPath, `${baseName}-400.webp`);

        try {
          await fs.access(smallestWebp);
          console.log(`  Skipping - already processed: ${relativePath}`);
          skipped++;
          continue;
        } catch (e) {
          // File doesn't exist, continue processing
        }

        // Load the image once
        const image = sharp(imagePath);
        const metadata = await image.metadata();

        // Process for each format and size
        for (const format of formats) {
          for (const width of widths) {
            // Only resize if original is larger
            if (width < metadata.width) {
              let pipeline = image.clone().resize(width);

              // Apply format-specific settings
              if (format === "webp") {
                pipeline = pipeline.webp({ quality: 80 });
              } else if (format === "jpeg") {
                pipeline = pipeline.jpeg({ quality: 80, progressive: true });
              }

              // Output file
              const outputFile = path.join(outputPath, `${baseName}-${width}.${format}`);
              await pipeline.toFile(outputFile);
            }
          }
        }

        processed++;
        console.log(`  Processed: ${relativePath}`);
      } catch (error) {
        console.error(`  Error processing ${imagePath}:`, error);
        errors++;
      }
    }

    console.log("Image processing complete!");
    console.log(`Processed: ${processed}, Skipped: ${skipped}, Errors: ${errors}`);
  } catch (error) {
    console.error("Error in image processing:", error);
    process.exit(1);
  }
}

// Run the function
processImages();
