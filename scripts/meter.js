class Meter {
  #observer;

  constructor(el) {
    this.el = el;
    this.countTag = el.querySelector("[data-meter-count]");
    this.bar = el.querySelector("[data-meter-bar]");

    this.start = "meterStart" in el.dataset ? el.dataset.meterStart : 1;

    if (!("meterCurr" in el.dataset)) {
      el.dataset.meterCurr = 1;
    }

    this.curr = el.dataset.meterCurr;

    this.end = el.dataset.meterEnd;

    this.#setListener();
    this.update();
  }

  #setListener() {
    this.#observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-meter-curr"
        ) {
          this.update();
        }
      });
    });

    this.#observer.observe(this.el, { attributes: true });
  }

  update() {
    const attrVal = this.el.dataset.meterCurr;

    if (attrVal < this.start) {
      this.#observer.disconnect();
      this.el.dataset.meterCurr = this.end;
      this.#observer.observe(this.el, { attributes: true });
    } else if (attrVal > this.end) {
      this.#observer.disconnect();
      this.el.dataset.meterCurr = this.start;
      this.#observer.observe(this.el, { attributes: true });
    }

    this.curr = this.el.dataset.meterCurr;
    this.countTag.innerText = this.curr;
    this.bar.style.width = (this.curr / this.end) * 100 + "%";
  }
}

const meters = document.querySelectorAll("[data-meter-end]");

meters.forEach((meter) => {
  new Meter(meter);
});
