'use client';

import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { useTWBreakpoint } from '../hooks/useTailwindMediaQuery';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const Navbar = () => {
  const isLg = useTWBreakpoint('lg');

  return (
    <nav className="flex flex-wrap items-center justify-between bg-indigo-500 p-6">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <Link href="/">
          <span className="text-xl font-semibold tracking-tight">Kyogen Clash</span>
        </Link>
      </div>
      <Menu>
        {({ open }) => (
          <>
            <div className="block lg:hidden">
              <Menu.Button className="flex h-[30px] w-[38px] items-center justify-center rounded border border-white px-3 py-2 text-white hover:border-opacity-50 hover:text-opacity-50">
                {open ? (
                  <p className="text-base">&times;</p>
                ) : (
                  <svg
                    className="h-3 w-3 fill-current"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                  </svg>
                )}
              </Menu.Button>
            </div>
            <Menu.Items
              className="block w-full flex-grow lg:flex lg:w-auto lg:items-center lg:justify-end"
              static={isLg}
            >
              <Menu.Item>
                <div className="mr-4">
                  <WalletMultiButton />
                </div>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href="/games"
                  className="mt-4 block text-right text-white hover:text-opacity-50 lg:mr-4 lg:mt-0 lg:inline-block"
                >
                  Games
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href="/games/new"
                  className="mt-4 block text-right text-white hover:text-opacity-50 lg:mr-4 lg:mt-0 lg:inline-block"
                >
                  New Game
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href="/fundWallet"
                  className="mt-4 block text-right text-white hover:text-opacity-50 lg:mr-4 lg:mt-0 lg:inline-block"
                >
                  Fund Game Wallet
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href="/meetTheClans"
                  className="mt-4 block text-right text-white hover:text-opacity-50 lg:mr-4 lg:mt-0 lg:inline-block"
                >
                  Meet The Clans
                </Link>
              </Menu.Item>
            </Menu.Items>
          </>
        )}
      </Menu>
    </nav>
  );
};
