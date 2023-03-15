import { ease } from "pixi-ease";
import { useEffect, useRef } from "react";
import { Container } from "react-pixi-fiber";
import { RoundedRect } from "./PixiComponents";

export const HealthBarWidth = 38;
export const HealthBarHeight = 4;

interface HealthBarProps extends Container {
  percent: number;
  x: number;
  y: number;
}

// TODO add inset shadow
export const HealthBar = ({ percent, x, y, ...props }: HealthBarProps) => {
  const healthRef = useRef(null);
  const mountRef = useRef(false);
  const initPercent = useRef(percent).current;

  useEffect(() => {
    if (!mountRef.current) {
      // don't run effect on mount
      mountRef.current = true;
      return;
    }
    if (healthRef.current) {
      ease.add(
        healthRef.current,
        { width: HealthBarWidth * percent },
        { duration: 300, ease: "linear" }
      );
    }
  }, [percent]);

  return (
    <Container x={x} y={y} {...props}>
      <RoundedRect
        alpha={0.8}
        height={HealthBarHeight + 4}
        width={HealthBarWidth + 4}
        fill={0xFFFFFF}
        radius={4}
        x={-2}
        y={-2}
      />
      <RoundedRect
        // black border (using stroke/strokewidth takes away from width of rect)
        height={HealthBarHeight + 2}
        width={HealthBarWidth + 2}
        fill={0x000000}
        radius={3}
        x={-1}
        y={-1}
      />
      <RoundedRect
        // background fill
        height={HealthBarHeight}
        width={HealthBarWidth}
        fill={0x14161b}
        radius={2}
      />
      <RoundedRect
        // health fill
        ref={healthRef}
        height={HealthBarHeight}
        width={HealthBarWidth * initPercent}
        fill={percent < 0.3 ? 0xff3d46 : percent < 0.65 ? 0xffc32d : 0x7dd75d}
        radius={2}
      />
    </Container>
  );
};
