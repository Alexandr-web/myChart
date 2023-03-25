import Chart from "./Chart";
import Line from "../elements/Line";
import Cap from "../elements/Cap";
import CustomFigure from "../elements/CustomFigure";
import getStyleByIndex from "../../helpers/getStyleByIndex";

import "../../interfaces/index";
import { TSort, } from "../../types/index";

class LineChart extends Chart implements ILineChartClass {
  public pointsX: Array<IPointX>;
  public pointsY: Array<IPointY>;
  public line: ILine;
  public cap: ICap;
  public sortValues: TSort;
  public caps: Array<ICapData>;
  public themeForLine: ILineTheme;
  public themeForCaps: ICapTheme;

  constructor(
    data,
    line,
    cap,
    pointsY,
    pointsX,
    ctx,
    width,
    height,
    title,
    padding,
    hideGroups,
    sortValues = "less-more",
    themeForLine = {},
    themeForCaps = {}
  ) {
    super(padding, data, ctx, width, height, "line", title, null, hideGroups);

    // Содержит данные точек оси абсцисс
    this.pointsX = pointsX;
    // Содержит данные точек оси ординат
    this.pointsY = pointsY;
    // Содержит данные линии
    this.line = line;
    // Содержит данные колпачка
    this.cap = cap;
    // Содержит сортированные значения
    this.sortValues = sortValues;
    // Содержит данные нарисованных колпачков
    this.caps = [];
    // Содержит стилия для линии от темы
    this.themeForLine = themeForLine;
    // Содержит стилия для колпачка от темы
    this.themeForCaps = themeForCaps;
  }

  /**
   * Определяет стили для графика
   * @param {object} gLine Данные линии группы
   * @param {object} gCap Данные колпачка группы
   * @param {string} group Название группы (ключ объекта data)
   * @private
   * @returns {object} Стили
   */
  private _getStyles(gLine: ILine, gCap: ICap, group: string): IChartStyle {
    const dataKeys: Array<string> = Object.keys(this.data);
    const idx: number = dataKeys.indexOf(group);
    const themeColorForLine: string = getStyleByIndex(idx, this.themeForLine.color);
    const themeFillForLine: string = getStyleByIndex(idx, this.themeForLine.fill);
    const themeColorForCap: string = getStyleByIndex(idx, this.themeForCaps.color);
    const themeStrokeColorForCap: string = getStyleByIndex(idx, this.themeForCaps.strokeColor);
    const lineStyle: IChartLineStyle = {
      width: gLine.width || this.line.width,
      color: gLine.color || this.line.color || themeColorForLine,
      dotted: gLine.dotted || this.line.dotted,
      stepped: gLine.stepped || this.line.stepped,
      fill: gLine.fill || this.line.fill || themeFillForLine,
    };
    const capStyle: IChartCapStyle = {
      size: gCap.size || this.cap.size,
      color: gCap.color || this.cap.color || themeColorForCap,
      stroke: gCap.stroke || this.cap.stroke || {},
      format: gCap.format || this.cap.format,
    };

    return {
      lineStyle,
      capStyle,
      themeStrokeColorForCap,
    };
  }

  /**
   * Определяет координаты данных группы
   * @param {object} gData Данные группы
   * @private
   * @returns {array} Массив координат у данных группы
   */
  private _getGroupsDataCoordinates(gData: Array<IDataAtItemData>): Array<IGroupDataCoordinates> {
    return gData.map(({ value, name, }) => {
      // Элемент для начальной позиции Y линии
      const findAxisYItem = this.pointsY.find((axisYItem) => axisYItem.value === value) as IPointY;
      // Элемент для начальной позиции X линии
      const findAxisXItem = this.pointsX.find((axisXItem) => axisXItem.name === name) as IPointX;

      return {
        x: findAxisXItem.x,
        y: findAxisYItem.y,
        value: findAxisYItem.value,
        name: findAxisXItem.name,
      };
    });
  }

  /**
   * Создает задний фон всей группе
   * @param {array} coordinates массив координат линий графика
   * @param {string|array} fill содержит данные о цвете заднего фона
   * @param {boolean} stepped Правило, которое будет рисовать линию пошагово
   * @param {string} group Группа, в которой находится линия
   * @private
   */
  private _setFillGroupChart(coordinates: Array<IGroupDataCoordinates>, fill: string | Array<string>, stepped: boolean, group: string): void {
    const firstPoint: IGroupDataCoordinates = coordinates[0];
    const lastPoint: IGroupDataCoordinates = coordinates[coordinates.length - 1];
    const yItemsOnScreen: Array<IPointY> = this.pointsY.filter(({ onScreen, }) => onScreen);
    const lastYPoint: IPointY = yItemsOnScreen[yItemsOnScreen.length - 1];
    const firstYPoint: IPointY = yItemsOnScreen[0];
    const lineData = {
      moveTo: { x: firstPoint.x, y: firstPoint.y, },
      lineTo: [],
      fill,
      group,
      startY: Math.min(...coordinates.map(({ y, }) => y)),
      endY: lastYPoint.y,
    };

    // Определяем координаты для будущей фигуры
    coordinates.map(({ x, y, }, index: number) => {
      if (stepped) {
        const nextItem: IGroupDataCoordinates | undefined = coordinates[index + 1];

        if (nextItem) {
          // Элемент для следующей позиции Y линии
          const findNextAxisYItem: IPointY = this.pointsY.find((nextAxisYItem: IPointY) => nextAxisYItem.value === nextItem.value);
          // Элемент для следующей позиции X линии
          const findNextAxisXItem: IPointX = this.pointsX.find((nextAxisXItem: IPointX) => nextAxisXItem.name === nextItem.name);

          lineData.lineTo.push(
            {
              x: findNextAxisXItem.x,
              y,
            },
            {
              x: findNextAxisXItem.x,
              y: findNextAxisYItem.y,
            }
          );
        }
      } else if (index > 0) {
        lineData.lineTo.push({ x, y, });
      }
    });

    // Закрываем фигуру
    switch (this.sortValues) {
      case "less-more":
        lineData.lineTo.push(
          { x: lastPoint.x, y: lastYPoint.y, },
          { x: firstPoint.x, y: lastYPoint.y, },
          lineData.moveTo
        );
        break;
      case "more-less":
        lineData.lineTo.push(
          { x: lastPoint.x, y: firstYPoint.y, },
          { x: firstPoint.x, y: firstYPoint.y, },
          lineData.moveTo
        );
        break;
    }

    // Рисуем задний фон группе
    new CustomFigure(
      lineData.moveTo.x,
      lineData.moveTo.y,
      lineData.fill,
      this.ctx,
      lineData.lineTo,
      lineData.startY,
      lineData.endY
    ).draw();
  }

