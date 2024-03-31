import { Router } from "express";
import { apiV1Router } from "./api/v1";

export const apiRouter = Router();

apiRouter.use("/api/v1/", apiV1Router);
