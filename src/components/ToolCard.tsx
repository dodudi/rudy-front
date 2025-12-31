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
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
    >
      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  )
}

export default ToolCard
