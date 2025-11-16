import { useEffect, useState } from "react";
import { TrendingUp, Smile, Frown, Meh, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, Legend 
} from 'recharts';

interface KeywordCount {
  keyword: string;
  count: number;
}

interface TimelineSentiment {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentData {
  sentiment_count: {
    positif: number;
    netral: number;
    negatif: number;
  };
  top_positive_keywords: KeywordCount[];
  top_negative_keywords: KeywordCount[];
  top_neutral_keywords: KeywordCount[];
  timeline_data: TimelineSentiment[];
  total: number;
  sample_comments: {
    positive: string[];
    neutral: string[];
    negative: string[];
  };
}

export default function SentimentAnalysis() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const fetchSentimentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = 'http://localhost:8000/api/sentiment/analysis';
      console.log('🔍 Fetching from:', API_URL);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Response error:', text.substring(0, 200));
        throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
      }
      
      const result = await response.json();
      console.log('✅ Data received:', result);
      
      if (result.success) {
        setData(result.data);
        console.log('✅ State updated successfully');
      } else {
        throw new Error('API returned success: false');
      }
    } catch (err) {
      console.error('❌ Error fetching sentiment data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data analisis sentimen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Frown className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchSentimentData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { sentiment_count, top_positive_keywords, top_negative_keywords, top_neutral_keywords, timeline_data, total, sample_comments } = data;

  const sentimentData = [
    {
      name: "Positive",
      value: total > 0 ? Math.round((sentiment_count.positif / total) * 100) : 0,
      count: sentiment_count.positif,
      color: "#10b981",
    },
    {
      name: "Neutral",
      value: total > 0 ? Math.round((sentiment_count.netral / total) * 100) : 0,
      count: sentiment_count.netral,
      color: "#f59e0b",
    },
    {
      name: "Negative",
      value: total > 0 ? Math.round((sentiment_count.negatif / total) * 100) : 0,
      count: sentiment_count.negatif,
      color: "#ef4444",
    },
  ];

  const barChartData = [
    { name: 'Positive', count: sentiment_count.positif, fill: '#10b981' },
    { name: 'Neutral', count: sentiment_count.netral, fill: '#f59e0b' },
    { name: 'Negative', count: sentiment_count.negatif, fill: '#ef4444' }
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2">
          Analisis Sentimen
        </h1>
        <p className="text-gray-600">Distribusi sentimen berdasarkan data TikTok</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Smile className="w-8 h-8 text-green-600" />
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">{sentimentData[0].value}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Positive</p>
            <p className="text-3xl font-bold text-gray-900">{sentiment_count.positif.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">komentar positif</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Meh className="w-8 h-8 text-yellow-600" />
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-lg font-bold text-yellow-600">{sentimentData[1].value}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Neutral</p>
            <p className="text-3xl font-bold text-gray-900">{sentiment_count.netral.toLocaleString()}</p>
            <p className="text-xs text-yellow-600 mt-1">komentar netral</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Frown className="w-8 h-8 text-red-600" />
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-lg font-bold text-red-600">{sentimentData[2].value}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Negative</p>
            <p className="text-3xl font-bold text-gray-900">{sentiment_count.negatif.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-1">komentar negatif</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Tren Sentimen dari Waktu ke Waktu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeline_data.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeline_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: any) => `${value} komentar`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="positive" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Positive"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="negative" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Negative"
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="neutral" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Neutral"
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Data timeline tidak tersedia</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Distribusi Sentimen (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => {
                    const count = props.payload.count;
                    return [`${count} komentar (${value}%)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Meh className="w-5 h-5 text-orange-600" />
              Jumlah Komentar per Sentimen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value) => `${value} komentar`} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          Contoh Komentar
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Smile className="w-6 h-6 text-green-600" />
                <CardTitle className="text-lg">Komentar Positif</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">Contoh respons positif</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {sample_comments?.positive && sample_comments.positive.length > 0 ? (
                <div className="space-y-3">
                  {sample_comments.positive.slice(0, 5).map((comment, index) => (
                    <div key={index} className="p-4 bg-white rounded-2xl border-2 border-green-300 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-2">
                        <Smile className="w-4 h-4 text-green-700 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-800 leading-relaxed font-medium">{comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Smile className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Tidak ada data</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Meh className="w-6 h-6 text-yellow-600" />
                <CardTitle className="text-lg">Komentar Netral</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">Contoh respons netral</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {sample_comments?.neutral && sample_comments.neutral.length > 0 ? (
                <div className="space-y-3">
                  {sample_comments.neutral.slice(0, 5).map((comment, index) => (
                    <div key={index} className="p-4 bg-white rounded-2xl border-2 border-yellow-300 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-2">
                        <Meh className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-800 leading-relaxed font-medium">{comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Meh className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Tidak ada data</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Frown className="w-6 h-6 text-red-600" />
                <CardTitle className="text-lg">Komentar Negatif</CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">Contoh respons negatif</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {sample_comments?.negative && sample_comments.negative.length > 0 ? (
                <div className="space-y-3">
                  {sample_comments.negative.slice(0, 5).map((comment, index) => (
                    <div key={index} className="p-4 bg-white rounded-2xl border-2 border-red-300 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-2">
                        <Frown className="w-4 h-4 text-red-700 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-800 leading-relaxed font-medium">{comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Frown className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Tidak ada data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Smile className="w-6 h-6 text-pink-500" />
              <CardTitle className="text-lg">Top Positive Keywords</CardTitle>
            </div>
            <p className="text-sm text-gray-500 mt-1">Kata dengan kemunculan terbanyak</p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {top_positive_keywords && top_positive_keywords.length > 0 ? (
              <div className="space-y-3">
                {top_positive_keywords.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 hover:shadow-md transition-all">
                    <div className="w-14 h-14 min-w-[3.5rem] rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 capitalize mb-1">{item.keyword}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium border border-green-300">positive</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-pink-600">
                      <Smile className="w-4 h-4" />
                      <span className="font-semibold">{item.count.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Smile className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada data</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Meh className="w-6 h-6 text-yellow-500" />
              <CardTitle className="text-lg">Top Neutral Keywords</CardTitle>
            </div>
            <p className="text-sm text-gray-500 mt-1">Kata dengan kemunculan terbanyak</p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {top_neutral_keywords && top_neutral_keywords.length > 0 ? (
              <div className="space-y-3">
                {top_neutral_keywords.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 hover:shadow-md transition-all">
                    <div className="w-14 h-14 min-w-[3.5rem] rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 capitalize mb-1">{item.keyword}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium border border-yellow-300">neutral</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Meh className="w-4 h-4" />
                      <span className="font-semibold">{item.count.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Meh className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada data</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Frown className="w-6 h-6 text-orange-500" />
              <CardTitle className="text-lg">Top Negative Keywords</CardTitle>
            </div>
            <p className="text-sm text-gray-500 mt-1">Kata dengan kemunculan terbanyak</p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {top_negative_keywords && top_negative_keywords.length > 0 ? (
              <div className="space-y-3">
                {top_negative_keywords.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 border border-rose-300 hover:shadow-md transition-all">
                    <div className="w-14 h-14 min-w-[3.5rem] rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 capitalize mb-1">{item.keyword}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 font-medium border border-rose-400">negative</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-rose-600">
                      <Frown className="w-4 h-4" />
                      <span className="font-semibold">{item.count.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Frown className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Tidak ada data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Ringkasan Analisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Smile className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sentimen Positif</p>
                <p className="text-sm text-gray-600 mt-1">
                  {sentiment_count.positif.toLocaleString()} komentar ({sentimentData[0].value}%) menunjukkan respons positif
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Meh className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sentimen Netral</p>
                <p className="text-sm text-gray-600 mt-1">
                  {sentiment_count.netral.toLocaleString()} komentar ({sentimentData[1].value}%) bersifat informatif
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Frown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sentimen Negatif</p>
                <p className="text-sm text-gray-600 mt-1">
                  {sentiment_count.negatif.toLocaleString()} komentar ({sentimentData[2].value}%) menunjukkan kritik
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Dataset:</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {total.toLocaleString()} komentar
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Sentimen Dominan:</p>
                <p className="text-lg font-bold" style={{ 
                  color: sentimentData.reduce((prev, current) => 
                    prev.value > current.value ? prev : current
                  ).color 
                }}>
                  {sentimentData.reduce((prev, current) => 
                    prev.value > current.value ? prev : current
                  ).name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}