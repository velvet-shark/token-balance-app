import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";

import { useState } from "react";
import { ethers, utils } from "ethers";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  //State variables
  const [tokens, setTokens] = useState([]);
  const [address, setAddress] = useState("");
  const [eth, setEth] = useState("");
  const [history, setHistory] = useState([]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setAddress(address);
    fetchEth();
    fetchTokens()
      .then((data) => {
        setTokens(data);
      })
      .catch((err) => setTokens([]));
  };

  // Fetch tokens
  const fetchTokens = async () => {
    if (!utils.isAddress(address)) {
      alert("Please enter a valid Ethereum wallet address");
      return;
    }
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_QUICKNODE_RPC);
    const response = await provider.send("qn_getWalletTokenBalance", [
      {
        wallet: address,
        // contracts: []

        contracts: [
          "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //WETH
          "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
          "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", // MATIC
          "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
          "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
          "0xb24cd494faE4C180A89975F1328Eab2a7D5d8f11", // CODE
          "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72", // ENS
          "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", // BNB
          "0x4Fabb145d64652a948d72533023f6E7A623C7C53", // BUSD
          "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // stETH
          "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", // SHIB
          "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
          "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39", // HEX
          "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
          "0x4d224452801ACEd8B2F0aebE155379bb5D594381", // APE
          "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32", // LDO
          "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // AAVE
          "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2" // MKR
        ]
      }
    ]);
    // console.log(response.result);
    return response.result;
  };

  const fetchEth = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_QUICKNODE_RPC);
    // Fetch ETH balance
    const eth = await provider.send("eth_getBalance", [address, "latest"]);

    setEth(eth);
  };

  const tokenHistory = async (token) => {
    // console.log("Wallet: ", address);
    // console.log("Token: ", token);

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_QUICKNODE_RPC);

    const history = await provider.send("qn_getWalletTokenTransactions", [
      {
        address: address,
        contract: token,
        page: 1,
        perPage: 20
      }
    ]);
    // console.log(history);
    setHistory(history);
  };

  return (
    <>
      <Head>
        <title>Token Balance App</title>
        <meta name="description" content="Token balance app using QuickNode Token and NFT API v2 bundle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Token Balance App</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div class="space-y-12">
              <div class="border-b border-gray-900/10 pb-12">
                <div class="col-span-full">
                  <label for="street-address" class="block text-l font-medium leading-6 text-gray-900">
                    Enter your address here 🎯
                  </label>
                  <div class="mt-2">
                    <input
                      onChange={(e) => setAddress(e.target.value)}
                      type="text"
                      id="address"
                      size="50"
                      maxLength="50"
                      className="block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-l leading-6 p-3 mb-2"
                    />
                    <button
                      type="submit"
                      className="rounded-lg top-1 right-1 bottom-1 border w-48 text-sm justify-center bg-blue-400 text-white p-3 font-bold"
                    >
                      Show me the tokens!
                    </button>

                    {eth && (
                      <div className="block">
                        <div className="relative mt-10 text-black-900 bg-green-200 rounded inline-block px-4 py-2">
                          {/* ETH balance:&nbsp; <strong>{utils.formatEther(eth)}</strong> */}
                          ETH balance:&nbsp;
                          <strong>
                            {(parseInt(eth, 16) / 1e18).toLocaleString(undefined, { minimumFractionDigits: 4 })}
                          </strong>
                        </div>
                      </div>
                    )}

                    {history.paginatedItems?.length > 0 && (
                      <div className="relative overflow-x-auto justify-center w-full h-140 my-10 bg-teal-50 rounded px-4 py-2">
                        <h1 className="text-xl font-bold mb-2">
                          Transaction history for {history.token.name} ({history.token.symbol})
                        </h1>
                        <table className="min-w-full divide-y-4 divide-gray-200 text-sm">
                          <thead>
                            <tr>
                              <th className="whitespace-nowrap py-4 text-left font-bold text-gray-1000">
                                Block number
                              </th>
                              <th className="whitespace-nowrap py-4 text-left font-bold text-gray-900">
                                Transaction type
                              </th>
                              <th className="whitespace-nowrap py-4 text-left font-bold text-gray-900">Amount</th>
                              <th className="whitespace-nowrap py-4 text-left font-bold text-gray-900">Link</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {history.paginatedItems.map((item, index) => (
                              <tr key={index}>
                                <td className="py-4 whitespace-nowrap text-sm">{item.blockNumber}</td>
                                {/* <td className="py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                          <img
                                            className="h-10 w-10 rounded-full"
                                            src={`https://robohash.org/${item.address}?set=set1`}
                                            alt=""
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{item.address}</div>
                                        </div>
                                      </div>
                                    </td> */}

                                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.totalBalance > 0 ? "Received" : "Sent"}
                                </td>
                                <td className="py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {utils.formatUnits(item.totalBalance, item.decimals)}
                                  </div>
                                </td>
                                <td className="py-4 whitespace-nowrap text-sm text-blue-500">
                                  <a
                                    href={`https://etherscan.io/tx/${item.transactionHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    [View on Etherscan]
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {tokens.length > 0 && (
                      <div className="relative overflow-x-auto justify-center w-full h-140 mt-10 mb-10 bg-blue-50 rounded px-4 py-2">
                        <h1 className="text-3xl font-bold">Tokens</h1>
                        <table className="min-w-full divide-y-4 divide-gray-200 text-sm">
                          <thead>
                            <tr>
                              <th className="whitespace-nowrap py-4 text-left font-bold text-gray-1000">Name</th>
                              <th className="whitespace-nowrap py-4 text-left font-bold text-gray-900">Symbol</th>
                              <th className="whitespace-nowrap py-4 text-left font-bold text-gray-900">Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {tokens.map((token, index) => (
                              <tr key={index}>
                                {/* Check if token has a name */}
                                {token.name && (
                                  <>
                                    <td className="whitespace-nowrap font-bold py-4 text-blue-500">
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          tokenHistory(token.address);
                                        }}
                                        className="font-bold"
                                      >
                                        {token.name}
                                      </button>
                                    </td>
                                    <td className="whitespace-nowrap py-4 text-gray-900">{token.symbol}</td>
                                    <td className="whitespace-nowrap py-4 text-gray-900">
                                      {utils.formatUnits(token.totalBalance, token.decimals)}
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="p-4 text-center">
            <div>
              <a href="https://www.quicknode.com" className="text-blue-500">
                Powered by QuickNode
              </a>
              <br />
              <a href="https://github.com/velvet-shark/token-balance-app" className="text-blue-500">
                [ Source code on GitHub ]
              </a>
            </div>
          </div>
        </div>
      </main>

      <div className="h-screen w-screen justify-center space-x-3 ml-5"></div>
    </>
  );
}
