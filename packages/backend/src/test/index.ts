import initializeBlacklist from "./initializeBlacklist";
import initializeCanvases from "./initializeCanvases";
import initializeColors from "./initializeColors";
import initializeEvents from "./initializeEvents";
import initializeGuilds from "./initializeGuilds";
import initializeHistory from "./initializeHistory";
import initializeUsers from "./initializeUsers";

// This is a code felony. Thoughts on implementing a builder?
export default function initializePrismock() {
  // TODO: Josh
  // info
  // participation
  initializeBlacklist();
  initializeCanvases();
  initializeColors();
  initializeEvents();
  initializeGuilds();
  initializeHistory();
  initializeGuilds();
  initializeUsers();
}
