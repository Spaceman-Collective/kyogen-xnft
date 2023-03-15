import React from "react";
import * as PIXI from "pixi.js";
import { CustomPIXIComponent, usePixiApp } from "react-pixi-fiber";
import { Viewport as PixiViewport, Viewport } from "pixi-viewport";
import { WORLD_OVERFLOW } from "../constants";

export interface ViewportProps {
  screenHeight?: number;
  screenWidth?: number;
  worldWidth: number;
  worldHeight: number;
  children?: React.ReactNode;
}

export interface DisplayObjectViewportProps extends ViewportProps {
  application: PIXI.Application;
}

const DisplayObjectViewport = CustomPIXIComponent<
  PixiViewport,
  DisplayObjectViewportProps
>(
  {
    customDisplayObject: ({
      application,
      screenHeight,
      screenWidth,
      worldHeight,
      worldWidth,
    }) => {
      const bounceBox = new PIXI.Rectangle(
        -WORLD_OVERFLOW,
        -WORLD_OVERFLOW,
        worldWidth + WORLD_OVERFLOW,
        worldHeight + WORLD_OVERFLOW
      ) as PIXI.Rectangle;
      const bounceOptions = {
        bounceBox,
        sides: "all",
        underflow: "center",
      };
      const viewport = new PixiViewport({
        screenHeight: screenHeight,
        screenWidth: screenWidth,
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        events: application.renderer.events,
        ticker: application.ticker,
        allowPreserveDragOutside: true,
      })
        .drag({ underflow: "center" })
        .pinch()
        .wheel()
        .decelerate({ bounce: 0.95 })
        .bounce(bounceOptions)
        .setZoom(0.8, true);
      // Set up the drag event for the viewport
      viewport.on("drag-end", () => {
        viewport.bounce(undefined);
      });
      // Set up the update event for the viewport
      viewport.on("frame-end", () => {
        viewport.bounce(bounceOptions);
      });
      return viewport;
    },
  },
  "Viewport"
);

export const KyogenViewport = (props: ViewportProps) => {
  const application = usePixiApp();

  return <DisplayObjectViewport application={application} {...props} />;
};

export const getViewport = (object: PIXI.DisplayObject): Viewport | null => {
  if (!object) {
    return null;
  }
  if (object instanceof Viewport) {
    return object as Viewport;
  }
  return getViewport(object.parent);
};
