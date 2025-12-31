interface ToolCardProps {
  id: string
  title: string
  description: string
  icon: string
  color: string
  onClick: () => void
}

function ToolCard({ title, description, icon, color, onClick }: ToolCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-rose-300 hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-1"
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-rose-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">
        {description}
      </p>
      <div className="mt-4 flex items-center text-rose-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>도구 열기</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

export default ToolCard
