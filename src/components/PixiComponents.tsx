import * as PIXI from "pixi.js";
import { CustomPIXIComponent, PixiComponent } from "react-pixi-fiber";
import { keyDiff } from "../utils/keyDiff";

interface GraphicsProps {
  x?: number;
  y?: number;
  strokeWidth?: number;
  stroke?: number;
  alpha?: number;
  fill?: number;
}

export interface CircleProps extends GraphicsProps {
  radius?: number;
}

export const Circle = CustomPIXIComponent<PIXI.Graphics, CircleProps>(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps: (obj, oldProps, newProps) => {
      if (
        keyDiff(oldProps, newProps, [
          "x",
          "y",
          "radius",
          "strokeWidth",
          "stroke",
          "fill",
        ])
      ) {
        obj.clear();
        obj.lineStyle({ width: newProps.strokeWidth, color: newProps.stroke });
        obj.beginFill(newProps.fill);
        obj.drawCircle(newProps.x || 0, newProps.y || 0, newProps.radius || 0);
        obj.blendMode = PIXI.BLEND_MODES.MULTIPLY;
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
        ])
      ) {
        obj.clear();
        obj.lineStyle({ width: newProps.strokeWidth, color: newProps.stroke });
        obj.beginFill(newProps.fill);
        obj.drawRoundedRect(
          newProps.x || 0,
          newProps.y || 0,
          newProps.width || 0,
          newProps.height || 0,
          newProps.radius || 0
        );
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
        obj.clear();
        obj.lineStyle({ width: newProps.strokeWidth, color: newProps.stroke });
        obj.beginFill(newProps.fill);
        obj.moveTo(newProps.width, 0);
        obj.lineTo(halfWidth, newProps.height);
        obj.lineTo(0, 0);
        obj.lineTo(halfWidth, 0);
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
  "Triangle"
);
