import React from "react";
import * as PIXI from "pixi.js";
import { CustomPIXIComponent, usePixiApp } from "react-pixi-fiber";
import { Viewport as PixiViewport, Viewport } from "pixi-viewport";

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
        interaction: application.renderer.events,
        ticker: application.ticker,
      })
        .drag()
        .pinch()
        .wheel()
        .decelerate({ bounce: 0.95 })
        .bounce();
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
