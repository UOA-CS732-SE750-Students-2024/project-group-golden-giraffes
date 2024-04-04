import { canvas } from "@prisma/client";
import { PNG } from "pngjs";
import { prisma } from "../client";

export async function canvasToPng(canvas: canvas): Promise<PNG> {
  const pixels = await prisma.pixel.findMany({
    select: {
      color: {
        select: { rgba: true },
      },
    },
    where: { canvas_id: canvas.id },
    orderBy: [{ y: "asc" }, { x: "asc" }],
  });

  const image = new PNG({ width: canvas.width, height: canvas.height, filterType: 0 });

  console.log(pixels.length);
  console.log(pixels[0]);
  console.log(pixels[1]);
  console.log(pixels[2]);
  console.log(pixels[3]);

  pixels.forEach((pixel, index) => {
    const imageIndex = index * 4;
    image.data[imageIndex] = pixel.color.rgba[0];
    image.data[imageIndex + 1] = pixel.color.rgba[1];
    image.data[imageIndex + 2] = pixel.color.rgba[2];
    image.data[imageIndex + 3] = pixel.color.rgba[3];
  });

  return image;
}
