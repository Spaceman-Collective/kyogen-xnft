import * as PIXI from "pixi.js";
import React, { useCallback } from "react";
import { useMemo } from "react";
import { Container } from "react-pixi-fiber";
import { TILE_LENGTH } from "../../constants";
import { RoundedRect, Triangle } from "../PixiComponents";

interface SelectorToolTipProps extends Container {
  spacing?: number;
  itemWidth: number;
  itemMaxHeight?: number;
}

export const SelectorToolTip = ({
  children,
  spacing = 2,
  itemWidth,
  itemMaxHeight = 100,
  x = 0,
  y = 0,
  ...props
}: SelectorToolTipProps) => {
  // TODO move viewport when mounted and outside of current viewport
  const childArray = React.Children.toArray(children);
  const noBorderWidth = itemWidth * childArray.length;
  const totalWidth = noBorderWidth + spacing * (childArray.length - 1) + 6;
  const centeredX = -totalWidth / 2 + TILE_LENGTH / 2;
  const totalRectHeight = itemMaxHeight + 6;
  const triangleLength = 24;

  const onHover: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      const child = event.currentTarget as PIXI.DisplayObject;
      child.alpha = 1;
    }, []);
  const onHoverEnd: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      const child = event.currentTarget as PIXI.DisplayObject;
      child.alpha = 0.5;
    }, []);

  return (
    <Container
      x={centeredX + x}
      y={-itemMaxHeight - triangleLength + y}
      {...props}
    >
      <>
        <RoundedRect
          x={-3}
          y={-3}
          radius={5}
          height={totalRectHeight}
          width={totalWidth}
          fill={0x371717}
        />
        {React.Children.map(childArray, (c, index) =>
          React.cloneElement(c as any, {
            alpha: 0.5,
            x: index * itemWidth + index * spacing,
            interactive: true,
            onmouseenter: onHover,
            onmouseleave: onHoverEnd,
          })
        )}
        <Triangle
          fill={0x371717}
          width={triangleLength}
          height={triangleLength}
          x={(noBorderWidth - triangleLength) / 2}
          y={itemMaxHeight}
        />
      </>
    </Container>
  );
};
