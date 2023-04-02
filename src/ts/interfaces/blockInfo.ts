import { IPointX, } from "./axisX";
import { IPos, IPadding, ISize, IBounds, } from "./global";
import { ILineTo, ILineTheme, } from "./line";
import { IFont, } from "./text";
import { IData, } from "./data";
import { TEmptyObject, } from "../types/index";

export interface IBlockInfoThemeWindow {
    color: Array<string> | string;
}

export interface IBlockInfoThemeTitle {
    color: string;
}

export interface ITriangleData extends IPos {
    lineTo: Array<ILineTo>,
    startY: number;
    endY: number;
}

export interface IBlockInfoThemeGroup {
    color: string;
}

export interface IBlockInfoTheme {
    window: IBlockInfoThemeWindow;
    title: IBlockInfoThemeTitle;
    group: IBlockInfoThemeGroup;
}

export interface IGroupsBlockInfoGaps {
    bottom: number;
    right: number;
}

export interface IGroupsBlockInfo {
    font: IFont;
    gaps: IGroupsBlockInfoGaps;
}

export interface ITitleBlockInfoGaps {
    bottom: number;
}

export interface ITitleBlockInfo {
    font: IFont;
    gaps: ITitleBlockInfoGaps;
}

export interface IBlockInfo {
    background?: string | Array<string>;
    groups: IGroupsBlockInfo;
    title: ITitleBlockInfo;
    padding?: IPadding | TEmptyObject;
}

export interface IBlockInfoElementWithSizeGroup extends ISize {
    name: string;
    color: string | Array<string>;
}

export interface IBlockInfoElementWithSizeValue extends ISize {
    name: string;
}

export interface IBlockInfoElementWithSize {
    group: IBlockInfoElementWithSizeGroup;
    value: IBlockInfoElementWithSizeValue;
}

export interface IBlockInfoClass {
    editValue: (value: number) => string;
    editName: (name: number | string) => string;
    data: IData;
    bounds: IBounds;
    elements: Array<IPointX>;
    padding?: IPadding | TEmptyObject;
    titleData: ITitleBlockInfo;
    groupsData: IGroupsBlockInfo;
    readonly groupLineWidth: number;
    readonly triangleSizes: ISize;
    title: string | number;
    themeForWindow: IBlockInfoThemeWindow | TEmptyObject;
    themeForLine: ILineTheme | TEmptyObject;
    themeForTitle: IBlockInfoThemeTitle | TEmptyObject;
    themeForGroup: IBlockInfoThemeGroup | TEmptyObject;

    init(): void;
}