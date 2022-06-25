import '../index.css';

import React from "react";
import Navbar from "./Navbar";
import Home42 from '../pages/Home42';
import Orbiter from "../components/Orbiter";

const Layout = ({ children }) => {
    console.log("in layout ", children);
    return (
        <div name='top' className='w-full h-view top-0'>
            <div className='flex flex-col w-full h-full z-0'>
                <section className="wrapper">
                    <div className="stars"></div>
                    <div className="stars2"></div>
                    <div className="stars3"></div>
                </section>
                <Orbiter className='fixed'/>

                <div className='absolute w-full h-full z-1 top-0'>
                    <Navbar />
                    
                </div>
            </div>
        </div>
    );
};

export default Layout;

/***
 * 
 * 
 


 */