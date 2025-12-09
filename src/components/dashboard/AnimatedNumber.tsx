"use client";
import { useEffect, useState } from "react";

export default function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value);
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplay(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return <span>{display}</span>;
}
