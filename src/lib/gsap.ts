// src/lib/gsap.ts
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

export { gsap, SplitText, ScrollTrigger };

export function setupWordScrollAnimation(
  selector: string = ".animate-words",
  stagger?: number,
  duration?: number,
) {
  const elements = document.querySelectorAll<HTMLElement>(selector);

  elements.forEach((el) => {
    // Prevent duplicate splitting if the function runs multiple times (e.g. view transitions)
    if (el.dataset.wordAnimated === "true") return;
    el.dataset.wordAnimated = "true";

    const text = el.textContent || "";
    const words = text.trim().split(/\s+/);

    // Wrap each word in an outer container (for overflow clipping) and inner span (for translation)
    el.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden pb-1 -mb-1"><span class="word-span inline-block translate-y-[100px] opacity-0 will-change-transform">${word}</span></span>`,
      )
      .join(" ");

    const wordSpans = el.querySelectorAll(".word-span");

    gsap.to(wordSpans, {
      y: 0,
      opacity: 1,
      duration: duration ?? 0.8,
      stagger: stagger ?? 0.04, // Delay between each word
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // Triggers when the top of the heading hits 85% of viewport height
        toggleActions: "play none none none",
      },
    });
  });
}
