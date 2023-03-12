import Image from "next/image";
import Check from "../../public/icons/green_check.svg";
import Warn from "../../public/icons/warning.svg";
import Close from "../../public/icons/close.svg";
import DangerIcon from "../../public/icons/red_stop.svg";
import { Role } from "@/types";
import { useRecoilState } from "recoil";
import { notificationsAtom } from "@/recoil";
import { useCallback } from "react";

const RoleImage = (role: Role) => {
  switch (role) {
    case "success":
      return <Image src={Check} alt="Check" />;
    case "danger":
      return <Image src={DangerIcon} alt="Danger" />;
    case "warning":
      return <Image src={Warn} alt="Warn" />;
    default:
      throw new Error("Unknown Toast role");
  }
};

export const Toast = ({
  role,
  message,
  onClose,
}: {
  role: Role;
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="flex flex-row items-start justify-between p-3 border-[1px] w-[450px] border-black bg-white rounded-tl-[5px] rounded-br-[5px] rounded-tr-[20px] rounded-bl-[20px]">
      {RoleImage(role)}
      <p className="text-black mx-2 font-bold">{message}</p>
      <Image className="cursor-pointer" src={Close} alt="Close" onClick={onClose} />
    </div>
  );
};

export const Notifications = () => {
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);

  const handleClose = useCallback((index: number) => {
    setNotifications(cur => cur.filter((_, idx)=> idx !== index))
  }, [setNotifications])

  if (notifications.length <= 0) return null;
  return (
    <div className="fixed top-[50px] right-[10px]">
      {notifications.map((notification, index) => (
        <Toast {...notification} onClose={() => handleClose(index)} />
      ))}
    </div>
  );
};
