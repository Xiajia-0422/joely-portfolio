const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

if (header && navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const capabilityCards = Array.from(document.querySelectorAll("[data-cap-card]"));
const capabilityStage = document.querySelector("#capability-stage");

if (capabilityCards.length && capabilityStage) {
  let activeCapability = 0;
  const prevButton = capabilityStage.querySelector(".capability-arrow.prev");
  const nextButton = capabilityStage.querySelector(".capability-arrow.next");

  const renderCapabilities = () => {
    const total = capabilityCards.length;
    capabilityCards.forEach((card, index) => {
      const offset = (index - activeCapability + total) % total;
      card.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next");

      if (offset === 0) card.classList.add("is-active");
      if (offset === 1) card.classList.add("is-next");
      if (offset === total - 1) card.classList.add("is-prev");
      if (offset === 2) card.classList.add("is-far-next");
      if (offset === total - 2) card.classList.add("is-far-prev");
    });
  };

  const setActiveCapability = (index) => {
    activeCapability = (index + capabilityCards.length) % capabilityCards.length;
    renderCapabilities();
  };

  capabilityCards.forEach((card, index) => {
    card.addEventListener("click", () => setActiveCapability(index));
  });

  prevButton?.addEventListener("click", () => setActiveCapability(activeCapability - 1));
  nextButton?.addEventListener("click", () => setActiveCapability(activeCapability + 1));
  renderCapabilities();
}
