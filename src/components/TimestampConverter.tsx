import { useState, useEffect } from 'react'
import Footer from './Footer'

interface TimestampConverterProps {
  onBack: () => void
}

interface ConversionResult {
  unixTimestampMillis: number
  unixTimestampSeconds: number
  iso8601: string
  formatted: string
  rfc2822: string
  timezone: string
}

const TIMEZONES = [
  { value: 'Asia/Seoul', label: 'KST' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'EST' },
  { value: 'America/Los_Angeles', label: 'PST' },
  { value: 'Europe/London', label: 'GMT' },
  { value: 'Asia/Tokyo', label: 'JST' },
]

function TimestampConverter({ onBack }: TimestampConverterProps) {
  const [timestampInput, setTimestampInput] = useState('')
  const [dateYear, setDateYear] = useState('')
  const [dateMonth, setDateMonth] = useState('')
  const [dateDay, setDateDay] = useState('')
  const [dateHour, setDateHour] = useState('')
  const [dateMinute, setDateMinute] = useState('')
  const [dateSecond, setDateSecond] = useState('')
  const [timezone, setTimezone] = useState('Asia/Seoul')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState<ConversionResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update result when timezone or current time changes
  useEffect(() => {
    updateCurrentTimeDisplay()
  }, [currentTime, timezone])

  const updateCurrentTimeDisplay = () => {
    try {
      const unixMillis = currentTime.getTime()
      const unixSeconds = Math.floor(unixMillis / 1000)

      // ISO 8601 format
      const iso8601 = new Intl.DateTimeFormat('sv-SE', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(currentTime).replace(' ', 'T')

      // Korean format
      const koreanDate = new Intl.DateTimeFormat('ko-KR', {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(currentTime)

      // RFC 2822 format
      const rfc2822 = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
      }).format(currentTime)

      setCurrentTimeDisplay({
        unixTimestampMillis: unixMillis,
        unixTimestampSeconds: unixSeconds,
        iso8601: iso8601,
        formatted: koreanDate,
        rfc2822: rfc2822,
        timezone: timezone,
      })
    } catch (err) {
      // 현재 시간 표시 오류는 무시 (변환 오류와 별개)
    }
  }

  const loadCurrentTime = () => {
    setCurrentTime(new Date())
    setResult(null)
  }

  const convertTimestampToDate = async () => {
    if (!timestampInput.trim()) {
      setError('타임스탬프를 입력해주세요')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/devtools/timestamp-convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: timestampInput.trim(),
          conversionType: 'TO_DATE',
          timezone,
        }),
      })

      const apiResponse = await response.json()

      if (apiResponse.success && apiResponse.data.success) {
        setResult({
          unixTimestampMillis: apiResponse.data.unixTimestampMillis,
          unixTimestampSeconds: apiResponse.data.unixTimestampSeconds,
          iso8601: apiResponse.data.iso8601,
          formatted: apiResponse.data.formatted,
          rfc2822: apiResponse.data.rfc2822,
          timezone: apiResponse.data.timezone,
        })
        setError('')
      } else {
        setError(apiResponse.data?.errorMessage || '변환 실패')
      }
    } catch (err) {
      setError('서버 연결 실패')
    } finally {
      setLoading(false)
    }
  }

  const convertDateToTimestamp = async () => {
    if (!dateYear || !dateMonth || !dateDay) {
      setError('년, 월, 일을 입력해주세요')
      return
    }

    // 날짜/시간 문자열 조합
    const year = dateYear.padStart(4, '0')
    const month = dateMonth.padStart(2, '0')
    const day = dateDay.padStart(2, '0')
    const hour = (dateHour || '0').padStart(2, '0')
    const minute = (dateMinute || '0').padStart(2, '0')
    const second = (dateSecond || '0').padStart(2, '0')

    const dateTimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/devtools/timestamp-convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: dateTimeString,
          conversionType: 'TO_TIMESTAMP',
          timezone,
        }),
      })

      const apiResponse = await response.json()

      if (apiResponse.success && apiResponse.data.success) {
        setResult({
          unixTimestampMillis: apiResponse.data.unixTimestampMillis,
          unixTimestampSeconds: apiResponse.data.unixTimestampSeconds,
          iso8601: apiResponse.data.iso8601,
          formatted: apiResponse.data.formatted,
          rfc2822: apiResponse.data.rfc2822,
          timezone: apiResponse.data.timezone,
        })
        setError('')
      } else {
        setError(apiResponse.data?.errorMessage || '변환 실패')
      }
    } catch (err) {
      setError('서버 연결 실패')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      alert('복사 실패')
    }
  }

  const setTimestampOffset = (minutes: number) => {
    const offsetTime = new Date(currentTime.getTime() + minutes * 60 * 1000)
    setTimestampInput(String(offsetTime.getTime()))
  }

  const setDateOffset = (minutes: number) => {
    const offsetTime = new Date(currentTime.getTime() + minutes * 60 * 1000)

    // 타임존을 고려한 날짜/시간 파싱
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(offsetTime)

    const getPartValue = (type: string) => {
      const part = parts.find(p => p.type === type)
      return part ? part.value : '0'
    }

    setDateYear(getPartValue('year'))
    setDateMonth(getPartValue('month'))
    setDateDay(getPartValue('day'))
    setDateHour(getPartValue('hour'))
    setDateMinute(getPartValue('minute'))
    setDateSecond(getPartValue('second'))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
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
                <h1 className="text-3xl font-bold text-gray-900">Timestamp Converter</h1>
                <p className="text-gray-600 mt-1">타임스탬프 변환 도구</p>
              </div>
            </div>

            <button
              onClick={loadCurrentTime}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              새로고침
            </button>
          </div>
        </div>
      </header>

      {/* Current Time Display */}
      {currentTimeDisplay && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="text-center">
              <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 opacity-90">현재 시간 (실시간)</h2>
              <div className="space-y-2">
                <div className="text-4xl font-bold">{currentTimeDisplay.formatted}</div>
                <div className="text-xl opacity-90">{currentTimeDisplay.iso8601}</div>
                <div className="text-sm opacity-75 mt-3">
                  Unix: {currentTimeDisplay.unixTimestampMillis} ms • {currentTimeDisplay.unixTimestampSeconds} s • {currentTimeDisplay.timezone}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Timezone Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">타임존:</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600 flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Input Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Timestamp to Date Converter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Unix Timestamp → 날짜/시간</h2>

            {/* Quick Time Select Buttons */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 mb-2 block">빠른 시간 선택:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTimestampOffset(-1440)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -24시간
                </button>
                <button
                  onClick={() => setTimestampOffset(-60)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -1시간
                </button>
                <button
                  onClick={() => setTimestampOffset(-30)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -30분
                </button>
                <button
                  onClick={() => setTimestampOffset(-10)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -10분
                </button>
                <button
                  onClick={() => setTimestampOffset(0)}
                  className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 rounded text-xs font-medium text-indigo-700 transition-colors"
                >
                  지금
                </button>
                <button
                  onClick={() => setTimestampOffset(10)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +10분
                </button>
                <button
                  onClick={() => setTimestampOffset(30)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +30분
                </button>
                <button
                  onClick={() => setTimestampOffset(60)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +1시간
                </button>
                <button
                  onClick={() => setTimestampOffset(1440)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +24시간
                </button>
              </div>
            </div>

            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && convertTimestampToDate()}
              placeholder="예: 1735894800000 (밀리초) 또는 1735894800 (초)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm mb-4"
            />
            <button
              onClick={convertTimestampToDate}
              disabled={loading}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? '변환중...' : '변환하기'}
            </button>
          </div>

          {/* Date to Timestamp Converter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">날짜/시간 → Unix Timestamp</h2>

            {/* Quick Time Select Buttons */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 mb-2 block">빠른 시간 선택:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDateOffset(-1440)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -24시간
                </button>
                <button
                  onClick={() => setDateOffset(-60)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -1시간
                </button>
                <button
                  onClick={() => setDateOffset(-30)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -30분
                </button>
                <button
                  onClick={() => setDateOffset(-10)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  -10분
                </button>
                <button
                  onClick={() => setDateOffset(0)}
                  className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 rounded text-xs font-medium text-indigo-700 transition-colors"
                >
                  지금
                </button>
                <button
                  onClick={() => setDateOffset(10)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +10분
                </button>
                <button
                  onClick={() => setDateOffset(30)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +30분
                </button>
                <button
                  onClick={() => setDateOffset(60)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +1시간
                </button>
                <button
                  onClick={() => setDateOffset(1440)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
                >
                  +24시간
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">년</label>
                <input
                  type="text"
                  value={dateYear}
                  onChange={(e) => setDateYear(e.target.value.replace(/\D/g, ''))}
                  placeholder="2026"
                  maxLength={4}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">월</label>
                <input
                  type="text"
                  value={dateMonth}
                  onChange={(e) => setDateMonth(e.target.value.replace(/\D/g, ''))}
                  placeholder="01"
                  maxLength={2}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">일</label>
                <input
                  type="text"
                  value={dateDay}
                  onChange={(e) => setDateDay(e.target.value.replace(/\D/g, ''))}
                  placeholder="04"
                  maxLength={2}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">시</label>
                <input
                  type="text"
                  value={dateHour}
                  onChange={(e) => setDateHour(e.target.value.replace(/\D/g, ''))}
                  placeholder="15"
                  maxLength={2}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">분</label>
                <input
                  type="text"
                  value={dateMinute}
                  onChange={(e) => setDateMinute(e.target.value.replace(/\D/g, ''))}
                  placeholder="30"
                  maxLength={2}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm text-center"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">초</label>
                <input
                  type="text"
                  value={dateSecond}
                  onChange={(e) => setDateSecond(e.target.value.replace(/\D/g, ''))}
                  placeholder="00"
                  maxLength={2}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm text-center"
                />
              </div>
            </div>
            <button
              onClick={convertDateToTimestamp}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? '변환중...' : '변환하기'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">변환 결과</h2>
            <div className="space-y-3">
              {/* Unix Timestamp (Milliseconds) */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-900 uppercase">Unix Timestamp (밀리초)</span>
                  <button
                    onClick={() => handleCopy(String(result.unixTimestampMillis), 'millis')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      copiedField === 'millis'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {copiedField === 'millis' ? '✓' : '복사'}
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900">{result.unixTimestampMillis}</div>
              </div>

              {/* Unix Timestamp (Seconds) */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-900 uppercase">Unix Timestamp (초)</span>
                  <button
                    onClick={() => handleCopy(String(result.unixTimestampSeconds), 'seconds')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      copiedField === 'seconds'
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {copiedField === 'seconds' ? '✓' : '복사'}
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900">{result.unixTimestampSeconds}</div>
              </div>

              {/* ISO 8601 */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-green-900 uppercase">ISO 8601</span>
                  <button
                    onClick={() => handleCopy(result.iso8601, 'iso')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      copiedField === 'iso'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {copiedField === 'iso' ? '✓' : '복사'}
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900">{result.iso8601}</div>
              </div>

              {/* Korean Format */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-900 uppercase">한국어 형식</span>
                  <button
                    onClick={() => handleCopy(result.formatted, 'korean')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      copiedField === 'korean'
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {copiedField === 'korean' ? '✓' : '복사'}
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900">{result.formatted}</div>
              </div>

              {/* RFC 2822 */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-900 uppercase">RFC 2822</span>
                  <button
                    onClick={() => handleCopy(result.rfc2822, 'rfc')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      copiedField === 'rfc'
                        ? 'bg-green-500 text-white'
                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                    }`}
                  >
                    {copiedField === 'rfc' ? '✓' : '복사'}
                  </button>
                </div>
                <div className="font-mono text-sm text-gray-900">{result.rfc2822}</div>
              </div>

              {/* Timezone */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <span className="text-xs font-semibold text-gray-700 uppercase block mb-2">타임존</span>
                <div className="font-mono text-sm text-gray-900">{result.timezone}</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default TimestampConverter
