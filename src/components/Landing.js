import * as React from 'react'
import '../css/project-base.css'
import '../css/animations.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Web3 from "web3";

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
} from "wagmi";

import routerABI from './contractABI/uniswaprouter.json';

const routerAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";

function Landing () {
    const [inAddress, setInAddress] = useState('0xdac17f958d2ee523a2206206994597c13d831ec7');
    const [inAmount, setInAmount] = useState('130');
    const [outAddress, setOutAddress] = useState('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9');
    const [outAmount, setOutAmount] = useState('');

    const getAmountsOut = useContractRead({
      address: routerAddress,
      abi: routerABI,
      functionName : 'getAmountsOut',
      args : [inAmount, [inAddress, outAddress]]
    });

    // USDT 0xdac17f958d2ee523a2206206994597c13d831ec7
    // AAVE 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9

    useEffect(() => {
      console.log('------------');
      console.log(inAmount);
    }, [inAmount]);
    // console.log('---------------------');
    // console.log(getAmountsOut.data);

    useEffect(() => {
      if(getAmountsOut.data != undefined && getAmountsOut.data != null)
        setOutAmount(getAmountsOut.data[1].toString());
    }, [getAmountsOut.data]);

    return (
      <div className="App">
        <div className='relative w-full h-screen body'>
          <div className='flex flex-col items-center justify-center h-full gap-10'>
            <div className='text-2xl font-medium'>Swap Tokens</div>
            <div className='flex flex-row items-center gap-5 text-lg font-medium'>
              Address 1:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]' value={inAddress} onChange={(e) => setInAddress(e.target.value)}></input>
              Amount :<input type="text" className='p-1 border border-gray-800 rounded-xl w-[100px]' value={inAmount} onChange={(e) => setInAmount(e.target.value)}></input>
            </div>
            <div className='flex flex-row items-center gap-5 text-lg font-medium'>
              Address 2:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]' value={outAddress} onChange={(e) => setOutAddress(e.target.value)}></input>
              Amount :<input disabled type="text" className='p-1 border border-gray-800 rounded-xl w-[150px]' value={outAmount} onChange={(e) => setOutAmount(e.target.value)}></input>/ (10 ** 18)
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
