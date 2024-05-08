"use client";
import config from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

export default function testauth() {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${config.apiUrl}/api/v1/discord/test`, {
        withCredentials: true,
      });
      setData(response.data);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading…</div>;
  }

  console.log(data);
  return <div>{JSON.stringify(data)}</div>;
}
