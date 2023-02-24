import Element from "./Element";
import Rect from "./Rect";
import Circle from "./Circle";

class Cap extends Element {
  constructor(size, x, y, color, format, ctx, opacity, startY, endY, rotateDeg, stroke = {}) {
    super(x, y, color, ctx, rotateDeg, opacity);

    // Формат колпачка
    this.format = format;
    // Размер колпачка
    this.size = size;
    // Объект, содержащий данные обводки ({ width, color })
    this.stroke = stroke;
    // Начальная позиция по оси ординат (для градиента)
    this.startY = startY;
    // Конечная позиция по оси ординат (для градиента)
    this.endY = endY;
  }

  // Рисует колпачок
  draw() {
    switch (this.format) {
      case "circle":
        new Circle(
          this.size,
          this.x,
          this.y,
          this.color,
          this.ctx,
          this.opacity,
          this.startY,
          this.endY,
          this.stroke
        ).draw();
        break;
      case "square":
        new Rect(
          this.x,
          this.y,
          this.color,
          this.ctx,
          this.size,
          this.size,
          this.startY,
          this.endY,
          this.rotateDeg,
          this.opacity,
          this.stroke
        ).draw();
        break;
    }
  }
}

export default Cap;