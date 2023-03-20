class TimelineSection extends HTMLElement {
  constructor() {
    super();

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      this.scrollTo({
        top: 0,
        left: window.innerWidth > 676 ? window.innerWidth / 10 : 70,
        behavior: "smooth",
      });
    };

    // load recommendations when -500px from bottom of viewport
    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px -500px 0px",
    }).observe(this);
  }
}

customElements.define("timeline-section", TimelineSection);
