import { useState } from 'react'
import ToolCard from './ToolCard'
import JsonParser from './JsonParser'

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
    }
  ]

  // JSON Parser 선택 시 JsonParser 컴포넌트 렌더링
  if (selectedTool === 'json-parser') {
    return <JsonParser onBack={() => setSelectedTool(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Developer Tools</h1>
          <p className="text-gray-600 mt-2">개발자를 위한 유틸리티 모음</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developerTools.map((tool) => (
            <ToolCard
              key={tool.id}
              {...tool}
              onClick={() => setSelectedTool(tool.id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
