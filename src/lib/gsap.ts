// src/lib/gsap.ts
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

export { gsap, SplitText, ScrollTrigger };
