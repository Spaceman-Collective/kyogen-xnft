import React from "react";
import * as PIXI from "pixi.js";
import { CustomPIXIComponent, usePixiApp } from "react-pixi-fiber";
import { Viewport as PixiViewport } from "pixi-viewport";

export interface ViewportProps {
  screenHeight: number;
  screenWidth: number;
  worldWidth?: number;
  worldHeight?: number;
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
        worldWidth: worldWidth || screenWidth,
        worldHeight: worldHeight || screenHeight,
        interaction: application.renderer.plugins.interaction,
        ticker: application.ticker,
      })
        .drag()
        .pinch()
        .wheel()
        .decelerate()
        .bounce();
      // TODO without bounce, when the viewport is moved it throws off positioning Sprites
      return viewport;
    },
  },
  "Viewport"
);

export const Viewport = (props: ViewportProps) => {
  const application = usePixiApp();

  return <DisplayObjectViewport application={application} {...props} />;
};
