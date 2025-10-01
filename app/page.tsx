"use client";
import { aeneid, StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { createWalletClient, custom, Hex } from "viem";
import Image from "next/image";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export default function Home() {
  const { login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();

  async function setupStoryClient(): Promise<StoryClient> {
    const wallet = wallets[0];
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
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={() => {
              handleRegisterTestIP();
            }}
          >
            <Image
              className="dark:invert"
              src="/ip-token-logo.png"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Register Test IP
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

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => (authenticated ? logout() : login())}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {authenticated && wallets.length > 0
              ? `Logged in: ${wallets[0].address}`
              : "Login"}
          </button>
          {authenticated && (
            <button
              onClick={() => logout()}
              className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors"
            >
              Logout
            </button>
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
