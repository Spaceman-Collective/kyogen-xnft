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
      const viewport = new PixiViewport({
        screenHeight: screenHeight,
        screenWidth: screenWidth,
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        events: application.renderer.events,
        ticker: application.ticker,
      })
        .drag({ underflow: "bottom" })
        .pinch()
        // TODO need to readjust movements to be relative to viewport to handle zoom
        .wheel({ wheelZoom: false })
        .decelerate({ bounce: 0.95 })
        .bounce({
          bounceBox: new PIXI.Rectangle(
            -WORLD_OVERFLOW,
            -WORLD_OVERFLOW,
            worldWidth + WORLD_OVERFLOW,
            worldHeight + WORLD_OVERFLOW
          ),
          underflow: "bottom",
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
