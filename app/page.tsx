"use client";
import { aeneid, StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { createWalletClient, custom, Hex } from "viem";
import Image from "next/image";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState } from "react";

export default function Home() {
  const { login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [isLoading, setIsLoading] = useState(false);
  const [registeredIPId, setRegisteredIPId] = useState<`0x${string}` | null>(
    null
  );
  console.log(wallets);

  async function setupStoryClient(): Promise<StoryClient> {
    const wallet = wallets[0];
    await wallet.switchChain(aeneid.id);
    const provider = await wallet.getEthereumProvider();
    const walletClient = createWalletClient({
      account: wallet.address as Hex,
      chain: aeneid,
      transport: custom(provider),
    });

    const config: StoryConfig = {
      wallet: walletClient,
      transport: custom(walletClient.transport),
      chainId: "aeneid",
    };
    const client = StoryClient.newClient(config);
    return client;
  }

  const handleRegisterTestIP = async () => {
    try {
      setIsLoading(true);
      setRegisteredIPId(null);
      const client = await setupStoryClient();
      const response = await client.ipAsset.registerIpAsset({
        nft: {
          type: "mint",
          spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc",
        },
        ipMetadata: {
          ipMetadataURI:
            "https://ipfs.io/ipfs/QmReVXv6nAFqw3o2gkWk6Ag51MyfFJV3XxAF9puyga2j8s",
          ipMetadataHash:
            "0x018a895030842946f4bd1911f1658dc6c811f53fae70c1609cc1727047315fa4",
          nftMetadataURI:
            "https://ipfs.io/ipfs/QmWQmJYqshh3SVQ6Yv8PnN4paN6QEDq2tmW17PQ6NybnZR",
          nftMetadataHash:
            "0x41a4d1aded5525a12fd2c1ee353712e9e980535651eb20c6b6ff151c5eecd590",
        },
      });
      console.log(
        `Root IPA created at tx hash ${response.txHash}, IPA ID: ${response.ipId}`
      );
      setRegisteredIPId(response.ipId as `0x${string}`);
    } catch (error) {
      console.error("Error registering IP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/story-logo.svg"
          alt="Story logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto ${
              authenticated && wallets.length > 0 && !isLoading
                ? "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
            }`}
            onClick={() => {
              if (authenticated && wallets.length > 0 && !isLoading) {
                handleRegisterTestIP();
              }
            }}
            disabled={!authenticated || wallets.length === 0 || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <Image
                className="dark:invert"
                src="/ip-token-logo.png"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
            )}
            {isLoading ? "Registering..." : "Register Test IP"}
          </button>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://docs.story.foundation"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Wallet Status
            </div>
            {authenticated && wallets.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                  {wallets[0].address}
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
              >
                Login to continue
              </button>
            )}
          </div>

          {registeredIPId && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                IP Asset Registered
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                Successfully registered IP Asset. It usually takes ~10 seconds
                to load.
              </div>
              <a
                href={`https://aeneid.explorer.story.foundation/ipa/${registeredIPId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors underline"
              >
                View on Explorer →
              </a>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://story.foundation"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to story.foundation →
        </a>
      </footer>
    </div>
  );
}
