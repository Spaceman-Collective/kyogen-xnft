import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { connectionAtom, currentSlotAtom } from "../recoil";

export const useTrackSlotChange = () => {
  const setCurrentSlot = useSetRecoilState(currentSlotAtom);
  const connection = useRecoilValue(connectionAtom);

  useEffect(() => {
    const id = connection.onSlotUpdate((slotUpdate) => {
      if (slotUpdate.type === "completed") {
        setCurrentSlot(slotUpdate.slot);
      }
    });
    return () => {
      connection.removeSlotChangeListener(id);
    };
  }, [connection, setCurrentSlot]);
};
