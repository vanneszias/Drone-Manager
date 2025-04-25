"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progressPercentage = (window.scrollY / totalHeight) * 100;
      setProgress(progressPercentage);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}
