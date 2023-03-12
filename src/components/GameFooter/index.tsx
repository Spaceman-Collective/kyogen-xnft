import { selectedUnitAtom } from "@/recoil";
import { useRecoilValue } from "recoil";

const SelectedUnit = () => {
  const selectedUnit = useRecoilValue(selectedUnitAtom);
  if (!selectedUnit) return null;

  return <div>{selectedUnit.name}</div>;
};

const GameFooter = () => {
  return (
    <div className="flex flex-row grow max-h-[275px]">
      <div className="grow">Mini Map</div>
      <div className="grow">
        <SelectedUnit />
      </div>
      <div className="grow">Unit Info</div>
      <div className="grow">Game feed</div>
    </div>
  );
};

export default GameFooter;
