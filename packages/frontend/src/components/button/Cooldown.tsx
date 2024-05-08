// Adding it as a button here to show proof of concept

import { Button } from "@/components/button";
import { useActiveCanvasContext } from "@/contexts";
import { useEffect, useState } from "react";

export default function Cooldown() {
  const { canvas } = useActiveCanvasContext();

  // cooldown will need to be able to accessed by the place pixel button on click
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [cooldown, setCooldown] = useState<Date | null>(null);

  // Change the cooldown to the new canvas if the canvas is changed
  useEffect(() => {
    // get the cooldown for the user from the endpoint which requires canvas
    console.log(canvas);

    // this is simulated by setting the cooldown to 60 seconds into the future
    setCooldown(new Date(Date.now() + 5 * 1000));
  }, [canvas]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (cooldown && new Date() < cooldown) {
      const timerId = setTimeout(() => {
        setTimeLeft(Math.round((cooldown.valueOf() - Date.now()) / 1000));
      }, 1000);
      return () => clearTimeout(timerId);
    }
    setCooldown(null);
  }, [cooldown, timeLeft]);

  if (!cooldown) {
    return <Button>No cooldown</Button>;
  }
  return (
    <>
      <Button>
        Cooldown: {Math.round((cooldown.valueOf() - Date.now()) / 1000)} seconds
      </Button>
    </>
  );
}
