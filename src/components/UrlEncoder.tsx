import { useState } from 'react'
import Footer from './Footer'

interface UrlEncoderProps {
  onBack: () => void
}

type OperationType = 'encode' | 'decode'

function UrlEncoder({ onBack }: UrlEncoderProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [operation, setOperation] = useState<OperationType>('encode')

  const handleProcess = async () => {
    if (!input.trim()) {
      setError('데이터를 입력해주세요')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const endpoint = operation === 'encode'
        ? 'http://localhost:8080/api/devtools/url-encode'
        : 'http://localhost:8080/api/devtools/url-decode'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      })

      const result = await response.json()

      if (result.success && result.data.success) {
        setOutput(result.data.result)
      } else {
        setError(result.data?.errorMessage || result.message || '처리 실패')
      }
    } catch (err) {
      setError('서버 연결 실패: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      alert('복사되었습니다!')
    }
  }

  const handleSwap = () => {
    if (output) {
      setInput(output)
      setOutput('')
      setOperation(operation === 'encode' ? 'decode' : 'encode')
    }
  }

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
                <h1 className="text-3xl font-bold text-gray-900">URL Encoder/Decoder</h1>
                <p className="text-gray-600 mt-2">URL 인코딩 및 디코딩</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-4 w-full">
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
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Control Buttons */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">작업:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setOperation('encode')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  operation === 'encode'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                인코딩
              </button>
              <button
                onClick={() => setOperation('decode')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  operation === 'decode'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                디코딩
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {output && (
              <button
                onClick={handleSwap}
                className="px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                ↔ 교체
              </button>
            )}
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              초기화
            </button>
            <button
              onClick={handleProcess}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? '처리중...' : operation === 'encode' ? '인코딩' : '디코딩'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                {operation === 'encode' ? '원본 URL' : 'URL 인코딩 텍스트'}
              </h2>
              <span className="text-sm text-gray-500">{input.length} 글자</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={operation === 'encode' ? 'https://example.com?name=홍길동&age=25' : 'https%3A%2F%2Fexample.com%3Fname%3D%ED%99%8D%EA%B8%B8%EB%8F%99'}
              className="w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                {operation === 'encode' ? 'URL 인코딩 결과' : '디코딩 결과'}
              </h2>
              {output && (
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
              value={output}
              readOnly
              placeholder="결과가 여기에 표시됩니다"
              className="w-full h-64 p-4 font-mono text-sm bg-gray-50 resize-none focus:outline-none"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default UrlEncoder
