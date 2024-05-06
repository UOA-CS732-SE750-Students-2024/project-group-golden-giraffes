import { prisma } from "@/client";

export default function initialiseGuilds() {
  prisma.guild.createMany({
    data: [
      { id: 0, invite: "web" },
      { id: 1, invite: "Guild 1" },
      { id: 9, invite: "Guild 9" },
    ],
  });
}
