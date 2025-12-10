import { useEffect } from 'react'
import { TeleprompterDisplay } from '../components/Prompter/TeleprompterDisplay'
import { useWindowSync } from '../hooks/useWindowSync'

export function ExternalWindow() {
    // Ativar modo Escravo (isMain = false)
    useWindowSync(false)

    // Ajustar estilos para tela cheia/clean
    useEffect(() => {
        document.body.style.backgroundColor = 'black'
        document.body.style.overflow = 'hidden'
        // Reset manual de margins para garantir
        document.body.style.margin = '0'
        document.body.style.padding = '0'

        return () => {
            document.body.style.backgroundColor = ''
            document.body.style.overflow = ''
            document.body.style.margin = ''
            document.body.style.padding = ''
        }
    }, [])

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'black',
            color: 'white',
            display: 'flex',        // Flex container
            flexDirection: 'column' // Coluna para o filho preencher height
        }}>
            <TeleprompterDisplay isExternal={true} />
        </div>
    )
}
