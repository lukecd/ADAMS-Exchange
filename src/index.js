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
window.$adams_coin_contract = "0xb37C634bB7877Ce22c729Ff37075Eb18F42879f9";
window.$adams_staking_contract = "0x3ab6FcF1B4A87Dd246d6f75D6594B77EAA1fcAAC";
window.$adams_vault_contract = "0x725e78299d62bf230FD6BC3e0324C67119b6B503";
window.$adams_swap_contract = "0xC2A2150219148bC394cAA81Dc3e1e80e20c116Bc";


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
