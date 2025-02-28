import fs from "fs";
import matter from "gray-matter";
import path from "path";

// Configuration
const imagesDir = "./assets/images/reviews";
const reviewsDir = "./content/reviews";

// Helper function to clean folder names
function cleanFolderName(name) {
  return name
    .replace(/['.]/g, "") // Remove periods and apostrophes
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .toLowerCase();
}

// Get all image folders
function getImageFolders() {
  try {
    if (!fs.existsSync(imagesDir)) {
      console.error(`Images directory ${imagesDir} does not exist`);
      return [];
    }

    return fs
      .readdirSync(imagesDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  } catch (error) {
    console.error(`Error getting image folders: ${error.message}`);
    return [];
  }
}

// Get all review files
function getReviewFiles() {
  try {
    if (!fs.existsSync(reviewsDir)) {
      console.error(`Reviews directory ${reviewsDir} does not exist`);
      return [];
    }

    return fs
      .readdirSync(reviewsDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => path.join(reviewsDir, file));
  } catch (error) {
    console.error(`Error getting review files: ${error.message}`);
    return [];
  }
}

// Find folders that need renaming
function findFoldersToRename(folders) {
  return folders
    .filter((folder) => {
      const cleanName = cleanFolderName(folder);
      return cleanName !== folder;
    })
    .map((folder) => ({
      original: folder,
      clean: cleanFolderName(folder),
    }));
}

// Rename folder
function renameFolder(original, clean) {
  const originalPath = path.join(imagesDir, original);
  const cleanPath = path.join(imagesDir, clean);

  try {
    // Create new directory if it doesn't exist
    if (!fs.existsSync(cleanPath)) {
      fs.mkdirSync(cleanPath, { recursive: true });
    }

    // Copy all files from original to clean directory
    const files = fs.readdirSync(originalPath);
    for (const file of files) {
      const oldFilePath = path.join(originalPath, file);
      const newFilePath = path.join(cleanPath, file);

      fs.copyFileSync(oldFilePath, newFilePath);
      console.log(`Copied: ${oldFilePath} -> ${newFilePath}`);
    }

    // Don't delete the original folder yet - we'll do that after updating all references
    return true;
  } catch (error) {
    console.error(`Error renaming folder ${original}: ${error.message}`);
    return false;
  }
}

// Update references in review files
function updateReviewFile(filePath, folderMap) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { data, content: markdownContent } = matter(content);

    // Check if photos property exists
    if (!data.photos || !Array.isArray(data.photos)) {
      return false;
    }

    let updated = false;

    // Update photo references
    data.photos = data.photos.map((photoPath) => {
      for (const [original, clean] of Object.entries(folderMap)) {
        const originalPattern = `/images/reviews/${original}/`;
        const cleanPattern = `/images/reviews/${clean}/`;

        if (photoPath.includes(originalPattern)) {
          updated = true;
          return photoPath.replace(originalPattern, cleanPattern);
        }
      }
      return photoPath;
    });

    // Update other references in frontmatter
    if (data.seo && data.seo.featured_image) {
      for (const [original, clean] of Object.entries(folderMap)) {
        const originalPattern = `/images/reviews/${original}/`;
        const cleanPattern = `/images/reviews/${clean}/`;

        if (data.seo.featured_image.includes(originalPattern)) {
          data.seo.featured_image = data.seo.featured_image.replace(originalPattern, cleanPattern);
          updated = true;
        }
      }
    }

    // Check for image references in markdown content
    let updatedContent = markdownContent;
    for (const [original, clean] of Object.entries(folderMap)) {
      const originalPattern = `/images/reviews/${original}/`;
      const cleanPattern = `/images/reviews/${clean}/`;

      if (updatedContent.includes(originalPattern)) {
        updatedContent = updatedContent.replace(new RegExp(originalPattern, "g"), cleanPattern);
        updated = true;
      }
    }

    // Write back to file if updated
    if (updated) {
      const updatedFileContent = matter.stringify(updatedContent, data);
      fs.writeFileSync(filePath, updatedFileContent, "utf8");
      console.log(`Updated references in: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error updating review file ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
async function cleanFolderNames() {
  console.log("Starting folder cleanup...");

  // Get all image folders and find problematic ones
  const imageFolders = getImageFolders();
  const foldersToRename = findFoldersToRename(imageFolders);

  if (foldersToRename.length === 0) {
    console.log("No folders need renaming.");
    return;
  }

  console.log(`Found ${foldersToRename.length} folders to rename:`);
  foldersToRename.forEach(({ original, clean }) => {
    console.log(`- ${original} -> ${clean}`);
  });

  // Create a mapping of original to clean folder names
  const folderMap = {};
  foldersToRename.forEach(({ original, clean }) => {
    folderMap[original] = clean;
  });

  // Rename folders
  console.log("\nRenaming folders...");
  for (const { original, clean } of foldersToRename) {
    const success = renameFolder(original, clean);
    if (success) {
      console.log(`Renamed: ${original} -> ${clean}`);
    }
  }

  // Update references in review files
  console.log("\nUpdating references in review files...");
  const reviewFiles = getReviewFiles();
  console.log(`Found ${reviewFiles.length} review files to check`);

  let updatedFiles = 0;
  for (const filePath of reviewFiles) {
    const updated = updateReviewFile(filePath, folderMap);
    if (updated) {
      updatedFiles++;
    }
  }

  console.log(`Updated references in ${updatedFiles} files`);

  // After all references are updated, now it's safe to delete original folders
  console.log("\nCleaning up original folders...");
  for (const { original } of foldersToRename) {
    try {
      // Using this approach to be extra safe - we're renaming the original folder
      // to a backup name instead of deleting it right away
      const originalPath = path.join(imagesDir, original);
      const backupPath = path.join(imagesDir, `_backup_${original}`);

      fs.renameSync(originalPath, backupPath);
      console.log(`Renamed original to backup: ${original} -> _backup_${original}`);
    } catch (error) {
      console.error(`Error backing up original folder ${original}: ${error.message}`);
    }
  }

  console.log("\nOperation completed. Please verify the changes before deleting backup folders.");
  console.log("To delete backup folders, run:");
  for (const { original } of foldersToRename) {
    console.log(`rm -rf "${path.join(imagesDir, `_backup_${original}`)}"`);
  }
}

// Run the script
cleanFolderNames().catch((error) => {
  console.error("Error running script:", error);
});
