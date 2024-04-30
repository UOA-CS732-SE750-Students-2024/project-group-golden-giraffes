import { DiscordUserLoginInfo } from "@blurple-canvas-web/types";
declare global {
  namespace Express {
    interface User extends DiscordUserLoginInfo {}
  }
}
