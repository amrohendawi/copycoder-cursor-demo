import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  BarChart3, 
  Clock, 
  FileText, 
  FolderOpen, 
  MoreHorizontal, 
  TrendingUp 
} from 'lucide-react'

export default function Home() {
  const stats = [
    { label: 'Active Proposals', value: '12', icon: FileText, trend: '+2.5%' },
    { label: 'Documents', value: '284', icon: FolderOpen, trend: '+12.3%' },
    { label: 'Review Time', value: '3.2d', icon: Clock, trend: '-8.1%' },
    { label: 'Approval Rate', value: '94%', icon: TrendingUp, trend: '+3.2%' }
  ]

  const recentActivity = [
    {
      type: 'proposal',
      title: 'Community Development Grant',
      action: 'submitted for review',
      time: '2 hours ago'
    },
    {
      type: 'document',
      title: 'Q2 Board Report',
      action: 'updated',
      time: '4 hours ago'
    },
    {
      type: 'workflow',
      title: 'Education Initiative',
      action: 'moved to approval stage',
      time: '1 day ago'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded">
                  <stat.icon size={20} className="text-blue-600" />
                </div>
                <span className={`text-sm ${
                  stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-semibold">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="p-2 bg-gray-50 rounded">
                    <BarChart3 size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.title}</span>
                      {' '}was {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
