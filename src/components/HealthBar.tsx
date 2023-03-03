import { RoundedRect } from "./PixiComponents";

export const HealthBarWidth = 38;
export const HealthBarHeight = 4;

// TODO add inset shadow
export const HealthBar = ({
  percent,
  x,
  y,
}: {
  percent: number;
  x: number;
  y: number;
}) => {
  return (
    <>
     <RoundedRect
        alpha={0.8}
        height={HealthBarHeight + 4}
        width={HealthBarWidth + 4}
        fill={0xFFFFFF}
        radius={4}
        x={x - 2}
        y={y - 2}
      />
      <RoundedRect
        // black border (using stroke/strokewidth takes away from width of rect)
        height={HealthBarHeight + 2}
        width={HealthBarWidth + 2}
        fill={0x000000}
        radius={3}
        x={x - 1}
        y={y - 1}
      />
      <RoundedRect
        // background fill
        height={HealthBarHeight}
        width={HealthBarWidth}
        fill={0x14161b}
        radius={2}
        x={x}
        y={y}
      />
      <RoundedRect
        // health fill
        height={HealthBarHeight}
        width={HealthBarWidth * percent}
        fill={percent < 0.3 ? 0xff3d46 : percent < 65 ? 0xffc32d : 0x7dd75d}
        radius={2}
        x={x}
        y={y}
      />
    </>
  );
};
