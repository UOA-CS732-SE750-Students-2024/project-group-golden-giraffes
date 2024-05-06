import seedBlacklist from "./seedBlacklist";
import seedCanvases from "./seedCanvases";
import seedColors from "./seedColors";
import seedDiscordProfiles from "./seedDiscordProfile";
import seedEvents from "./seedEvents";
import seedGuilds from "./seedGuilds";
import seedHistory from "./seedHistory";
import seedPixels from "./seedPixels";
import seedUsers from "./seedUsers";

export { default as seedBlacklist } from "./seedBlacklist";
export { default as seedCanvases } from "./seedCanvases";
export { default as seedColors } from "./seedColors";
export { default as seedDiscordProfiles } from "./seedDiscordProfile";
export { default as seedEvents } from "./seedEvents";
export { default as seedGuilds } from "./seedGuilds";
export { default as seedHistory } from "./seedHistory";
export { default as seedPixels } from "./seedPixels";
export { default as seedUsers } from "./seedUsers";

// This is a code felony. Thoughts on implementing a builder?
export default function seedPrismock() {
  // TODO: Josh
  // info
  // participation
  seedBlacklist();
  seedCanvases();
  seedColors();
  seedDiscordProfiles();
  seedEvents();
  seedGuilds();
  seedHistory();
  seedPixels();
  seedUsers();
}
