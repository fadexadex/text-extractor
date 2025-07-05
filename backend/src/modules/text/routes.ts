import { Router } from "express";
import { TextController } from "./controller";
import upload from "../../utils/multer";

const route = Router();
const textController = new TextController();

route.post("/get-text", upload.array("image"), textController.getText);

export default route;
