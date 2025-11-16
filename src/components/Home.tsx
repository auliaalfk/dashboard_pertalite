// (Lokasi: src/components/Home.tsx)
// GANTI SELURUH FILE ANDA DENGAN INI

import { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageCircle, Heart, Clock, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// IMPORT LIBRARY GRAFIK (ANDA SUDAH INSTALL INI)
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- TIPE DATA (Biar tidak error) ---
interface KpiCards {
  total_comments: number;
  total_likes: number;
  total_replies: number;
  avg_engagement: number;
}
interface DailyTrend { date_WIB: string; comments: number; }
interface HourlyTrend { hour_WIB: number; comments: number; }
interface WeeklyTrend { day: string; comments: number; }
interface TopComment {
  text: string;
  uniqueId: string;
  diggCount: number;
  replyCommentTotal: number;
}
interface TopRepliedComment {
  text: string;
  uniqueId: string;
  replyCommentTotal: number;
  diggCount: number;
}
interface TopUser {
  username: string;
  total_likes: number;
  rank: number;
}
interface HomeData {
  kpi_cards: KpiCards;
  daily_trend_chart: DailyTrend[];
  hourly_chart: HourlyTrend[];
  weekly_chart: WeeklyTrend[];
  top_liked_comments: TopComment[];
  top_replied_comments: TopRepliedComment[];
  most_influential_accounts: TopUser[];
}

// --- Hook untuk Menunggu Browser Siap (Kita masukkan di sini) ---
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}


