import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function extractFileContent(buffer, mimetype) {
  if (!buffer) {
    throw new Error("File buffer is required.");
  }

  if (mimetype === "text/plain" || mimetype === "text/plain; charset=UTF-8") {
    return buffer.toString("utf-8");
  }

  if (mimetype === "application/pdf") {
    try {
      const data = await pdfParse(buffer);
      return data.text || "";
    } catch (err) {
      throw new Error("Failed to extract PDF content");
    }
  }

  throw new Error("Unsupported file type. Please use TXT or PDF.");
}