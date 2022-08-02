import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import ReactDOM from "react";
import { ArwesThemeProvider, Text, Button, FrameBox } from '@arwes/core';
import { ethers } from "ethers";
import Social from "../components/Social";

import adamsStakingABI from '../abi/AdamsStaking.json';
import adamsCoinABI from '../abi/AdamsCoin.json';

import ConnectWalletModal from "../components/ConnectWalletModal";
import GeneralModal from "../components/GeneralModal";

const Staking = () => {
    let [stakedAmount, setStakedAmount] = useState(0);
    let [dueAmount, setDueAmount] = useState(0);
    let [contractStaked, setContractStaked] = useState(0);
    let [walletAmount, setWalletAmount] = useState(0);
    let [amountToStake, setAmountToStake] = useState(0);
    let [hasApproved, setHasApproved] = useState(false);

    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [modalTitle, setModalTitle] = useState("");
    let [modalDescription, setModalDescription] = useState("");
    let [isCWOpen, setIsCWOpen] = useState(false);

    // staking provider for checking amount staked
    const stakingProvider = useProvider();
    const adamsStakingContractProvider = useContract({
      addressOrName: window.$adams_staking_contract,
      contractInterface: adamsStakingABI,
      signerOrProvider: stakingProvider,
    });

    const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
    // staking signer for staking
    const adamsStakingContractSigner = useContract({
      addressOrName: window.$adams_staking_contract,
      contractInterface: adamsStakingABI,
      signerOrProvider: signer,
    });

    // coin provider checking unstaked balance
    const coinProvider = useProvider();
    const adamsCoinContractProvider = useContract({
      addressOrName: window.$adams_coin_contract,
      contractInterface: adamsCoinABI,
      signerOrProvider: coinProvider,
    });

    // coin signer for approving swaps transactions
    const adamsCoinContractSigner = useContract({
      addressOrName: window.$adams_coin_contract,
      contractInterface: adamsCoinABI,
      signerOrProvider: signer,
    });    

    // called on page load
    useEffect(() => {
      // THINGS TO CALL
      // USER: 1: getAmountStaked 2: getTotalDue 3: get amount of ADAMS in wallet
      // CONTRACT: getTotalStaked
      // check if user has claimed rewards
      const checkStaked = async () => {
        await checkAmountStaked()
          .then( returnValue => {setStakedAmount(returnValue);})
          .catch(error => {console.log("checkStaked ", error)});
      };
      checkStaked();
      const checkDue = async () => {
        await checkAmountDue()
          .then( returnValue => {setDueAmount(returnValue);})
          .catch(error => {console.log("checkDue ", error)});
      };
      checkDue();
      const checkWallet = async () => {
        await checkWalletADAMSBalance()
          .then( returnValue => {setWalletAmount(returnValue); setAmountToStake(returnValue)})
          .catch(error => {console.log("checkWallet ", error)});
      };
      checkWallet();
      const checkContractTotal = async () => {
        await checkAmountStakedInContract()
          .then( returnValue => {setContractStaked(returnValue);})
          .catch(error => {console.log("checkContractTotal ", error)});
      };
      checkContractTotal();

      // figure out if we've approved yet
      const checkAllowance = async () => {
      await checkStakingApproved()
        .then( returnValue => {console.log("checkStakingApproved ", returnValue); setHasApproved(returnValue);})
        .catch(error => console.log(error));
      };
      checkAllowance();     
    }, []);

    /**
     * 
     * @returns The amount of ADAMS tokens currently staked
     */
    const checkAmountStaked = async () => {
      let amountStaked = await adamsStakingContractSigner.getAmountStaked();
      console.log("amountStaked by user1 ", amountStaked);

      amountStaked = ethers.utils.formatEther(amountStaked);
      console.log("amountStaked by user2 ", amountStaked);
      return amountStaked;
    }

    /**
     * 
     * @returns The amount of ADAMS tokens currently staked by the user
     */
     const checkAmountDue = async () => {
      let amountDue = await adamsStakingContractSigner.getTotalDue();
      amountDue = ethers.utils.formatEther(amountDue);
      console.log("amountDue to user ", amountDue);
      return amountDue;
    }

    /**
     * 
     * @returns The amount of ADAMS tokens held by the user in their wallet
     */
    const checkWalletADAMSBalance = async () => {
      if(!signer) return 0;
      let balance = await adamsCoinContractProvider.balanceOf(signer._address);
      balance = ethers.utils.formatEther(balance);

      return balance;  
    }

    /**
     * 
     * @returns The amount of ADAMS tokens currently staked in the contract
     */
     const checkAmountStakedInContract = async () => {
      let amountStaked = await adamsStakingContractProvider.getTotalStaked();
      amountStaked = ethers.utils.formatEther(amountStaked);
      console.log("checkAmountStakedInContract amountStaked in contract ", amountStaked);
      return amountStaked;
    }    

    /**
     * Main function. Stakes specified amount.
     */
    const stake = async () => {
      if(!signer) {
        setIsCWOpen(true);
      }
      else {
        // talk to contract
        const formattedStakeAmount = ethers.utils.parseEther(amountToStake);
        console.log("staking ", formattedStakeAmount);

        await adamsStakingContractSigner.stake(formattedStakeAmount)
          .then( returnValue => {checkWalletADAMSBalance();})
          .catch(error => showModal("Umm ...", error.reason))
      }
    }

    /**
     * Main function. Withdraws all.
     */
    const withdraw = async () => {
      if(!signer) {
        setIsCWOpen(true);
      }
      else {
        // talk to contract
        await adamsStakingContractSigner.withdraw()
          .then( returnValue => {checkWalletADAMSBalance();})
          .catch(error => showModal("Umm ...", error.reason))
      }
    }

    /**
     * 
     * @returns True if user has approved the staking contract to access funds
     */
     const checkStakingApproved = async () => {
      if(!signer) return false;
      let approvedBalance = await adamsCoinContractProvider.allowance(signer._address, window.$adams_staking_contract);
      approvedBalance = ethers.utils.formatEther(approvedBalance);
      
      console.log("approvedBalance ", approvedBalance);
      console.log("signer._address ", signer._address);
      return approvedBalance > 0;
    }

    /**
     * Approves the staking contract to access funds
     * NOTE: It seems like best practices are to just approve exactly what's needed
     * BUT, seems like most DEXs do a large blanket appoval (ethers.constants.MaxUint256)... so I'm going that way.
     */
    const approveAccess = async () => {
      console.log(`Approving ${window.$adams_staking_contract} to access ${ethers.constants.MaxUint256}`);
      await adamsCoinContractSigner.approve(window.$adams_staking_contract, ethers.constants.MaxUint256)
      .then( returnValue => {setHasApproved(true);})
      .catch(error => showModal("Umm ...", error.reason));
    }

     /**
     * Shows a modal dialog with the specified info
     * @param {*} title Of the modal
     * @param {*} reason Details of the modal
     */
      const showModal = async (title, reason) => {
        setModalTitle(title);
        //reason = reason.replace("execution reverted: ", "");
        setModalDescription(reason);
        setModalIsOpen(true);
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
                    <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Staking!</h1>
                
                <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                  Stake your ADAMS to earn 42% APR ... or leave it unstaked and win tax rewards.
                  Will you stake and stick with the know, or will you venture into the unknown? 
                  Staking you earn 42% and then we top it off by continuously compounding it for you. 
                  Rewards could earn you a lot more ... or could earn you nothing. It's a hard decision. 
                  Who knows, you may earn enough for a nice meal at <a className="underline decoration-[#d31a83]" href="https://en.wikipedia.org/wiki/The_Restaurant_at_the_End_of_the_Universe" rel="noreferrer" target="_blank">The Restaurant At The End Of The Universe.</a>
                    <p className="flex flex-row justify-end text-sm mr-2 mt-2">Total Staked In Contract: {contractStaked}</p>
                </h2>
              </div>

              <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                  <p className='bg-white text-black font-bold opacity-80 text-center'>
                      You  have {stakedAmount} ADAMS staked and {dueAmount} available to withdraw.
                      <br/>
                      { (walletAmount !=0 ) && (
                        <>You have {walletAmount} tokens available to stake.</>
                      )}
                      { (walletAmount ==0 ) && (
                        <>You don't have any unstaked ADAMS. Grab some <a className="underline decoration-[#d31a83]" href="https://goerlifaucet.com/" rel="noreferrer" target="_blank">Goerli ETH</a> and swap for ADAMS first. </>
                      )}
                  </p>
                  <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                    <ArwesThemeProvider>
                      <div className="flex items-center border-b border-teal-500 py-2">
                      <input type="number" value={amountToStake} onChange={(e) => setAmountToStake(e.target.value)} className="appearance-none border-[#d31a83] w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
                      { !hasApproved && (
                        <Button animator={{ animate: false }} onClick={approveAccess}>
                        <Text>Approve</Text>
                        </Button>
                      )}
                      { hasApproved && (
                        <>
                        <Button animator={{ animate: false }} onClick={stake}>
                        <Text>Stake</Text>
                        </Button>
                        </>
                      )}

                      </div>
                    </ArwesThemeProvider>
                  </div>
                  <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                    <ArwesThemeProvider>
                      <div className="flex items-center border-b border-teal-500 py-2">
                  
                      { hasApproved && (
                        <>
                        <Button animator={{ animate: false }} onClick={withdraw}>
                        <Text>Withdraw</Text>
                        </Button>
                        </>
                      )}

                      </div>
                    </ArwesThemeProvider>
                  </div>
              </div>
            </div>
        </div>

    </div> 
    </>
    );
};

export default Staking;
