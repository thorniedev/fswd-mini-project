"use client"

import React, { useMemo } from "react"

import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const seeded = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const meteorStyles = useMemo<Array<React.CSSProperties>>(
    () =>
      [...new Array(number)].map((_, index) => {
        const r1 = seeded(index * 12.9898 + angle);
        const r2 = seeded(index * 78.233 + number);
        const r3 = seeded(index * 45.164 + minDuration + maxDuration);

        return {
          "--angle": `${-angle}deg`,
          top: "-5%",
          left: `${Math.floor(r1 * 100)}%`,
          animationDelay: `${r2 * (maxDelay - minDelay) + minDelay}s`,
          animationDuration: `${Math.floor(r3 * (maxDuration - minDuration) + minDuration)}s`,
        }
      }),
    [number, minDelay, maxDelay, minDuration, maxDuration, angle]
  )

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            "animate-meteor pointer-events-none absolute size-0.5 rotate-(--angle) rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-zinc-500 to-transparent" />
        </span>
      ))}
    </>
  )
}
