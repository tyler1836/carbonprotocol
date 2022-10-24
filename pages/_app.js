import '../styles/globals.css'
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi'
/* use publicprovider when first testing out app not recommended will give 429 errors
import { publicProvider } from 'wagmi/providers/public'
*/
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { SessionProvider } from 'next-auth/react'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const { provider, webSocketProvider, chains } = configureChains(defaultChains, [alchemyProvider({ apiKey: process.env.ALCHEMY_KEY })])

const {connectors} = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
})

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors
})


function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <WagmiConfig client={client}>
       <SessionProvider session={session}  refetchInterval={0}>{/* basePath="/api/auth/request-message" */}
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>


  )
}

export default MyApp
