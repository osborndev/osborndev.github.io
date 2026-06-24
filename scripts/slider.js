class ParagraphSlider {
  constructor(el) {
    this.el = el;
    this.paragraphs = [...el.querySelectorAll("p")];
    this.back = el.querySelector("[data-paragraph-slider-back]");
    this.forward = el.querySelector("[data-paragraph-slider-forward]");
    this.meter = el.querySelector("[data-meter-end]");

    this.pos = 0;

    this.#setBtnListener(this.back, -1);
    this.#setBtnListener(this.forward, 1);
    this.moveTo(0);
  }

  #setBtnListener(btn, shift) {
    btn.addEventListener("click", () => {
      this.moveTo(this.pos + shift);
    });
  }

  moveTo(pos) {
    const len = this.paragraphs.length;

    if (pos < 0) {
      pos = len - 1;
    }

    this.pos = pos % len;

    for (let i = 0; i < len; i++) {
      const paragraph = this.paragraphs[i];
      if (i != this.pos) {
        if (!paragraph.classList.contains("inactive")) {
          paragraph.classList.add("inactive");
        }
      } else {
        paragraph.classList.remove("inactive");
      }
    }

    this.meter.dataset.meterCurr = this.pos + 1;
  }
}

const sliders = document.querySelectorAll("[data-paragraph-slider]");

sliders.forEach((slider) => {
  new ParagraphSlider(slider);
});
