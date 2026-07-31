export const backToBackTransition = {
  forwards: {
    old: {
      name: "slideOutToLeft",
      duration: "0.4s",
      easing: "ease-in-out",
      fillMode: "forwards",
    },
    new: {
      name: "slideInFromRight",
      duration: "0.4s",
      easing: "ease-in-out",
      fillMode: "backwards",
    },
  },
  backwards: {
    old: {
      name: "slideOutToRight",
      duration: "0.4s",
      easing: "ease-in-out",
      fillMode: "forwards",
    },
    new: {
      name: "slideInFromLeft",
      duration: "0.4s",
      easing: "ease-in-out",
      fillMode: "backwards",
    },
  },
};
