import*as s from"https://cdn.jsdelivr.net/npm/three@0.112/build/three.module.js";import{OrbitControls as O}from"https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/controls/OrbitControls.js";import{EffectComposer as T}from"https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/postprocessing/EffectComposer.js";import{RenderPass as j}from"https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/postprocessing/RenderPass.js";import{UnrealBloomPass as B}from"https://cdn.jsdelivr.net/npm/three@0.112/examples/jsm/postprocessing/UnrealBloomPass.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function e(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=e(o);fetch(o.href,a)}})();let y,d,p,l,_,P=[],L,$;async function A(t){try{const n=await fetch(t);if(!n.ok)throw new Error("Network response was not ok");P=await n.json(),console.log("JSON data has been fetched and stored")}catch(n){console.error("Failed to fetch the JSON data:",n)}}let x=null;window.addEventListener("mousemove",t=>{h.x=t.clientX/window.innerWidth*2-1,h.y=-(t.clientY/window.innerHeight)*2+1,D.setFromCamera(h,d);const n=D.intersectObjects(M);if(n.length>0){const e=n[0].object;document.body.style.cursor="pointer",x=e}else document.body.style.cursor="auto",x=null});window.addEventListener("dblclick",t=>{if(x){const n=x.starData.id;window.open(`./html/exosky.html?starId=${n}`,"_blank")}});async function H(){y=new s.Scene,d=new s.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,15e4),d.position.z=100,p=new s.WebGLRenderer,p.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(p.domElement),l=new O(d,p.domElement),l.enableDamping=!0,l.dampingFactor=.05;const t=new s.AmbientLight(11184810);y.add(t);const n=new s.TextureLoader;n.crossOrigin=!0,await A("./Hosts_info-1.json"),console.log("check-up"),L=new s.Group,$=new s.Group,V(),y.add(L),y.add($),G(),C()}function G(){_=new T(p),_.addPass(new j(y,d));const t=new B(new s.Vector2(window.innerWidth,window.innerHeight),2,.5,.1);_.addPass(t)}const M=[],R=[];function W(t,n,e){const r=n,o=t,a=e*Math.sin(r)*Math.cos(o),i=e*Math.sin(r)*Math.sin(o),c=e*Math.cos(r);return{x:a,y:i,z:c}}function F(t){var n,e=0,r=0,o=0;return t<-.4&&(t=-.4),t>2&&(t=2),t>=-.4&&t<0?(n=(t+.4)/(0+.4),e=.61+.11*n+.1*n*n):t>=0&&t<.4?(n=(t-0)/(.4-0),e=.83+.17*n):t>=.4&&t<2.1&&(n=(t-.4)/(2.1-.4),e=1),t>=-.4&&t<0?(n=(t+.4)/(0+.4),r=.7+.07*n+.1*n*n):t>=0&&t<.4?(n=(t-0)/(.4-0),r=.87+.11*n):t>=.4&&t<1.6?(n=(t-.4)/(1.6-.4),r=.98-.16*n):t>=1.6&&t<2&&(n=(t-1.6)/(2-1.6),r=.82-.5*n*n),t>=-.4&&t<.4?(n=(t+.4)/(.4+.4),o=1):t>=.4&&t<1.5?(n=(t-.4)/(1.5-.4),o=1-.47*n+.1*n*n):t>=1.5&&t<1.94&&(n=(t-1.5)/(1.94-1.5),o=.63-.6*n*n),[e,r,o]}function V(){for(var t=P.Hosts,n=0;n<t.length;n++){var e=t[n];const i=e["BV[mag]"],c=F(i),f=e["Radius[R_Sun]"],m=e["RA[degree]"],u=e["Dec[degree]"],g=e["Distance[pc]"],E=.03*f;if(isNaN(m)||isNaN(u)||isNaN(g)){console.log("Star data missing/malformed: "+e.name+": "+m+", "+u+", "+g);continue}const{x:S,y:I,z:N}=W(m,u,g),z=new s.SphereGeometry(E,16,16);var r=new s.MeshBasicMaterial({color:new s.Color(c[0],c[1],c[2])});const w=new s.Mesh(z,r);if(w.position.set(S,I,N),w.starData={id:e.ID,name:e.host_name,star_number:e.star_number,pl_number:e.planet_number,radi:e["Radius[R_Sun]"],ra:e["RA[degree]"],de:e["Dec[degree]"],dist:e["Distance[pc]"],temp:e["Temperature[K]"],met:e.Metallicity,mass:e["Mass[M_Sun]"],speck:e["Spectral Type"],lumin:e["Luminosity[L_Sun]"],age:e["Age[Gyr]"],vel:e["Velocity[m/s]"],bv:e["BV[mag]"],planets:[]},e.Planets&&e.Planets.length>0)for(var o=0;o<e.Planets.length;o++){var a=e.Planets[o];w.starData.planets.push({planet_name:a.planet_name,radius:a["Radius[R_Earth]"],mass:a["Mass[M_Earth]"],temperature:a["Temperature[K]"],semimajor_axis:a["Semimajor_axis[AU]"],eccentricity:a.Eccentricity,inclination:a["Inclination[degree]"],period:a["Period[day]"],transit_duration:a["Transit Duration[hour]"],star_id:e.ID})}L.add(w),M.push(w)}}function U(t,n){for(var e=0;e<t.length;e++){const a=t[e],i=a.planet_name;console.log(i);const c=a.radius;console.log(c);const f=a.semimajor_axis;var r=new s.SphereGeometry(c*.003,16,16),o=new s.MeshStandardMaterial({map:K(),roughness:.5,metalness:.3});const m=new s.Mesh(r,o),u=e*(Math.PI/t.length),g=n.x+f*3*Math.cos(u),E=n.y,S=n.z+f*3*Math.sin(u);m.planetData={name:a.planet_name,radius:a.radius,mass:a.mass,temperature:a.temperature,semimajor_axis:a.semimajor_axis,eccentricity:a.eccentricity,inclination:a.inclination,period:a.period,transit_duration:a.transit_duration,star_id:a.star_id},m.position.set(g,E,S),$.add(m),R.push(m)}}document.addEventListener("DOMContentLoaded",function(){const t=document.getElementById("searchBtn"),n=document.getElementById("searchInput");t.addEventListener("click",function(){const e=n.value.trim().toLowerCase();console.log(`Searching for star: ${e}`),M.forEach(r=>{if(r.starData&&r.starData.name)if(r.starData.name.trim().toLowerCase()===e){const a=r.position;l.target.set(a.x,a.y,a.z),gsap.to(d.position,{duration:2,x:a.x+4,y:a.y+4,z:a.z+4,onUpdate:()=>l.update()})}else console.log("Star name doesn't match")})})});const D=new s.Raycaster,h=new s.Vector2;window.addEventListener("click",t=>{h.x=t.clientX/window.innerWidth*2-1,h.y=-(t.clientY/window.innerHeight)*2+1,D.setFromCamera(h,d);const n=D.intersectObjects(M);if(n.length>0){const e=n[0].object,r=e.position;l.target.set(r.x,r.y,r.z),document.getElementById("hint").style.display="flex",document.getElementById("starName").innerText=`
        Star Name: ${e.starData.name}
        Radius[R_Sun]: ${e.starData.radi}
        Spectral Type: ${e.starData.speck}
        Mass[M_Sun]: ${e.starData.mass}
        Temperature[K]: ${e.starData.temp}
        Metallicity: ${e.starData.met} Fe/H
        Luminosity[L_Sun]: ${e.starData.lumin}
        Age[Gyr]: ${e.starData.age}
        Velocity: ${e.starData.vel}
        RA[Earth]: ${e.starData.ra}
        DE[Earth]: ${e.starData.de}
        Parralax[Earth]: ${e.starData.dist}
        BV: ${e.starData.bv}
    `,U(e.starData.planets,r),gsap.to(d.position,{duration:2,x:r.x+10,y:r.y+10,z:r.z+10,onUpdate:()=>l.update()})}else{const e=D.intersectObjects(R);if(e.length>0){const r=e[0].object,o=r.position;l.target.set(o.x,o.y,o.z),document.getElementById("starName").innerText=`
            Planet Name: ${r.planetData.name}
            Radius[R_Earth]: ${r.planetData.radius}
            Mass[M_Earth]: ${r.planetData.mass}
            Temperature[K]: ${r.planetData.temperature}
            Semimajor Axis[AU]: ${r.planetData.semimajor_axis}
            Eccentricity: ${r.planetData.eccentricity}
            Inclination[Degree]: ${r.planetData.inclination}
            Period[day]: ${r.planetData.period}
            Transit Duration[hour]: ${r.planetData.transit_duration}
            Star Id: ${r.planetData.star_id}
        `,gsap.to(d.position,{duration:2,x:o.x+10,y:o.y+10,z:o.z+10,onUpdate:()=>l.update()})}}});function K(){const t=[["red","yellow"],["red","blue"],["green","blue"],["green","red"],["yellow, blue"]],n=Math.floor(Math.random()*t.length),[e,r]=t[n],o=256,a=document.createElement("canvas");a.width=o,a.height=o;const i=a.getContext("2d"),c=i.createRadialGradient(o/2,o/2,o/4,o/2,o/2,o/2);return c.addColorStop(0,e),c.addColorStop(1,r),i.fillStyle=c,i.fillRect(0,0,o,o),new s.CanvasTexture(a)}function C(){requestAnimationFrame(C),l.update(),_.render()}window.addEventListener("resize",()=>{p.setSize(window.innerWidth,window.innerHeight),d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix()});document.addEventListener("DOMContentLoaded",H);
