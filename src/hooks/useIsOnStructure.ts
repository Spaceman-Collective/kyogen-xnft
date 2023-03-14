import { selectAllStructures } from "@/recoil/selectors";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";


const useIsOnStructure = () => {
    // Load all structures with their X,Y
    const structures = useRecoilValue(selectAllStructures);

    return useCallback((tileX: number, tileY: number) => {
        const overlappingStructure = structures.find(structure => structure && structure.x === tileX && structure.y === tileY);

        return !!overlappingStructure;
    }, [structures])
}

export default useIsOnStructure;