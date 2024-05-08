import { DiscordUserProfile } from "@blurple-canvas-web/types";
declare global {
  namespace Express {
    interface Request {
      /**
       * This is used to identify requests made by the Discord bot on behalf of the user in
       * the `user` field.
       */
      isBot?: boolean;
    }

    interface User extends DiscordUserProfile {}
  }
}
