
import React from 'react'
import { CueStyleType } from '../../types'

interface CueIndicatorProps {
    style: CueStyleType
    position: number
    color: string
    opacity: number
    thickness: number
}

export function CueIndicator({ style, position, color, opacity, thickness }: CueIndicatorProps) {
    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        left: 0,
        right: 0,
        top: `${position}%`,
        transform: 'translateY(-50%)',
        opacity: opacity / 100,
        pointerEvents: 'none',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        mixBlendMode: 'screen', // Better blending for glow
    }

    const glowFilter = `drop-shadow(0 0 2px ${color}) drop-shadow(0 0 4px ${color}40)` // Reduced glow spread

    const ArrowRight = () => (
        <svg width="18" height="22" viewBox="0 0 18 22" style={{ filter: glowFilter, flexShrink: 0 }}>
            <polygon points="0,0 18,11 0,22" fill={color} />
        </svg>
    )

    const ArrowLeft = () => (
        <svg width="18" height="22" viewBox="0 0 18 22" style={{ filter: glowFilter, flexShrink: 0 }}>
            <polygon points="18,0 0,11 18,22" fill={color} />
        </svg>
    )

    const Line = () => (
        <div style={{
            flex: 1,
            height: `${thickness}px`,
            background: color,
            boxShadow: `0 0 4px ${color}, 0 0 8px ${color}40`, // Reduced glow
            borderRadius: '2px',
        }} />
    )

    if (style === 'arrow-left') {
        return (
            <div style={containerStyle}>
                <ArrowRight />
            </div>
        )
    }

    if (style === 'arrow-left-line') {
        return (
            <div style={containerStyle}>
                <ArrowRight />
                <Line />
            </div>
        )
    }

    if (style === 'full') {
        return (
            <div style={containerStyle}>
                <ArrowRight />
                <Line />
                <ArrowLeft />
            </div>
        )
    }

    if (style === 'line-arrow-right') {
        return (
            <div style={containerStyle}>
                <Line />
                <ArrowLeft />
            </div>
        )
    }

    if (style === 'arrow-right') {
        return (
            <div style={{ ...containerStyle, justifyContent: 'flex-end' }}>
                <ArrowLeft />
            </div>
        )
    }

    if (style === 'arrows-only') {
        return (
            <div style={containerStyle}>
                <ArrowRight />
                <div style={{ flex: 1 }} />
                <ArrowLeft />
            </div>
        )
    }

    return (
        <div style={{ ...containerStyle, padding: '0 15px' }}>
            <Line />
        </div>
    )
}
