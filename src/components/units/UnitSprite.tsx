import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "react-pixi-fiber";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { FE_RECOVERY_BUFFER, UNIT_LENGTH, UNIT_OFFSET } from "../../constants";
import { useMoveUnit } from "../../hooks/useMoveUnit";
import {
  connectionAtom,
  gameStateAtom,
  selectedTileIdAtom,
  troopContainerRefAtomFamily,
  troopsAtomFamily,
} from "../../recoil";
import {
  selectCurrentPlayer,
  selectMapDims,
  selectPlayerColor,
  selectTileFromTroopId,
} from "../../recoil/selectors";
import { Troop } from "../../types";
import {
  calculateTileCoords,
  calculateUnitPositionOnTileCoords,
  calculateDistance,
  getMoveableTiles,
  normalizeGlobalPointFromViewport,
} from "../../utils/map";
import { MoveHighlight } from "../MoveHighlight";
import { Circle } from "../PixiComponents";
import { getViewport } from "../PixiViewport";
import { ClippedUnit } from "./ClippedUnit";
import { UnitHealth } from "./UnitHealth";

export const TroopUnit = ({ troopId }: { troopId: string }) => {
  const troop = useRecoilValue(troopsAtomFamily(troopId));
  const tile = useRecoilValue(selectTileFromTroopId(troopId));

  if (!troop || !tile) {
    return null;
  }
  return <UnitSprite tileX={tile.x} tileY={tile.y} troop={troop} />;
};

