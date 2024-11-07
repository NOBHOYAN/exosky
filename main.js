import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/controls/OrbitControls.js';

import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/postprocessing/UnrealBloomPass.js';


// this is a checkup message, ignore it

let scene;
let camera;
let renderer;
let controls;
let composer;
let hostData = [];
let star_group;
let planet_group;


async function fetchJsonData(url) {
    try {
      const response = await fetch(url);
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      hostData = await response.json();  // Store parsed JSON in the global variable
      console.log("JSON data has been fetched and stored");
    } catch (error) {
      console.error("Failed to fetch the JSON data:", error);
    }
  }

  // Cursor change on hover and redirection on double click
let hoveredStar = null;

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(starMeshes);
    if (intersects.length > 0) {
        const star = intersects[0].object;
        document.body.style.cursor = 'pointer'; // Set cursor to pointer on hover
        hoveredStar = star;
    } else {
        document.body.style.cursor = 'auto'; // Reset cursor when not hovering
        hoveredStar = null;
    }
});

window.addEventListener('dblclick', (event) => {
    if (hoveredStar) {
        const starId = hoveredStar.starData.id;
        window.open(`./html/exosky.html?starId=${starId}`, '_blank'); // Open star link in a new tab
    }
});

async function host_setup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 150000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
   


    textureLoader.crossOrigin = true;
    
    //scene.add(galaxy);
    await fetchJsonData('./Hosts_info-1.json');
    console.log("check-up")

    star_group = new THREE.Group();
    planet_group = new THREE.Group();
    createStars();


    scene.add(star_group);
    scene.add(planet_group);
    initPostProcessing();
   
    animate();
}

//for the sun-like glow effect
function initPostProcessing() {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2, // Strength(by the time i wrote done these were 0.5, 0.8, 1)
        0.5, // Radius
        0.1 // Threshold
    );
    composer.addPass(bloomPass);
}


const starMeshes = [];
const planetsMeshes = [];

function raDecToXYZ(ra, dec, dist) {
    const phi = dec;
    const theta = ra;
    
    const x = dist * Math.sin(phi) * Math.cos(theta);

    const y = dist * Math.sin(phi) * Math.sin(theta);
    const z = dist * Math.cos(phi);
    
    return { x, y, z };
}

function bv2rgb(bv){    // RGB <0,1> <- BV <-0.4,+2.0> [-]
    var t;  
    var r=0.0;
    var g=0.0;
    var b=0.0; 
    
    if (bv<-0.4) bv=-0.4; if (bv> 2.0) bv= 2.0;
    
         if ((bv>=-0.40)&&(bv<0.00)) { t=(bv+0.40)/(0.00+0.40); r=0.61+(0.11*t)+(0.1*t*t); }
    else if ((bv>= 0.00)&&(bv<0.40)) { t=(bv-0.00)/(0.40-0.00); r=0.83+(0.17*t)          ; }
    else if ((bv>= 0.40)&&(bv<2.10)) { t=(bv-0.40)/(2.10-0.40); r=1.00                   ; }
         if ((bv>=-0.40)&&(bv<0.00)) { t=(bv+0.40)/(0.00+0.40); g=0.70+(0.07*t)+(0.1*t*t); }
    else if ((bv>= 0.00)&&(bv<0.40)) { t=(bv-0.00)/(0.40-0.00); g=0.87+(0.11*t)          ; }
    else if ((bv>= 0.40)&&(bv<1.60)) { t=(bv-0.40)/(1.60-0.40); g=0.98-(0.16*t)          ; }
    else if ((bv>= 1.60)&&(bv<2.00)) { t=(bv-1.60)/(2.00-1.60); g=0.82         -(0.5*t*t); }
         if ((bv>=-0.40)&&(bv<0.40)) { t=(bv+0.40)/(0.40+0.40); b=1.00                   ; }
    else if ((bv>= 0.40)&&(bv<1.50)) { t=(bv-0.40)/(1.50-0.40); b=1.00-(0.47*t)+(0.1*t*t); }
    else if ((bv>= 1.50)&&(bv<1.94)) { t=(bv-1.50)/(1.94-1.50); b=0.63         -(0.6*t*t); }
    return [r, g, b];
}


