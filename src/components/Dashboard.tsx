import { useState } from 'react'
import ToolCard from './ToolCard'

function Dashboard() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const developerTools = [
    {
      id: 'json-parser',
      title: 'JSON Parser',
      description: 'JSON 포맷팅 및 유효성 검사',
      icon: '{ }',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'base64',
      title: 'Base64 Encoder/Decoder',
      description: 'Base64 인코딩 및 디코딩',
      icon: '🔐',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'url-encoder',
      title: 'URL Encoder/Decoder',
      description: 'URL 인코딩 및 디코딩',
      icon: '🔗',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'color-picker',
      title: 'Color Picker',
      description: 'HEX, RGB, HSL 색상 변환',
      icon: '🎨',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'regex-tester',
      title: 'Regex Tester',
      description: '정규표현식 테스트 및 검증',
      icon: '.*',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'timestamp',
      title: 'Timestamp Converter',
      description: '타임스탬프 변환기',
      icon: '⏰',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'hash-generator',
      title: 'Hash Generator',
      description: 'MD5, SHA256 해시 생성',
      icon: '#️⃣',
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 'uuid-generator',
      title: 'UUID Generator',
      description: 'UUID v4 생성기',
      icon: '🆔',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'lorem-ipsum',
      title: 'Lorem Ipsum Generator',
      description: '더미 텍스트 생성기',
      icon: '📝',
      color: 'from-gray-500 to-slate-500'
    },
    {
      id: 'diff-checker',
      title: 'Diff Checker',
      description: '텍스트 비교 도구',
      icon: '⚖️',
      color: 'from-violet-500 to-purple-500'
    },
    {
      id: 'jwt-decoder',
      title: 'JWT Decoder',
      description: 'JWT 토큰 디코더',
      icon: '🎫',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'markdown-preview',
      title: 'Markdown Preview',
      description: '마크다운 미리보기',
      icon: '📄',
      color: 'from-cyan-500 to-blue-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              🛠️ Developer Tools
            </h1>
            <p className="text-gray-600 text-lg">개발자를 위한 편리한 도구 모음</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {developerTools.map((tool) => (
            <ToolCard
              key={tool.id}
              {...tool}
              onClick={() => setSelectedTool(tool.id)}
            />
          ))}
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-rose-200">
            <span className="text-2xl">🚀</span>
            <span className="text-gray-700 font-medium">더 많은 도구가 추가될 예정입니다!</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
