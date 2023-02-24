import getRange from "./getRange";

/**
 * @param {array} color Содержит цвета
 * @param {number} startY Начальная позиция по оси ординат
 * @param {number} endY Конечная позиция по оси ординат
 * @param {string} propertyToStyle Свойство, к которому нужно применять градиент
 * @param {CanvasRenderingContext2D} ctx Контекст элемента canvas
 * @param {number} startX Начальная позиция по оси абсцисс
 * @param {number} endX Конечная позиция по оси абсцисс
 */
export default (color, startY, endY, propertyToStyle, ctx, startX = 0, endX = 0) => {
  const grd = ctx.createLinearGradient(startX, startY, endX, endY);
  const range = getRange(0, 1, color.length - 1);

  // Создает градиент
  color.map((clr, idx) => grd.addColorStop(range[idx], clr));

  ctx[propertyToStyle] = grd;
};