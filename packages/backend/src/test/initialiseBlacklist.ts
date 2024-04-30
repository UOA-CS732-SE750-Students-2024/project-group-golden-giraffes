import { prisma } from "@/client";

export default function () {
  prisma.blacklist.create({
    data: {
      user_id: 9,
      date_added: new Date(0),
    },
  });
}
