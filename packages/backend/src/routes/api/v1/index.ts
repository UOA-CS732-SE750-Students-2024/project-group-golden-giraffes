import { Router } from "express";
import { canvasRouter } from "./canvas";
import { paletteRouter } from "./palette";

export const apiV1Router = Router();

apiV1Router.use("/canvas", canvasRouter);
apiV1Router.use("/palette", paletteRouter);
