import config from "@/config";
import { CanvasView } from ".";

export default function Main() {
  return <CanvasView imageUrl={`${config.apiUrl}/api/v1/canvas/current`} />;
}
