"use client";
import config from "@/config";
import { useEffect, useState } from "react";

export default function testauth() {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${config.apiUrl}/api/v1/discord/test`,
        /* { credentials: "same-origin", } */
      );
      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading…</div>;
  }

  console.log(data);
  return <div>{JSON.stringify(data)}</div>;
}
