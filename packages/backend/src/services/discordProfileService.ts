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

export async function createDiscordProfile(
  discordUserProfile: discord_user_profile,
) {
  // TODO: Unsure if I should check for existing profile here or at the endpoint
  await prisma.discord_user_profile.create({
    data: {
      user_id: discordUserProfile.user_id,
      username: discordUserProfile.username,
      profile_picture_url: discordUserProfile.profile_picture_url,
    },
  });
}

export async function updateDiscordProfile(
  discordUserProfile: discord_user_profile,
) {
  // TODO: Unsure if I should check for existing profile here or at the endpoint
  await prisma.discord_user_profile.update({
    where: {
      user_id: discordUserProfile.user_id,
    },
    data: {
      username: discordUserProfile.username,
      profile_picture_url: discordUserProfile.profile_picture_url,
    },
  });
}
