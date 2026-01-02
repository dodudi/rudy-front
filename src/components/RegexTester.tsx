import { useState } from 'react'
import Footer from './Footer'

interface RegexTesterProps {
  onBack: () => void
}

interface RegexMatch {
  match: string
  start: number
  end: number
  groups: string[]
}

function RegexTester({ onBack }: RegexTesterProps) {
  const [pattern, setPattern] = useState('')
  const [testText, setTestText] = useState('')
  const [matches, setMatches] = useState<RegexMatch[]>([])
  const [matchCount, setMatchCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [caseInsensitive, setCaseInsensitive] = useState(false)
  const [multiline, setMultiline] = useState(false)
  const [dotAll, setDotAll] = useState(false)

  const handleTest = async () => {
    if (!pattern.trim()) {
      setError('정규표현식 패턴을 입력해주세요')
      return
    }
    if (!testText.trim()) {
      setError('테스트 텍스트를 입력해주세요')
      return
    }

    setLoading(true)
    setError('')
    setMatches([])
    setMatchCount(0)

    try {
      const response = await fetch('http://localhost:8080/api/devtools/regex-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pattern,
          text: testText,
          caseInsensitive,
          multiline,
          dotAll,
        }),
      })

      const result = await response.json()

      if (result.success && result.data.success) {
        setMatches(result.data.matches)
        setMatchCount(result.data.matchCount)
      } else {
        setError(result.data?.errorMessage || result.message || '테스트 실패')
      }
    } catch (err) {
      setError('서버 연결 실패: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPattern('')
    setTestText('')
    setMatches([])
    setMatchCount(0)
    setError('')
  }

  // 텍스트에서 매칭 부분 하이라이트
  const highlightMatches = () => {
    if (matches.length === 0) return testText

    const parts: JSX.Element[] = []
    let lastIndex = 0

    matches.forEach((match, idx) => {
      // 매칭 이전 텍스트
      if (match.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>{testText.substring(lastIndex, match.start)}</span>
        )
      }
      // 매칭된 텍스트 (하이라이트)
      parts.push(
        <span key={`match-${idx}`} className="bg-yellow-200 font-semibold">
          {match.match}
        </span>
      )
      lastIndex = match.end
    })

    // 마지막 매칭 이후 텍스트
    if (lastIndex < testText.length) {
      parts.push(
        <span key="text-end">{testText.substring(lastIndex)}</span>
      )
    }

    return parts
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
                <h1 className="text-3xl font-bold text-gray-900">Regex Tester</h1>
                <p className="text-gray-600 mt-2">정규표현식 테스트 및 검증</p>
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

      {/* Success Alert */}
      {!error && matchCount > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-4 w-full">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-800">매칭 성공</h3>
              <p className="text-sm text-green-600 mt-1">{matchCount}개의 매칭을 찾았습니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Pattern Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">정규표현식 패턴</h2>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\d+|[A-Za-z]+"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {/* Flags */}
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseInsensitive}
                onChange={(e) => setCaseInsensitive(e.target.checked)}
                className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">대소문자 구분 안함 (i)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={multiline}
                onChange={(e) => setMultiline(e.target.checked)}
                className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">멀티라인 모드 (m)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dotAll}
                onChange={(e) => setDotAll(e.target.checked)}
                className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">. 이 줄바꿈 포함 (s)</span>
            </label>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            초기화
          </button>
          <button
            onClick={handleTest}
            disabled={loading}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? '테스트 중...' : '테스트'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Text Input */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">테스트 텍스트</h2>
              <span className="text-sm text-gray-500">{testText.length} 글자</span>
            </div>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="테스트할 텍스트를 입력하세요"
              className="w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none"
            />
          </div>

          {/* Matches Result */}
          <div className="bg-white rounded-lg shadow">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">매칭 결과</h2>
              {matchCount > 0 && (
                <span className="text-sm font-semibold text-yellow-600">{matchCount}개 매칭</span>
              )}
            </div>
            <div className="h-96 p-4 overflow-y-auto">
              {matches.length === 0 ? (
                <p className="text-gray-400 text-sm">매칭 결과가 여기에 표시됩니다</p>
              ) : (
                <div className="space-y-4">
                  {matches.map((match, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">매칭 #{idx + 1}</span>
                        <span className="text-xs text-gray-500">위치: {match.start}-{match.end}</span>
                      </div>
                      <div className="bg-white rounded p-2 mb-2">
                        <span className="font-mono text-sm text-gray-900">{match.match}</span>
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-gray-500">캡처 그룹:</span>
                          <div className="mt-1 space-y-1">
                            {match.groups.map((group, gIdx) => (
                              <div key={gIdx} className="bg-white rounded p-2">
                                <span className="text-xs text-gray-500">그룹 {gIdx + 1}: </span>
                                <span className="font-mono text-sm text-gray-900">{group || '(null)'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlighted Preview */}
        {matches.length > 0 && (
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">하이라이트 미리보기</h2>
            </div>
            <div className="p-4 font-mono text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
              {highlightMatches()}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default RegexTester
