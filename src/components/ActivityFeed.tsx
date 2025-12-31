interface Activity {
  user: string
  action: string
  time: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-start gap-3 pb-3 border-b border-rose-100 last:border-0 hover:bg-rose-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
            {activity.user.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-rose-600">{activity.user}</span>
              {' '}
              <span className="text-gray-600">{activity.action}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">⏰ {activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed
