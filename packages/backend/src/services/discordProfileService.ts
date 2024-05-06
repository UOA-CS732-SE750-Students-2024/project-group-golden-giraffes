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
  profile: discord_user_profile,
): Promise<void> {
  if (!profile) {
    throw new Error("Profile is required");
  }
  await prisma.discord_user_profile.upsert({
    where: {
      user_id: profile.user_id,
    },
    update: profile,
    create: {
      ...profile,
    },
  });
}

export function createDefaultAvatarUrl(userId: bigint): string {
  const BIT_SHIFT_VALUE: bigint = 22n;
  const NUMBER_OF_AVATARS: bigint = 6n;
  const avatarId = (userId >> BIT_SHIFT_VALUE) % NUMBER_OF_AVATARS;

  return `https://cdn.discordapp.com/embed/avatars/${avatarId}.png`;
}
