import React from 'react';

const Grid = ({pos, id, visible, image, handleClick})=>{
  const x = pos%3;
  const y = parseInt(pos/3, 10);
  const u = id%3;
  const v = parseInt(id/3, 10);
  return (
    <div className='grid' style={{
      transform: `translate(${x*100}px, ${y*100}px)`,
      display: visible?'block':'none',
    }}
      onClick={handleClick}
    >
      <div className='img' style={{
        transform: `translate(-${u*100}px, -${v*100}px)`,
        backgroundImage: `url('${image}')`,
      }}/>
    </div>
  );
}

export default Grid;
