import { Container } from "react-pixi-fiber";
import { WORLD_OVERFLOW } from "../constants";
import { useWorldDims } from "../hooks/useWorldDims";
import { RoundedRect } from "./PixiComponents";

/**
 * Interactive container that takes up the entire space of the world.
 */
export const WorldOverlay = (props: Container) => {
  const worldDims = useWorldDims();

  return (
    <Container
      x={-WORLD_OVERFLOW}
      y={-WORLD_OVERFLOW}
      interactive
      {...props}
    >
      <RoundedRect
        // must have the rect, otherwise interactions fall through the Container
        alpha={0}
        x={0}
        y={0}
        height={worldDims.height + 2 * WORLD_OVERFLOW}
        width={worldDims.width + 2 * WORLD_OVERFLOW}
      />
    </Container>
  );
};
