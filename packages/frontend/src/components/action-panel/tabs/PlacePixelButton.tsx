import { Button } from "@/components/Button";
import { PaletteColor, Point } from "@blurple-canvas-web/types";
import { styled } from "@mui/material";

const Container = styled(Button)`
  &:not(:disabled) {
    &:hover {
      border-color: oklch(var(--discord-white-oklch) / 36%);
    }

    &:active {
      border-color: oklch(var(--discord-white-oklch) / 72%);
    }
  }
`;

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
  margin: 0;
`;

type PlacePixelButtonProps = {
  color: PaletteColor | null;
  coordinates: Point;
  disabled?: boolean;
  onClick?: () => void;
};

export default function PlacePixelButton({
  color,
  coordinates,
  disabled = false,
  onClick = () => {},
  ...props
}: PlacePixelButtonProps) {
  const rgba = color?.rgba;
  const rgb = rgba?.slice(0, 3).join(" ");
  const alphaFloat = rgba ? rgba[3] / 255 : undefined;

  const { x, y } = coordinates;

  return (
    <Container
      backgroundColor={color ? `rgb(${rgb} / ${alphaFloat})` : undefined}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span>
        Paint it!{" "}
        <CoordinateLabel>
          ({x}, {y})
        </CoordinateLabel>
      </span>
    </Container>
  );
}
