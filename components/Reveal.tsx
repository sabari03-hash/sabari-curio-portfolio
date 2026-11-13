"use client";

import { useEffect, useRef, type ReactNode, type HTMLAttributes } from "react";

/** Fades its children in the first time they scroll into view. */
export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
  delay = 0,
  ...rest
}: {
  as?: "div" | "form" | "section" | "article" | "ul";
  className?: string;
  children: ReactNode;
  delay?: number;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">) {
  const ref = useRef<HTMLElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp: any = Tag;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Comp {...rest} ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Comp>
  );
}
