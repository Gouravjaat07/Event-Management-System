import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "college-events",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// 👇 THIS IS CRITICAL
// export const eventUpload = upload.fields([
//   { name: "banner", maxCount: 1 },
//   { name: "logo", maxCount: 1 },
// ]);

export default upload;

// // origional file
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js"; // ✅ REQUIRED

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: "college-events",
//         allowed_formats: ["jpg", "jpeg", "png", "webp"],
//     },
// });

// const upload = multer({ storage });


// export default upload;

// import multer from "multer";
// import path from "path";

// // Storage config
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, "uploads/certificate-templates");
//     },
//     filename(req, file, cb) {
//         cb(
//             null,
//             `${Date.now()}-${file.originalname.replace(/\s+/g, "")}`
//         );
//     },
// });

// // File filter (only docx)
// const fileFilter = (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();

//     if(ext === ".docx") {
//         cb(null, true);
//     } else {
//         cb(new Error("Only .docx files are allowed"),
//     false);
//     }
// };

// // Upload
// const upload = multer({
//     storage,
//     fileFilter,
// });

// export default upload;