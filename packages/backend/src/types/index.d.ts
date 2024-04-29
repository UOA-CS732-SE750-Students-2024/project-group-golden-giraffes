import { DiscordUserLoginInfo } from "@blurple-canvas-web/types";
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends DiscordUserLoginInfo {}
  }
}
