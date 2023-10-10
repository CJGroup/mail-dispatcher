import {
  NextFunction,
  Request,
  Response,
} from "express-serve-static-core";
import { User } from "../db";
import { expressjwt } from "express-jwt";
import { JWT_SECRET, genToken } from ".";

declare module "express-serve-static-core" {
  interface Request {
    auth: Record<string, any>;
  }
}

export const adminMiddleware: any[] = [
  expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }),
  async function (req: Request, res: Response, next: NextFunction) {
    const user = await User.findOne({
      where: {
        openID: req.auth.openID,
        unionID: req.auth.unionID,
      },
    });
    const permission = user?.permission?user.permission:1;
    if (!user)
      res.status(401).json({
        code: 1,
        message: "Login needed!",
      });
    else if (permission < 2)
      res.status(403).json({
        code: 3,
        message: "You have no permission!",
      });
    else next();
  },
];

export const superAdminMiddleware:any[] = [
  expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }),
  async function (req: Request, res: Response, next: NextFunction) {
    const user = await User.findOne({
      where: {
        openID: req.auth.openID,
        unionID: req.auth.unionID,
      },
    });
    const permission = user?.permission?user.permission:1;
    if (!user)
      res.status(401).json({
        code: 1,
        message: "Login needed!",
      });
    else if (permission < 3)
      res.status(403).json({
        code: 3,
        message: "You have no permission!",
      });
    else next();
  },
];
