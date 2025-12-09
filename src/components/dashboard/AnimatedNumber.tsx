<<<<<<< HEAD
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
=======
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
>>>>>>> 977c3b3b9697ba4d9c58d2047bd14e2e5a6ef096
