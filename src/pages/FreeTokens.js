import React, { useState, useEffect, useCallback } from "react";
import Disclaimer from "../components/Disclaimer";
import { ArwesThemeProvider, Text, Button, FrameBox } from '@arwes/core';
import { useAccount, useContract, useContractEvent, useProvider, useSigner } from "wagmi";
import Social from "../components/Social";
import adamsVaultABI from '../abi/AdamsVault.json';
//export const adamsVaultABI = avABI;

const FreeTokens = () => {
    // contract addresses 
    const adamsCoinAddress = '0x87e128c6cD8Ffa3d8409187DE25CaBCaac1e2EF5';
    const adamsVaultAddress = '0xa20e128fFec6F8A59eF0C507901855cE9dB4279B';

    // provider for checking if user has claimed rewards
    const provider = useProvider();
    const adamsVaultContractProvider = useContract({
      addressOrName: adamsVaultAddress,
      contractInterface: adamsVaultABI,
      signerOrProvider: provider,
    });

    // signer for claiming rewards
    const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
    console.log("FreeTokens signer ", signer);
    
    const adamsVaultContractSigner = useContract({
      addressOrName: adamsVaultAddress,
      contractInterface: adamsVaultABI,
      signerOrProvider: signer,
    });

    // state mgmt
    const [hasClaimed, setHasClaimed] = useState(false);

    // checks is a user has already claimed tokens
    // TODO: always returns false. not sure why.
    const checkContractHasClaimed = async() => {
      const hasClaimed = await adamsVaultContractProvider.hasClaimedDistribution();
      console.log("hasClaimed ", hasClaimed);
      return hasClaimed;
    }

    useEffect(() => {
      console.log("check if user has claimed rewards");
      const checker = async () => {
        await checkContractHasClaimed()
          .then( returnValue => {setHasClaimed(returnValue); console.log("checked if has claimed ", returnValue)})
          .catch(error => console.log(error));
      };
      checker();
    }, []);

    const claimTokens = async () => {
        // talk to contract
        await adamsVaultContractSigner.claimDistribution()
          .then( returnValue => {setHasClaimed(true)})
          .catch(error => console.log(error));

    }

    return (
       <div className='mt-[90px] w-screen h-screen text-white'>
            <div className='ml-10 mr-10 mt-40 flex flex-col justify-start items-start'>

                <div className='mt-20 w-full h-full'>
                  <div className='lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 text-left pb-2 pl-4 border-[#d31a83]'>
                        <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Free ADAMS For All!</h1>
                    
                    <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                      Adams's Coin is more fun when more people have it.
                      Want some free coins? Connect your wallet and click below for 4,200 free coins. 
                      /
                      You've already claimed your tokens.
                    </h2>
                  </div>

                  <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                      <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                        <ArwesThemeProvider>
                          {hasClaimed && (
                          <Text>You already got yours.</Text>
                          )}
                          {!hasClaimed && (
                          <Button animator={{ animate: false }} onClick={claimTokens}>
                            <Text>Claim Free Tokens</Text>
                          </Button>
                          )}
                        </ArwesThemeProvider>
                      </div>
                  </div>
                </div>
            </div>
            <Social />
        </div>
    );
};

export default FreeTokens;
