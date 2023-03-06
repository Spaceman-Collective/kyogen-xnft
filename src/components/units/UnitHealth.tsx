import { useLayoutEffect, useRef, useState } from "react";
import { Container } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { ease } from "pixi-ease";
import { TILE_LENGTH, UNIT_LENGTH } from "../../constants";
import { HealthBar, HealthBarWidth } from "../HealthBar";
import { NumberContainer } from "../NumberContainer";
import { usePrevious } from "../../hooks/usePrevious";

export const UnitHealth = ({
  health,
  maxHealth,
  showHealthBar,
}: {
  health: number;
  maxHealth: number;
  showHealthBar: boolean;
}) => {
  const mountRef = useRef(false);
  const healthNotifRef = useRef<Container>(null);
  const notifInitialY = TILE_LENGTH / 1.8;
  const prevHealth = usePrevious(health);
  const [healthNotifState, setHealthNotifState] = useState({
    forceShow: false,
    diff: 0,
  });

  useLayoutEffect(() => {
    const healthDiff = health - (prevHealth ?? 0);
    if (!mountRef.current) {
      // don't run effect on mount
      mountRef.current = true;
      return;
    }
    if (!healthDiff) {
      return;
    }
    const containerHeight = healthNotifRef.current?.height ?? 0;
    const terminalY = containerHeight / 2;
    if (healthNotifRef.current?.y) {
      setHealthNotifState({ forceShow: true, diff: healthDiff });
      const anim = ease.add(
        healthNotifRef.current as unknown as PIXI.DisplayObject,
        { alpha: 1, y: terminalY },
        { ease: "easeInOutQuad", duration: 500, reverse: true }
      );
      anim.on("complete", () => {
        setHealthNotifState({ forceShow: false, diff: 0 });
      });
    }
  }, [health, prevHealth]);

  return (
    <>
      <NumberContainer
        ref={healthNotifRef}
        alpha={0}
        fill={healthNotifState.diff > 0 ? 0x7dd75d : 0xff3d46}
        stroke={0x000000}
        text={Math.abs(healthNotifState.diff).toString()}
        sign={healthNotifState.diff > 0 ? "+" : "-"}
        x={TILE_LENGTH}
        y={notifInitialY}
      />
      <HealthBar
        alpha={healthNotifState.forceShow || showHealthBar ? 1 : 0}
        percent={health / maxHealth}
        x={(TILE_LENGTH - HealthBarWidth) / 2}
        y={UNIT_LENGTH}
      />
    </>
  );
};
