import { prisma } from "@/client";
import { NotFoundError } from "@/errors";
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

export async function createOrUpdateDiscordProfile(
  profile: discord_user_profile,
): Promise<void> {
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
  const BIT_SHIFT_VALUE = 22n;
  const NUMBER_OF_AVATARS = 6n;
  const avatarId = (userId >> BIT_SHIFT_VALUE) % NUMBER_OF_AVATARS;

  return `https://cdn.discordapp.com/embed/avatars/${avatarId}.png`;
}

export function createCustomAvatarUrl(
  userId: bigint,
  profilePictureHash: string,
): string {
  return `https://cdn.discordapp.com/avatars/${userId}/${profilePictureHash}.png`;
}

export async function saveDiscordProfile(
  userId: bigint,
  username: string,
  profilePictureHash: string | null,
): Promise<void> {
  const profilePictureUrl =
    profilePictureHash ?
      createCustomAvatarUrl(userId, profilePictureHash)
    : createDefaultAvatarUrl(userId);

  await createOrUpdateDiscordProfile({
    user_id: userId,
    username,
    profile_picture_url: profilePictureUrl,
  });
}
