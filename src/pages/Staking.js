import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import ReactDOM from "react";
import { ArwesThemeProvider, Text, Button, FrameBox } from '@arwes/core';
import Disclaimer from "../components/Disclaimer";

import adamsCoinABI from '../abi/AdamsCoin.json';
import Social from "../components/Social";


const Staking = () => {
    const adamsCoinAddress = '0x87e128c6cD8Ffa3d8409187DE25CaBCaac1e2EF5';
    const adamsStakingAddress = 'TODO';
    
    const [stakingAmount, setStakingAmount] = useState("42");

    const stake = () => {
        alert('go stake');
    }

    

    return (
      <div className='mt-[90px] w-screen h-screen text-white'>
            <div className='ml-2 mr-2 mt-20 flex flex-col justify-start items-start'>

            <div className='mt-20 w-full h-full'>
              <div className='lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 text-left pb-2 border-[#d31a83]'>
                    <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Staking!</h1>
                
                <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                  Stake your ADAMS to earn 42% APR.
                  But you actually get more, because we continuously compound it for you. Go ahead stake some,
                  who knows, you may earn enough for a nice meal at The Restaurant At The End Of The Universe.
                </h2>
              </div>

              <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                  <p className='bg-white text-black font-bold opacity-80 text-center'>
                      You currently have ____ ADAMS staked.
                      /
                      You currently have ____ rewards available to stake.
                      /
                      You don't have any unstaked ADAMS. Grab some <a className="underline decoration-[#d31a83]" href="https://goerlifaucet.com/" rel="noreferrer" target="_blank">Goerli ETH</a> and swap for ADAMS first. 
                </p>
                  <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                    <ArwesThemeProvider>
                      <form>
                      <div className="flex items-center border-b border-teal-500 py-2">
                      <input type="number" value={stakingAmount} onChange={(e) => setStakingAmount(e.target.value)} className="appearance-none border-[#d31a83] w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
                      <Button animator={{ animate: false }} onClick={stake}>
                         <Text>Stake</Text>
                      </Button>
                      </div>
                      </form>
                    </ArwesThemeProvider>
                  </div>
              </div>
            </div>
        </div>
        <Social />
    </div> 
    );
};

export default Staking;
