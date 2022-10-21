import React, {useState} from 'react'
import styles from '../../styles/Home.module.css'
import Staking from '../assets/stakingABI.json'
import Moralis from 'moralis'
import {
  useAccount,
  useBalance,
  useContractWrite,

  usePrepareContractWrite,
  useContractRead
} from 'wagmi'

function Stake() {
  Moralis.start({ apiKey: "HNWtsymzpO87D10hjCMw7J8QmrLyT8ejkzKrINsrw0hVsEPyI7rPG8ldJIAV69JB" })

  const { address, isConnected } = useAccount()
  const [txPending, setTxPending] = useState(false)
  const [amount, setAmount] = useState(0)
  const { config } = usePrepareContractWrite({
    // address of contract
    addressOrName: '0xc8fEdA1417Ab687e07eBF0506B2468d89Fc3b66b',
    // interface or abi
    contractInterface: Staking,
    functionName: 'stakeTokens',
    args: ["0xb94ae34DE09B1EeF75E18e8Ed17F91C32E9B0A9f", address, amount],
    onSettled(data, error){
      console.log(data);
      setTxPending(false)
    }
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    // value = value * 10**18;
    setAmount(value)
    console.log(value)
  }

  const { data: writeData, isLoading: writeIsLoading, isSuccess: writeIsSuccess, write } = useContractWrite(config)

  return (
    <div>
    {txPending ? <h4>Transaction Pending...</h4> :
    <div className={styles.stake}>
      <h1>Stake your Carbon token here for rewards!</h1>
      <input type="number" min={1} max={1000} name="amountStaked" id="" onChange={() => handleChange(event)}/>
      <button onClick={() => {write?.(), setTxPending(true)}}>Stake</button>
    </div>
    }
    </div>
  )
}

export default Stake