import React from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {AiOutlineCloseSquare} from 'react-icons/ai';

const GeneralModal = (props) => {

    const closeDialog = () => {
        props.onClose(false);
    }
    console.log("modalDescription", props.modalDescription);
    return (
        
        <div className='rounded-lg'>
            <Dialog
            open={props.open}
            onClose={() => props.onClose(false)}
            className="relative "
            >
            <div className="fixed inset-0 flex items-center justify-center z-50 ">
                <Dialog.Panel className="w-full max-w-sm rounded bg-slate-300 p-10">
                <div className='flex items-end justify-end'>
                <AiOutlineCloseSquare className="text-[#d31a83] text-2xl font-bold" onClick={closeDialog}/>
                </div>
                <Dialog.Title className="font-[Orbitron] text-2xl leading-10 font-bold inline underline decoration-[#d31a83]">{props.modalTitle}</Dialog.Title>
                <Dialog.Description className="text-xl">
                    {props.modalDescription}
                </Dialog.Description>
                </Dialog.Panel>
            </div>
            </Dialog>
        </div>
    )
}

export default GeneralModal