function createStars() {
    var hosts = hostData["Hosts"]
    
    for ( var i = 0; i < hosts.length; i++){
        var star = hosts[i]
        const bv = star["BV[mag]"];
        const star_color = bv2rgb(bv);
        const radI = star["Radius[R_Sun]"];
        const ra = star["RA[degree]"];
        const dec = star["Dec[degree]"];
        const dist = star["Distance[pc]"];
        const radi = 0.03 * radI

        
        if (isNaN(ra) || isNaN(dec) || isNaN(dist)) {
            console.log("Star data missing/malformed: " + star["name"] + ": " + ra + ", " + dec + ", " + dist);
            continue;
        }
        const { x, y, z } = raDecToXYZ(ra, dec, dist);
        const geometry = new THREE.SphereGeometry(radi, 16, 16); // Increased size
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(star_color[0], star_color[1], star_color[2])
    })
        const starMesh = new THREE.Mesh(geometry, material);

        starMesh.position.set(x, y, z);
        starMesh.starData = {
                id: star["ID"],
                name: star["host_name"],
                star_number: star["star_number"],
                pl_number: star["planet_number"],
                radi: star["Radius[R_Sun]"],
                ra: star["RA[degree]"],
                de: star["Dec[degree]"],
                dist: star["Distance[pc]"],
                temp: star["Temperature[K]"],
                met: star["Metallicity"],
                mass: star["Mass[M_Sun]"],
                speck: star["Spectral Type"],
                lumin: star["Luminosity[L_Sun]"],  
                age: star["Age[Gyr]"],
                vel: star["Velocity[m/s]"],
                bv: star["BV[mag]"],
                planets: []      
            };
        
            if (star["Planets"] && star["Planets"].length > 0) {
                // Loop through the planets array and add each planet's data
                for (var j = 0; j < star["Planets"].length; j++) {
                    var planet = star["Planets"][j];
                    starMesh.starData.planets.push({
                    planet_name: planet["planet_name"],
                    radius: planet["Radius[R_Earth]"],
                    mass: planet["Mass[M_Earth]"],
                    temperature: planet["Temperature[K]"],
                    semimajor_axis: planet["Semimajor_axis[AU]"],
                    eccentricity: planet["Eccentricity"],
                    inclination: planet["Inclination[degree]"],
                    period: planet["Period[day]"],
                    transit_duration: planet["Transit Duration[hour]"],
                    star_id: star["ID"]
                });
            }
        }
        
    
        star_group.add(starMesh);
        starMeshes.push(starMesh);

    }       
};

