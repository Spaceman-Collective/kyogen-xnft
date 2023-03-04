import * as PIXI from "pixi.js";
import { useMemo } from "react";
import { Container, CustomPIXIComponent, Text } from "react-pixi-fiber";
import { keyDiff } from "../utils/keyDiff";
import { GraphicsProps } from "./PixiComponents";

const baseStyle: Partial<PIXI.ITextStyle> = {
  fill: 0xffffff,
  fontFamily: 'Inter',
  stroke: 0x000000,
  fontWeight: "900",
  strokeThickness: 5,
};
const numTextStyle = new PIXI.TextStyle({
  ...baseStyle,
  fontSize: 17,
  lineHeight: 17,
});
const xTextStyle = new PIXI.TextStyle({
  ...baseStyle,
  fontSize: 14,
  lineHeight: 14,
});

const xMetrics = PIXI.TextMetrics.measureText("x", xTextStyle);

// I really dk what to call this.
export const NumberContainer = ({
  fill,
  stroke,
  text,
  x = 0,
  y = 0,
}: {
  fill: number;
  stroke: number;
  text: string;
  x?: number;
  y?: number;
}) => {
  numTextStyle.stroke = stroke;
  xTextStyle.stroke = stroke;
  const textDims = useMemo(
    () => PIXI.TextMetrics.measureText(text, numTextStyle),
    [text]
  );

  // must scale down the dims since there's a lot of spacing around text glyphs
  const hexHeight = textDims.height - 5;
  // const scale = hexHeight / textDims.height;
  const hexRadius = hexHeight / Math.sqrt(3);
  const hexWidth = Math.max(textDims.width, hexRadius);

  return (
    <Container x={x - hexWidth / 2} y={y - hexHeight / 2}>
      <Hexagon
        // hex for box shadow
        height={hexHeight}
        width={hexWidth}
        stroke={stroke}
        strokeWidth={3}
        x={2}
      />
      <Hexagon
        height={hexHeight}
        width={hexWidth}
        fill={fill}
        stroke={stroke}
        strokeWidth={3}
      >
        <Text
          style={numTextStyle}
          // Start text centered in hexagon
          x={-hexRadius / 2}
          y={-hexHeight / 2}
          text={text}
        />
        <Text
          anchor={0.5}
          x={xMetrics.width / 2 - hexRadius}
          y={textDims.height - xMetrics.height}
          rotation={-0.175}
          style={xTextStyle}
          text="x"
        />
      </Hexagon>
    </Container>
  );
};

export interface HexagonProps extends GraphicsProps {
  width?: number;
  height: number;
}
/**
 * Hexagon where height determines the radius. A width can be specified that will
 * adjust the length of the top/bottom edges (i.e. internal rectangle).
 */
const Hexagon = CustomPIXIComponent<PIXI.Graphics, HexagonProps>(
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
        const height = newProps.height;
        const radius = height / Math.sqrt(3);
        const width = newProps.width || radius;

        obj.x = x;
        obj.y = y;
        obj.clear();
        obj.lineStyle({ width: newProps.strokeWidth, color: newProps.stroke });
        obj.beginFill(newProps.fill);
        obj.drawPolygon([
          // pt 1 (left)
          -radius,
          0,
          // pt 2 (bottom left)
          -radius / 2,
          height / 2,
          // pt 3 (bottom right)
          width - radius / 2,
          height / 2,
          // pt 4 (right)
          width,
          0,
          // pt 5 (top right)
          width - radius / 2,
          -height / 2,
          // pt 6 (top left)
          -radius / 2,
          -height / 2,
        ]);
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
  "Hexagon"
);
