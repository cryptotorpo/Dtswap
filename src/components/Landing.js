import * as React from 'react'
import '../css/project-base.css'
import '../css/animations.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing () {
    return (
      <div className="App">
        <div className='relative w-full h-screen body'>
          <div className='flex flex-col items-center justify-center h-full gap-10'>
            <div className='text-2xl font-medium'>Swap Tokens</div>
            <div className='flex flex-row items-center gap-5 text-lg font-medium'>
              Address 1:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]'></input>
              Amount :<input type="text" className='p-1 border border-gray-800 rounded-xl w-[100px]'></input>
            </div>
            <div className='flex flex-row items-center gap-5 text-lg font-medium'>
              Address 2:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]'></input>
              Amount :<input type="text" className='p-1 border border-gray-800 rounded-xl w-[100px]'></input>
            </div>
            <div className='flex flex-row gap-7'>
              <ConnectButton />
              <div className='font-bold flex justify-center items-center py-1 text-lg bg-[#0E76FD] text-white shadow-lg cursor-pointer rounded-xl px-7'>Swap</div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Landing;
