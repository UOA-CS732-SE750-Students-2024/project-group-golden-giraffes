import seedBlacklist from "./seedBlacklist";
import seedCanvases from "./seedCanvases";
import seedColors from "./seedColors";
import seedEvents from "./seedEvents";
import seedGuilds from "./seedGuilds";
import seedHistory from "./seedHistory";
import seedPixels from "./seedPixels";
import seedUsers from "./seedUsers";

// reexport seed
// export { default as seedBlacklist } from "./seedBlacklist";

// This is a code felony. Thoughts on implementing a builder?
export default function seedPrismock() {
  // TODO: Josh
  // info
  // participation
  seedBlacklist();
  seedCanvases();
  seedColors();
  seedEvents();
  seedGuilds();
  seedHistory();
  seedPixels();
  seedUsers();
}
