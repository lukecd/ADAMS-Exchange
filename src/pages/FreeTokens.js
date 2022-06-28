import React, { Fragment, useState, useEffect, useCallback } from "react";
import { ArwesThemeProvider, Text, Button, FrameBox } from '@arwes/core';
import { useAccount, useContract, useContractEvent, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import Social from "../components/Social";
import adamsVaultABI from '../abi/AdamsVault.json';

import ConnectWalletModal from "../components/ConnectWalletModal";
import GeneralModal from "../components/GeneralModal";

const FreeTokens = () => {
    // state mgmt
    let [hasClaimed, setHasClaimed] = useState(false);
    let [vaultReserve, setVaultReserve] = useState(0);

    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [modalTitle, setModalTitle] = useState("");
    let [modalDescription, setModalDescription] = useState("");
    let [isCWOpen, setIsCWOpen] = useState(false);

    // provider for checking if user has claimed rewards
    const provider = useProvider();
    const adamsVaultContractProvider = useContract({
      addressOrName: window.$adams_vault_contract,
      contractInterface: adamsVaultABI,
      signerOrProvider: provider,
    });

    // signer for claiming rewards
    const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
    
    const adamsVaultContractSigner = useContract({
      addressOrName: window.$adams_vault_contract,
      contractInterface: adamsVaultABI,
      signerOrProvider: signer,
    });

    // runs on pae load. set
    useEffect(() => {
      console.log("check if user has claimed rewards");
      const checker = async () => {
        await checkContractHasClaimed()
          .then( returnValue => {setHasClaimed(returnValue); console.log("checked if has claimed ", returnValue)})
          .catch(error => console.log(error));
      };
      checker();
      const checkReserve = async () => {
        await checkVaultReserve()
          .then( returnValue => {setVaultReserve(returnValue); console.log("checked vaultReserve ", returnValue)})
          .catch(error => console.log(error));
      };
      checkReserve();
      

    }, []);

    /**
     * 
     * @returns true / false indiciating if the logged in wallet has claimed ADAMS from the vault.
     * TODO: find out why it's always retuerning false.
     */
    const checkContractHasClaimed = async () => {
      const hasClaimed = await adamsVaultContractProvider.hasClaimedDistribution();
      console.log("hasClaimed ", hasClaimed);
      return hasClaimed;
    }

    /**
     * 
     * @returns The number of ADAMS tokens currently held by the vault
     */
    const checkVaultReserve = async () => {
      let vaultReserve = await adamsVaultContractProvider.getReserve();
      vaultReserve = ethers.utils.formatEther(vaultReserve);
      console.log("vaultReserve ", vaultReserve);
      return vaultReserve;
    }

    /**
     * Primary function for this page. Connects to the vault contract and tries to 
     * claim 4200 tokens for the users. 
     */
    const claimTokens = async () => {
        // if signer is null, popup a connect wallet error
        if(!signer) {
          setIsCWOpen(true);
        }
        else {
          // talk to contract
          await adamsVaultContractSigner.claimDistribution()
            .then( returnValue => {setHasClaimed(true); showModal("Success", `Check your wallet, if you don't see it, make sure to add the contract ${window.$adams_coin_contract}`)})
            .catch(error => showModal("Umm ...", error.reason))
        }
    }

    useContractEvent(
      {
        addressOrName: window.$adams_vault_contract,
        contractInterface: adamsVaultABI,
      },
      'VaultDistribution',
      (event) => console.log('VaultDistribution', event),
    )
    
    /**
     * Shows a modal dialog with the specified info
     * @param {*} title Of the modal
     * @param {*} reason Details of the modal
     */
    const showModal = async (title, reason) => {
      setModalTitle(title);
      reason = reason.replace("execution reverted: ", "");
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
                        <h1 className='text-4xl leading-10 font-bold inline underline decoration-[#d31a83]'>Free ADAMS For All!</h1>
                    
                    <h2 className='text-center mt-2 text-1xl font-bold opacity-80 bg-white text-black'>
                      {!hasClaimed && (
                        <>
                        ADAMS is more fun when more people have it.
                        Want some free coins? Connect your wallet and click below for 4,200 free coins. 
                        <p className="flex flex-row justify-end text-sm mr-2">Vault Balance: {vaultReserve}</p>
                        </>
                      )}
                        {hasClaimed && (
                        <>
                        You've already claimed your tokens. Did you run out? Want some more? Grab some free <a className="underline decoration-[#d31a83]" href="https://goerlifaucet.com/" rel="noreferrer" target="_blank">Goerli ETH</a> and swap for ADAMS.
                        </>
                      )}                    
                      
                    </h2>
                  </div>

                  <div className='pt:10 mt-3 lg:pr-40 lg:pl-40 md:pr-20 md:pl-20 '>
                      <div className="w-full mr-3 mt-3 flex flex-row justify-end justify-items-end">
                        <ArwesThemeProvider>
                    
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
        </>
    );
};

export default FreeTokens;
