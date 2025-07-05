import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { fileToText } from "../../../utils/fileToText";
import fs from "fs";
import { SocketRequest } from "utils/types";

interface FileTextResponse {
  fileName: string;
  text: string;
}

export class TextController {
  getText = async (req: SocketRequest, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      for (let file of files) {
        await fileToText(file, req.io);
        fs.unlinkSync(file.path);
      }
      return res.status(StatusCodes.OK).json({
        message: "Text extracted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
