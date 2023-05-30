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
import { useKyogenInstructionSdk } from "@/hooks/useKyogenInstructionSdk";
import { ixWasmToJs, randomU64 } from '@/utils/wasm';
import { useSendAndConfirmGameWalletTransaction } from '@/hooks/useSendTransaction';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { connectionAtom, gameWallet as gameWalletAtom, notificationsAtom } from '@/recoil';
import { append_registry_index, create_mint, init_map, init_structures, init_structures_index, init_tiles, loadGameConfig, mint_spl } from '@/utils/startNewGame';
import { useKyogenRegistrySdk } from '@/hooks/useKyogenRegistrySdk';
import { useKyogenGameStateSdk } from '@/hooks/useKyogenGameStateSdk';
import { useKyogenStructuresSdk } from '@/hooks/ useKyogenStructuresSdk';
import * as anchor from "@coral-xyz/anchor"

import config from '@/configs/15x15-12.json'
import { useEffect, useState } from 'react';
import { SdkLoader } from '@/components/KyogenSdkLoader';

const New = () => {
  const router = useRouter();
  const instructionSdk = useKyogenInstructionSdk();
  const registrySdk = useKyogenRegistrySdk()
  const structuresSdk = useKyogenStructuresSdk()
  const sendTransaction = useSendAndConfirmGameWalletTransaction();
  const connection = useRecoilValue(connectionAtom);
  const gameWallet = useRecoilValue(gameWalletAtom);
  const sdkLoadGameState = useKyogenGameStateSdk();
  const [loading, setLoading] = useState<boolean>(false);
  const setNotifications = useSetRecoilState(notificationsAtom);

  const [maxPlayers, setMaxPlayers] = useState<number>();
  const [maxSolariteScore, setMaxSolariteScore] = useState<number>();
  const [selectedMapConfig, setSelectedMapConfig] = useState<any>();

  useEffect(() => {
    /* Set default map config */
    setSelectedMapConfig(config)
  }, []);

  useEffect(() => {
    console.log('[selectedMapConfig]: ', selectedMapConfig);
  }, [selectedMapConfig])

  useEffect(() => {
    // console.log(`[maxPlayers]: ${maxPlayers} - maxSolariteScore: ${maxSolariteScore}`);
    let defaultMapConfig = (selectedMapConfig) ? selectedMapConfig : config;
    setSelectedMapConfig({
        ...defaultMapConfig,
        max_players: (maxPlayers) ? maxPlayers : selectedMapConfig?.maxPlayers,
        max_score: (maxSolariteScore) ? maxSolariteScore : selectedMapConfig?.solariteScore,
      })
  }, [maxPlayers, maxSolariteScore])

  const MapRadioButtons = [
    { value: "Balanced",  label: "Balanced" },
    { value: "Custom",    label: "Custom" },
  ];

  const handleStartGame = async () => {
    if (!gameWallet) {
      console.log("[handleStartGame] gameWallet not found");
      setLoading(false);

      setNotifications((notifications: any) => [
        ...notifications,
        {
          role: "success",
          message: `Ok`,
        },
      ]);
      return;
    }

    /* We copy `selectedMapConfig` so we can modify it without setState and
     * risk having stale values down this handler
     */
    let mapCfg = selectedMapConfig;
    try {
      const STARTING_BALANCE = await connection.getBalance(
        gameWallet?.publicKey
      );

      // Create SPL Mint per game
      const gameMint = await create_mint(connection, gameWallet);
      if (!gameMint) {
        console.log("[handleStartGame] failed to create game token mint");
        setLoading(false);
        return;
      }
      mapCfg.game_token = gameMint.toString();

      // Create Kyogen Game instance
      // const instance = await create_game_instance();
      let newInstanceId = randomU64();
      const ix = ixWasmToJs(
        instructionSdk.create_game_instance(newInstanceId, mapCfg)
      );
      await sendTransaction([ix]);
      // TODO: Confirm transaction went thorugh or abort!
      console.log("Game Instance: ", newInstanceId.toString());

      // Register ABs for Instance
      const kyogenId = process.env.NEXT_PUBLIC_KYOGEN_ID as string;
      const structuresId = process.env.NEXT_PUBLIC_KYOGEN_ID as string;
      await append_registry_index(
        connection,
        registrySdk,
        newInstanceId,
        kyogenId,
        structuresId,
        gameWallet
      );

      // Init Index for Structures
      const gameState = await sdkLoadGameState(newInstanceId);
      await init_structures_index(
        connection,
        gameState,
        structuresSdk,
        newInstanceId,
        gameWallet,
        mapCfg
      );

      // Mint Tokens into Structure Index
      await mint_spl(
        connection,
        structuresSdk,
        newInstanceId,
        gameWallet,
        mapCfg
      );

      // Init Map
      await init_map(
        connection,
        instructionSdk,
        newInstanceId,
        gameWallet,
        mapCfg
      );

      // Init Tiles
      await init_tiles(
        connection,
        instructionSdk,
        newInstanceId,
        gameWallet,
        mapCfg
      );
      // await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec

      // TODO: Init Structures
      await init_structures(
        connection,
        gameState,
        structuresSdk,
        newInstanceId,
        gameWallet,
        mapCfg
      );

      const ENDING_BALANCE = await connection.getBalance(gameWallet.publicKey);
      const SOL_COST =
        (STARTING_BALANCE - ENDING_BALANCE) / anchor.web3.LAMPORTS_PER_SOL;

      console.log(`Map Config took ${SOL_COST} SOL to deploy.`);
    } catch (err) {
      if (err instanceof Error) {
        setNotifications((notifications: any) => [
          ...notifications,
          {
            role: "danger",
            message: `Danger`,
          },
        ]);
      }
    } finally {
      setLoading(false);
      setSelectedMapConfig(mapCfg);
    }
  };

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
                        onChange={(e) => setMaxPlayers(Number(e.target.value))}
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
                        onChange={(e) =>
                          setMaxSolariteScore(Number(e.target.value))
                        }
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
                      <TextInput
                        // defaultValue={`${selectedMapConfig?.mapmeta?.max_x} x ${selectedMapConfig?.mapmeta?.max_y}`}
                        defaultValue={`${config.mapmeta.max_x} x ${config.mapmeta.max_y}`}
                        disabled
                        className="text-start h-full pl-3 font-millimetre"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full h-full flex justify-end items-end mb-2">
                  <PrimaryButton loading={loading} onClick={handleStartGame}>
                    Start Game
                  </PrimaryButton>
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

const NewPage = () => {
  return (
    <SdkLoader>
      <New />
    </SdkLoader>
  );
};

export default NewPage