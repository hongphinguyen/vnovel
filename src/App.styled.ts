import styled, { css } from 'styled-components'
import testBackdrop from './assets/800-screen-04.jpg'

interface AppProps {
  backdrop?: string;
}

export const App = styled.div<AppProps>`
  height: 100vh;
  width: 100vw;
  ${props => props.backdrop && css`
    background: url(${testBackdrop}) no-repeat;
    background-size: cover;
  `}
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

export const ForkOverlay = styled.div`
  position: fixed;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ForkDialogue = styled(RoundedFixedBox)`
  width: 400px;
`