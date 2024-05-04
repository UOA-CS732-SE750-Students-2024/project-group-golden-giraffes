import { Guild } from "./Guild";
import { PaletteColor } from "./paletteColor";

export interface Participation {
  guildId: number;
  guild: Guild;
  event: BlurpleEvent;
  color?: PaletteColor;
}
