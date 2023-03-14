import * as PIXI from "pixi.js";
import { CustomPIXIComponent } from "react-pixi-fiber";
import { keyDiff } from "../utils/keyDiff";

export interface GraphicsProps {
  x?: number;
  y?: number;
  strokeWidth?: number;
  stroke?: number;
  alpha?: number;
  fill?: number;
  fillAlpha?: number;
  filters?: PIXI.Filter[];
}

export interface CircleProps extends GraphicsProps {
  radius?: number;
  blendMode?: PIXI.BLEND_MODES;
}

export const Circle = CustomPIXIComponent<PIXI.Graphics, CircleProps>(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (obj, oldProps, newProps) => {
      if (
        keyDiff(oldProps, newProps, [
          "blendMode",
          "x",
          "y",
          "radius",
          "strokeWidth",
          "stroke",
          "fill",
          "fillAlpha",
        ])
      ) {
        obj.clear();
        obj.lineStyle({ width: newProps.strokeWidth, color: newProps.stroke });
        obj.beginFill(newProps.fill, newProps.fillAlpha);
        obj.drawCircle(newProps.x || 0, newProps.y || 0, newProps.radius || 0);
        if (newProps.blendMode) {
          obj.blendMode = newProps.blendMode;
        }
        obj.endFill();
      }

      if (
        typeof newProps.alpha !== "undefined" &&
        oldProps?.alpha !== newProps.alpha
      ) {
        obj.alpha = newProps.alpha;
      }
    },
  },
  "Circle"
);

export interface RoundedRectProps extends GraphicsProps {
  height?: number;
  width?: number;
  radius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
}

export const RoundedRect = CustomPIXIComponent<PIXI.Graphics, RoundedRectProps>(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (obj, oldProps, newProps) => {
      if (
        keyDiff(oldProps, newProps, [
          "height",
          "width",
          "x",
          "y",
          "radius",
          "strokeWidth",
          "stroke",
          "fill",
          "fillAlpha",
          "topLeftRadius",
          "topRightRadius",
          "bottomLeftRadius",
          "bottomRightRadius",
        ])
      ) {
        const x = newProps.x ?? 0;
        const y = newProps.y ?? 0;
        const width = newProps.width ?? 0;
        const height = newProps.height ?? 0;
        obj
          .clear()
          .lineStyle({ width: newProps.strokeWidth, color: newProps.stroke })
          .beginFill(newProps.fill, newProps.fillAlpha ?? 1)
          // move middle top
          .moveTo(x + width / 2, y)
          // arc top right corner
          .arcTo(
            x + width,
            y,
            x + width,
            y + height / 2,
            newProps.topRightRadius || newProps.radius || 0
          )
          // arc bottom right
          .arcTo(
            x + width,
            y + height,
            x + width / 2,
            y + height,
            newProps.bottomRightRadius || newProps.radius || 0
          )
          // arc bottom left
          .arcTo(
            x,
            y + height,
            x,
            y + height / 2,
            newProps.bottomLeftRadius || newProps.radius || 0
          )
          // arc top left
          .arcTo(
            x,
            y,
            x + width / 2,
            y,
            newProps.topLeftRadius || newProps.radius || 0
          )
          .lineTo(x + width / 2, y)
          .endFill();
      }

      if (
        typeof newProps.alpha !== "undefined" &&
        oldProps?.alpha !== newProps.alpha
      ) {
        obj.alpha = newProps.alpha;
      }

      if (
        typeof newProps.filters !== "undefined" &&
        oldProps?.filters !== newProps.filters
      ) {
        obj.filters = newProps.filters;
      }
    },
  },
  "RoundedRect"
);

export interface TriangleProps extends GraphicsProps {
  width: number;
  height: number;
}

export const Triangle = CustomPIXIComponent<PIXI.Graphics, TriangleProps>(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (obj, oldProps, newProps) => {
      if (
        keyDiff(oldProps, newProps, [
          "height",
          "width",
          "x",
          "y",
          "strokeWidth",
          "stroke",
          "fill",
        ])
      ) {
        const x = newProps.x || 0;
        const y = newProps.y || 0;
        const halfWidth = newProps.width / 2;
        obj.x = x;
        obj.y = y;
        obj
          .clear()
          .lineStyle({ width: newProps.strokeWidth, color: newProps.stroke })
          .beginFill(newProps.fill)
          .moveTo(newProps.width, 0)
          .lineTo(halfWidth, newProps.height)
          .lineTo(0, 0)
          .lineTo(halfWidth, 0)
          .endFill();
      }

      if (
        typeof newProps.alpha !== "undefined" &&
        oldProps?.alpha !== newProps.alpha
      ) {
        obj.alpha = newProps.alpha;
      }
    },
  },
  "Triangle"
);
