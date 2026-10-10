import sys

with open("src/pages/Home.tsx", "r") as f:
    content = f.read()

content = content.replace("""<<<<<<< HEAD
import { cn } from "@/lib/utils";
import { motion, useInView, useSpring, useTransform } from "motion/react";
import { useRef, useEffect } from "react";

function Counter({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) => Math.round(current) + suffix);

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
=======
import { motion } from "motion/react";
>>>>>>> origin/main""", """import { cn } from "@/lib/utils";
import { motion, useInView, useSpring, useTransform } from "motion/react";
import { useRef, useEffect } from "react";

function Counter({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) => Math.round(current) + suffix);

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}""")

with open("src/pages/Home.tsx", "w") as f:
    f.write(content)
