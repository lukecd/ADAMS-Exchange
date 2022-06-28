import React from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {AiOutlineCloseSquare} from 'react-icons/ai';

/**
 * 
 * @param {*} props.onClose A callback used to close the window
 * @param {*} props.modalTitle A title for the condition
 * @param {*} props.modalDescription A description of the condition 
 * 
 * @returns A modal dialog alerting the user to a specific condition 
 */
const GeneralModal = (props) => {

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
                <Dialog.Title className="font-[Orbitron] text-2xl leading-10 font-bold inline underline decoration-[#d31a83]">{props.modalTitle}</Dialog.Title>
                <Dialog.Description className="text-sm">
                    {props.modalDescription}
                </Dialog.Description>
                </Dialog.Panel>
            </div>
            </Dialog>
        </div>
    )
}

export default GeneralModal
