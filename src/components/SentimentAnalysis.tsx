import { useEffect, useState } from 'react';
import { TrendingUp, Smile, Frown, Meh } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

export function SentimentAnalysis() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    positive: 0,
    neutral: 0,
    negative: 0
  });

  // ---------------------------------------------------
  // 🔥 FETCH DATA DARI BACKEND FASTAPI
  // ---------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:8000/api/sentiment/all")
      .then(res => res.json())
      .then(data => {
        setData(data);

        const positive = data.filter(d => d.sentiment_gemini === "positif").length;
        const neutral = data.filter(d => d.sentiment_gemini === "netral").length;
        const negative = data.filter(d => d.sentiment_gemini === "negatif").length;

        setSummary({ positive, neutral, negative });
      });
  }, []);

  // ---------------------------------------------------
  // 🔥 DATA UNTUK PIECHART
  // ---------------------------------------------------
  const chartSentiment = [
    { name: 'Positive', value: summary.positive, color: '#10b981' },
    { name: 'Neutral', value: summary.neutral, color: '#f59e0b' },
    { name: 'Negative', value: summary.negative, color: '#ef4444' },
  ];

  // Dummy trend (bisa dibuat dynamic kalau kamu punya kolom date)
  const trendData = [
    { date: 'Week 1', positive: summary.positive, neutral: summary.neutral, negative: summary.negative },
  ];

  // Dummy keyword until we calculate real NLP keyword extraction
  const topPositive = ["harga terjangkau", "irit", "bagus", "stabil", "mudah ditemukan"];
  const topNegative = ["antri panjang", "stok habis", "mahal", "kualitas turun", "jauh dari rumah"];

  // ---------------------------------------------------
  // 🔥 UI DASHBOARD
  // ---------------------------------------------------
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2 text-3xl font-bold">
          Analisis Sentimen
        </h1>
        <p className="text-gray-600">Distribusi sentimen berdasarkan komentar TikTok</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Positive */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Positive</p>
                <p className="text-gray-900 text-xl">{summary.positive}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl">
                <Smile className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neutral */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Neutral</p>
                <p className="text-gray-900 text-xl">{summary.neutral}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl">
                <Meh className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Negative */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Negative</p>
                <p className="text-gray-900 text-xl">{summary.negative}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl">
                <Frown className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Pie Chart */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Distribusi Sentimen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartSentiment}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                  dataKey="value"
                >
                  {chartSentiment.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Chart (static for now) */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-purple-500" />
              Trend Sentimen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="positive" fill="#10b981" />
                <Bar dataKey="neutral" fill="#f59e0b" />
                <Bar dataKey="negative" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KEYWORDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Positive Keywords */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="size-5 text-green-500" />
              Top Positive Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPositive.map((kw, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                  <div className="bg-green-500 text-white size-8 rounded-full flex items-center justify-center">{i+1}</div>
                  <p>{kw}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Negative Keywords */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Frown className="size-5 text-red-500" />
              Top Negative Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topNegative.map((kw, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-50">
                  <div className="bg-red-500 text-white size-8 rounded-full flex items-center justify-center">{i+1}</div>
                  <p>{kw}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
