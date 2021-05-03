import styled, { css } from 'styled-components'
import testBackdrop from './assets/800-screen-04.jpg'

interface AppProps {
  backdrop?: string;
}

export const App = styled.div<AppProps>`
  height: 100vh;
  width: 100vw;
  position: relative;
  ${props => props.backdrop && css`
    background: url(${testBackdrop}) no-repeat;
    background-size: cover;
  `}
`

export const GlossaryButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
`

export const Novel = styled.div`
  height: 300px;
`

export const Caption = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
`

const RoundedFixedBox = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 25px;
  transition: 0.1s;
  display: flex;
  flex-direction: column;

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`

export const DialogueBox = styled(RoundedFixedBox)`
  bottom: 10%;
  left: 10%;
  right: 10%;
  height: 200px;
  user-select: none;
  cursor: pointer;
  z-index: 1;
`

export const Modifiers = styled(RoundedFixedBox)`
  top: 30px;
  right: 30px;
  width: 300px;

  z-index: 1;
`

export const Overlay = styled.div`
  position: fixed;
  z-index: 2;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`

export const ForkDialogue = styled(RoundedFixedBox)`
  width: 400px;
`

export const GlossaryDialogue = styled(RoundedFixedBox)`
  width: 900px;
  height: 800px;
  background: rgba(255, 255, 255, 0.8);

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`

export const GlossaryLayout = styled.div`
  display: grid;
  grid-template-columns: 20% 79%;
  grid-gap: 1%;
`

export const EntryList = styled.div`
  display: flex;
  flex-direction: column;
`

export const Entry = styled.span`
  cursor: pointer;
`