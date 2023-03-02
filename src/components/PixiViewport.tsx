import React from "react";
import * as PIXI from "pixi.js";
import { CustomPIXIComponent, usePixiApp } from "react-pixi-fiber";
import { Viewport as PixiViewport } from "pixi-viewport";

export interface ViewportProps {
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
    customDisplayObject: ({ application, worldHeight, worldWidth }) => {
      const viewport = new PixiViewport({
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        interaction: application.renderer.events,
        ticker: application.ticker,
      })
        .drag()
        .pinch()
        .wheel()
        .decelerate()
        .bounce();
      return viewport;
    },
  },
  "Viewport"
);

export const Viewport = (props: ViewportProps) => {
  const application = usePixiApp();

  return <DisplayObjectViewport application={application} {...props} />;
};
