import Image from "next/image";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { InputContainer } from "./inputs/InputContainer";
import { TextInput } from "./inputs/TextInput";
import KyogenLogo from "../../public/kyogen-logo.svg";
import { useLocalStorage } from "usehooks-ts";

export const OnboardingUserGate = () => {
  const [username, setUsername] = useLocalStorage("username", "");
  const [connected, setConnected] = useLocalStorage("connected", false);

  if (connected && username) {
    return null;
  }

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 bg-white bg-contain bg-center bg-no-repeat bg-[url('/bg_loading_screen_2x.webp')] z-10 flex">
      <div className="flex flex-1 flex-col items-center justify-end mb-[10%]">
        <InputContainer className="md:w-[450px]">
          <p className="text-center uppercase font-millimetre text-title font-outline-3 outline-none mb-5">
            Username
          </p>
          <TextInput
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <PrimaryButton
            className="my-5"
            onClick={() => {
              if (username) {
                setConnected(true);
              }
            }}
          >
            Connect Your Wallet
          </PrimaryButton>
        </InputContainer>
        <Image src={KyogenLogo} alt="Kyogen Clash" className="-mt-10" />
      </div>
    </div>
  );
};
