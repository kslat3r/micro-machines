class Canvas {
  constructor (elem) {
    this.elem = elem;
    this.height = elem.height;
    this.width = elem.width;
    this.context = elem.getContext('2d');
  }

  clear () {
    this.elem.height = this.elem.height;
    this.elem.width = this.elem.width;
  }
}

module.exports = Canvas;
