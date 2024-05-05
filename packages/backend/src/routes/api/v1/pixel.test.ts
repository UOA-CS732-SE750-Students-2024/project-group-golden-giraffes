import express from "express";
import request from "supertest";

import seedPrismock from "@/test";
import { pixelRouter } from "./pixel";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/canvas/:canvasId/pixel", pixelRouter);

describe("Place Pixel Tests", () => {
  beforeEach(() => {
    seedPrismock();
  });

  it("Pixel is placed", async () => {
    const token = "X7DfnSE5XYS8c1cCklKPKNVQbJBpUa";
    const response = await request(app)
      .post("/api/v1/canvas/1/pixel")
      .send({
        x: 1,
        y: 1,
        colorId: 1,
      })
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });
    expect(response.body.message).toStrictEqual("pixel endpoint1");
  });
});
