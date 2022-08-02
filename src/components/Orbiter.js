import { useEffect, useRef } from 'react';
import p5 from 'p5';


import Sun from '../assets/images/planet-1.png';
import Planet1 from '../assets/images/planet-2.png';
import Planet2 from '../assets/images/planet-3.png';
import Planet3 from '../assets/images/planet-4.png';
import Planet4 from '../assets/images/planet-5.png';
import Planet5 from '../assets/images/planet-6.png';

// based on code from https://codereview.stackexchange.com/questions/211796/basic-orbiting-planets-in-p5-js
function sketch(p) {
    class Orbiter {
        constructor(sizeRadius, orbitRadius, orbitAngle=0, image) {
            this.sizeRadius = sizeRadius;
            this.orbitRadius = orbitRadius;
            this.orbitAngle = 0; // degrees relative to x axis
            this.image = image;

            // 2000 is an arbitrary animation speed (which also depends on the frame rate)
            // The -1.5 exponent is due to Kepler's 3rd Law
            this.orbitAngleDelta = 2000 * Math.pow(orbitRadius, -1.5);
            this.x = this.y = 0;
            this.color = 'white';
        }

        orbit(primary) {
            this.x = primary.x + this.orbitRadius * p.cos(p.radians(this.orbitAngle));
            this.y = primary.y + this.orbitRadius * p.sin(p.radians(this.orbitAngle));
            this.orbitAngle = (this.orbitAngle + this.orbitAngleDelta) % 360;
        }

    }

    let planets = [];
    let planetImages = [];
    let sunImage = "";
    let sun = new Orbiter(100, 0, planetImages[0]);
    
    p.preload = () => {
        sunImage = p.loadImage('/assets/images/planet-1.png');
        planetImages[0] = p.loadImage('/assets/images/planet-2.png');
        planetImages[1] = p.loadImage('/assets/images/planet-3.png');
        planetImages[2] = p.loadImage('/assets/images/planet-4.png');
        planetImages[3] = p.loadImage('/assets/images/planet-5.png');
        planetImages[4] = p.loadImage('/assets/images/planet-6.png');
    }
    
    p.setup = () => {
        p.createCanvas(window.screen.width, window.screen.height);
        p.frameRate(144);
    
        sun.x = p.windowWidth / 2;
        sun.y = p.windowHeight * .7
        
        //sun.x = p.windowWidth * .5;
        //sun.y = p.windowHeight * .8;
    
        // Instantiate 5 planets
        for (let i = 0; i < 5; i++) {
            planets[i] = new Orbiter(5 + 15 * i, 175 + 100 * i);
        }
    }

    p.draw = () => {

        p.background(0, 0, 0, 100);
        // sun
        p.image(sunImage, sun.x-(sunImage.width/2), sun.y-(sunImage.height/2));       

        for(let i=0; i<planets.length; i++) {
            planets[i].orbit(sun);
            //p.image(planetImages[1], sun.x-(planetImages[0].width/2), sun.y-(planetImages[0].height/2));
            p.image(planetImages[i], planets[i].x-(planetImages[i].width/2), planets[i].y-(planetImages[i].height/2))
            //planets[i].display();
        }
         
    }
    p.windowResized = () => {
        //p.resizeCanvas(p.createCanvas(window.screen.width, window.screen.height));
        sun.x = p.windowWidth / 2;
        sun.y = (p.windowHeight-250) / 2;
    }
}




function Orbiter() {
    // create a reference to the container in which the p5 instance should place the canvas
    const p5ContainerRef = useRef();

    useEffect(() => {
        // On component creation, instantiate a p5 object with the sketch and container reference 
        const p5Instance = new p5(sketch, p5ContainerRef.current);

        // On component destruction, delete the p5 instance
        return () => {
            p5Instance.remove();
        }
    }, []);

    return (
        <>
        <div ref={p5ContainerRef} />
        </>
    );
}

export default Orbiter;