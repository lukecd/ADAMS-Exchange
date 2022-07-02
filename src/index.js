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
window.$adams_coin_contract = "0x23066f44A441421F6ACbB7dC17526a3FEC38e528";
window.$adams_staking_contract = "0x008B232AA9e238D5B9b6A599B9308c8D24F9fb2a";
window.$adams_vault_contract = "0xc00cf2bF83C72412113c4b64eb0001F58A1A7b26";
window.$adams_swap_contract = "0x81A4769E613d103F6A59AB330bf5bAD383d18efE";


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
