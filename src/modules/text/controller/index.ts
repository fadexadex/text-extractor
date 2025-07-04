import { TextService } from "../service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { fileToText } from "../../../utils/fileToText";
import fs from "fs";

const textService = new TextService();

interface FileTextResponse {
  fileName: string;
  text: string;
}

export class TextController {
  getText = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      let finalText: FileTextResponse[] = []
      for(let file of files){
        const text = await fileToText(file)
        fs.unlinkSync(file.path); 
        finalText.push({ fileName: file.originalname, text });
      }
      return res.status(StatusCodes.OK).json(finalText);
    } catch (error) {
      next(error);
    }
  };
}
