import { useEffect, useState } from 'react'
import { Frown } from 'react-feather'
import Loader from '../../components/Loader'
import Modal from '../../components/Modal'
import { StakeModal } from '../../components/StakeModal'
import { StakerEventCard } from '../../components/StakerEventCard'
import { FarmingType } from '../../models/enums'
import { useChunkedRows } from '../../utils/chunkForRows'
import { EventsCardsRow, EventsCards, PageWrapper, EmptyMock } from './styled'

export default function EternalFarmsPage({
    data,
    refreshing,
    fetchHandler
}: {
    data: any
    refreshing: boolean
    fetchHandler: () => any
}) {
    const [modalForPool, setModalForPool] = useState(null)

    useEffect(() => {
        fetchHandler()
    }, [])

    const chunked = useChunkedRows(data, 3)

    return (
        <>
            <Modal isOpen={!!modalForPool} onHide={() => setModalForPool(null)}
                   onDismiss={() => console.log()}>
                {modalForPool && (
                    <>
                        <StakeModal
                            event={modalForPool}
                            closeHandler={() => setModalForPool(null)}
                            farmingType={FarmingType.ETERNAL}
                        />
                    </>
                )}
            </Modal>
            <PageWrapper>
                {refreshing ? (
                    <EmptyMock>
                        <Loader stroke='white' size='20px' />
                    </EmptyMock>
                ) : !data || data.length === 0 ? (
                    <EmptyMock>
                        <div>No infinite farms</div>
                        <Frown size={35} stroke={'white'} />
                    </EmptyMock>
                ) : !refreshing && data.length != 0 ? (
                    <EventsCards>
                        {chunked?.map((el, i) => (
                            <EventsCardsRow key={i}>
                                {el.map((event, j) => (
                                    <StakerEventCard
                                        key={j}
                                        stakeHandler={() => setModalForPool(event)}
                                        refreshing={refreshing}
                                        now={0}
                                        eternal
                                        event={event}
                                    />
                                ))}
                            </EventsCardsRow>
                        ))}
                    </EventsCards>
                ) : null}
            </PageWrapper>
        </>
    )
}
