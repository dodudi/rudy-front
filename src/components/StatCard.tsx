interface StatCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
}

function StatCard({ title, value, change, isPositive }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100 hover:border-rose-300 hover:shadow-xl transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          isPositive
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {change}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-800 group-hover:text-rose-600 transition-colors mb-3">
        {value}
      </p>
      <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isPositive
              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
              : 'bg-gradient-to-r from-red-400 to-rose-500'
          }`}
          style={{ width: '70%' }}
        />
      </div>
    </div>
  )
}

export default StatCard
