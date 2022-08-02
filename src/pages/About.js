import React, { useState, useEffect, useCallback } from "react";
import { ArwesThemeProvider, Table, Text, Button, FrameBox } from '@arwes/core';
  

const About = () => {
   
    return (
    
          <div className='mt-[90px] w-screen h-screen text-white'>
            <div className='ml-2 mr-2 mt-20 flex flex-col justify-start items-start'>

                <div className='mt-20 w-full h-full'>
                  <div className='lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 text-left pb-2 border-[#d31a83]'>
                        <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>About!</h1>
                    
                    <h2 className='pl-10 pr-10 mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                    
                      Remember <a className="underline decoration-[#d31a83]" href="https://hitchhikers.fandom.com/wiki/Deep_Thought" rel="noreferrer" target="_blank">Deep Thought?</a> 
                    </h2>
                    <div className='mt-2 pl-10 pr-10 opacity-80 bg-white text-black'>
                    <p>The computer built to the answer to the Ultimate Question of Life, the Universe, and Everything. It designed the other supercomputer Earth, which was built by the Magratheans.</p>
                    <br/>
                    <p>Yeah, well it wasn't real. And neither is this site.</p>
                    <br/>
                    <p>I mean, this site is really here and it's really in front you. You're not hallucinating ... or if you are hallucinating, this website isn't part of that.
                    When I say this site isn't real, I mean don't use real money with it. Just play around with it using Goerli ETH on the 
                    Goerli Testnet. </p>
                    <br/>
                    <p>I built the site to teach myself ReactJS, Rainbow Kit and Solidity. </p>
                    <br/>
                    <p>You can check out <a className="underline decoration-[#d31a83]" href="https://github.com/lukecd/ADAMS-Exchange" rel="noreferrer" target="_blank">the sourcode for the UI here</a>, the <a className="underline decoration-[#d31a83]" href="https://github.com/lukecd/ADAMS-Coin" rel="noreferrer" target="_blank">sourcecode for the smart contracts here,</a> you can find 
                    on <a className="underline decoration-[#d31a83]" href="https://twitter.com/spaceagente" rel="noreferrer" target="_blank">Twitter here</a> and check out <a className="underline decoration-[#d31a83]" href="https://luke.gallery" rel="noreferrer" target="_blank">my portfolio here.</a> </p>
                    <br/>
                    <p>Got a cool project to work on together? Hit me up.</p>
                    </div>
                  </div>

        
                </div>
            </div>
          </div> 

    );
};

export default About;


<a className="underline decoration-[#d31a83]" href="" rel="noreferrer" target="_blank"></a>