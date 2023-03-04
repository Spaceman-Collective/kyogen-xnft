import * as PIXI from "pixi.js";
import React, { JSXElementConstructor, ReactElement, useCallback } from "react";
import { Container } from "react-pixi-fiber";
import { TILE_LENGTH } from "../../constants";
import { RoundedRect, Triangle } from "../PixiComponents";

interface SelectorToolTipProps extends Container {
  children:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactElement<any, string | JSXElementConstructor<any>>[];
  spacing?: number;
  itemWidth: number;
  itemMaxHeight?: number;
}

const setAlphaIfSpriteChildren = (alpha: number) => (c: any) => {
  if (c instanceof PIXI.Sprite) {
    c.alpha = alpha;
  }
  return c;
};
/**
 * NOTE: Children will be displayed in the opposite order. This is to ensure any
 * overlapping components overlap from left to right.
 *
 * All Sprites within the container will have their alpha adjusted.
 * 
 * Currently assumes all children are containers with nested sprites. May want
 * to adjust this in the future.
 */
export const SelectorToolTip = ({
  children,
  spacing = 2,
  itemWidth,
  itemMaxHeight = 100,
  x = 0,
  y = 0,
  ...props
}: SelectorToolTipProps) => {
  const childArray = React.Children.toArray(children) as ReactElement<
    any,
    string | JSXElementConstructor<any>
  >[];
  const noBorderWidth = itemWidth * childArray.length;
  const totalWidth = noBorderWidth + spacing * (childArray.length - 1) + 6;
  const centeredX = -totalWidth / 2 + TILE_LENGTH / 2;
  const totalRectHeight = itemMaxHeight + 6;
  const triangleLength = 24;

  const onHover: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      const container = event.currentTarget as PIXI.DisplayObject;
      container.children?.forEach(setAlphaIfSpriteChildren(1));
    }, []);
  const onHoverEnd: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      const container = event.currentTarget as PIXI.DisplayObject;
      container.children?.forEach(setAlphaIfSpriteChildren(0.5));
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
        {React.Children.map(childArray, (c, index) => {
          // must render right to left so overlap happens left to right.
          const lastIndex = childArray.length - 1;
          const normalizedIndex = lastIndex - index;

          return React.cloneElement(c, {
            children: React.Children.map(
              React.Children.toArray(c.props.children),
              (c: any) =>
              // iterate over children to 
                React.cloneElement(c as any, {
                  alpha: c.type === "Sprite" ? 0.5 : undefined,
                })
            ),
            x: normalizedIndex * itemWidth + normalizedIndex * spacing,
            interactive: true,
            onmouseenter: onHover,
            onmouseleave: onHoverEnd,
          });
        })}
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
