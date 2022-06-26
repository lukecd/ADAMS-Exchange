
import React, { FC, useState, useEffect } from 'react';
import { ArwesThemeProvider,  Blockquote, FrameBox } from '@arwes/core';
import Disclaimer from '../components/Disclaimer';
import Social
 from '../components/Social';
const Home42 = () => {
    const [activate, setActivate] = React.useState(true);

    const testENV = () => {
        console.log("window.$adams_coin_contract ", window.$adams_coin_contract);

    }
    testENV();

    return (
        <div className='mt-[90px] w-screen h-screen text-white'>
            <div className='ml-2 mr-2 mt-20 flex flex-col justify-start items-start'>

                <div className='mt-20 w-full h-full'>
    
                        <div className='lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 text-left pb-2 pl-4 border-[#d31a83]'>
                            <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Adams Coin ...</h1>
                            
                        <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                            If "42" is the answer to the “ultimate question of life, the universe, and everything, 
                            then perhaps the question is "what random and unexpected thing will happen to me today?". 
                            In the spirit of Life, The Universe and Everything, here is Adams coin.  
                        </h2>
                        </div>
 
                        <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20'>
                            <p className='bg-white text-black font-bold opacity-80 text-center'>Each token transfer is taxed 42% and then that tax is randomly given to one account holder. </p>

                            <div className="w-full mr-3 mt-3 leading-6 bg-white text-black opacity-80">
                                <ol className='mt-2 list-decimal ml-9 '>
                                <li>The contract owner can never win.</li>
                                <li>10 % of the time, there is a non-weighted distribution. Each wallet has an equal chance of winning, regardless of their token balance.</li>
                                <li>90% of the time there is a weighted distribution. Each token owned increases your chance of winning.</li>
                                </ol>
                            </div>
                        </div>
        
                </div>
                
            </div>
            <Social />
        </div>
     
    )
};

export default Home42;
