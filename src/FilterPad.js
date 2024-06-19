export class FilterPad {
  constructor(applyFilterCallback) {
    this.applyFilterCallback = applyFilterCallback;
    document.addEventListener("keydown", (e) => this.processKeyInput(e));
  }

  processKeyInput(e) {
    if (e.code.includes("Digit")) {
      const filterIndex = parseInt(e.code.slice(-1));
      this.applyFilterCallback(filterIndex);
    }
  }
}
