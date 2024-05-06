import { prisma } from "@/client";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/errors";
import {
  seedBlacklist,
  seedCanvases,
  seedColors,
  seedPixels,
  seedUsers,
} from "@/test";
import {
  placePixel,
  validateColor,
  validatePixel,
  validateUser,
} from "./pixelService";

describe("Pixel Validation Tests", () => {
  beforeEach(() => {
    seedCanvases();
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

  it("Rejects locked canvas when honorLocked is true", async () => {
    return expect(validatePixel(9, 0, 0, true)).rejects.toThrow(ForbiddenError);
  });

  it("Resolves locked canvas when honorLocked is false", async () => {
    return expect(validatePixel(9, 0, 0, false)).resolves.not.toThrow();
  });
});

describe("Color Validation Tests", () => {
  beforeEach(() => {
    seedColors();
  });

  it("Resolves valid color", async () => {
    return expect(validateColor(1)).resolves.not.toThrow();
  });

  it("Rejects color that is not global", async () => {
    return expect(validateColor(3)).rejects.toThrow(ForbiddenError);
  });

  it("Rejects invalid color", async () => {
    return expect(validateColor(99)).rejects.toThrow(NotFoundError);
  });
});

describe("User Validation Tests", () => {
  beforeEach(() => {
    seedUsers();
    seedBlacklist();
    seedCanvases();
  });

  it("Rejects blacklisted user", async () => {
    return expect(validateUser(1, BigInt(9))).rejects.toThrow(ForbiddenError);
  });

  it("Resolves canvas with no cooldown_time", async () => {
    // A user theoretically shouldn't have cooldown time if the canvas doesn't
    prisma.cooldown.create({
      data: { canvas_id: 9, user_id: BigInt(1), cooldown_time: new Date() },
    });
    return expect(validateUser(9, BigInt(1))).resolves.not.toThrow();
  });

  it("Resolves user with no cooldown", async () => {
    // Don't create cooldown in the database.
    return expect(validateUser(1, BigInt(1))).resolves.not.toThrow();
  });

  it("Resolves user with null cooldown", async () => {
    // A user theoretically shouldn't have cooldown time if the canvas doesn't
    prisma.cooldown.create({
      data: { canvas_id: 1, user_id: BigInt(1), cooldown_time: null },
    });
    return expect(validateUser(1, BigInt(1))).resolves.not.toThrow();
  });

  it("Resolves user with cooldown greater than 30 seconds", async () => {
    const dateTime = Date.now() - 1000 * 30;
    prisma.cooldown.create({
      data: {
        canvas_id: 1,
        user_id: BigInt(1),
        cooldown_time: new Date(dateTime),
      },
    });
    return expect(validateUser(1, BigInt(1))).resolves.not.toThrow();
  });

  it("Rejects user with cooldown less than 30 seconds", async () => {
    prisma.cooldown.create({
      data: { canvas_id: 1, user_id: BigInt(1), cooldown_time: new Date() },
    });
    return expect(validateUser(1, BigInt(1))).rejects.toThrow(ForbiddenError);
  });
});

describe("Place Pixel Tests", () => {
  beforeEach(() => {
    seedUsers();
    seedCanvases();
    seedColors();
    seedPixels();
  });

  it("Resolves places the pixel", async () => {
    const canvasId = 1;
    const userId = BigInt(1);

    await placePixel(canvasId, userId, { x: 1, y: 1, colorId: 1 }, new Date());
    const before = await fetchCooldownPixelHistory(canvasId, userId, 1, 1);
    await placePixel(
      canvasId,
      userId,
      { x: 1, y: 1, colorId: 2 },
      new Date(Date.now() + 31),
    );
    const after = await fetchCooldownPixelHistory(canvasId, userId, 1, 1);

    expect(before.pixel).not.toStrictEqual(after.pixel);
    expect(before.cooldown).not.toStrictEqual(after.cooldown);
    expect(before.history.length + 1).toEqual(after.history.length);
  });

  it("Resolves it only places once within 30 seconds", async () => {
    const canvasId = 1;
    const userId = BigInt(1);

    const date = new Date();

    const before = await fetchCooldownPixelHistory(canvasId, userId, 1, 1);
    for (let i = 0; i < 3; i++) {
      await placePixel(canvasId, userId, { x: 1, y: 1, colorId: 1 }, date);
    }
    const after = await fetchCooldownPixelHistory(canvasId, userId, 1, 1);

    expect(before.history.length + 1).toEqual(after.history.length);
  });

  async function fetchCooldownPixelHistory(
    canvasId: number,
    userId: bigint,
    x: number,
    y: number,
  ) {
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        user_id: userId,
        canvas_id: canvasId,
      },
    });
    const pixel = await prisma.pixel.findFirst({
      where: {
        canvas_id: canvasId,
        x: x,
        y: y,
      },
    });
    const history = await prisma.history.findMany({
      where: {
        canvas_id: canvasId,
        x: x,
        y: y,
      },
    });
    return { cooldown, pixel, history };
  }
});
