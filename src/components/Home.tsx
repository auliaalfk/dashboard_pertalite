import { TrendingUp, Users, MessageCircle, Heart, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TimelineByDate } from './TimelineByDate';
import { TimelineByHour } from './TimelineByHour';
import { TimelineByDay } from './TimelineByDay';
import { TopCommentsByLikes } from './TopCommentsByLikes';
import { TopCommentsByReplies } from './TopCommentsByReplies';
import { TopUsers } from './TopUsers';

export function Home() {
  const stats = [
    { 
      label: 'Total Comments', 
      value: '1,769', 
      change: 'Unique', 
      icon: MessageCircle,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: 'Total Likes', 
      value: '76,290', 
      change: 'On Comments', 
      icon: Heart,
      color: 'from-pink-500 to-pink-600'
    },
    { 
      label: 'Total Replies', 
      value: '2,043', 
      change: 'Received', 
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      label: 'Avg. Engagement', 
      value: '43.13', 
      change: 'Likes/Comment', 
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2">
          Pertalite Analytics Dashboard
        </h1>
        <p className="text-gray-600">Comprehensive insights from TikTok comments & engagement</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-gray-900 mb-1">{stat.value}</p>
                    <span className="text-xs text-purple-600">{stat.change}</span>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                    <Icon className="size-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline Section */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="size-5 text-purple-500" />
          Timeline & Activity Patterns
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <TimelineByDate />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimelineByHour />
            <TimelineByDay />
          </div>
        </div>
      </div>

      {/* Top Comments Section */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="size-5 text-pink-500" />
          Top Performing Comments
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopCommentsByLikes />
          <TopCommentsByReplies />
        </div>
      </div>

      {/* Top Users Section */}
      <TopUsers />
    </div>
  );
}