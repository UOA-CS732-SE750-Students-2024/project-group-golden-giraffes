// Adding it as a button here to show proof of concept

import { Button } from "@/components/button";
import { useActiveCanvasContext } from "@/contexts";
import { useEffect, useState } from "react";

interface CooldownProps {
  children: React.ReactNode;
  cooldown: Date | null;
  cooldownLoading: boolean;
}

export default function Cooldown({ children }: CooldownProps) {
  const { canvas } = useActiveCanvasContext();

  // cooldown will need to be able to accessed by the place pixel button on click
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [cooldown, setCooldown] = useState<Date | null>(null);
  const [cooldownLoading, setCooldownLoading] = useState(false);

  // Change the cooldown to the new canvas if the canvas is changed
  useEffect(() => {
    async function fetchCooldown() {
      // get the cooldown for the user from the endpoint which requires canvas
      console.log(canvas);
      console.log("set cooldown to loading");
      setCooldownLoading(true);

      console.log("fetching cooldown");
      // sleep for 1 second
      await new Promise((r) => setTimeout(r, 5000));
      console.log("cooldown loaded");

      // this is simulated by setting the cooldown to 60 seconds into the future
      setCooldown(new Date(Date.now() + 10 * 1000));
      setCooldownLoading(false);
    }

    fetchCooldown();
  }, [canvas]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <timeLeft is used to power the countdown>
  useEffect(() => {
    if (cooldown && new Date() < cooldown) {
      const timerId = setTimeout(() => {
        setTimeLeft(Math.round((cooldown.valueOf() - Date.now()) / 1000));
      }, 1000);
      return () => clearTimeout(timerId);
    }
    setCooldown(null);
  }, [cooldown, timeLeft]);

  if (cooldownLoading) {
    return (
      <Button variant="contained" disabled>
        Loading
      </Button>
    );
  }

  if (!cooldown) {
    return <Button>No cooldown</Button>;
  }

  // Maybe return button with loading
  return (
    <Button variant="contained" disabled>
      Cooldown: {Math.round((cooldown.valueOf() - Date.now()) / 1000)} seconds
    </Button>
  );
}