function createPlanet(planets, starPosition) {
    for (var k = 0; k < planets.length; k++) {
        const planet = planets[k]; // Access the individual planet
        const pl_name = planet["planet_name"];
        console.log(pl_name);
        const prad = planet["radius"];
        console.log(prad);
        const semiaxis = planet["semimajor_axis"];

        // Create planet geometry and material
        var planetGeometry = new THREE.SphereGeometry(prad * 0.003, 16, 16); // Scaled down for visualization
        var planetMaterial = new THREE.MeshStandardMaterial({
            //map: planetTexture, // Assign the texture to the map property
            map: getBlendedColorTexture(), // Apply the texture map
            roughness: 0.5, // Adjust roughness if using MeshStandardMaterial
            metalness: 0.3, // Adjust metalness if using MeshStandardMaterial
            
        });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

        // Different orbits for each planet based on k index
        const angle = k * (Math.PI / planets.length); // Spread planets evenly around the star
        const planetX = starPosition.x + semiaxis * 3 * Math.cos(angle); 
        const planetY = starPosition.y;  // Keep 2D orbit for simplicity
        const planetZ = starPosition.z + semiaxis * 3 * Math.sin(angle);

        planetMesh.planetData = {
            name: planet["planet_name"],
            radius: planet["radius"],
            mass: planet["mass"],
            temperature: planet["temperature"],
            semimajor_axis: planet["semimajor_axis"],
            eccentricity: planet["eccentricity"],
            inclination: planet["inclination"],
            period: planet["period"],
            transit_duration: planet["transit_duration"],
            star_id: planet["star_id"]

        }
        
        planetMesh.position.set(planetX, planetY, planetZ);
        planet_group.add(planetMesh);
        planetsMeshes.push(planetMesh)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitstar = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    submitstar.addEventListener('click', function() {
        const starname = searchInput.value.trim().toLowerCase(); // Trim and lowercase the input
        console.log(`Searching for star: ${starname}`);
        
        starMeshes.forEach(star => {
            // Ensure star.starData and star.starData.name exist
            if (star.starData && star.starData.name) {
                const starNameLowerCase = star.starData.name.trim().toLowerCase(); // Trim and lowercase star name
                
                if (starNameLowerCase === starname) {
                    const goto_position = star.position;
                    controls.target.set(goto_position.x, goto_position.y, goto_position.z)
                    gsap.to(camera.position, {
                        duration: 2,
                        x: goto_position.x + 4,
                        y: goto_position.y + 4,
                        z: goto_position.z + 4,
                        onUpdate: () => controls.update()
                    });
                    ;
                } else {
                    console.log("Star name doesn't match");
                }
            } 
        });
    });
});




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(starMeshes);
    if (intersects.length > 0) {
        const Star = intersects[0].object;
        const starPosition = Star.position;
        controls.target.set(starPosition.x, starPosition.y, starPosition.z);
        document.getElementById('hint').style.display="flex";
       
        document.getElementById('starName').innerText = `
        Star Name: ${Star.starData.name}
        Radius[R_Sun]: ${Star.starData.radi}
        Spectral Type: ${Star.starData.speck}
        Mass[M_Sun]: ${Star.starData.mass}
        Temperature[K]: ${Star.starData.temp}
        Metallicity: ${Star.starData.met} Fe/H
        Luminosity[L_Sun]: ${Star.starData.lumin}
        Age[Gyr]: ${Star.starData.age}
        Velocity: ${Star.starData.vel}
        RA[Earth]: ${Star.starData.ra}
        DE[Earth]: ${Star.starData.de}
        Parralax[Earth]: ${Star.starData.dist}
        BV: ${Star.starData.bv}
    `;
        
    createPlanet(Star.starData.planets, starPosition)

        gsap.to(camera.position, {
            duration: 2,
            x: starPosition.x + 10,
            y: starPosition.y + 10,
            z: starPosition.z + 10,
            onUpdate: () => controls.update()
        });
    } else {
        const intersects = raycaster.intersectObjects(planetsMeshes)
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            const planetPosition = planet.position;
            controls.target.set(planetPosition.x, planetPosition.y, planetPosition.z);
            
           
            document.getElementById('starName').innerText = `
            Planet Name: ${planet.planetData.name}
            Radius[R_Earth]: ${planet.planetData.radius}
            Mass[M_Earth]: ${planet.planetData.mass}
            Temperature[K]: ${planet.planetData.temperature}
            Semimajor Axis[AU]: ${planet.planetData.semimajor_axis}
            Eccentricity: ${planet.planetData.eccentricity}
            Inclination[Degree]: ${planet.planetData.inclination}
            Period[day]: ${planet.planetData.period}
            Transit Duration[hour]: ${planet.planetData.transit_duration}
            Star Id: ${planet.planetData.star_id}
        `;
    
            gsap.to(camera.position, {
                duration: 2,
                x: planetPosition.x + 10,
                y: planetPosition.y + 10,
                z: planetPosition.z + 10,
                onUpdate: () => controls.update()
            });
        }
    }
});

function getBlendedColorTexture() {
    // Define possible color pairs
    const colorPairs = [
        ['red', 'yellow'],
        ['red', 'blue'],
        ['green', 'blue'],
        ['green', 'red'],
        ['yellow, blue']
    ];

    // Randomly select a color pair
    const randomIndex = Math.floor(Math.random() * colorPairs.length);
    const [color1, color2] = colorPairs[randomIndex];

    // Create a canvas element
    const size = 256; // Size of the canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');

    // Create a radial gradient for smooth blending of the two colors
    const gradient = context.createRadialGradient(
        size / 2, size / 2, size / 4, // Inner circle (center)
        size / 2, size / 2, size / 2  // Outer circle (edges)
    );

    // Add the randomly selected color stops
    gradient.addColorStop(0, color1);  // Center color
    gradient.addColorStop(1, color2);  // Outer color

    // Apply the gradient to the canvas
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}



function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render();
}



window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

document.addEventListener("DOMContentLoaded", host_setup);