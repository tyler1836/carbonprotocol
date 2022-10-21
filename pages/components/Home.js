import { React, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styles from '../../styles/Home.module.css'
import GoerliTokens from '../assets/token-list-goerli.json'
import Staking from '../assets/stakingABI.json'
import Token from '../assets/tokenAbi.json'
import Moralis from 'moralis'
import {
  useAccount,
  useBalance,
  useContractWrite,

  usePrepareContractWrite,
  useContractRead
} from 'wagmi'

function Home() {
  // Used to start moralis need apikey from moralis profile allows wagmi to work
  Moralis.start({ apiKey: "HNWtsymzpO87D10hjCMw7J8QmrLyT8ejkzKrINsrw0hVsEPyI7rPG8ldJIAV69JB" })

  // for reading balances const [read, setRead] = useState(false)
  // using for ternary statement blocking buttons for while transaction is in a pending state
  const [txPending, setTxPending] = useState(false)
  // amount to pass into transfer from state
  const [amount, setAmount] = useState(BigNumber)
  const { address, isConnected } = useAccount()
  const [selectedToken, setSelectedToken] = useState(GoerliTokens[0])
  // setting contract configuration
  const { config } = usePrepareContractWrite({
    // address of contract
    addressOrName: '0x2569800Ecb7B94392a6C6e2F41A2c62A23f56878',
    // interface or abi
    contractInterface: Token,
    //must approve address to access tokens from holding wallet
    functionName: 'transferFrom',
    args: ["0xb94ae34DE09B1EeF75E18e8Ed17F91C32E9B0A9f", address, amount],
    onSettled(data, error){
      console.log(data);
      setTxPending(false)
    }
  })
  /*
  const contractRead = useContractRead({
    addressOrName: '0x2Eb1Cc6631c2d1f178D082577E78F0a5F540d214 ',
    contractInterface: socialTokenABI,
    functionName: 'balanceOf',
    enabled: read,
    onSettled(data, error) {
      let hexNumber = data._hex
      console.log(Number(hexNumber));
      setRead(false)
    }
  })
  */
  const { data: writeData, isLoading: writeIsLoading, isSuccess: writeIsSuccess, write } = useContractWrite(config)
  const { data, isError, isLoading } = useBalance({
    addressOrName: address,
    chainId: 5,
    token: selectedToken?.address || ''
  })

  const readOptions = {
    contractAddress: GoerliTokens[2].address,
    functionName: "balanceOf",
    abi: Staking
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setAmount(value)
    console.log(amount, value)
  }

  return (
    <main className={styles.main}>
      <div className={styles.home}>
        <h1>Invest in our future!</h1>
        <h2>Become an EcoCitizen today!</h2>
      </div>
      <div className={styles.home}>
        <h3>Carbon staking token</h3>
        {txPending ? <h4>Transaction pending...</h4> 
        :
          <div style={{display: "flex", flexDirection: "column"}}>
            <button onClick={() => {
              write?.()
              console.log(write)
              setTxPending(true)
              console.log(writeData)
            }}>Buy your token here</button>
            <input type="number" name='amtOfTokens'min={1} max={1000} onChange={() => handleChange(event)}/>
            <select name="tokenSelect" id="" onChange={(e) => {
              setSelectedToken(GoerliTokens[e.target.value])
            }}>
              <option defaultChecked={true}>Select</option>
              {GoerliTokens.map((token, index) => {
                return <option value={index} key={token.address}>{token.name}</option>
              })}
            </select>
            {(isLoading || !isConnected) ? <h2>Fetching Data</h2> :
              <div>
                <h4>{`${address.slice(0, 6)}...${address.slice(address.length - 4)}`}</h4>
                <p>{data?.formatted}  {data?.symbol}</p>
              </div>}
          </div> }
      </div>
    </main>

  )
}

export default Home