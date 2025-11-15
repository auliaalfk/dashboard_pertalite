import { MessageSquare, Tag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const topics = [
  { 
    id: 1,
    name: 'Harga & Ekonomi',
    keywords: ['harga', 'murah', 'terjangkau', 'hemat', 'irit', 'kantong'],
    posts: 4832,
    percentage: 30.5,
    color: 'from-purple-500 to-purple-600'
  },
  { 
    id: 2,
    name: 'Kualitas & Performa',
    keywords: ['kualitas', 'performa', 'mesin', 'stabil', 'bagus', 'cocok'],
    posts: 3654,
    percentage: 23.1,
    color: 'from-pink-500 to-pink-600'
  },
  { 
    id: 3,
    name: 'Ketersediaan',
    keywords: ['antri', 'habis', 'stok', 'spbu', 'jauh', 'susah'],
    posts: 2987,
    percentage: 18.8,
    color: 'from-orange-500 to-orange-600'
  },
  { 
    id: 4,
    name: 'Perbandingan BBM',
    keywords: ['pertamax', 'vs', 'pertalite', 'beda', 'mending', 'pilih'],
    posts: 2456,
    percentage: 15.5,
    color: 'from-yellow-500 to-yellow-600'
  },
  { 
    id: 5,
    name: 'Tips & Trik',
    keywords: ['tips', 'cara', 'trik', 'pagi', 'fresh', 'saran'],
    posts: 1918,
    percentage: 12.1,
    color: 'from-green-500 to-green-600'
  },
];

const topicDistribution = [
  { topic: 'Harga', value: 30.5 },
  { topic: 'Kualitas', value: 23.1 },
  { topic: 'Ketersediaan', value: 18.8 },
  { topic: 'Perbandingan', value: 15.5 },
  { topic: 'Tips', value: 12.1 },
];

const topicTrend = [
  { topic: 'Harga', Week1: 450, Week2: 520, Week3: 580, Week4: 670 },
  { topic: 'Kualitas', Week1: 340, Week2: 380, Week3: 420, Week4: 480 },
  { topic: 'Ketersediaan', Week1: 280, Week2: 310, Week3: 340, Week4: 380 },
  { topic: 'Perbandingan', Week1: 230, Week2: 260, Week3: 280, Week4: 310 },
  { topic: 'Tips', Week1: 180, Week2: 200, Week3: 220, Week4: 250 },
];

export function TopicModeling() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2">
          Pemodelan Topik
        </h1>
        <p className="text-gray-600">Analisis topik pembahasan dari komentar TikTok</p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {topics.map((topic) => (
          <Card key={topic.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${topic.color} p-3 rounded-xl`}>
                  <Tag className="size-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-gray-900">{topic.percentage}%</p>
                  <p className="text-xs text-gray-500">{topic.posts} posts</p>
                </div>
              </div>
              <h3 className="text-gray-900 mb-3">{topic.name}</h3>
              <div className="flex flex-wrap gap-2">
                {topic.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-5 text-purple-500" />
              Distribusi Topik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="topic" type="category" stroke="#888" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value" fill="url(#topicGradient)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="topicGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-pink-500" />
              Radar Topic Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={topicDistribution}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="topic" stroke="#888" />
                <PolarRadiusAxis stroke="#888" />
                <Radar 
                  name="Topics" 
                  dataKey="value" 
                  stroke="#a855f7" 
                  fill="#a855f7" 
                  fillOpacity={0.6} 
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Topic Trends */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-orange-500" />
            Trend Topik per Minggu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicTrend.map((topic, index) => {
              const weeks = [topic.Week1, topic.Week2, topic.Week3, topic.Week4];
              const maxWeek = Math.max(...weeks);
              return (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">{topic.topic}</p>
                    <span className="text-sm text-green-600">
                      +{Math.round(((topic.Week4 - topic.Week1) / topic.Week1) * 100)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {weeks.map((value, weekIndex) => (
                      <div key={weekIndex}>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${(value / maxWeek) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          W{weekIndex + 1}: {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
