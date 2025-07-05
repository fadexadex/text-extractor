import { Prisma } from "@prisma/client";
import { Request } from "express";
import { Server as SocketServer} from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
export interface ILoginBody {

  email: string;
  password: string;
}


export interface SocketRequest extends Request {
  io: SocketServer;
}

export type TokenPayload = Omit<Prisma.UserCreateInput, "password">;


