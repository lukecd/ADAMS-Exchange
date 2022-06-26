import '../index.css';

import { Link, useHistory } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from '../assets/images/adams-logo-250.png';

import React, { useState } from 'react';
import {FaBars, FaTimes} from 'react-icons/fa';


/**
 * @returns Top navigation bar
 */
const Navbar = () => {
    const [nav, setNav] = useState(false);
    const handleClick = () => setNav(!nav);

    return (
        <div className='fixed w-full h-[90px] flex justify-between items-center text-[#15274c] z-10'>
            <div>
                <img className='px-5' src={Logo} alt="Adams Coin"/>
            </div>
            {/* desktop menu */} 
            <ul className='hidden lg:flex px:5 py:5'>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/">
                        42
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/free-tokens">
                        free tokens
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/swap">
                        swap
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/staking">
                        staking
                    </Link>
                </li>
                <li>
                    <Link className='hover:bg-[#d31a83] hover:border-[#d31a83] text-white border-2 px-4 py-2 mx-1 rounded-sm' to="/rewards">
                        rewards
                    </Link>
                </li>
            </ul>
            <div className='hidden lg:flex mr-10'>
                <ConnectButton showBalance={false}/>
            </div>
            {/* hamburger */}
            <div onClick={handleClick} className='lg:hidden z-10 mr-10'>
                {!nav ? <FaBars /> : <FaTimes />}
                
            </div>
            {/* mobile menu */}
            <ul className={!nav ? 'hidden' : 'absolute top-0 left-0 w-full h-screen bg-[#d31a83] text-white flex flex-col justify-center items-center' }>
                <li  className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="top" to='/'>
                        42
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="me" to='/free-tokens'>
                        free tokens
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="coding" to='/swap'>
                        swap
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="tv-video" to='/staking'>
                        staking
                    </Link>
                </li>
                <li className='py-6 text-4xl'>
                     <Link onClick={handleClick} to="contact" to='/rewards'>
                        rewards
                    </Link>
                </li>
                <li>
                <ConnectButton showBalance={false}/>
                </li>
                <li className='mt-8'>
                <a className="underline" href="https://www.linkedin.com/in/lukecd/" target="_blank" rel="noreferrer">LinkedIn</a> &nbsp;|&nbsp; 
                <a className="underline" href="https://twitter.com/spaceagente" target="_blank" rel="noreferrer">Twitter</a> &nbsp;|&nbsp; 
                <a className="underline" href="https://www.instagram.com/lukecd/" target="_blank" rel="noreferrer">Instagram</a> |&nbsp; 
                <a className="underline" href="https://github.com/lukecd" target="_blank" rel="noreferrer">GitHub</a>
                </li>
            </ul>
            {/* social */}
            <div className='hidden'></div>
        </div>
    )
}

export default Navbar