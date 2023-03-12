import Image from "next/image";
import Check from "../../public/icons/green_check.svg";
import Warn from "../../public/icons/warning.svg";
import Close from "../../public/icons/close.svg";
import DangerIcon from "../../public/icons/red_stop.svg";

type Role = "success" | "danger" | "warning"

const RoleImage = (role: Role) => {
    switch(role) {
        case "success":
            return <Image src={Check} alt="Check" />;
        case "danger":
            return <Image src={DangerIcon} alt="Danger" />;
        case "warning":
            return <Image src={Warn} alt="Warn" />;
        default:
            throw new Error("Unknown Toast role");
    }
}

export const Toast = ({ role, message }: { role: Role; message: string }) => {
  return (
    <div className="flex flex-row p-3 items-start border-[1px] w-[450px] border-black bg-white rounded-tl-[5px] rounded-br-[5px] rounded-tr-[20px] rounded-bl-[20px]">
      {RoleImage(role)}
      <p className="text-black mx-2 font-bold">{message}</p>
      <Image src={Close} alt="Close" />
    </div>
  );
};

export const Notifications = () => {
  return (
    <div className="fixed top-[50px] right-[10px]">
      <Toast
        role="success"
        message="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </div>
  );
};
