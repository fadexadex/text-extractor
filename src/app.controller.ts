import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares";
import authRoutes from "./modules/auth/routes";
import textRoutes from "./modules/text/routes"; 
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import { SocketRequest } from "./utils/types";
import http from "http";

dotenv.config();

export class Server {
  private app: express.Application;
  private port: number;
  private apiRouter: express.Router;
  private server: http.Server;
  private io: SocketServer;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.apiRouter = express.Router();
    this.server = http.createServer(this.app);
  }

  private enableMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(errorHandler);
    this.app.use(cors());
  }

  private setupSocket() {
    this.io = new SocketServer(this.server, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket) => {
      console.log("User connected");
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }

  private useSocket() {
    this.app.use((req: SocketRequest, res, next) => {
      req.io = this.io;
      next();
    });
  }

  private setUpRoutes() {
    this.apiRouter.use("/auth", authRoutes);
    this.apiRouter.use("/text", textRoutes);
    this.app.use("/api/v1", this.apiRouter);
    this.app.use(errorHandler);
  }

  public startApp() {
    this.enableMiddlewares();
    this.setupSocket();
    this.useSocket();
    this.setUpRoutes();
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
