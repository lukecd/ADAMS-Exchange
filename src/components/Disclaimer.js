import '../index.css';

import React, { Component } from 'react'
import { ArwesThemeProvider,  Blockquote, FrameBox } from '@arwes/core';

export default class Disclaimer extends Component {
  render() {
    return (
      <div className='text-sm'>
          <ArwesThemeProvider>
            <Blockquote palette="error">
            Remember the supercomputer built to determine the question to the answer that was 42? Well that's not real and neither is this.
            </Blockquote>
            <Blockquote palette="error">
                I mean this is real in the sense that you're not hallucinating. Well, you may be hallucinating, but this website isn't part of your hallucination.
                It's not real in that you shouldn't use any real money with it. I really just wrote it to learn Solidity, React and web3 dev.
            </Blockquote>
            <Blockquote palette="error">
                So connect your wallet to the Goerli faucet get some free money and really play around. just don't use any real money. Please.
                Ohh and this is totally, really, not in any way endorsed by Douglas Adams. Really.
            </Blockquote>
        </ArwesThemeProvider>
       </div>
    )
  }
}
