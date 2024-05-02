import { prisma } from "@/client";

// Only have 4 colours for testing purposes; selected colours reflect prod database
export default function () {
  prisma.color.createMany({
    data: [
      {
        id: 1,
        code: "blank",
        emoji_name: "pl_blank",
        emoji_id: BigInt("540761786484391957"),
        global: true,
        name: "Blank tile",
        rgba: [88, 101, 242, 127],
      },
      {
        id: 18,
        code: "blpl",
        emoji_name: "pl_blpl",
        emoji_id: BigInt("971623647758401566"),
        global: true,
        name: "Blurple",
        rgba: [88, 101, 242, 255],
      },
      {
        id: 24,
        code: "mrvl",
        emoji_name: "pl_mrvl",
        emoji_id: BigInt("572564652559564810"),
        global: false,
        name: "Marvel Red",
        rgba: [234, 35, 40, 255],
      },
      {
        id: 76,
        code: "iitr",
        emoji_name: "pl_iitr",
        emoji_id: BigInt("840064486374637608"),
        global: false,
        name: "insaneintheblue",
        rgba: [0, 90, 166, 255],
      },
    ],
  });
}
