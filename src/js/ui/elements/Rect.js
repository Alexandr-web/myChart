import Element from "./Element";
import setGradientColor from "../../helpers/setGradientColor";

class Rect extends Element {
  constructor(x, y, color, ctx, width, height, startY, endY, rotateDeg, opacity, stroke = {}) {
    super(x, y, color, ctx, rotateDeg, opacity);

    // Ширина
    this.width = width;
    // Высота
    this.height = height;
    // Начальная позиция по оси ординат (для градиента)
    this.startY = startY;
    // Конечная позиция по оси ординат (для градиента)
    this.endY = endY;
    // Содержит данные обводки ({ color, width })
    this.stroke = stroke;
  }

  /**
   * Устанавливает цвет
   * @private
   */
  _setColor() {
    if (Array.isArray(this.color)) {
      setGradientColor(this.color, this.startY, this.endY, "fillStyle", this.ctx);
    } else if (typeof this.color === "string") {
      this.ctx.fillStyle = this.color;
    }
  }

  // Рисует прямоугольник
  draw() {
    this.ctx.beginPath();
    this.ctx.globalAlpha = this.opacity;

    this._setColor();

    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    if (Object.keys(this.stroke).length) {
      this.ctx.lineWidth = this.stroke.width;
      this.ctx.strokeStyle = this.stroke.color;
      this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}

export default Rect;