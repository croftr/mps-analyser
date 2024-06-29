"use client"
import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const imgs = ['cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg', 'cat.jpg'];

//@ts-ignore
const Similarity = ({ data }) => {

  const fgRef = useRef();
  // const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // if (fgRef.current) {
    //   fgRef.current.zoomToFit(450, 20); // Adjust duration and padding as needed
    // }
    console.log("data ", data);
    
  }, [data]); // Trigger zoomToFit whenever the data changes
  
  return (
    <div className='w-full h-full ring'>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeAutoColorBy="group" 
        nodeLabel="id"
        linkWidth={link => link.value * 5} // Scale link width based on similarity
        linkDirectionalParticles={link => link.value * 2} // Add particles for visual effect
        linkDirectionalParticleSpeed={0.005}
      />
    </div>
  );
};

export default Similarity;