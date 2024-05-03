import express from "express";
import request from "supertest";

import { prisma } from "@/client";
import { ForbiddenError } from "@/errors";
import BadRequestError from "@/errors/BadRequestError";
import NotFoundError from "@/errors/NotFoundError";
import initializeCanvases from "@/test/initializeCanvases";
import { validatePixel } from "./pixelService";

describe("Pixel Validation Tests", () => {
  beforeEach(() => {
    initializeCanvases();
  });

  it("Resolves valid canvas on top left pixel (0, 0)", async () => {
    return expect(validatePixel(1, 0, 0, false)).resolves.not.toThrow();
  });

  it("Resolves valid canvas on bottom right pixel (1, 1)", async () => {
    return expect(validatePixel(1, 1, 1, false)).resolves.not.toThrow();
  });

  it("Rejects with x too small", async () => {
    return expect(validatePixel(1, -1, 0, false)).rejects.toThrow(
      BadRequestError,
    );
  });

  it("Rejects with x too large", async () => {
    return expect(validatePixel(1, 99, 0, false)).rejects.toThrow(
      BadRequestError,
    );
  });

  it("Rejects valid canvas with y too small", async () => {
    return expect(validatePixel(1, 0, -1, false)).rejects.toThrow(
      BadRequestError,
    );
  });

  it("Rejects valid canvas with y too large", async () => {
    return expect(validatePixel(1, 0, 99, false)).rejects.toThrow(
      BadRequestError,
    );
  });

  it("Rejects nonexistent canvas", async () => {
    return expect(validatePixel(9999, 0, 0, false)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("Rejects locked canvas when respectLocked is true", async () => {
    return expect(validatePixel(9, 0, 0, true)).rejects.toThrow(ForbiddenError);
  });

  it("Resolves locked canvas when respectLocked is false", async () => {
    return expect(validatePixel(9, 0, 0, false)).resolves.not.toThrow();
  });
});
