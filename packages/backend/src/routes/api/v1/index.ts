import { Router } from "express";
import { canvasRouter } from "./canvas";
import { discordRouter } from "./discord";
import { paletteRouter } from "./palette";

export const apiV1Router = Router();

apiV1Router.use("/canvas", canvasRouter);
apiV1Router.use("/discord", discordRouter);
apiV1Router.use("/palette", paletteRouter);
