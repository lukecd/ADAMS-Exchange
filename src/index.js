import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home42 from "./pages/Home42";
import Swap from "./pages/Swap";
import FreeTokens from "./pages/FreeTokens";
import Staking from "./pages/Staking";
import ClaimRewards from "./pages/ClaimRewards";
import Navbar from "./components/Navbar";
import Orbiter from "./components/Orbiter";

import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


const { chains, provider } = configureChains(
    [chain.goerli],
    [
      alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'Adams Exchange',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  

// global variables
window.$adams_coin_contract = "0xAA75B2F0A38506EE5A42fF74241f44645508b72e";
window.$adams_staking_contract = "0x1c6BE1E04E78dae5D91F2b0d7E3455bBCAA3a851";
window.$adams_vault_contract = "0x8B517538168d8674f859b6a29C136F4DcA3e0EAa";
window.$adams_swap_contract = "0x3315e0Ca84565B1DF96931F385505F457d1A4fbe";


ReactDOM.render(
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <BrowserRouter>
          <div name='top' className='w-full h-view top-0'>
              <div className='flex flex-col w-full h-full z-0'>
                  <section className="wrapper">
                      <div className="stars"></div>
                      <div className="stars2"></div>
                      <div className="stars3"></div>
                  </section>
                  <Orbiter className='fixed'/>

                  <div className='absolute w-full h-full z-1 top-0'>
                      <Navbar />
                      <Routes>
                        <Route path="/" element={<Home42 />} />
                        <Route path="/free-tokens" element={<FreeTokens />} />
                        <Route path="/staking" element={<Staking />} />
                        <Route path="/swap" element={<Swap />} />
                        <Route path="/rewards" element={<ClaimRewards />} />
                      </Routes>
                  </div>
              </div>
          </div>
        </BrowserRouter>
    </RainbowKitProvider>
    </WagmiConfig>
    ,
    document.getElementById("root")
);
