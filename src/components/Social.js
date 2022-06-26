import React from 'react'

/**
 * 
 * @returns A styled list of all social media profiles
 */
const Social = () => {
  return (
    <div className='hidden md:flex bg-white text-black md:absolute md:bottom-10 md:right-5'>
        <a className="underline" href="https://www.linkedin.com/in/lukecd/" target="_blank" rel="noreferrer">LinkedIn</a> &nbsp;|&nbsp; 
        <a className="underline" href="https://twitter.com/spaceagente" target="_blank" rel="noreferrer">Twitter</a> &nbsp;|&nbsp; 
        <a className="underline" href="https://www.instagram.com/lukecd/" target="_blank" rel="noreferrer">Instagram</a> &nbsp;|&nbsp; 
        <a className="underline" href="https://github.com/lukecd" target="_blank" rel="noreferrer">GitHub</a>
    </div>      
  )
}

export default Social