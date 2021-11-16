import NON_FUN_POS_MAN from 'abis/non-fun-pos-man'
import STAKER_ABI from 'abis/staker'
import { Contract, providers } from "ethers"
import { Interface } from "ethers/lib/utils"
import { useCallback, useState } from "react"
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, STAKER_ADDRESS } from "../constants/addresses"
import { useTransactionAdder } from "../state/transactions/hooks"
import { useActiveWeb3React } from "./web3"
import { calculateGasMargin } from "../utils/calculateGasMargin"

export function useStakerHandlers() {

    const { chainId, account, library } = useActiveWeb3React()

    const _w: any = window
    const provider = _w.ethereum ? new providers.Web3Provider(_w.ethereum) : undefined

    const stakerInterface = new Interface(STAKER_ABI)
    const nonFunPosManInterface = new Interface(NON_FUN_POS_MAN)

    const addTransaction = useTransactionAdder()

    const [approvedHash, setApproved] = useState(null)
    const [transferedHash, setTransfered] = useState(null)
    const [stakedHash, setStaked] = useState(null)
    const [getRewardsHash, setGetRewards] = useState(null)
    const [withdrawnHash, setWithdrawn] = useState(null)
    const [claimRewardHash, setClaimReward] = useState(null)
    const [sendNFTL2Hash, setSendNFTL2] = useState(null)

    const claimRewardsHandler = useCallback(async (tokenAddress, amount) => {

        if (!account || !provider) return

        const stakerContract = new Contract(
            STAKER_ADDRESS[chainId],
            STAKER_ABI,
            provider.getSigner()
        )

        setClaimReward({ hash: null, id: null })

        try {

            const result = await stakerContract.claimReward(
                tokenAddress,
                account,
                amount
            )

            addTransaction(result, {
                summary: 'Claiming reward for ...'
            })

            setClaimReward({ hash: result.hash, id: tokenAddress, error: null })

        } catch (err) {
            console.error(err)
            setClaimReward({ error: err })
        }

    }, [account, chainId])

    const getRewardsHandler = useCallback(async (token, { staked, rewardToken, bonusRewardToken, pool, startTime, endTime, refundee }) => {

        if (!account || !provider) return

        setGetRewards({ hash: null, id: null })

        try {

            const stakerContract = new Contract(
                STAKER_ADDRESS[chainId],
                STAKER_ABI,
                provider.getSigner()
            )

            if (staked) {

                const result = await stakerContract.exitFarming(
                    [rewardToken.id, bonusRewardToken.id, pool.id, +startTime, +endTime, refundee],
                    +token
                )

                addTransaction(result, {
                    summary: `Rewards were claimed!`
                })
                // staked = false
                setGetRewards({ hash: result.hash, id: token })
            }
        } catch (err) {
            console.error(err)
            setGetRewards('failed')
        }

    }, [account, chainId])

    const withdrawHandler = useCallback(async (token, { transfered, rewardToken, pool, startTime, endTime, refundee }) => {

        if (!account || !provider) return


        setWithdrawn({ hash: null, id: null })

        try {

            const stakerContract = new Contract(
                STAKER_ADDRESS[chainId],
                STAKER_ABI,
                provider.getSigner()
            )

            if (transfered) {
                const result = await stakerContract.withdrawToken(
                    token,
                    account,
                    0x0
                )

                addTransaction(result, {
                    summary: `NFT #${token} was withdrawn!`
                })

                // token.staked = false
                // token.transfered = false
                setWithdrawn({ hash: result.hash, id: token })
            }
        } catch (err) {
            console.error(err)
            setWithdrawn('failed')
        }

    }, [account, chainId])

    const stakeHandler = useCallback(async (selectedNFT, { rewardAddress, bonusRewardAddress, pool, startTime, endTime, refundee }) => {

        if (!account || !provider) return

        setStaked(null)

        let current

        try {

            const stakerContract = new Contract(
                STAKER_ADDRESS[chainId],
                STAKER_ABI,
                provider.getSigner()
            )

            if (selectedNFT.transfered && !selectedNFT.staked) {
                current = selectedNFT.tokenId

                const result = await stakerContract.enterFarming(
                    [rewardAddress, bonusRewardAddress, pool, startTime, endTime, refundee],
                    selectedNFT.tokenId
                )

                addTransaction(result, {
                    summary: `NFT #${selectedNFT.tokenId} was deposited!`
                })

                setStaked({ hash: result.hash, id: selectedNFT.tokenId })
            }
        } catch (e) {
            console.error(e, current)
            setStaked('failed')
            return
        }

    }, [account, chainId])

    const transferHandler = useCallback(async (selectedNFT) => {

        if (!account || !provider) return

        setTransfered(null)

        let current

        try {

            const nonFunPosManContract = new Contract(
                NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                NON_FUN_POS_MAN,
                provider.getSigner()
            )

            if (selectedNFT.approved) {
                current = selectedNFT.tokenId

                const result = await nonFunPosManContract['safeTransferFrom(address,address,uint256)'](
                    account,
                    STAKER_ADDRESS[chainId],
                    selectedNFT.tokenId
                )

                addTransaction(result, {
                    summary: `NFT #${selectedNFT.tokenId} was transferred!`
                })

                setTransfered({ hash: result.hash, id: selectedNFT.tokenId })

            }

        } catch (e) {
            setTransfered('failed')
            console.error(e, current)
            return
        }

    }, [account, chainId])

    const approveHandler = useCallback(async (selectedNFT) => {

        if (!account || !provider) return

        setApproved(null)

        let current

        try {

            const nonFunPosManContract = new Contract(
                NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
                NON_FUN_POS_MAN,
                provider.getSigner()
            )

            if (!selectedNFT.approved) {
                current = selectedNFT.tokenId

                const result = await nonFunPosManContract.approve(
                    STAKER_ADDRESS[chainId],
                    selectedNFT.tokenId
                )

                addTransaction(result, {
                    summary: `NFT #${selectedNFT.tokenId} was approved!`
                })

                setApproved({ hash: result.hash, id: selectedNFT.tokenId })

            }

        } catch (e) {

            setApproved('failed')
            console.error(e, current)
            return
        }

    }, [account, chainId])

    const sendNFTL2Handler = useCallback(async (recipient: string, l2TokenId: string) => {

        if (!account || !provider) return

        setSendNFTL2(null)

        try {

            const stakerContract = new Contract(
                STAKER_ADDRESS[chainId],
                STAKER_ABI,
                provider.getSigner()
            )

            const approveData = stakerInterface.encodeFunctionData('approve', [
                recipient,
                l2TokenId
            ])

            const sendData = stakerInterface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
                account,
                recipient,
                l2TokenId
            ])

            const result = await stakerContract.multicall([
                approveData,
                sendData
            ])

            addTransaction(result, {
                summary: `NFT #${l2TokenId} was sent!`
            })

            setSendNFTL2({ hash: result.hash, id: l2TokenId })

        } catch (e) {
            setSendNFTL2('failed')
            console.error(e)
            return
        }

    }, [account, chainId])

    return {
        approveHandler,
        approvedHash,
        transferHandler,
        transferedHash,
        stakeHandler,
        stakedHash,
        getRewardsHandler,
        getRewardsHash,
        withdrawHandler,
        withdrawnHash,
        claimRewardsHandler,
        claimRewardHash,
        sendNFTL2Handler,
        sendNFTL2Hash
    }
}