import React from "react";
import ReactDOM from "react";
import { useState, useEffect } from 'react';
import { ArwesThemeProvider, Text, Button, FrameBox } from '@arwes/core';
import { useBalance, useAccount, useContract, useContractEvent, useProvider, useSigner } from "wagmi";

import { BigNumber, ethers } from "ethers";
import Social from "../components/Social";
import { MdSwapCalls }  from 'react-icons/md';

import adamsSwapABI from '../abi/AdamsSwap.json';
import adamsCoinABI from '../abi/AdamsCoin.json';

import ConnectWalletModal from "../components/ConnectWalletModal";
import GeneralModal from "../components/GeneralModal";

const AdamsSwap = () => {
    const [token0, setToken0] = useState();
    const [token1, setToken1] = useState();
    const [swapGorToAdams, setSwapGorToAdams] = useState(true);
    const [gorBalanceContract, setGorBalanceContract] = useState(0);
    const [adamsBalanceContract, setAdamsBalanceContract] = useState(0);
    const [gorBalanceUser, setGorBalanceUser] = useState(0);
    const [adamsBalanceUser, setAdamsBalanceUser] = useState(0);
    const [hasApproved, setHasApproved] = useState(false);

    const [ethPrice, setETHPrice] = useState(0);


    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [modalTitle, setModalTitle] = useState("");
    let [modalDescription, setModalDescription] = useState("");
    let [isCWOpen, setIsCWOpen] = useState(false);

    // provider for figuring out the GOR balance of the Swap contract
    // I tried using the useBalance() wagmi hook, but it didn't work. 
    // Going this way instead
    const gorProvider = ethers.getDefaultProvider('goerli')

    // swap provider for reading
    const swapProvider = useProvider();
    const adamsSwapContractProvider = useContract({
      addressOrName: window.$adams_swap_contract,
      contractInterface: adamsSwapABI,
      signerOrProvider: swapProvider,
    });

    // coin provider for reading
    const coinProvider = useProvider();
    const adamsCoinContractProvider = useContract({
      addressOrName: window.$adams_coin_contract,
      contractInterface: adamsCoinABI,
      signerOrProvider: coinProvider,
    });

    const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
    // swap signer for submitting transactions
    const adamsSwapContractSigner = useContract({
      addressOrName: window.$adams_swap_contract,
      contractInterface: adamsSwapABI,
      signerOrProvider: signer,
    });

    // coin signer for approving swaps transactions
    const adamsCoinContractSigner = useContract({
      addressOrName: window.$adams_coin_contract,
      contractInterface: adamsCoinABI,
      signerOrProvider: signer,
    });

    // called on page load. 
    // a lot happens, so i broke it all down into separate function calls to make it easier to read
    // but now i'm wondering if i should move some of that into a utils file. 
    useEffect(() => {
      // set gor / adams balances held by swap contract
      const checkAdams = async () => {
        await getContractAdamsBalance()
          .then( returnValue => {setAdamsBalanceContract(returnValue);})
          .catch(error => console.log(error));
      };
      checkAdams();
      const checkGor = async () => {
        await getContractGorBalance()
          .then( returnValue => {setGorBalanceContract(returnValue);})
          .catch(error => console.log(error));
      };
      checkGor();

      //next set user's balances
      const checkAdamsUser = async () => {
        await getUserAdamsBalance()
          .then( returnValue => {setAdamsBalanceUser(returnValue); })
          .catch(error => console.log(error));
      };
      checkAdamsUser();

      const checkGorUser = async () => {
        await getUserGorBalance()
          .then( returnValue => {setGorBalanceUser(returnValue);})
          .catch(error => console.log(error));
      };
      checkGorUser();
      
      // set token0 based on the value of swapGorToAdams
      if(swapGorToAdams) setToken0(gorBalanceUser);
      else setToken0(adamsBalanceUser);

      // figure out if we've approved yet
      const checkAllowance = async () => {
        await checkSwapApproved()
          .then( returnValue => {setHasApproved(returnValue);})
          .catch(error => console.log(error));
        };
        checkAllowance();  

      // get the current ETH price so we can estimate current ADAMS price
      const checkETH = async () => {
        await getEthPrice()
          .then( returnValue => {setETHPrice(returnValue);})
          .catch(error => console.log(error));
      };
      checkETH();    
    }, []);

    /**
     * Shows a modal dialog with the specified info
     * @param {*} title Of the modal
     * @param {*} reason Details of the modal
     */
     const showModal = async (title, reason) => {
      console.log("showModal ", reason);
      setModalTitle(title);
      //if(reason.indexOf("execution reverted") !== -1) reason = reason.replace("execution reverted: ", "");
      setModalDescription(reason);
      setModalIsOpen(true);
    }

    /**
     * Queries the ADAMS Coin contract for the ADAMS balance held by the logged in wallet
     */
    const getUserAdamsBalance = async () => {
      if(!signer) return 0;
      let balance = await adamsCoinContractProvider.balanceOf(signer._address);
      balance = ethers.utils.formatEther(balance);

      return balance;  
    }

    /**
     * Queries the default provider contract for the GOR balance held by the logged in wallet
     */
     const getUserGorBalance = async () => {
      if(!signer) return 0;
      let balance = await gorProvider.getBalance(signer._address);
      balance = ethers.utils.formatEther(balance)

      return balance;  
    }

    /**
     * Queries the swap contract for the current GOR balance
     */
     const getContractAdamsBalance = async () => {
      let balance = await adamsSwapContractProvider.getReserve();
      balance = ethers.utils.formatEther(balance)
      return balance;  
    }

    /**
     * Queries the swap contract for the current GOR balance
     */
     const getContractGorBalance = async () => {
      let balance = await gorProvider.getBalance(window.$adams_swap_contract);
      balance = ethers.utils.formatEther(balance)
      return balance;  
    }    

    /**
     * 
     * @returns True if user has approved the swap contract to access funds
     */
     const checkSwapApproved = async () => {
      if(!signer) return false;
      let approvedBalance = await adamsCoinContractProvider.allowance(signer._address, window.$adams_swap_contract);
      approvedBalance = ethers.utils.formatEther(approvedBalance);
      console.log("approvedBalance ", approvedBalance)
      return approvedBalance > 0;
    }

    /**
     * Queries the coingecko API to get ETH price, used to show ADAMS price in USD
     */
    const getEthPrice = async () => {
      const queryURL = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD";
      const response = await fetch(queryURL);
      let actualData = await response.json();

      return actualData.ethereum.usd;
    }

    /**
     * Queries the swap contract to get the estiamted amount of GOR received 
     * after swapping the amount of ADAMS shown in the UI.
     * @param shouldFormat true to format the value into an easily readible format, false to leave as is
     */
    const getEstimatedGorForAdams = async (shouldFormat) => {
      // getAmountOfTokens takes (uint256 inputAmount, uint256 inputReserve, uint256 outputReserve)
      // when swapping ADAMS for GOR we use the following values
      // inputAmount = amount of ADAMS we want to swap
      // inputReserve = ADAMS balance of Swap Contract
      // outputReserve = ETH balance of Swap Contract
      const inputAmount = ethers.utils.parseEther(token0);
      const inputReserve = ethers.utils.parseEther(adamsBalanceContract);
      const outputReserve = ethers.utils.parseEther(gorBalanceContract);
      const amountOfTokens = await adamsSwapContractProvider.getAmountOfTokens(inputAmount, inputReserve, outputReserve)
      if(shouldFormat) return ethers.utils.formatEther(amountOfTokens);
      else return amountOfTokens;     
    }

    /**
     * Queries the swap contract to get the estiamted amount of ADAMS received 
     * after swapping the amount of GOR shown in the UI.
     * @param shouldFormat true to format the value into an easily readible format, false to leave as is
     */
    const getEstimatedAdamsForGor = async (shouldFormat) => {
      // getAmountOfTokens takes (uint256 inputAmount, uint256 inputReserve, uint256 outputReserve)
      // when swapping GOR for ADAMS we use the following values
      // inputAmount = amount of ETH we want to swap
      // inputReserve = ETH balance of Swap Contract
      // outputReserve = ADAMS balance of Swap Contract
      const inputAmount = ethers.utils.parseEther(token0);
      const inputReserve = ethers.utils.parseEther(gorBalanceContract);
      const outputReserve = ethers.utils.parseEther(adamsBalanceContract);
      const amountOfTokens = await adamsSwapContractProvider.getAmountOfTokens(inputAmount, inputReserve, outputReserve)
      if(shouldFormat) return ethers.utils.formatEther(amountOfTokens);
      else return amountOfTokens;
    }

    /**
     * Updates the value of token1 to show the estimated amount of GOR / ADAMS received given the value of token0
     */
    const setSwapResult = async () => {
      // always check if we're connected before interacting with the contract
      if(signer) {
        if(swapGorToAdams) {
          const gorForAdams = await getEstimatedAdamsForGor(true);
          setToken1(gorForAdams);
        }
        else {
          // first get estimated swap amount
          const adamsForGor = await getEstimatedGorForAdams(true);
          setToken1(adamsForGor);
        }
      }
    }

    /**
     * The main function of this page, swaps GOR <=> ADAMS
     * 
     */
    const swap = async () => {
      // first check if the wallet is connected
      if(!signer) {
        setIsCWOpen(true);
        return;
      }
      if(swapGorToAdams) {
        const amountOfTokens = await getEstimatedAdamsForGor(false);
        await adamsSwapContractSigner.ethToAdams(amountOfTokens, { value: ethers.utils.parseEther(token0) })
        .then( returnValue => {console.log("swap success ", returnValue)})
        .catch(error => showModal("Umm ...", error.reason))
      }
      else {
        // then swap
        const amountOfTokens = await getEstimatedGorForAdams(false);
        console.log("SWAP adamsForGor amountOfTokens", ethers.utils.formatEther(amountOfTokens)); 
        console.log("SWAP adamsForGor token0", token0); 
        console.log("SWAP adamsForGor adamsSwapContractSigner", adamsSwapContractSigner); 

        await adamsSwapContractSigner.adamsToEth(ethers.utils.parseEther(token0), amountOfTokens)
        .then( returnValue => {console.log("swap success ", returnValue)})
        .catch(error => showModal("Umm ...", error.reason))
      }
    }

    /**
     * Approves the swap contract to access the tokens held by the user
     * NOTE: It seems like best practices are to just approve exactly what's needed
     * BUT, seems like most DEXs do a large blanket appoval (ethers.constants.MaxUint256)... so I'm going that way.
     */
    const approve = async () => {
      console.log(`Approving ${window.$adams_staking_contract} to access ${ethers.constants.MaxUint256}`);
      await adamsCoinContractSigner.approve(window.$adams_swap_contract, ethers.constants.MaxUint256)
      .then( returnValue => {setHasApproved(true)})
      .catch(error => showModal("Umm ...", error.reason));

    }

    /**
     * Changes the swap direction GOR <=> ADAMS
     */
    const changeSwapDirection = async () => {
      // sometimes we don't get these values on page load
      if(gorBalanceUser === 0)  {
        const balance = await getUserGorBalance();
        setGorBalanceUser(balance);
      }
      if(adamsBalanceUser === 0)  {
        const balance = await getUserAdamsBalance();
        setAdamsBalanceUser(balance);       
      }

      // now update the estimated post-swap values

      // first update the form values first as state seems to take time to update
      // note this seems backwards, but that's because we haven't updated the value of swapGorToAdams
      if(swapGorToAdams) {
        setToken0(adamsBalanceUser);
        // in this case, we need to check if we have approved enough yet
      }
      else setToken0(gorBalanceUser);   

      // then update  the UI
      setSwapGorToAdams(!swapGorToAdams);

      // then clear the value of token1
      setToken1(0);
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
                      <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Swap!</h1>
                  
                  <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                    Swap <a className="underline decoration-[#d31a83]" href="https://goerlifaucet.com/" rel="noreferrer" target="_blank">Goerli ETH</a> for ADAMS, pay the tax and see who gets it. Maybe you'll get it, maybe someone else will.
                    Hold on to your ADAMS, the more you have, the better your chance of winning the tax is.
                    <p className="flex flex-row justify-end text-sm mr-2 mt-2">Swap GOR Balance: {gorBalanceContract}</p>
                    <p className="flex flex-row justify-end text-sm mr-2">Swap ADAMS Balance: {adamsBalanceContract}</p>  
                    <p className="flex flex-row justify-end text-sm mr-2">1 ADAMS = {gorBalanceContract / adamsBalanceContract} GOR</p>                                    
                    <p className="flex flex-row justify-end text-sm mr-2">1 ADAMS = {(gorBalanceContract / adamsBalanceContract) * ethPrice} USD</p>                                    
                  </h2>
                </div>

                <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                    <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                  
                        <div className="flex flex-col justify-start">
                        <MdSwapCalls className="text-4xl" onClick={changeSwapDirection}/>
                        </div>
                        <div>
                        
                        <div className="flex flex-row justify-end mx-5 my-1">
                          {swapGorToAdams && (
                            <h1 className="px-5 font-bold"><>GOR</> </h1>
                          )}
                           {!swapGorToAdams && (
                            <h1 className="px-5 font-bold"><>ADAMS</> </h1>
                           )}
                          <input type="number" id="token0" value={token0} onChange={(e) => {setToken0(e.target.value); setSwapResult();}} className="appearance-none border-[#d31a83] w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" />
                        </div>

                        <div className="flex flex-row justify-end mx-5 my-1">  
                          {swapGorToAdams && (
                            <h1 className="px-5 font-bold">ADAMS</h1>

                          )}
                           {!swapGorToAdams && (
                            <h1 className="px-5 font-bold">GOR</h1>
                          )} 
                          <input type="number" id="token1" value={token1} onChange={(e) => setToken1(e.target.value)} className="appearance-none border-[#d31a83] w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none disabled" />  
                        </div>
                        
                        <div className="flex flex-row justify-end ">
                          <ArwesThemeProvider>
                            {swapGorToAdams && (
                              <Button animator={{ animate: false }} onClick={swap}>
                              <Text>Swap</Text>
                              </Button>
                            )}
                            {!swapGorToAdams && !hasApproved && (
                              <Button animator={{ animate: false }} onClick={approve}>
                              <Text>Approve</Text>
                              </Button>
                            )}
                            {!swapGorToAdams && hasApproved && (
                              <Button animator={{ animate: false }} onClick={swap}>
                              <Text>Swap</Text>
                              </Button>
                            )}

                          </ArwesThemeProvider>
                        </div> 
                      </div>
                    </div>    
                </div>
              </div>
          </div>
          <Social />
      </div> 
      </>           
    );
};

export default AdamsSwap;
