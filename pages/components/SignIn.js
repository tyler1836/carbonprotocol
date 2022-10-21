import { React, useState, useEffect } from 'react'
import { useConnect, useAccount, useSignMessage, useDisconnect, useNetwork } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function SignIn() {
  const [provider, setProvider] = useState(false)
  const { isConnected,address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { status } = useSession()
  const { push } = useRouter()

  useEffect(() => {
    const handleAuth = async () => {

      //enabling metamask  
      const userData = { address, chain: chain.id, network: 'evm' };
      //make a post request to our request-message endpoint
      const { data } = await axios.post('/api/auth/request-message', userData, {
        header: {
          'content-type': 'application/json'
        },
      })
  
      const message = data.message;
      //signing received messagge via metamask
      const signature = await signMessageAsync({message})
      //redirect to user page using callbacks to prevent page refresh
      const {url} = await signIn('credentials', {message, signature, redirect: false, callbackUrl: '/'})
      //push url to router 
      push(url)
  
      console.log(signature);
  
      console.log(userData)
    };

    if(status == 'unauthenticated' && isConnected){
      handleAuth()
    }

  },[status, isConnected])


  return (
    <div>
      <h3>Web3 Authentication</h3>
      <ConnectButton />
    </div>
  );
}

export default SignIn;