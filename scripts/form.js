class Form {
  constructor(el) {
    this.back = el.querySelector("[data-form-back]");
    this.forward = el.querySelector("[data-form-forward]");
    this.meter = el.querySelector("[data-meter-end]");

    this.form = el.querySelector("form");
    this.containers = Array.from(
      el.querySelectorAll("[data-form-input-container]"),
    );

    this.pos = 0;

    this.#setSubmitListener();
    this.#setBtnListener(this.back, -1);
    this.moveTo(this.pos);
  }

  #setBtnListener(btn, shift) {
    btn.addEventListener("click", () => {
      this.moveTo(this.pos + shift);
    });
  }

  #setSubmitListener() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.sendEmail(new FormData(e.target))) {
        this.notifySuccess();
        this.form.reset();
      }
    });

    this.forward.addEventListener("click", () => {
      if (this.pos >= this.containers.length - 1) {
        this.handleSubmit();
      } else {
        this.moveTo(this.pos + 1);
      }
    });
  }

  moveTo(pos) {
    if (pos >= 0 && pos < this.containers.length) {
      this.pos = pos;
      this.meter.dataset.meterCurr = this.pos + 1;

      for (let i = 0; i < this.containers.length; i++) {
        const container = this.containers[i];

        if (i == this.pos) {
          container.classList.add("active");
        } else {
          container.classList.remove("active");
        }
      }
    }
  }

  handleSubmit() {
    for (let i = 0; i < this.containers.length; i++) {
      const container = this.containers[i];
      let input = container.querySelector("input");

      if (input == null) {
        input = container.querySelector("textarea");
      }

      if (!input.checkValidity()) {
        this.moveTo(i);
        return;
      }
    }

    this.form.requestSubmit();
  }

  async sendEmail(data) {
    try {
      const response = await fetch(this.form.action, {
        method: this.form.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to send email");
      return false;
    }

    return true;
  }

  notifySuccess() {
    this.form.reset();
    this.moveTo(0);
  }
}

const formWrappers = document.querySelectorAll("[data-form-wrapper]");

formWrappers.forEach((formWrapper) => {
  new Form(formWrapper);
});
