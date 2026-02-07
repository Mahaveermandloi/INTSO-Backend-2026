import fs from "fs";
import path from "path";

export const createUploadFolders = (__dirname) => {
  const folders = [
    "uploads",
    "uploads/gallery",
    "uploads/resources/images",
    "uploads/resources/videos",
    "uploads/resources/pdfs",
    "uploads/banners",
    "uploads/profile",
    "uploads/testimonial",
    "uploads/newsandupdate",
    "uploads/blog",
  ];

  folders.forEach((folder) => {
    const fullPath = path.join(__dirname, "..", folder);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log("✅ Created:", fullPath);
    }
  });
};
