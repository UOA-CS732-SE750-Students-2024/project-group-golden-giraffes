import { prisma } from "@/client";
import { discord_user_profile } from "@prisma/client";

export async function getDiscordProfile(
  userId: bigint,
): Promise<discord_user_profile> {
  const discordUserProfile = await prisma.discord_user_profile.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!discordUserProfile) {
    throw new Error(`Discord profile not found for user ID ${userId}`);
  }

  return discordUserProfile;
}

export async function createOrUpdateDiscordProfile(
  userId: bigint,
  profile: discord_user_profile,
): Promise<void> {
  await prisma.discord_user_profile.upsert({
    where: {
      user_id: userId,
    },
    update: profile,
    create: {
      user_id: userId,
      username: profile.username,
      profile_picture_url: profile.profile_picture_url,
    },
  });
}
