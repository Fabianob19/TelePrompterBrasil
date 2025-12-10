
import { FileText } from 'lucide-react'

// Window interface is defined in vite-env.d.ts

export function TitleBar() {
    return (
        <div className="titlebar">
            <div className="titlebar-controls">
                <button
                    className="titlebar-btn close"
                    onClick={() => window.electronAPI?.closeWindow()}
                    title="Fechar"
                />
                <button
                    className="titlebar-btn minimize"
                    onClick={() => window.electronAPI?.minimizeWindow()}
                    title="Minimizar"
                />
                <button
                    className="titlebar-btn maximize"
                    onClick={() => window.electronAPI?.maximizeWindow()}
                    title="Maximizar"
                />
            </div>
            <div className="titlebar-logo">
                <FileText size={14} />
                <span>TelePrompterBrasil</span>
            </div>
        </div>
    )
}
