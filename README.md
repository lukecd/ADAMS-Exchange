
### 
This is the repository for the UI for ADAMS Exchange. The smart contracts are all here https://github.com/lukecd/ADAMS-Coin.

This project started out with me imaginging a token that would appeal to gamblers. I came up with the idea of
taxing every transfer and then giving that tax randomally to a wallet holder. Giving tax rewards away to holders
would incentivize HODLing, and then to make sure whales don't always win, I decided distribute tax
rewards as follows.
    <ol>
        <li>The contract owner can never win.</li>
        <li>10 % of the time, there is a non-weighted distribution. Each wallet has an equal chance of winning, regardless of their token balance.</li>
        <li>90% of the time there is a weighted distribution. Each token owned increases your chance of winning.</li>
    </ol>
Lots more details on how that's handled in the ADAMS Coin Repository.

### 
This project is built using React, Tailwind, p5 and Rainbowkit. The animations are done using p5.js and inline
Processing code. 

What you're seeing now is actually the 3rd version of this site. I haven't done much webdesign since 1999, so 
I decided to let myself experiment with different technologies as I built this. The first version was all VanillaJS, 
but then I realized the web3 stuff would be too challenging without a library. Since RainbowKit works with React, 
I build the second version using React. Initially I used normal css, but I struggled to get it looking how I wanted while
also being responsive. Finally I rebuilt everything a 3rd time using Tailwind.

Honestly, at first I thought I'd hate Tailwind. It seemed like just normal inline CSS and would get messy after a while.
Then I started working with it and realized it's really super fast and lots of fun to work with. Just a joy.

### 
3rd party things
- Cool scifi buttons from https://arwes.dev/develop/core/
- Planet illustrations from https://www.freepik.com/free-vector/set-fantastic-planets-asteroids-cosmic-objects_20576153.htm
- Orbial math used in p5 animation from https://codereview.stackexchange.com/questions/211796/basic-orbiting-planets-in-p5-js
- Wallet connect https://rainbowkit.com/