"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const projects = [
  { id: 1, image: "/images/projects1.jpg" },
  { id: 2, image: "/images/projects2.jpg" },
  { id: 3, image: "/images/projects3.jpg" },
  { id: 4, image: "/images/projects4.jpg" },
  { id: 5, image: "/images/projects5.jpg" },
];


export default function FeaturedProjects() {

  const [index,setIndex] = useState(0);
  const [positions, setPositions] = useState([]);

  const next=()=>setIndex((p)=>(p+1)%projects.length);

  const prev=()=>setIndex((p)=>(p-1+projects.length)%projects.length);


  useEffect(() => {
  const updatePositions = () => {
    const width = window.innerWidth;

    if (width >= 1100) {
      setPositions([
        { x: -470, y: 10, scale: .82, z: 1, opacity: .55, h: 320 },
        { x: -235, y: 0, scale: .92, z: 2, opacity: .9, h: 360 },
        { x: 0, y: 60, scale: 1, z: 5, opacity: 1, h: 300 },
        { x: 235, y: 0, scale: .92, z: 2, opacity: .9, h: 360 },
        { x: 470, y: 10, scale: .82, z: 1, opacity: .55, h: 320 },
      ]);
    } else if (width >= 1024) {
      setPositions([
        { x: -390, y: 10, scale: .82, z: 1, opacity: .55, h: 300 },
        { x: -195, y: 0, scale: .92, z: 2, opacity: .9, h: 340 },
        { x: 0, y: 50, scale: 1, z: 5, opacity: 1, h: 280 },
        { x: 195, y: 0, scale: .92, z: 2, opacity: .9, h: 340 },
        { x: 390, y: 10, scale: .82, z: 1, opacity: .55, h: 300 },
      ]);
    } else if (width >= 992) {
      setPositions([
        { x: -300, y: 10, scale: .82, z: 1, opacity: .45, h: 260 },
        { x: -150, y: 0, scale: .92, z: 2, opacity: .85, h: 300 },
        { x: 0, y: 45, scale: 1, z: 5, opacity: 1, h: 250 },
        { x: 150, y: 0, scale: .92, z: 2, opacity: .85, h: 300 },
        { x: 300, y: 10, scale: .82, z: 1, opacity: .45, h: 260 },
      ]);
    } else if (width >= 768) {
      setPositions([
        { x: -180, y: 0, scale: .85, z: 1, opacity: .3, h: 220 },
        { x: -90, y: 0, scale: .95, z: 2, opacity: .75, h: 260 },
        { x: 0, y: 35, scale: 1, z: 5, opacity: 1, h: 230 },
        { x: 90, y: 0, scale: .95, z: 2, opacity: .75, h: 260 },
        { x: 180, y: 0, scale: .85, z: 1, opacity: .3, h: 220 },
      ]);
    } else {
      setPositions([
        { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
        { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
        { x: 0, y: 0, scale: 1, z: 5, opacity: 1, h: 250 },
        { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
        { x: 0, y: 0, scale: 0, z: 0, opacity: 0, h: 0 },
      ]);
    }
  };

  updatePositions();
  window.addEventListener("resize", updatePositions);

  return () => window.removeEventListener("resize", updatePositions);
}, []);


  const visible=[];

  for(let i=-2;i<=2;i++){

    const idx=(index+i+projects.length)%projects.length;

    visible.push(projects[idx]);

  }

  if (!positions.length) return null;
  

  return(

<section className="featured-projects">

<div className="container">

<div className="featured-wrapper">

<h2 className="featured-title">
FEATURED PROJECTS
</h2>

<div className="featured-stage">

<AnimatePresence initial={false}>

{visible.map((item,i)=>(

<motion.div

key={item.id}

className="featured-card"

animate={{

x:positions[i].x,

y:positions[i].y,

scale:positions[i].scale,

opacity:positions[i].opacity,

zIndex:positions[i].z,

height:positions[i].h

}}

transition={{

duration:.8,

ease:[.25,.1,.25,1]

}}

>

<Image

src={item.image}

alt=""

fill

className="featured-image"

/>

</motion.div>

))}

</AnimatePresence>

</div>

<p className="featured-description">

Explore a curated collection of our most distinctive projects,
thoughtfully designed to transform spaces through greenery,
creativity and immersive biophilic experiences.

</p>

<div className="featured-controls">

<button onClick={prev}>

<IoChevronBack/>

</button>

<button onClick={next}>

<IoChevronForward/>

</button>

</div>

</div>

</div>

</section>

  );

}