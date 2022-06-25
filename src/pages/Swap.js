import React from "react";
import ReactDOM from "react";
import { useState } from 'react';
import { ArwesThemeProvider, Text, Button, FrameBox } from '@arwes/core';
import Disclaimer from "../components/Disclaimer";
import Social from "../components/Social";
import { MdSwapCalls }  from 'react-icons/md';

const AdamsSwap = () => {
    const [token0, setToken0] = useState("42");
    const [token1, setToken1] = useState("42");
    const [gorToADAMS, setGorToADAMS] = useState(true);
    const swap = () => {
        // talk to cotnract
        alert('go swap');
    }

    const swapTokens = () => {
      setGorToADAMS(!gorToADAMS);
    }
    return (
      <div className='mt-[90px] w-screen h-screen text-white'>
          <div className='ml-10 mr-10 mt-40 flex flex-col justify-start items-start'>

              <div className='mt-20 w-full h-full'>
                <div className='lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 text-left pb-2 pl-4 border-[#d31a83]'>
                      <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Swap!</h1>
                  
                  <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                    Swap <a className="underline decoration-[#d31a83]" href="https://goerlifaucet.com/" rel="noreferrer" target="_blank">Goerli ETH</a> for ADAMS, pay the tax and see who gets it. Maybe you'll get it, maybe someone else will.
                    Hold on to your ADAMS, the more you have, the better your chance of winning the tax is.
                    
                  </h2>
                </div>

                <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                    <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                  
                        <div className="flex flex-col justify-start">
                          <MdSwapCalls className="text-4xl" onClick={swapTokens}/>
                        </div>
                        <div>
                        <div className="flex flex-row justify-end mx-5 my-1">
                          <h1 className="px-5 font-bold">
                          {gorToADAMS && (
                            <>GOR</>
                          )}
                           {!gorToADAMS && (
                            <>ADAMS</>
                          )}                         
                          </h1>
                          <input type="number" value={token0} onChange={(e) => setToken0(e.target.value)} className="appearance-none border-[#d31a83] w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
                        </div>
                        <div className="flex flex-row justify-end mx-5 my-1">
                          <h1 className="px-5 font-bold">
                          {gorToADAMS && (
                            <>ADAMS</>
                          )}
                           {!gorToADAMS && (
                            <>GOR</>
                          )}   
                          </h1>
                          <input type="number" value={token1} onChange={(e) => setToken1(e.target.value)} className="appearance-none border-[#d31a83] w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
                        </div>
                        
                        <div className="flex flex-row justify-end ">
                          <ArwesThemeProvider>
                            <Button animator={{ animate: false }} onClick={swap}>
                              <Text>Swap</Text>
                            </Button>
                          </ArwesThemeProvider>
                        </div> 
                      </div>
                    </div>    
                </div>
              </div>
          </div>
          <Social />
      </div>            
    );
};

export default AdamsSwap;
