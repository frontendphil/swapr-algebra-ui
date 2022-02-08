import styled from 'styled-components/macro'

export const PageWrapper = styled.div`
  width: 100%;
`
export const EventsCards = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
export const EventsCardsRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;

  & > * {
    &:not(:last-of-type) {
      margin-right: 1rem;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`{
    flex-direction: column;
    margin-bottom: unset;
    display: none;
    &:first-of-type {
      display: flex;
    }
  }`}
`
export const EmptyMock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  & > * {
    margin-bottom: 1rem;
  }
`
