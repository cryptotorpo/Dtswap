import * as React from 'react'
import '../css/project-base.css'
import '../css/animations.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

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

const routerAddress = "0x05ff2b0db69458a0750badebc4f9e13add608c7f ";

function Landing () {
    const account = useAccount();
  
    const [inAddress, setInAddress] = useState('0x88b985007d714d1578bccdec2303212c14946cdc');
    const [inTokenData, setInTokenData] = useState({name: '', symbol: '', decimals: '', price: '0'});
    const [inAmount, setInAmount] = useState('130');
    const [outAddress, setOutAddress] = useState('0x111111111117dc0aa78b770fa6a738034120c302');
    const [outTokenData, setOutTokenData] = useState({name: '', symbol: '', decimals: '', price: '0'});
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

    // AAVE 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9 97
    // 1inch 0x111111111117dC0aa78b770fA6A738034120C302 0.37
    // Aimbot 0x0c48250eb1f29491f1efbeec0261eb556f0973c7 5.75

    useEffect(() => {
      const request_headers = {'api-key' : 'RULpC_ncK1gTXFPYe9WUnjNaaQxXh0r02bBP8VY5o50'};

      // Token info fetch data
      axios.get('https://api.dev.dex.guru/v1/chain/56/tokens/' + inAddress,
          {headers: request_headers}
        )
        .then((response) => {
          // Price fetch data
          axios.get('https://api.dev.dex.guru/v1/chain/56/tokens/' + inAddress + '/market',
            {headers: request_headers}
          )
          .then((response1) => {
            setInTokenData({name: response.data.name, symbol: response.data.symbol, decimals: response.data.decimals, price: response1.data.price_usd});
          })
          .catch((error) => {
              console.error(error);
          });
        })
        .catch((error) => { 
            console.error(error);
        });
    }, [inAddress]);

    useEffect(() => {
      const request_headers = {'api-key' : 'RULpC_ncK1gTXFPYe9WUnjNaaQxXh0r02bBP8VY5o50'};

      // Token info fetch data
      axios.get('https://api.dev.dex.guru/v1/chain/56/tokens/' + outAddress,
          {headers: request_headers}
        )
        .then((response) => {
          // Price fetch data
          axios.get('https://api.dev.dex.guru/v1/chain/56/tokens/' + outAddress + '/market',
            {headers: request_headers}
          )
          .then((response1) => {
            setOutTokenData({name: response.data.name, symbol: response.data.symbol, decimals: response.data.decimals, price: response1.data.price_usd});
          })
          .catch((error) => {
              console.error(error);
          });
        })
        .catch((error) => {
            console.error(error);
        });
    }, [outAddress]);

    useEffect(() => {
      let res = (parseFloat(inTokenData.price) * parseInt(inAmount) / parseFloat(outTokenData.price)) * 99.7; //Calc Uniswap Fee
      setOutAmount(res.toString());
    }, [inAmount, inTokenData, outTokenData]);

    const swapTokens = async () => {
      try {
        await write2({
          functionName: "approve",
          args: [routerAddress, inAmount * (10 ** parseInt(inTokenData.decimals))]
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
              AddressIn:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]' value={inAddress} onChange={(e) => setInAddress(e.target.value)}></input>
              AmountIn :<input type="text" className='p-1 border border-gray-800 rounded-xl w-[100px]' value={inAmount} onChange={(e) => setInAmount(e.target.value)}></input>
            </div>
            <div className='flex flex-row gap-5 font-medium'>
              <p>Token Name: {inTokenData.name}</p>
              <p>Token Symbol: {inTokenData.symbol}</p>
              <p>Token Decimals: {inTokenData.decimals}</p>
              <p>Token Price: {inTokenData.price}</p>
            </div>
            <div className='flex flex-row items-center gap-5 text-lg font-medium'>
              AddressOut:<input type="text" className='p-1 border border-gray-800 rounded-xl w-[250px]' value={outAddress} onChange={(e) => setOutAddress(e.target.value)}></input>
              AmountOut : {outAmount}
            </div>
            <div className='flex flex-row gap-5 font-medium'>
              <p>Token Name: {outTokenData.name}</p>
              <p>Token Symbol: {outTokenData.symbol}</p>
              <p>Token Decimals: {outTokenData.decimals}</p>
              <p>Price: {outTokenData.price}</p>
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
