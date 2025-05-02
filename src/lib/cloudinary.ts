import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, // Cloudinary Cloud Name
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,       // Cloudinary API Key
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET, // Cloudinary API Secret
  secure: true, // Use HTTPS
});

export default cloudinary;