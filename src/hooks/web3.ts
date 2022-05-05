import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { gnosisSafe, injected, ontoconnector } from '../connectors'
import { NetworkContextName } from '../constants/misc'
import { OntoWindow } from '../models/types/global'
import { useUserSelectedWallet } from '../state/user/hooks'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
    const context = useWeb3React<Web3Provider>()
    const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
    return context.active ? context : contextNetwork
}


export function useEagerConnect() {
    const { activate, active, deactivate } = useWeb3React()
    const [tried, setTried] = useState(false)
    const [wallet, setWallet] = useUserSelectedWallet()
    const onto = (window as unknown as OntoWindow).onto

    // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
    // if we are not embedded in an iframe, it is not worth checking
    const [triedSafe, setTriedSafe] = useState(!(window.parent !== window))
    const [triedOnto, setTriedOnto] = useState(false)

    function changeOntoWallet(e: string[]) {
        if (e.length === 0) {
            deactivate()
            setWallet('')
            onto.removeListener('accountsChanged', changeOntoWallet)
        } else {
            activate(ontoconnector, undefined, true)
                .then(() => {
                    window.location.reload()
                })
                .catch(e => {
                    window.location.reload()
                })
        }
    }

    // first, try connecting to a gnosis safe
    useEffect(() => {
        if (!triedSafe) {
            gnosisSafe.isSafeApp().then((loadedInSafe) => {
                if (loadedInSafe) {
                    activate(gnosisSafe, undefined, true).catch(() => {
                        setTriedSafe(true)
                    })
                } else {
                    setTriedSafe(true)
                }
            })
        }
    }, [activate, setTriedSafe, triedSafe])

    useEffect(() => {
        if (!triedOnto) {
            if (wallet === 'onto') {
                activate(ontoconnector, undefined, true)
                    .then(() => {
                        onto.on('accountsChanged', changeOntoWallet)
                    })
                    .catch((e) => {
                        alert('Unsupported Chain Id')
                        setTriedOnto(true)
                        onto.on('accountsChanged', changeOntoWallet)
                    })
            } else {
                setTriedOnto(true)
            }
        } else {
            setTriedOnto(true)
        }
    }, [activate, setTriedSafe, triedOnto])

    // then, if that fails, try connecting to an injected connector
    //@ts-ignore
    useEffect(async () => {
        if (!active && triedSafe && triedOnto) {

            const timeout = new Promise((res, rej) => setTimeout(rej, 8000))
            const isAuthorized = injected.isAuthorized()

            Promise.race([isAuthorized, timeout]).then(isAuthorized => {

                if (wallet === 'metamask') {
                    activate(injected, undefined, true).catch(() => {
                        setTried(true)
                    })
                }
                if (isAuthorized) {
                    activate(injected, undefined, true).catch(() => {
                        setTried(true)
                    })
                } else {
                    if (isMobile && window.ethereum) {
                        activate(injected, undefined, true).catch(() => {
                            setTried(true)
                        })
                    } else {
                        setTried(true)
                    }
                }
            }).catch(e => window.location.reload())

        }
    }, [activate, active, triedSafe, triedOnto])

    // wait until we get confirmation of a connection to flip the flag
    useEffect(() => {
        if (active) {
            setTried(true)
            setTriedOnto(true)
        }
    }, [active])

    return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
    const { active, error, activate, deactivate } = useWeb3React()
    const [, setWallet] = useUserSelectedWallet()

    const [currentOntoAccount, setCurrentOntoAccount] = useState('')

    useEffect(() => {
        const ethereum = window.ethereum

        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = () => {
                // eat errors
                activate(injected, undefined, true).catch((error) => {
                    console.error('Failed to activate after chain changed', error)
                })
            }

            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    // eat errors
                    activate(injected, undefined, true).catch((error) => {
                        console.error('Failed to activate after accounts changed', error)
                    })
                } else {
                    setWallet('')
                }
            }

            ethereum.on('chainChanged', handleChainChanged)
            ethereum.on('accountsChanged', handleAccountsChanged)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    ethereum.removeListener('accountsChanged', handleAccountsChanged)
                }
            }

        }

        return undefined
    }, [active, error, suppress, activate])
}
