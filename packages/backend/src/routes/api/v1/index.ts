import { Router } from "express";
import { canvasRouter } from "./canvas";

export const apiV1Router = Router();

apiV1Router.use("/canvas", canvasRouter);