export const UnitSprite = ({
  tileX,
  tileY,
  troop,
}: {
  tileX: number;
  tileY: number;
  troop: Troop;
}) => {
  const containerRef = useRef(null);
  const connection = useRecoilValue(connectionAtom);
  const setTroopContainerRef = useSetRecoilState(
    troopContainerRefAtomFamily(troop.id)
  );
  const resetTroopContainerRef = useResetRecoilState(
    troopContainerRefAtomFamily(troop.id)
  );
  const coords = calculateUnitPositionOnTileCoords(tileX, tileY);
  const currentPlayer = useRecoilValue(selectCurrentPlayer);
  const ownedByCurrentPlayer = currentPlayer?.id === troop.player_id;
  const troopPlayerColor = useRecoilValue(selectPlayerColor(troop.player_id));
  const mapDims = useRecoilValue(selectMapDims);
  const gameState = useRecoilValue(gameStateAtom);
  const setSelectedTileId = useSetRecoilState(selectedTileIdAtom);
  const [dragging, setDragging] = useState(false);
  const [startTile, setStartTile] = useState<[number, number] | null>([
    tileX,
    tileY,
  ]);
  const [hovering, setHovering] = useState(false);
  const moveUnit = useMoveUnit(troop.id, tileX, tileY);
  const movement = Number(troop.movement);
  const moveable = useMemo(
    () =>
      dragging && startTile
        ? getMoveableTiles(startTile, movement, mapDims.width, mapDims.height)
        : [],
    [dragging, mapDims.height, mapDims.width, movement, startTile]
  );

  const onMouseOver: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      setHovering(true);
    }, []);

  const onMouseOut: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      setHovering(false);
    }, []);

  const onDragStart: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      (event) => {
        event.stopPropagation();
        const container = event.currentTarget as PIXI.DisplayObject;
        const viewport = getViewport(container);
        if (!viewport) {
          return;
        }

        const _startTile = calculateTileCoords(
          normalizeGlobalPointFromViewport(viewport, event.global),
          viewport.lastViewport?.scaleX,
          viewport.lastViewport?.scaleY
        );
        const startTileId = gameState!.get_tile_id(
          _startTile[0],
          _startTile[1]
        );
        setSelectedTileId(startTileId);

        if (!ownedByCurrentPlayer) {
          // do nothing if enemy unit
          return;
        }

        setStartTile(_startTile);
        container.alpha = 0.5;
        setDragging(true);
      },
      [gameState, ownedByCurrentPlayer, setSelectedTileId]
    );

  const onDragEnd: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      async (event) => {
        // prevent viewport from moving
        event.stopPropagation();
        const container = event.currentTarget as PIXI.DisplayObject;
        const viewport = getViewport(container);
        if (!viewport) {
          return;
        }
        const coords = calculateTileCoords(
          normalizeGlobalPointFromViewport(viewport, event.global),
          viewport.lastViewport?.scaleX,
          viewport.lastViewport?.scaleY
        );
        const destinationTileId = gameState!.get_tile_id(coords[0], coords[1]);
        // Set the selected unit

        container.alpha = 1;
        setDragging(false);
        // snap sprite to tile
        const distance = calculateDistance(startTile!, coords);
        if (
          distance > movement ||
          (startTile![0] === coords[0] && startTile![1] === coords[1])
        ) {
          // unit could not be moved or was moved to starting tile
          container.position = calculateUnitPositionOnTileCoords(...startTile!);
          return;
        }
        // unit could be moved
        try {
          const slot = await connection.getSlot("confirmed");
          const recovering =
            slot - parseInt(troop.last_used) <=
            parseInt(troop.recovery) + FE_RECOVERY_BUFFER;
          if (recovering) {
            throw Error("Cannot move recovering unit");
          }
          setSelectedTileId(destinationTileId);
          await moveUnit(destinationTileId);
          container.position = calculateUnitPositionOnTileCoords(...coords);
          return;
        } catch (err) {
          if (startTile) {
            // NOTE: if the user clicks on another tile and the move TX errors, then the selected unit will revert.
            // TODO find a better way to handle this.
            setSelectedTileId(
              gameState!.get_tile_id(startTile[0], startTile[1])
            );
          }
          console.log(err);
          // TODO better error handling
          container.position = calculateUnitPositionOnTileCoords(...startTile!);
        }
      },
      [
        gameState,
        startTile,
        movement,
        connection,
        troop.last_used,
        troop.recovery,
        setSelectedTileId,
        moveUnit,
      ]
    );

  const onDragMove: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      (event) => {
        event.stopPropagation();
        const container = event.currentTarget as PIXI.DisplayObject;
        if (dragging) {
          const viewport = getViewport(container);
          if (!viewport) {
            return;
          }
          const scaleX = viewport.lastViewport?.scaleX ?? 1;
          const scaleY = viewport.lastViewport?.scaleY ?? 1;
          const position = normalizeGlobalPointFromViewport(
            viewport,
            event.global
          );
          container.x = position.x / scaleX - UNIT_LENGTH / 2;
          container.y = position.y / scaleY - UNIT_LENGTH / 2;
        }
      },
      [dragging]
    );

  useEffect(() => {
    // register container for troop
    setTroopContainerRef(containerRef);

    return () => {
      // reset when unmounting
      resetTroopContainerRef();
    };
  }, [resetTroopContainerRef, setTroopContainerRef]);

  return (
    <>
      {ownedByCurrentPlayer && (
        <MoveHighlight
          // must be outside container in order to remain static
          movement={movement}
          startTile={startTile}
          tiles={moveable}
        />
      )}
      <Container
        ref={containerRef}
        onpointerdown={onDragStart}
        onpointerup={onDragEnd}
        onpointermove={onDragMove}
        onmouseover={onMouseOver}
        onmouseout={onMouseOut}
        x={coords.x}
        y={coords.y}
        interactive
      >
        <ClippedUnit
          height={UNIT_LENGTH}
          width={UNIT_LENGTH}
          name={troop.name}
          x={UNIT_OFFSET}
          y={UNIT_OFFSET}
        />
        {!ownedByCurrentPlayer && (
          <Circle
            fill={troopPlayerColor}
            radius={5}
            stroke={0x000000}
            strokeWidth={1}
            x={UNIT_OFFSET + 12}
            y={UNIT_OFFSET + 12}
          />
        )}
        <UnitHealth
          health={Number(troop.health)}
          maxHealth={Number(troop.max_health)}
          showHealthBar={hovering}
        />
      </Container>
    </>
  );
};
