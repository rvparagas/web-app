import { useSocket } from '../context/SocketContext'
import './ActivityFeed.css'

function ActivityFeed() {
  const { activities, onlineUsers, typingUsers } = useSocket()

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create': return '+'
      case 'update': return '~'
      case 'delete': return '-'
      case 'join': return '>'
      case 'leave': return '<'
      default: return '*'
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <aside className="activity-feed">
      <div className="activity-section">
        <h3>Online Now</h3>
        <div className="online-users">
          {onlineUsers.length === 0 ? (
            <p className="empty-state">No one else online</p>
          ) : (
            onlineUsers.map((user, i) => (
              <div key={i} className="online-user">
                <span className="online-dot"></span>
                <span className="user-email">{user.email}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          <span className="typing-dots">
            <span></span><span></span><span></span>
          </span>
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      <div className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {activities.length === 0 ? (
            <p className="empty-state">No recent activity</p>
          ) : (
            activities.map((activity, i) => (
              <div key={i} className={`activity-item activity-${activity.type}`}>
                <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                <div className="activity-content">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-message">{activity.message}</span>
                </div>
                <span className="activity-time">{formatTime(activity.timestamp)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}

export default ActivityFeed
