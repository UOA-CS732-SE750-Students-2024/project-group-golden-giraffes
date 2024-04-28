import request from "supertest";
import { createApp } from "./index";

import { prisma } from "@/client";

// Instantiates the entire server of the app here since the hello world route is not exported
// It would be better to create an express app at the start and then add the specific route
const { app, server } = createApp();

describe("Hello world test", () => {
  describe("GET /", () => {
    it("Recieves hello world", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ message: "Hello, world!" });
    });

    it("Recieves hello world but with a different syntax", async () => {
      await request(app).get("/").expect(200, { message: "Hello, world!" });
    });
  });
});

describe("Test Prisma Stuff", () => {
  const testCanvas = {
    name: "Test Canvas",
    locked: true,
    width: 100,
    height: 100,
    start_coordinates: [1, 1],
  };

  it("can find no canvases", async () => {
    const canvas = await prisma.canvas.findMany();
    expect(canvas).toStrictEqual([]);
  });

  it("can write to in memory prisma instance", async () => {
    prisma.canvas.create({ data: testCanvas });
    const canvas = await prisma.canvas.findFirst({ where: { id: 1 } });
    expect(canvas?.name).toStrictEqual("Test Canvas");
  });

  it("resets after each test", async () => {
    prisma.canvas.create({ data: testCanvas });
    const canvas = await prisma.canvas.findMany();
    expect(canvas.length).toEqual(1);
  });
});

server.close();
