import * as React from 'react'
import '../css/project-base.css'
import '../css/animations.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Web3 from "web3";

import {ethers, BigNumber} from 'ethers';

import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
} from "wagmi";

import routerABI from './contractABI/uniswaprouter.json';
import ERC20ABI from './contractABI/ERC20ABI.json';

const routerAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";

function Landing () {
    const account = useAccount();
  
    const [inAddress, setInAddress] = useState('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9');
    const [inAmount, setInAmount] = useState('130');
    const [outAddress, setOutAddress] = useState('0x111111111117dC0aa78b770fA6A738034120C302');
    const [outAmount, setOutAmount] = useState('');

    const getAmountsOut = useContractRead({
      address: routerAddress,
      abi: routerABI,
      functionName : 'getAmountsOut',
      args : [inAmount, [inAddress, outAddress]]
    });

    const { data: data1, isLoading: isLoading1, isSuccess: isSuccess1, write: write1 } = useContractWrite({
      address: routerAddress,
      abi: routerABI,
    });

    const { data: data2, isLoading: isLoading2, isSuccess: isSuccess2, write: write2 } = useContractWrite({
      address: inAddress,
      abi: ERC20ABI,
    });

    // AAVE 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9
    // 1inch 0x111111111117dC0aa78b770fA6A738034120C302

    useEffect(() => {
      if(getAmountsOut.data != undefined && getAmountsOut.data != null)
        setOutAmount(getAmountsOut.data[1].toString());
    }, [getAmountsOut.data]);

    const swapTokens = async () => {
      try {
        // await write2({
        //   functionName: "approve",
        //   args: [routerAddress, "0"]
        // });
        await write2({
          functionName: "approve",
          args: [routerAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935"]
        });
        await write1({
          functionName: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
          args: [inAmount, 0, [inAddress, outAddress], account.address, new Date().getTime()]  
        });
      } catch (error) {
        console.log('Error:', error);
      }
    };

    return (
      <div className="App">
        <div className='relative w-full h-screen body'>
          <div className='flex flex-col items-center justify-center h-full gap-10'>
            <div className='text-2xl font-medium'>Swap Tokens</div>
            <div className='flex flex-row items-center gap-5 text-lg font-medium'>
              From Address:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]' value={inAddress} onChange={(e) => setInAddress(e.target.value)}></input>
              AmountIn :<input type="text" className='p-1 border border-gray-800 rounded-xl w-[100px]' value={inAmount} onChange={(e) => setInAmount(e.target.value)}></input>
            </div>
            <div className='flex flex-row items-center gap-5 text-lg font-medium'>
              To Address:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]' value={outAddress} onChange={(e) => setOutAddress(e.target.value)}></input>
              AmountOut :<input disabled type="text" className='p-1 border border-gray-800 rounded-xl w-[150px]' value={outAmount} onChange={(e) => setOutAmount(e.target.value)}></input>/ (10 ** decimals)
            </div>
            <div className='flex flex-row gap-7'>
              <ConnectButton />
              <div className='font-bold flex justify-center items-center py-1 text-lg bg-[#0E76FD] text-white shadow-lg cursor-pointer rounded-xl px-7' onClick={() => swapTokens()}>
                Swap
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Landing;
