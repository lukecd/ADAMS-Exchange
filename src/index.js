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
window.$adams_coin_contract = "0x005F065F00b12d4F1B2c9c98B3F1b28385A56254";
window.$adams_staking_contract = "0xC9f83D2d010dc887CE9D7cD2aCb2e5ea34b2eeBD";
window.$adams_vault_contract = "0xAFF2dFc45540864AA841CA18E96e710d06c8BCF5";
window.$adams_swap_contract = "0xe6d007d76b299C8E88eB2323148F84B2C6C25ac2";


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