// --- KOMPONEN UTAMA ANDA ---
export function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Panggil hook-nya
  const hasMounted = useHasMounted();

  useEffect(() => {
    // Pastikan port-nya sama dengan backend Anda (8000)
    fetch('http://127.0.0.1:8000/api/home/summary') 
      .then(res => {
        if (!res.ok) {
          throw new Error(`Gagal mengambil data: ${res.statusText}`);
        }
        return res.json();
      })
      .then((apiData: HomeData) => {
        setData(apiData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError("Tidak dapat memuat data dari server. Pastikan backend Anda berjalan.");
        setLoading(false);
      });
  }, []); 

  
  // --- Handle Loading & Error ---
  if (isLoading) {
    return <div className="p-8 text-center text-lg">Memuat data dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-lg text-red-500">{error}</div>;
  }
  if (!data) {
    return <div className="p-8 text-center text-lg">Data tidak ditemukan.</div>;
  }
  
  // --- Data untuk KPI Cards ---
  const stats = [
    { label: 'Total Comments', value: data.kpi_cards.total_comments.toLocaleString(), change: 'Unique', icon: MessageCircle, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Likes', value: data.kpi_cards.total_likes.toLocaleString(), change: 'On Comments', icon: Heart, color: 'from-pink-500 to-pink-600' },
    { label: 'Total Replies', value: data.kpi_cards.total_replies.toLocaleString(), change: 'Received', icon: Users, color: 'from-orange-500 to-orange-600' },
    { label: 'Avg. Engagement', value: data.kpi_cards.avg_engagement.toString(), change: 'Likes/Comment', icon: TrendingUp, color: 'from-yellow-500 to-yellow-600' },
  ];

  // --- Data & Mapping untuk Grafik ---
  const hourlyData = data.hourly_chart.map(item => ({
    ...item,
    hour: item.hour_WIB.toString().padStart(2, '0')
  }));
  
  const dayMapping: { [key: string]: string } = {
    'Monday': 'Senin', 'Tuesday': 'Selasa', 'Wednesday': 'Rabu',
    'Thursday': 'Kamis', 'Friday': 'Jumat', 'Saturday': 'Sabtu', 'Sunday': 'Minggu'
  };
  const weeklyData = data.weekly_chart.map(item => ({
    ...item,
    day: dayMapping[item.day] || item.day
  }));

  const topUsersCol1 = data.most_influential_accounts.filter(user => user.rank <= 5);
  const topUsersCol2 = data.most_influential_accounts.filter(user => user.rank > 5);

  
  return (
    <div className="p-8">
      {/* Header */}
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

      {/* --- KODE GRAFIK LANGSUNG DI SINI --- */}
      
      {/* Timeline Section */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="size-5 text-purple-500" />
          Timeline & Activity Patterns
        </h2>
        <div className="grid grid-cols-1 gap-6">
          
          {/* 1. TimelineByDate (KODE RESPONSIF) */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-purple-500" />
                Daily Comment Activity & Engagement Trend
              </CardTitle>
            </CardHeader>
            {/* Beri tinggi pada kotaknya, BUKAN pada grafiknya */}
            <CardContent className="h-[350px]"> 
              {hasMounted && (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={data.daily_trend_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date_WIB" stroke="#888" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#888" tick={{ fontSize: 12 }} label={{ value: 'Comments', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                    <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <defs>
                      <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="comments" stroke="#a855f7" strokeWidth={3} fill="url(#commentsGradient)" name="Comments" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 2. TimelineByHour (KODE RESPONSIF) */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5 text-pink-500" />
                  Hourly Distribution Pattern
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {hasMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#888" tick={{ fontSize: 11 }} interval={1} label={{ value: 'Hour (24h format)', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }} />
                      <YAxis stroke="#888" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} formatter={(value) => [`${value} comments`, 'Comments']} />
                      <Bar dataKey="comments" fill="url(#hourGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
    
            {/* 3. TimelineByDay (KODE RESPONSIF) */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5 text-orange-500" />
                  Weekly Activity Pattern
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {hasMounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#888" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#888" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} formatter={(value) => [`${value} comments`, 'Total Comments']} />
                      <Bar dataKey="comments" fill="url(#dayGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#fb923c" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    
      {/* --- KODE TOP COMMENTS LANGSUNG DI SINI --- */}
      
      {/* Top Comments Section */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="size-5 text-pink-500" />
          Top Performing Comments
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 4. TopCommentsByLikes */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="size-5 text-pink-500" />
                  Most Liked Comments
                </CardTitle>
                <TrendingUp className="size-4 text-pink-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">Komentar dengan likes terbanyak</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.top_liked_comments.map((comment, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 hover:shadow-md transition-all border border-pink-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white size-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 mb-2 text-sm leading-relaxed">{comment.text}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-purple-600">@{comment.uniqueId}</span>
                        <div className="flex items-center gap-3 ml-auto">
                          <span className="text-xs text-pink-600 flex items-center gap-1">
                            <Heart className="size-3 fill-pink-500 text-pink-500" />
                            {comment.diggCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* 5. TopCommentsByReplies */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="size-5 text-orange-500" />
                  Most Replied Comments
                </CardTitle>
                <TrendingUp className="size-4 text-orange-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">Komentar dengan replies terbanyak</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.top_replied_comments.map((comment, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-md transition-all border border-orange-100">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white size-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 mb-2 text-sm leading-relaxed">{comment.text}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-purple-600">@{comment.uniqueId}</span>
                        <div className="flex items-center gap-3 ml-auto">
                          <span className="text-xs text-orange-600 flex items-center gap-1">
                            <MessageCircle className="size-3" />
                            {comment.replyCommentTotal.toLocaleString()} replies
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 6. TopUsers */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-5 text-yellow-500" />
                Most Influential Accounts
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Ranked by total likes received on comments</p>
            </div>
            <TrendingUp className="size-5 text-yellow-400" />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {topUsersCol1.map((user) => (
              <div key={user.rank} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 hover:shadow-md transition-all border border-yellow-100">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white size-12 rounded-full flex items-center justify-center flex-shrink-0">
                  {user.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate font-semibold">@{user.username}</p>
                  <span className="text-xs text-gray-500">Rank #{user.rank}</span>
                </div>
                <div className="text-right">
                  <p className="text-orange-600 font-bold">{user.total_likes.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">total likes</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {topUsersCol2.map((user) => (
              <div key={user.rank} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 hover:shadow-md transition-all border border-yellow-100">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white size-12 rounded-full flex items-center justify-center flex-shrink-0">
                  {user.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate font-semibold">@{user.username}</p>
                  <span className="text-xs text-gray-500">Rank #{user.rank}</span>
                </div>
                <div className="text-right">
                  <p className="text-orange-600 font-bold">{user.total_likes.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">total likes</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}