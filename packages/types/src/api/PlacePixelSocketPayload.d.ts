import { PixelColor } from "../palette";
import { Point } from "../point";

export interface Payload {
  coords: Point;
  color: PixelColor;
}
