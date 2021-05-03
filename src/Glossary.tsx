import React, { FC, useState } from 'react'
import * as SC from './App.styled'
import { glossary } from './scripts/glossary/glossary'
import ReactMarkdown from 'react-markdown'

interface Props {
  show: boolean
  onClose: () => void
}

export const Glossary: FC<Props> = ({ show, onClose }) => {
  const [mdText, setMdText] = useState<string | null>(null)

  const handleNameClick = (md: string) => {
    fetch(md)
      .then((response) => {
          if (response.ok) return response.text()
          else return Promise.reject("Didn't fetch text correctly")
      })
      .then((text) => {
        setMdText(text)
      })
      .catch((error) => console.error(error))
  }

  if (!show) {
    return null
  }
  
  return (
    <SC.Overlay>
      <SC.Backdrop onClick={onClose} />
      <SC.GlossaryDialogue>
        <SC.GlossaryLayout>
          <SC.EntryList>
            {glossary.map(({ text, name }) => (
              <SC.Entry key={text} onClick={() => handleNameClick(text)}>{name}</SC.Entry>
            ))}
          </SC.EntryList>
          <div>
            {mdText && <ReactMarkdown source={mdText} />}
          </div>
        </SC.GlossaryLayout>
      </SC.GlossaryDialogue>
    </SC.Overlay>
  )
}

