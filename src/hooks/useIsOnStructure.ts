import { selectAllStructures } from "@/recoil/selectors";
import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";

const useIsOnStructure = (tileX: number, tileY: number) => {
  // Load all structures with their X,Y
  const structures = useRecoilValue(selectAllStructures);

  return useMemo(() => {
    const overlappingStructure = structures.find(
      (structure) => structure && structure.x === tileX && structure.y === tileY
    );

    return !!overlappingStructure;
  }, [structures, tileX, tileY]);
};

export default useIsOnStructure;
