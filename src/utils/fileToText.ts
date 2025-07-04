import pdf from "pdf-parse";
import mammoth from "mammoth";
import {createWorker} from "tesseract.js";
import fsPromises from "fs/promises";
import fs from "fs";

export const fileToText = async (file: Express.Multer.File) => {
  try {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      const worker = await createWorker('eng');
      const result = await worker.recognize(file.path);
      return result.data.text.toString();
    } else if (file.mimetype === "application/pdf") {
      const dataBuffer = await fsPromises.readFile(file.path);
      const result = await pdf(dataBuffer);
      return result.text.toString();
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      return result.value.toString();
    } else {
      throw new Error("Invalid file type");
    }
  } catch (error) {
    fs.unlinkSync(file.path);
    throw new Error(error.message);
  }
};
