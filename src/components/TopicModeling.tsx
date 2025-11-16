import { MessageSquare, Tag, TrendingUp, Loader2, Lightbulb, BarChart3, Info, Fuel, DollarSign, Car, Wrench, AlertTriangle, Users, Zap, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState, useEffect } from 'react';

interface TopicInfo {
  id: number;
  name: string;
  keywords: string[];
  posts: number;
  percentage: number;
  color: string;
  explanation?: string;
  example_comments?: string[];
}

interface TopicDistribution {
  topic: string;
  value: number;
}

interface ModelInfo {
  model_name: string;
  num_topics: number;
  coherence: number;
}

interface Insights {
  dominant_topic: { name: string; percentage: number };
  least_discussed: { name: string; percentage: number };
  coverage: string;
  diversity: string;
}

interface TopicResponse {
  topics: TopicInfo[];
  distribution: TopicDistribution[];
  total_documents: number;
  model_info: ModelInfo;
  insights: Insights;
}

// Array ikon untuk topik
const topicIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Fuel,
  2: Wrench,
  3: AlertTriangle,
  4: Zap,
  5: Shield,
  6: Car,
  7: DollarSign,
  8: Users,
};

export function TopicModeling() {
  const [topics, setTopics] = useState<TopicInfo[]>([]);
  const [distribution, setDistribution] = useState<TopicDistribution[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/topic/topics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TopicResponse = await response.json();
      
      setTopics(data.topics);
      setDistribution(data.distribution);
      setTotalDocs(data.total_documents);
      setModelInfo(data.model_info);
      setInsights(data.insights);
      
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data topik & menganalisis dengan AI...</p>
          <p className="text-sm text-gray-500 mt-2">Proses ini membutuhkan waktu ~30 detik</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Error Loading Topics</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchTopics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const colorMap: Record<string, string> = {
    'from-purple-500 to-purple-600': '#a855f7',
    'from-pink-500 to-pink-600': '#ec4899',
    'from-orange-500 to-orange-600': '#f97316',
    'from-yellow-500 to-yellow-600': '#eab308',
    'from-green-500 to-green-600': '#22c55e',
    'from-blue-500 to-blue-600': '#3b82f6',
    'from-red-500 to-red-600': '#ef4444',
    'from-indigo-500 to-indigo-600': '#6366f1',
  };

  const getTopicIcon = (id: number) => {
    return topicIcons[id] || Car;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2">
          Pemodelan Topik
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Analisis Komentar TikTok tentang BBM Motor
        </p>
      </div>

      {/* Topic Summary Cards - Simplified (no percentage/posts) */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Tag className="w-6 h-6 text-purple-600" />
          Ringkasan Topik
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const IconComponent = getTopicIcon(topic.id);
            return (
              <Card key={topic.id} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`bg-gradient-to-br ${topic.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {topic.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topic.keywords.slice(0, 6).map((keyword, index) => (
                      <span 
                        key={index}
                        className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                    {topic.keywords.length > 6 && (
                      <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        +{topic.keywords.length - 6}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Charts Section - 1x2 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Bar Chart */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Distribusi Topik (Bar Chart)
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" tick={{ fontSize: 11 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#888" 
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(2)}% (${props.payload.posts.toLocaleString()} posts)`,
                    'Persentase'
                  ]}
                />
                <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
                  {topics.map((topic, index) => (
                    <Cell key={`cell-${index}`} fill={colorMap[topic.color] || '#a855f7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <TrendingUp className="w-5 h-5 text-pink-600" />
              Distribusi Topik (Radar Chart)
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topics}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                />
                <PolarRadiusAxis 
                  angle={30} 
                  stroke="#9ca3af"
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="Persentase"
                  dataKey="percentage"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Persentase']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Topic Explanation Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-pink-600" />
          Penjelasan Detail Topik
        </h2>
        <div className="space-y-6">
          {topics.map((topic) => {
            const IconComponent = getTopicIcon(topic.id);
            return (
              <Card key={topic.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`bg-gradient-to-br ${topic.color} p-4 rounded-xl flex-shrink-0 shadow-md`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {topic.name}
                        </h3>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{topic.percentage}%</p>
                          <p className="text-xs text-gray-500">{topic.posts.toLocaleString()} posts</p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                        {topic.explanation || 'Menunggu analisis...'}
                      </p>
                      
                      {topic.example_comments && topic.example_comments.length > 0 && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                            Contoh Komentar Asli:
                          </p>
                          <ul className="space-y-2">
                            {topic.example_comments.map((comment, idx) => (
                              <li key={idx} className="text-sm text-gray-600 pl-4 border-l-3 border-purple-400 italic">
                                "{comment}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Insight Section */}
      {insights && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50 mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">🏆 Topik Paling Dominan</p>
                <p className="text-lg font-bold text-orange-600">
                  {insights.dominant_topic.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{insights.dominant_topic.percentage}% dari diskusi</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">📊 Topik Paling Jarang</p>
                <p className="text-lg font-bold text-blue-600">
                  {insights.least_discussed.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{insights.least_discussed.percentage}% dari diskusi</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">🎯 Coverage</p>
                <p className="text-base font-bold text-purple-600">{insights.coverage}</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">🌈 Keberagaman Topik</p>
                <p className="text-base font-bold text-pink-600">{insights.diversity}</p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-orange-400">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>💡 Rekomendasi:</strong> Topik "<strong>{insights.dominant_topic.name}</strong>" mendominasi diskusi dengan {insights.dominant_topic.percentage}% dari total komentar. 
                Fokus strategi konten pada topik ini untuk engagement maksimal, sambil mengeksplorasi topik niche seperti "<strong>{insights.least_discussed.name}</strong>" untuk diferensiasi konten.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Information */}
      {modelInfo && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Info className="w-5 h-5 text-purple-600" />
              Informasi Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Model</p>
                <p className="text-lg md:text-xl font-bold text-purple-600">{modelInfo.model_name}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Topics</p>
                <p className="text-lg md:text-xl font-bold text-pink-600">{modelInfo.num_topics}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Coherence</p>
                <p className="text-lg md:text-xl font-bold text-orange-600">{modelInfo.coherence.toFixed(3)}</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Documents</p>
                <p className="text-lg md:text-xl font-bold text-blue-600">{totalDocs.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}