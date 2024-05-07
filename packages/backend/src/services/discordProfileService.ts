import { prisma } from "@/client";
import { NotFoundError } from "@/errors";
import { DiscordProfile } from "@blurple-canvas-web/types";
import { discord_user_profile } from "@prisma/client";

export async function getDiscordProfile(
  userId: discord_user_profile["user_id"],
): Promise<discord_user_profile> {
  const discordUserProfile = await prisma.discord_user_profile.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!discordUserProfile) {
    throw new NotFoundError(`Discord profile not found for user ID ${userId}`);
  }

  return discordUserProfile;
}

export function createDefaultAvatarUrl(userId: bigint): string {
  const BIT_SHIFT_VALUE = 22n;
  const NUMBER_OF_AVATARS = 6n;
  const avatarId = (userId >> BIT_SHIFT_VALUE) % NUMBER_OF_AVATARS;

  return `https://cdn.discordapp.com/embed/avatars/${avatarId}.png`;
}

export function getProfilePictureUrlFromHash(
  userId: discord_user_profile["user_id"],
  profilePictureHash: string | null,
): string {
  if (!profilePictureHash) {
    return createDefaultAvatarUrl(userId);
  }

  return createCustomAvatarUrl(userId, profilePictureHash);
}

export function createCustomAvatarUrl(
  userId: discord_user_profile["user_id"],
  profilePictureHash: string,
): string {
  return `https://cdn.discordapp.com/avatars/${userId}/${profilePictureHash}.png`;
}

export async function saveDiscordProfile(
  profile: DiscordProfile,
): Promise<void> {
  const dbProfile: discord_user_profile = {
    user_id: BigInt(profile.userId),
    username: profile.username,
    profile_picture_url: profile.profilePictureUrl,
  };

  await prisma.discord_user_profile.upsert({
    where: {
      user_id: dbProfile.user_id,
    },
    update: dbProfile,
    create: dbProfile,
  });
}
