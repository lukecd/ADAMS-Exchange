import React from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {AiOutlineCloseSquare} from 'react-icons/ai';

/**
 * 
 * @param {*} props A callback used to close the modal
 * @returns A modal dialog telling the user to connet their wallet
 * Created as a separate class from GeneralModal as I plan to do some custom styling specific to this error
 */
const ConnectWalletModal = (props) => {

    const closeDialog = () => {
        props.onClose(false);
    }

    return (
        <div className='rounded-lg'>
            <Dialog
            open={props.open}
            onClose={() => props.onClose(false)}
            className="relative "
            >
            <div className="fixed inset-0 flex items-center justify-center z-50 ">
                <Dialog.Panel className="w-full max-w-sm rounded bg-slate-300 p-5">
                <div className='flex items-end justify-end'>
                <AiOutlineCloseSquare className="text-[#d31a83] text-2xl font-bold" onClick={closeDialog}/>
                </div>
                <Dialog.Title className="font-[Orbitron] text-2xl leading-10 font-bold inline underline decoration-[#d31a83]">Connect Your Wallet.</Dialog.Title>
                <Dialog.Description className="">
                    See that button in the top right? Yeah the one over there. Click it.
                </Dialog.Description>
                </Dialog.Panel>
            </div>
            </Dialog>
        </div>
    )
}

export default ConnectWalletModal