  /**
   * Рисует линии и колпачки
   * @param {array} coordinates Массив координат у данных группы
   * @param {object} gData Данные группы
   * @param {object} gLine Данные линии группы
   * @param {object} gCap Данные колпачка группы
   * @param {string} group Название группы (ключ объекта data)
   * @private
   */
  private _drawLinesAndCaps(coordinates: Array<IGroupDataCoordinates>, gData: Array<IDataAtItemData>, gLine: ILine, gCap: ICap, group: string): void {
    const { lineStyle, capStyle, themeStrokeColorForCap, } = this._getStyles(gLine, gCap, group);

    // Находим координаты для линий
    coordinates.map(({ value, name, x, y, }, index: number) => {
      const nextDataItem: IDataAtItemData | undefined = gData[index + 1];
      // Содержит следующие позиции линии
      const lineToArray: Array<IPos> = [];

      if (nextDataItem) {
        // Элемент для следующей позиции Y линии
        const findNextAxisYItem: IPointY = this.pointsY.find((nextAxisYItem: IPointY) => nextAxisYItem.value === nextDataItem.value);
        // Элемент для следующей позиции X линии
        const findNextAxisXItem: IPointX = this.pointsX.find((nextAxisXItem: IPointX) => nextAxisXItem.name === nextDataItem.name);

        if (!lineStyle.stepped) {
          lineToArray.push({ x: findNextAxisXItem.x, y: findNextAxisYItem.y, });
        } else {
          lineToArray.push(
            {
              x: findNextAxisXItem.x,
              y,
            },
            {
              x: findNextAxisXItem.x,
              y: findNextAxisYItem.y,
            }
          );
        }
      }

      // Рисуем линию
      if (lineStyle.color) {
        new Line(
          x,
          y,
          lineStyle.color,
          this.ctx,
          lineToArray,
          lineStyle.width,
          lineStyle.dotted
        ).draw();
      }

      // Рисуем колпачок
      if (capStyle.color) {
        new Cap(
          capStyle.size,
          capStyle.format === "circle" ? x : x - capStyle.size / 2,
          capStyle.format === "circle" ? y : y - capStyle.size / 2,
          capStyle.color,
          capStyle.format,
          this.ctx,
          1,
          capStyle.format === "circle" ? y - capStyle.size : y - capStyle.size / 2,
          capStyle.format === "circle" ? y + capStyle.size : y + capStyle.size / 2,
          0,
          {
            ...capStyle.stroke,
            color: capStyle.stroke.color || themeStrokeColorForCap,
          }
        ).draw();

        this.caps.push({
          group,
          value,
          name,
          x: capStyle.format === "circle" ? x : x - capStyle.size / 2,
          y: capStyle.format === "circle" ? y : y - capStyle.size / 2,
          stroke: capStyle.stroke,
          format: capStyle.format,
          size: capStyle.size,
        });
      }
    });
  }

  /**
   * Рисует график
   * @returns {LineChart}
   */
  public draw(): LineChart {
    const visibleGroups: IData = Object
      .keys(this.data)
      .filter((group: string) => !this.hideGroups.includes(group))
      .reduce((acc: object, group: string) => {
        acc[group] = this.data[group];

        return acc;
      }, {});

    for (const group in visibleGroups) {
      const {
        data: groupData,
        line: groupLine = {},
        cap: groupCap = {},
      } = visibleGroups[group];

      const { lineStyle, } = this._getStyles(groupLine as any, groupCap as any, group);
      const coordinates: Array<IGroupDataCoordinates> = this._getGroupsDataCoordinates(groupData);

      // Рисуем задний фон группе
      if (Array.isArray(lineStyle.fill) || (typeof lineStyle.fill === "string" && lineStyle.fill.length)) {
        this._setFillGroupChart(coordinates, lineStyle.fill, lineStyle.stepped, group);
      }

      this._drawLinesAndCaps(coordinates, groupData, groupLine as any, groupCap as any, group);
    }

    return this;
  }
}

export default LineChart;