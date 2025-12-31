import { useState } from 'react'
import Footer from './Footer'

interface JsonParserProps {
  onBack: () => void
}

function JsonParser({ onBack }: JsonParserProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [indentSize, setIndentSize] = useState(2)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleFormat = async () => {
    if (!input.trim()) {
      setError('JSON 데이터를 입력해주세요')
      return
    }

    setLoading(true)
    setError('')
    setOutput('')
    setIsValid(null)

    try {
      const response = await fetch('http://localhost:8080/api/devtools/json-parser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ json: input, indent: indentSize }),
      })

      const result = await response.json()

      if (result.success) {
        setOutput(result.data.formattedJson)
        setIsValid(result.data.isValid)
      } else {
        setError(result.data?.errorMessage || result.message || '포맷팅 실패')
        setIsValid(false)
      }
    } catch (err) {
      setError('서버 연결 실패: ' + (err instanceof Error ? err.message : String(err)))
      setIsValid(false)
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = () => {
    if (!input.trim()) {
      setError('JSON 데이터를 입력해주세요')
      return
    }

    try {
      JSON.parse(input)
      setIsValid(true)
      setError('')
      setOutput('✓ 유효한 JSON입니다.')
    } catch (err) {
      setIsValid(false)
      setError('유효하지 않은 JSON: ' + (err instanceof Error ? err.message : String(err)))
      setOutput('')
    }
  }

  const handleMinify = () => {
    if (!input.trim()) {
      setError('JSON 데이터를 입력해주세요')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setIsValid(true)
      setError('')
    } catch (err) {
      setIsValid(false)
      setError('유효하지 않은 JSON: ' + (err instanceof Error ? err.message : String(err)))
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setIsValid(null)
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      alert('복사되었습니다!')
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
                <h1 className="text-3xl font-bold text-gray-900">JSON Parser</h1>
                <p className="text-gray-600 mt-2">JSON 포맷팅 및 유효성 검사</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alerts */}
      <div className="max-w-6xl mx-auto px-6 mt-4 space-y-3">
        {/* Validation Status */}
        {isValid !== null && (
          <div className={`rounded-lg p-4 flex items-start gap-3 ${
            isValid
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <svg className={`w-5 h-5 mt-0.5 ${isValid ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
              {isValid ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <div className="flex-1">
              <h3 className={`text-sm font-semibold ${isValid ? 'text-green-800' : 'text-red-800'}`}>
                {isValid ? '유효한 JSON' : '유효하지 않은 JSON'}
              </h3>
              <p className={`text-sm mt-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                {isValid ? 'JSON 형식이 올바릅니다.' : 'JSON 형식에 오류가 있습니다.'}
              </p>
            </div>
            <button
              onClick={() => setIsValid(null)}
              className={isValid ? 'text-green-400 hover:text-green-600' : 'text-red-400 hover:text-red-600'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
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
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Control Buttons */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">들여쓰기:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2 칸</option>
              <option value={4}>4 칸</option>
              <option value={8}>8 칸</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleValidate}
              className="px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors font-medium"
            >
              검증
            </button>
            <button
              onClick={handleMinify}
              className="px-4 py-2 text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors font-medium"
            >
              압축
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              초기화
            </button>
            <button
              onClick={handleFormat}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? '처리중...' : '파싱'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
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
              className="w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">결과</h2>
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

export default JsonParser
