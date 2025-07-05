import pdf from "pdf-parse";
import mammoth from "mammoth";
import {createWorker} from "tesseract.js";
import fsPromises from "fs/promises";
import fs from "fs";
import { Server as SocketServer } from "socket.io";

export const fileToText = async (file: Express.Multer.File, io?: SocketServer) => {
  try {
    let extractedText: string;
    
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      const worker = await createWorker('eng');
      const result = await worker.recognize(file.path);
      extractedText = result.data.text.toString();
    } else if (file.mimetype === "application/pdf") {
      const dataBuffer = await fsPromises.readFile(file.path);
      const result = await pdf(dataBuffer);
      extractedText = result.text.toString();
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value.toString();
    } else {
      throw new Error("Invalid file type");
    }

    if (io) {
      io.emit("file-extraction-complete", {
        filename: file.originalname,
        message: `Text extraction completed for ${file.originalname}`,
        timestamp: new Date().toISOString()
      });
    }

    return extractedText;
  } catch (error) {
    fs.unlinkSync(file.path);
    
    if (io) {
      io.emit("file-extraction-error", {
        filename: file.originalname,
        message: `Text extraction failed for ${file.originalname}: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    }
    
    throw new Error(error.message);
  }
};
