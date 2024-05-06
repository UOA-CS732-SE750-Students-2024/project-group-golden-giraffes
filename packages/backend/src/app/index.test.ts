import request from "supertest";
import { createApp } from "./index";

import { prisma } from "@/client";
import seedPrismock from "@/test";

// Instantiates the entire server of the app here since the hello world route is not exported
// It would be better to create an express app at the start and then add the specific route
const { app, server } = createApp();

describe("Hello world test", () => {
  describe("GET /", () => {
    it("Receives hello world", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ message: "Hello, world!" });
    });

    it("Receives hello world but with a different syntax", async () => {
      await request(app).get("/").expect(200, { message: "Hello, world!" });
    });
  });
});

describe("Test Prisma Stuff", () => {
  beforeEach(() => {
    seedPrismock();
  });

  it("can write to in memory prisma instance", async () => {
    await prisma.canvas.create({
      data: { name: "New Canvas", width: 2, height: 2 },
    });
    const canvas = await prisma.canvas.findFirst({
      where: { name: "New Canvas" },
    });
    expect(canvas?.name).toStrictEqual("New Canvas");
  });

  it("resets after each test", async () => {
    const canvas = await prisma.canvas.findMany();
    expect(canvas.length).toEqual(2);
  });
});

server.close();
