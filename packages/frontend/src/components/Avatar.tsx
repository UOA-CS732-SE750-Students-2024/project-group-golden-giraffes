import { styled } from "@mui/material";

import { DiscordUserProfile } from "@blurple-canvas-web/types";

type AvatarProps = Pick<
  DiscordUserProfile,
  "username" | "profilePictureUrl"
> & {
  /** In pixels */
  size?: number;
};

const StyledObject = styled("object")`
  --stroke-width: max(0.125rem, 1px);

  border-radius: calc(infinity * 1px);
  outline: oklch(var(--discord-white-oklch) / 12%) var(--stroke-width) solid;
  outline-offset: calc(-1 * var(--stroke-width));
`;

export default function Avatar({
  username,
  profilePictureUrl,
  size,
}: AvatarProps) {
  return (
    <StyledObject data={profilePictureUrl} width={size} height={size}>
      <img
        alt={`${username}’s avatar`}
        src="https://cdn.discordapp.com/embed/avatars/1.png"
      />
    </StyledObject>
  );
}
