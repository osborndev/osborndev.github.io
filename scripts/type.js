const config = {
  cursor: "_",
  repeat: true,
  typeRate: { min: 150, max: 250 },
  delRate: 75,
  blink: { rate: 500, multiple: { start: 3, gap: 4, end: 2 } },
};

class Type {
  constructor(el) {
    this.el = el;
    this.currText = "";
    this.cursorVisible = false;

    this.#process();
  }

  #process() {
    const dataset = this.el.dataset;
    let settings = {};

    const textList = JSON.parse(dataset.typeText);
    settings.items = [];

    for (let i = 0; i < textList.length; i++) {
      const textItem = textList[i];

      let item = { classList: null, text: null };

      if (Array.isArray(textItem)) {
        item.classList = textItem[0];
        item.text = textItem[1];
      } else {
        item.text = textItem;
      }

      settings.items.push(item);
    }

    settings.cursor =
      "typeCursor" in dataset ? dataset.typeCursor : config.cursor;

    settings.repeat =
      "typeRepeat" in dataset
        ? dataset.typeRepeat.toLowerCase() === "true"
        : config.repeat;

    settings.typeRate = { min: null, max: null };

    settings.typeRate.min =
      "typeRateMin" in dataset ? dataset.typeRateMin : config.typeRate.min;

    settings.typeRate.max =
      "typeRateMax" in dataset ? dataset.typeRateMax : config.typeRate.max;

    settings.delRate =
      "typeDelRate" in dataset ? dataset.typeDelRate : config.delRate;

    settings.blink = {
      rate: null,
      multiple: { start: null, gap: null, end: null },
    };

    settings.blink.rate =
      "typeBlinkRate" in dataset ? dataset.typeBlinkRate : config.blink.rate;

    settings.blink.multiple.start =
      "typeBlinkMultipleStart" in dataset
        ? dataset.typeBlinkMultipleStart
        : config.blink.multiple.start;

    settings.blink.multiple.gap =
      "typeBlinkMultipleGap" in dataset
        ? dataset.typeBlinkMultipleGap
        : config.blink.multiple.gap;

    settings.blink.multiple.end =
      "typeBlinkMultipleEnd" in dataset
        ? dataset.typeBlinkMultipleEnd
        : config.blink.multiple.end;

    this.settings = settings;
  }

  async run() {
    let i = 0;
    let increment;

    if (this.settings.repeat) {
      increment = () => {
        i++;
        i %= this.settings.items.length;
      };
    } else {
      increment = () => {
        i++;
      };
    }

    if (this.settings.blink.multiple.start > 0) {
      await this.#blink(
        this.settings.blink.rate,
        this.settings.blink.multiple.start,
      );
    }

    while (i < this.settings.items.length) {
      const item = this.settings.items[i];
      const text = item.text;
      const classList =
        item.classList != null ? item.classList.split(" ") : null;
      const blinkRate = this.settings.blink.rate;
      const gapMultiple = this.settings.blink.multiple.gap;

      if (classList != null) {
        this.el.classList.add(...classList);
      }

      await this.#type(
        this.settings.typeRate.min,
        this.settings.typeRate.max,
        text,
      );

      if (!this.settings.repeat && i == this.settings.items.length - 1) {
        await this.#blink(blinkRate, this.settings.blink.multiple.end);
      } else {
        await this.#blink(blinkRate, gapMultiple);
        await this.#del(this.settings.delRate, text);
        await this.#blink(blinkRate, gapMultiple);

        if (classList != null) {
          this.el.classList.remove(...classList);
        }
      }

      increment();
    }
  }

  async #type(minRate, maxRate, text) {
    this.currText = "";
    this.cursorVisible = true;

    for (let i = 0; i < text.length; i++) {
      const typeTime = Math.round(
        Math.random() * (maxRate - minRate) + minRate,
      );

      await this.#delay(typeTime);
      this.currText += text[i];
      this.#build();
    }
  }

  async #del(rate, text) {
    this.currText = text;
    this.cursorVisible = true;

    for (let i = text.length - 1; i >= 0; i--) {
      await this.#delay(rate);
      this.currText = this.currText.slice(0, -1);
      this.#build();
    }
  }

  async #blink(rate, multiple) {
    for (let i = 0; i < 2 * multiple + this.cursorVisible; i++) {
      await this.#delay(rate);
      this.cursorVisible = !this.cursorVisible;
      this.#build();
    }
  }

  #delay(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  #build() {
    this.el.innerText =
      this.currText + this.settings.cursor.repeat(this.cursorVisible);
  }
}

const typeElements = document.querySelectorAll("[data-type-text]");

typeElements.forEach((el) => {
  new Type(el).run();
});
