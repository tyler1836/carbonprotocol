import '../styles/globals.css'
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { SessionProvider } from 'next-auth/react'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const { provider, webSocketProvider, chains } = configureChains(defaultChains, [publicProvider()])

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
      <SessionProvider session={session} basePath="/api/auth/request-message" refetchInterval={0}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>


  )
}

export default MyApp
