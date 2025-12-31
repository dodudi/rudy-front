import { useState } from 'react'

interface JsonParserProps {
  onBack: () => void
}

function JsonParser({ onBack }: JsonParserProps) {
  const [input, setInput] = useState('')
  const [formattedOutput, setFormattedOutput] = useState('')
  const [minifiedOutput, setMinifiedOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'formatted' | 'minified'>('formatted')

  const handleFormat = async () => {
    if (!input.trim()) {
      setError('JSON 데이터를 입력해주세요')
      return
    }

    setLoading(true)
    setError('')
    setFormattedOutput('')
    setMinifiedOutput('')

    try {
      const response = await fetch('http://localhost:8080/api/devtools/json-parser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ json: input }),
      })

      const result = await response.json()

      if (result.success) {
        setFormattedOutput(result.data.formattedJson)
        setMinifiedOutput(result.data.minifiedJson)
      } else {
        setError(result.data?.errorMessage || result.message || '포맷팅 실패')
      }
    } catch (err) {
      setError('서버 연결 실패: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setFormattedOutput('')
    setMinifiedOutput('')
    setError('')
  }

  const handleCopy = async () => {
    const textToCopy = activeTab === 'formatted' ? formattedOutput : minifiedOutput
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      alert('복사되었습니다!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
                <h1 className="text-2xl font-bold text-gray-900">JSON Parser</h1>
                <p className="text-gray-600 text-sm">JSON 포맷팅 및 유효성 검사</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
              <button
                onClick={handleFormat}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? '처리중...' : '포맷팅'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">오류</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">입력</h2>
              <span className="text-sm text-gray-500">{input.length} 글자</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "홍길동", "age": 25}'
              className="w-full h-[calc(100vh-280px)] p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('formatted')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activeTab === 'formatted'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Formatted
                </button>
                <button
                  onClick={() => setActiveTab('minified')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activeTab === 'minified'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Minified
                </button>
              </div>
              {(formattedOutput || minifiedOutput) && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  복사
                </button>
              )}
            </div>
            <textarea
              value={activeTab === 'formatted' ? formattedOutput : minifiedOutput}
              readOnly
              placeholder={activeTab === 'formatted' ? '포맷팅된 JSON이 여기에 표시됩니다' : '압축된 JSON이 여기에 표시됩니다'}
              className="w-full h-[calc(100vh-280px)] p-4 font-mono text-sm bg-gray-50 resize-none focus:outline-none"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default JsonParser
