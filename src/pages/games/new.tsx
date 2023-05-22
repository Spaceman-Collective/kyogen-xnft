import Head from 'next/head'
import { Navbar } from '../../components/Navbar';
import { InputContainer } from '@/components/inputs/InputContainer';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { useRouter } from "next/router";
import { TextInput } from '@/components/inputs/TextInput';
import Image from 'next/image';
import { BorderedContainer } from '@/components/BorderedContainer';
import  Minimap  from 'public/kyogen-mini-map.svg';
import { BackButton } from '@/components/buttons/BackButton';
import { RadioButtonGroup } from '@/components/RadioButtonGroup';

export default function Home() {
  const router = useRouter();

  const MapRadioButtons = [
    { value: "Balanced",  label: "Balanced" },
    { value: "Custom",    label: "Custom" },
  ];

  return (
    <>
      {/* <Navbar /> */}
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-white bg-contain bg-center bg-no-repeat bg-[url('/kyogen-bg-shadowed.png')] z-10 flex">
        <div className="flex-grow grid overflow-y-auto scrollbar-hide">
          <div className="flex flex-col pt-14 justify-self-center w-[67%] gap-y-2">
            <div className="flex flex-col pb-20 pt-10">
              <div className="mb-10">
                <BackButton onClick={() => router.push("/")}>Back</BackButton>
              </div>
              <div className="text-red-500 drop-shadow-md text-4xl font-millimetre">
                New Quck Game
              </div>
              <div className="text-white mt-2 drop-shadow-md text-xl font-millimetre">
                Choose the settings for your game
              </div>
            </div>

            <div className="flex relative">
              <InputContainer className={`gap-y-6 items-center basis-3/5`}>
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="text-black font-millimetre">
                      Max number of players
                    </div>
                    <div className="h-[47px]">
                      <TextInput
                        className="text-start h-full pl-3 font-millimetre"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="text-black font-millimetre">
                      Max Solarite Score
                    </div>
                    <div className="h-[47px]">
                      <TextInput
                        className="text-start h-full pl-3 font-millimetre"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="text-black font-millimetre">Map</div>
                    <div className="h-[47px]">
                      <RadioButtonGroup
                        className="w-[209px] h-[47px]"
                        buttons={MapRadioButtons}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="text-black font-millimetre">Select Map</div>
                    <div className="h-[47px]">
                      <TextInput className="text-start h-full pl-3 font-millimetre" />
                    </div>
                  </div>
                </div>
                <div className="w-full h-full flex justify-end items-end mb-2">
                  <PrimaryButton>Start Game</PrimaryButton>
                </div>
              </InputContainer>
              <BorderedContainer className="flex flex-col basis-2/5 scale-105">
                <div className="h-auto max-w-lg object-cover -mt-6">
                  <Image
                    src={Minimap}
                    alt="minimap"
                    width={450}
                    height={300}
                  ></Image>
                </div>

                <div className="p-4">
                  <div className="text-white font-millimetre h-[35px]">
                    Game Id: 1231212312
                  </div>
                  <div className="text-[#959595] flex justify-between items-end font-millimetre h-[35px] border-b border-[#3C3C3C]">
                    <div>Map Size</div>
                    <div>Custom / 8x8</div>
                  </div>
                  <div className="text-[#959595] flex justify-between items-end font-millimetre h-[35px] border-b border-[#3C3C3C]">
                    <div>Players</div>
                    <div>12</div>
                  </div>
                  <div className="text-[#959595] flex justify-between items-end font-millimetre h-[35px] border-b border-[#3C3C3C]">
                    <div>Max Score</div>
                    <div>2000/5000</div>
                  </div>
                  <div className="text-[#959595] flex justify-between items-end font-millimetre h-[35px] border-b border-[#3C3C3C]">
                    <div>Duration</div>
                    <div>15 Minutes</div>
                  </div>
                </div>
              </BorderedContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
