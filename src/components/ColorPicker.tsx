import { useState, useEffect } from 'react'
import Footer from './Footer'

interface ColorPickerProps {
  onBack: () => void
}

function ColorPicker({ onBack }: ColorPickerProps) {
  const [hexColor, setHexColor] = useState('#3B82F6')
  const [rgbR, setRgbR] = useState(59)
  const [rgbG, setRgbG] = useState(130)
  const [rgbB, setRgbB] = useState(246)
  const [hslH, setHslH] = useState(217)
  const [hslS, setHslS] = useState(91)
  const [hslL, setHslL] = useState(60)
  const [updateSource, setUpdateSource] = useState<'hex' | 'rgb' | 'hsl'>('hex')

  // HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  // RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Update colors when HEX changes
  useEffect(() => {
    if (updateSource === 'hex') {
      const rgb = hexToRgb(hexColor)
      if (rgb) {
        setRgbR(rgb.r)
        setRgbG(rgb.g)
        setRgbB(rgb.b)
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        setHslH(hsl.h)
        setHslS(hsl.s)
        setHslL(hsl.l)
      }
    }
  }, [hexColor, updateSource])

  // Update colors when RGB changes
  useEffect(() => {
    if (updateSource === 'rgb') {
      const hex = rgbToHex(rgbR, rgbG, rgbB)
      setHexColor(hex.toUpperCase())
      const hsl = rgbToHsl(rgbR, rgbG, rgbB)
      setHslH(hsl.h)
      setHslS(hsl.s)
      setHslL(hsl.l)
    }
  }, [rgbR, rgbG, rgbB, updateSource])

  // Update colors when HSL changes
  useEffect(() => {
    if (updateSource === 'hsl') {
      const rgb = hslToRgb(hslH, hslS, hslL)
      setRgbR(rgb.r)
      setRgbG(rgb.g)
      setRgbB(rgb.b)
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      setHexColor(hex.toUpperCase())
    }
  }, [hslH, hslS, hslL, updateSource])

  const handleHexChange = (value: string) => {
    setUpdateSource('hex')
    setHexColor(value)
  }

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    setUpdateSource('rgb')
    if (channel === 'r') setRgbR(value)
    if (channel === 'g') setRgbG(value)
    if (channel === 'b') setRgbB(value)
  }

  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    setUpdateSource('hsl')
    if (channel === 'h') setHslH(value)
    if (channel === 's') setHslS(value)
    if (channel === 'l') setHslL(value)
  }

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    alert(`${label} 복사되었습니다!`)
  }

  const currentRgb = `rgb(${rgbR}, ${rgbG}, ${rgbB})`
  const currentHsl = `hsl(${hslH}, ${hslS}%, ${hslL}%)`

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Color Picker</h1>
                <p className="text-gray-600 mt-2">HEX, RGB, HSL 색상 변환</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-900 mb-4">미리보기</h2>
            <div
              className="w-full h-64 rounded-lg border-2 border-gray-200 shadow-inner"
              style={{ backgroundColor: hexColor }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-mono text-gray-700">{hexColor}</span>
                <button
                  onClick={() => handleCopy(hexColor, 'HEX')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  복사
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-mono text-gray-700">{currentRgb}</span>
                <button
                  onClick={() => handleCopy(currentRgb, 'RGB')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  복사
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-mono text-gray-700">{currentHsl}</span>
                <button
                  onClick={() => handleCopy(currentHsl, 'HSL')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  복사
                </button>
              </div>
            </div>
          </div>

          {/* Color Controls */}
          <div className="space-y-6">
            {/* HEX Input */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-4">HEX</h2>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={hexColor}
                  onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
                  className="w-16 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={hexColor}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* RGB Input */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-4">RGB</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">Red</label>
                    <span className="text-sm font-mono text-gray-900">{rgbR}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbR}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-black to-red-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">Green</label>
                    <span className="text-sm font-mono text-gray-900">{rgbG}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbG}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-black to-green-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">Blue</label>
                    <span className="text-sm font-mono text-gray-900">{rgbB}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbB}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-black to-blue-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* HSL Input */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-4">HSL</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">Hue</label>
                    <span className="text-sm font-mono text-gray-900">{hslH}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hslH}
                    onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">Saturation</label>
                    <span className="text-sm font-mono text-gray-900">{hslS}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hslS}
                    onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-gray-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-600">Lightness</label>
                    <span className="text-sm font-mono text-gray-900">{hslL}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hslL}
                    onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ColorPicker
