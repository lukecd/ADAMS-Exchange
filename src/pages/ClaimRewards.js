import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import Social from "../components/Social";
import Disclaimer from "../components/Disclaimer";
import { ArwesThemeProvider, Table, Text, Button, FrameBox } from '@arwes/core';
  
import adamsCoinABI from '../abi/AdamsCoin.json';

const ClaimRewards = () => {
    const adamsCoinAddress = '0x87e128c6cD8Ffa3d8409187DE25CaBCaac1e2EF5';
    const [rewardsAvailable, setRewardsAvailable] = useState('');

    // provider for checking if user has claimed rewards
    const provider = useProvider();
    console.log("ClaimRewards provider ", provider);
    const adamsCoinContractProvider = useContract({
      addressOrName: adamsCoinAddress,
      contractInterface: adamsCoinABI,
      signerOrProvider: provider,
    });

    // signer for claiming rewards
    const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
    const adamsCoinContractSigner = useContract({
      addressOrName: adamsCoinAddress,
      contractInterface: adamsCoinABI,
      signerOrProvider: signer,
    });

    const claimRewards = async () => {
      // talk to contract
      await adamsCoinContractSigner.claimRewards()
        .then( returnValue => {setRewardsAvailable(0)})
        .catch(error => console.log(error));
    }

    // checks if user has rewards available for claiming
    const checkContractHasRewards = async() => {
      let rewardsAvailable = await adamsCoinContractProvider.checkRewards('0xcb082454a4D41cc44F031600A5F3bc00Ae66Fc6f');
      console.log("rewardsAvailable ", rewardsAvailable);
      rewardsAvailable = ethers.utils.formatEther(rewardsAvailable);
      console.log("rewardsAvailable ", rewardsAvailable);
      return rewardsAvailable;
    }

    useEffect(() => {
      console.log("check if user has claimed rewards");
      const checker = async () => {
        await checkContractHasRewards()
          .then( returnValue => {setRewardsAvailable(returnValue); console.log("checked if has rewards ", returnValue)})
          .catch(error => {setRewardsAvailable(0); console.log(error)});
      };
      checker();
    }, []);

    return (
          <div className='mt-[90px] w-screen h-screen text-white'>
            <div className='ml-2 mr-2 mt-20 flex flex-col justify-start items-start'>

                <div className='mt-20 w-full h-full'>
                  <div className='lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 text-left pb-2 pl-4 border-[#d31a83]'>
                        <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Rewards!</h1>
                    
                    <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                      Rewards are the heart of ADAMS Coin. We tax each swap 42% and then give all of that to a random person. It's like Oprah, but for nerds.
                    </h2>
                  </div>

                  <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                      <p className='bg-white text-black font-bold opacity-80 text-center'>
                        You currently have ____ rewards available for claiming.
                        /
                        You haven't earned any rewards yet. Try grabbing some <a className="underline decoration-[#d31a83]" href="https://goerlifaucet.com/" rel="noreferrer" target="_blank">Goerli ETH</a> and swapping. 
                      </p>

                      <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                        <ArwesThemeProvider>
                        
                          <Button animator={{ animate: false }} onClick={claimRewards}>
                            <Text>Claim Rewards</Text>
                          </Button>
        
                        </ArwesThemeProvider>
                      </div>
                  </div>
                </div>
            </div>
            <Social />
          </div> 
    );
};

export default ClaimRewards;


/**

    const _generateRandomText = () => {
      return '0x8a7D9289Ee4FF2A9C8af60D2eea1007147F454C7';
    }
    const headers = [
      { id: 'a', data: 'Wallet ID' },
      { id: 'b', data: 'Reward Amount' }
    ];
    const dataset = Array(10).fill(0).map((_, index) => ({
      id: index,
      columns: [
        { id: 'p', data: '0x8a7D9289Ee4FF2A9C8af60D2eea1007147F454C7' },
        { id: 'q', data: '42000' }
      ]
    }));

 * 
 * <FrameBox className="adamsFrameBox" animator={{ animate: false }}>

                  <p><h1>These Lucky People Need To Come Claim Their ADAMS!</h1></p>

               <Table animator={{ animate: false }} headers={headers} dataset={dataset}/>
            </FrameBox>
 */