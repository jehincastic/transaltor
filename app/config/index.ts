export const IS_PROD = process.env.NODE_ENV === "production";

// File upload
export const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
export const ACCEPTED_FILE_TYPES = ["application/zip", "application/x-zip-compressed"];
