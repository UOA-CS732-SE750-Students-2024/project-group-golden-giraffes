import express from "express";
import request from "supertest";

import seedPrismock from "@/test";
import { mockAuth } from "@/test/mockAuth";
import { pixelRouter } from "./pixel";

const app = express();

app.use(express.json());
app.use(mockAuth);
app.use("/api/v1/canvas/:canvasId/pixel", pixelRouter);

describe("Place Pixel Tests", () => {
  beforeEach(() => {
    seedPrismock();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("Pixel is placed with valid user", async () => {
    const dateTime = new Date(0);
    vi.setSystemTime(dateTime);
    const response = await request(app)
      .post("/api/v1/canvas/1/pixel")
      .send({
        x: 1,
        y: 1,
        colorId: 1,
      })
      .type("json")
      .set("X-TestUserId", "1");
    expect(response.body).toStrictEqual({
      coolDownTimeStamp: dateTime.toISOString(),
    });
    expect(response.status).toBe(201);
  });
});
