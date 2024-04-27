import request from "supertest";
import { createApp } from "./index";

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

server.close();
