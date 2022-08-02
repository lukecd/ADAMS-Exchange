import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import Social from "../components/Social";
import { ArwesThemeProvider, Table, Text, Button, FrameBox } from '@arwes/core';
  
import adamsCoinABI from '../abi/AdamsCoin.json';

import ConnectWalletModal from "../components/ConnectWalletModal";
import GeneralModal from "../components/GeneralModal";

const ClaimRewards = () => {
    const [rewardsAvailable, setRewardsAvailable] = useState(0);
    const [hasRewardsAvailable, setHasRewardsAvailable] = useState(false);
    const [awardAddresses, setAwardAddresses] = useState([]);
    const [awardAmounts, setAwardAmounts] = useState([]);

    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [modalTitle, setModalTitle] = useState("");
    let [modalDescription, setModalDescription] = useState("");
    let [isCWOpen, setIsCWOpen] = useState(false);

    // coin provider for checking rewards
    const coinProvider = useProvider();
    const adamsCoinContractProvider = useContract({
      addressOrName: window.$adams_coin_contract,
      contractInterface: adamsCoinABI,
      signerOrProvider: coinProvider,
    });

    const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
    // coin signer for approving claim rewards transactions
    const adamsCoinContractSigner = useContract({
      addressOrName: window.$adams_coin_contract,
      contractInterface: adamsCoinABI,
      signerOrProvider: signer,
    });

    /**
     * @notice Main function for this page, claims all available rewards.
     */
    const claimRewards = async () => {
      console.log("claimRewards");
      // talk to contract
      await adamsCoinContractSigner.claimRewards({gasLimit: 100000})
        .then( returnValue => {setRewardsAvailable(false); setRewardsAvailable(0)})
        .catch(error => console.log(error));
    }

    // called on page load
    useEffect(() => {
      // check if user has claimed rewards
      const checkHasRewards = async () => {
        await checkContractHasRewards()
          .then( returnValue => {setRewardsAvailable(returnValue); setHasRewardsAvailable(returnValue != 0)})
          .catch(error => {setRewardsAvailable(0); console.log(error)});
      };
      checkHasRewards();

      // set all available rewards as state variables
      const setAvailableRewards = async () => {
        await setAvailbleRewardsAsState()
          .then()
          .catch(error => {setRewardsAvailable(0); console.log(error)});
      };
      setAvailableRewards();

    }, []);

    /**
     * 
     * @returns true / false indicating if the logged in user has rewards availble for claiming
     */
    const checkContractHasRewards = async() => {
      console.log("rewardsAvailable ", signer._address);
      let rewardsAvailable = await adamsCoinContractSigner.checkRewards();
      console.log("rewardsAvailable ", rewardsAvailable);
      rewardsAvailable = ethers.utils.formatEther(rewardsAvailable);
      console.log("rewardsAvailable ", rewardsAvailable);
      return rewardsAvailable;
    }

    /**
     * Queries the blockchain for available rewards and sets as state variables
     * The contract returns two parallel arrays, one containing the addresses of 
     * all wallets with rewards and one containing the awards
     */
    const setAvailbleRewardsAsState = async () => {
      const getAllAvailableRewards = await adamsCoinContractProvider.getAllAvailableRewards();
      const {0: addresses, 1: rewards} = getAllAvailableRewards;
      // just set the addresses, they're basically strings
      setAwardAddresses(addresses);
      // award amounts are big numbers, need to convert first
      let covertedAwards = [];
      for(let i=0; i<rewards.length; i++) {
        covertedAwards.push(ethers.utils.formatEther(rewards[i]));
      }
      console.log("covertedAwards", covertedAwards);
      setAwardAmounts(covertedAwards);
    }

    return (
      <>
      <ConnectWalletModal
        open={isCWOpen}
        onClose={setIsCWOpen}
      />
      <GeneralModal
        open={modalIsOpen}
        onClose={setModalIsOpen}
        modalTitle={modalTitle}
        modalDescription={modalDescription}
      /> 
          <div className='mt-[90px] w-screen h-screen text-white'>
            <div className='ml-2 mr-2 mt-20 flex flex-col justify-start items-start'>

                <div className='mt-20 w-full h-full'>
                  <div className='lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 text-left pb-2 border-[#d31a83]'>
                        <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Rewards!</h1>
                    
                    <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                      Rewards are the heart of ADAMS Coin. We tax each swap 42% and then give all of that to a random person. It's like Oprah, but for nerds.
                    </h2>
                  </div>

                  <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                      <p className='bg-white text-black font-bold opacity-80 text-center'>
                        {hasRewardsAvailable && (
                          <>
                          You currently have {rewardsAvailable} rewards available for claiming.
                          </>
                        )}
                         {!hasRewardsAvailable && (
                          <>
                          You haven't earned any rewards yet. Try grabbing some <a className="underline decoration-[#d31a83]" href="https://goerlifaucet.com/" rel="noreferrer" target="_blank">Goerli ETH</a> and swapping. 
                          </>
                        )}
    
                      </p>

                      <div className="w-full mt-3 flex flex-row justify-end justify-items-end">
                        <ArwesThemeProvider>
                        {hasRewardsAvailable && (
                          <Button animator={{ animate: false }} onClick={claimRewards}>
                            <Text>Claim Rewards</Text>
                          </Button>
                        )}
                        </ArwesThemeProvider>
                      </div>
                      <div className="w-full mt-3 flex flex-col justify-center justify-items-end">
                      <p className='bg-white text-black font-bold opacity-80 text-center'>Unclaimed Rewards</p>
                      <table className="bg-white text-black opacity-80 table-auto ">
                        <thead>
                          <tr>
                            <th>Wallet</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                            {awardAddresses.map((address, i) => <tr><td>{address}</td><td>{awardAmounts[i]}</td></tr>)}
                        </tbody>
                      </table>
                  </div>

                  </div>

                </div>
            </div>
 
          </div> 
      </>
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