import Table from '../../components/Table'
import TableHeader from '../../components/Table/TableHeader'
import React, { useMemo, useState } from 'react'
import { useHandleSort } from '../../hooks/useHandleSort'
import { useHandleArrow } from '../../hooks/useHandleArrow'
import './index.scss'
import TokenReward from './TokenReward'
import PoolReward from './PoolReward'

const eventsHistory = [
    {
        start: new Date('Nov 19 2021').getTime(),
        startStr: 'Nov 19',
        end: 'Nov 26',
        pool: {
            token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 80_000,
        bonusRewardToken: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
        bonusReward: 5000,
        participants: 92,
        type: 'Finite',
        apr: '3404',
    },
    {
        start: new Date('Dec 7 2021').getTime(),
        startStr: 'Dec 7',
        end: 'Dec 14',
        pool: {
            token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 80_000,
        bonusRewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        bonusReward: 5000,
        participants: 64,
        type: 'Finite',
        apr: '472',
    },
    {
        start: new Date('Dec 22 2021').getTime(),
        startStr: 'Dec 22',
        end: 'Jan 5',
        pool: {
            token0: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
            token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 500_000,
        bonusRewardToken: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' },
        bonusReward: 25_000,
        participants: 113,
        type: 'Finite',
        apr: '312',
    },
    {
        start: new Date('Jan 3 2022').getTime(),
        startStr: 'Jan 3',
        end: 'Jan 17',
        pool: {
            token0: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
            token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 100_000,
        bonusRewardToken: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' },
        bonusReward: 10_000,
        participants: 23,
        type: 'Finite',
        apr: '200',
    },
    {
        start: new Date('Jan 6 2022').getTime(),
        startStr: 'Jan 6',
        end: 'Jan 20',
        pool: {
            token0: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
            token1: { address: '0xc3cffdaf8f3fdf07da6d5e3a89b8723d5e385ff8', symbol: 'RBC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 70_000,
        bonusRewardToken: { address: '0xc3cffdaf8f3fdf07da6d5e3a89b8723d5e385ff8', symbol: 'RBC' },
        bonusReward: 14_000,
        participants: 64,
        type: 'Finite',
        apr: '840',
    },
    {
        start: new Date('Mar 6 2022').getTime(),
        startStr: 'Mar 6',
        end: 'Mar 13',
        pool: {
            token0: { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'MATIC' },
            token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 1_000_000,
        bonusRewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        bonusReward: 400_000,
        participants: 69,
        type: 'Finite',
        apr: '1504',
    },
    {
        start: new Date('Mar 17 2022').getTime(),
        startStr: 'Mar 17',
        end: 'Mar 24',
        pool: {
            token0: { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH' },
            token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 1_000_000,
        bonusRewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        bonusReward: 400_000,
        participants: 19,
        type: 'Finite',
        apr: '1802',
    },
    {
        start: new Date('Mar 27 2022').getTime(),
        startStr: 'Mar 27',
        end: 'Apr 3',
        pool: {
            token0: { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH' },
            token1: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC' }
        },
        rewardToken: { address: '0x0169ec1f8f639b32eec6d923e24c2a2ff45b9dd6', symbol: 'ALGB' },
        reward: 1_000_000,
        bonusRewardToken: null,
        bonusReward: null,
        participants: 28,
        type: 'Finite',
        apr: '473',
    }
]

const sortFields = [
    {
        title: 'Pool',
        value: 'pool'
    },
    {
        title: 'Reward',
        value: 'reward'
    },
    {
        title: 'Bonus Reward',
        value: 'bonusReward'
    },
    {
        title: 'Participants',
        value: 'participants'
    },
    {
        title: 'APR',
        value: 'apr'
    },
    {
        title: 'Dates',
        value: 'start'
    }
]

export default function EventsHistory() {

    const [sortField, setSortField] = useState<string>('start')
    const [sortDirection, setSortDirection] = useState<boolean>(true)
    const [sortIndex, setSortIndex] = useState<number>(5)

    const handleSort = useHandleSort(sortField, sortDirection, setSortDirection, setSortField, setSortIndex)
    const arrow = useHandleArrow(sortField, sortIndex, sortDirection)

    const data = useMemo(() => {
        return eventsHistory.map((el, i) => {
            return [
                {
                    title: <PoolReward pool={el.pool}/>,
                    value: el.pool.token1.address
                },
                {
                    title: <TokenReward token={el.rewardToken} reward={el.reward}/>,
                    value: el.reward
                },
                {
                    title: <TokenReward token={el.bonusRewardToken} reward={el.bonusReward}/>,
                    value: el.bonusReward
                },
                {
                    title: el.participants,
                    value: el.participants
                },
                {
                    title: <span className={'c-g'}>{el.apr + '%'}</span>,
                    value: el.apr
                },
                {
                    title: el.startStr + ' - ' + el.end,
                    value: el.start
                }
            ]
        })
    }, [])

    return (
        <div style={{overflow: "overlay"}}>
            <div className={'w-100 event-table-wrapper'}>
                <Table gridClass={'event-table'} sortDirection={sortDirection} sortField={sortField} sortIndex={sortIndex} data={data}>
                    <TableHeader gridClass={'event-table'} arrow={arrow} handleSort={handleSort} sortFields={sortFields}>
                        <span className={'table-header__item'}>Pool</span>
                        <span className={'table-header__item table-header__item'}>Reward</span>
                        <span className={'table-header__item table-header__item'}>Bonus</span>
                        <span className={'table-header__item table-header__item'}>Participants</span>
                        <span className={'table-header__item table-header__item'}>Best APR</span>
                        <span className={'table-header__item table-header__item'}>Dates</span>
                    </TableHeader>
                </Table>
            </div>
        </div>
    )
}
