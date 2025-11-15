import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, Smile, ThumbsDown } from 'lucide-react';

const EmotionAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState('all');

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-purple-600 text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  const totalRecords = 1715;
  const complaints = 591;
  const sarcasm = 90;

  const emotionDistribution = {
    anger: 1445,
    sadness: 185,
    happiness: 53,
    love: 17,
    fear: 15
  };

  const emotionColors = {
    anger: '#ef4444',
    sadness: '#3b82f6',
    happiness: '#f59e0b',
    love: '#ec4899',
    fear: '#8b5cf6'
  };

  const pieData = Object.entries(emotionDistribution).map(([emotion, count]) => ({
    name: emotion,
    value: count,
    percentage: ((count / totalRecords) * 100).toFixed(1)
  }));

  const barData = Object.entries(emotionDistribution).map(([emotion, count]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    count: count,
    percentage: ((count / totalRecords) * 100).toFixed(1)
  }));

  const dominantEmotionName = 'ANGER';
  const dominantEmotionPercentage = '84.3';

  const contextData = [
    { emotion: 'Anger', sarcasm: 90, complaint: 498 },
    { emotion: 'Fear', sarcasm: 0, complaint: 4 },
    { emotion: 'Happiness', sarcasm: 0, complaint: 21 },
    { emotion: 'Love', sarcasm: 0, complaint: 7 },
    { emotion: 'Sadness', sarcasm: 0, complaint: 61 }
  ];

  const sarcasmComments = [
    { text: 'Pertamina bisu dek 😂😭...' },
    { text: 'sudah disidak sama Pertamina dan tim bahlil,, katanya kualitas BBM di jatim baik baik saja,, yaampuuuun...' },
    { text: 'Jare saiki wes isok klaim perbaikan motor mbak nak SPBU. Tapi koen eruh salah siji syarate? Melampir...' },
    { text: 'ngene kok jare onok berita jatim aman LAH IKI BUKTIE??!!...' },
    { text: 'jangankan sing pertalite, aku sing ngisi pertamax lakok budal nang bengkel, padahal sebelume ngisi s...' }
  ];

  const complaintComments = [
    { text: 'sudah disidak sama Pertamina dan tim bahlil,, katanya kualitas BBM di jatim baik baik saja,, yaampuu...' },
    { text: 'UU perlindungan konsumen ga berlaku pada Pertamina 🙂 susah ngelawan Perusahaan BUMN. Kecuali masyara...' },
    { text: 'klarifikasi pertamina di berita tv nasional tadi udah dicek sesuai prosedur dan yang bermasalah moto...' },
    { text: 'dikiro rakyat iki duit e ga entek² 7 turunan gawe nang bengkel 😭 mangkel...' },
    { text: 'please siapapun yang bertanggung jawab notis dong kita nih rakyat kecil di dzolimi terus, itu kendar...' }
  ];

  const angerKeywords = [
    ['bahlil', 180], ['rusak', 165], ['dari', 95], ['motor', 88], ['pertalite', 85],
    ['ga', 80], ['bensin', 75], ['brebet', 70], ['brebet', 68], ['sama', 65],
    ['aku', 62], ['rusak', 60], ['beli', 58], ['rusak', 55], ['ya', 52],
    ['etanol', 50], ['sekarang', 48], ['tidak', 45], ['pertamina', 43], ['udah', 42],
    ['kita', 40], ['pertamina', 38], ['dan', 36], ['mau', 35], ['bisa', 33],
    ['jadi', 32], ['kalo', 30], ['terus', 28], ['kok', 26], ['habis', 25],
    ['wes', 24], ['sepeda', 22], ['gak', 20], ['sih', 19], ['SPBU', 18]
  ];

  const sadnessKeywords = [
    ['motor', 52], ['oleh', 48], ['rakyat', 45], ['bengkel', 42], ['aku', 38],
    ['pertamina', 35], ['biaya', 32], ['isi', 30], ['kecewa', 28], ['baru', 26],
    ['tolong', 24], ['jalan', 22], ['mogok', 20], ['udah', 19], ['punya', 18],
    ['ngga', 17], ['tapi', 16], ['aja', 15], ['ada', 14], ['susah', 13],
    ['juga', 12], ['kena', 11], ['sumpah', 10], ['tiba', 9], ['capek', 8]
  ];

  const happinessKeywords = [
    ['alhamdulillah', 30], ['semoga', 28], ['bengkel', 25], ['aman', 22], ['aja', 20], ['pertamina', 18],
    ['astaghfirullah', 16], ['eceran', 15], ['busi', 13], ['pemerintah', 12], ['wis', 11],
    ['aman', 10], ['tak', 9], ['udah', 8], ['ganti', 7], ['beat', 6], ['juga', 4],
  ];

  const loveKeywords = [
    ['dikasih', 18], ['mantap', 16], ['respect', 14], ['mampu', 12], ['BBM', 10],
    ['kasih', 9], ['dulu', 8], ['jadi', 7], ['SPBU', 6], ['Mau', 5], ['kebijakan', 3]  
  ];

  const fearKeywords = [
    ['takut', 32], ['pentes', 28], ['ketauan', 25], ['indonesia', 22], ['membahayakan', 20],
    ['nyadar', 18], ['perampasan', 16], ['hukuman', 14], ['koruptor', 12], ['masalah', 10]
  ];

  const allKeywords = [
    ['bahlil', 258], ['motor', 203], ['SPBU', 180], ['pertamina', 145], ['pertalite', 128],
    ['bensin', 127], ['pertamx', 118], ['yang', 110], ['dari', 105], ['bengkel', 102],
    ['yo', 98], ['ga', 95], ['oleh', 88], ['brebet', 85], ['rakyat', 82],
    ['sama', 79], ['iki', 76], ['takut', 70], ['beli', 65], ['rusak', 63],
    ['ya', 60], ['tidak', 58], ['udah', 55], ['podo', 52], ['baru', 48],
    ['sekarang', 45], ['gw', 43], ['kita', 42], ['biaya', 40], ['mau', 38]
  ];

  const getTopKeywords = (emotion) => {
    const keywordMap = {
      'all': allKeywords,
      'anger': angerKeywords,
      'sadness': sadnessKeywords,
      'happiness': happinessKeywords,
      'love': loveKeywords,
      'fear': fearKeywords
    };
    return keywordMap[emotion] || allKeywords;
  };

  const topKeywords = getTopKeywords(selectedEmotion);

  const sarcasmData = [
    { emotion: 'Anger', 'False': 1355, 'True': 90 },
    { emotion: 'Fear', 'False': 15, 'True': 0 },
    { emotion: 'Happiness', 'False': 53, 'True': 0 },
    { emotion: 'Love', 'False': 17, 'True': 0 },
    { emotion: 'Sadness', 'False': 185, 'True': 0 }
  ];

  const complaintData = [
    { emotion: 'Anger', 'False': 947, 'True': 498 },
    { emotion: 'Fear', 'False': 11, 'True': 4 },
    { emotion: 'Happiness', 'False': 32, 'True': 21 },
    { emotion: 'Love', 'False': 10, 'True': 7 },
    { emotion: 'Sadness', 'False': 124, 'True': 61 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-600 mb-4">
          Emotion Analysis
        </h1>
        <p className="text-gray-600 text-xl">Insightful emotion metrics from TikTok user responses</p>
      </div>

      {/* Key Metrics */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <MessageSquare className="w-7 h-7 text-blue-600" />
            </div>
            <p className="text-xs text-blue-600 mb-3 font-medium uppercase tracking-wide">Total Komentar</p>
            <p className="text-4xl font-extrabold text-blue-900 mb-2">{totalRecords.toLocaleString()}</p>
            <p className="text-xs text-blue-600 font-semibold">100.0% of total</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-red-200">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-7 h-7 text-red-600" />
            </div>
            <p className="text-xs text-red-600 mb-3 font-medium uppercase tracking-wide">Emosi Dominan</p>
            <p className="text-4xl font-extrabold text-red-900 uppercase mb-2">
              {dominantEmotionName}
            </p>
            <p className="text-xs text-red-600 font-semibold">{dominantEmotionPercentage}%</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <Smile className="w-7 h-7 text-amber-600" />
            </div>
            <p className="text-xs text-amber-600 mb-3 font-medium uppercase tracking-wide">Sarkasme Terdeteksi</p>
            <p className="text-4xl font-extrabold text-amber-900 mb-2">{sarcasm}</p>
            <p className="text-xs text-amber-600 font-semibold">{((sarcasm / totalRecords) * 100).toFixed(1)}%</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-pink-200">
            <div className="flex items-center justify-between mb-3">
              <ThumbsDown className="w-7 h-7 text-pink-600" />
            </div>
            <p className="text-xs text-pink-600 mb-3 font-medium uppercase tracking-wide">Keluhan</p>
            <p className="text-4xl font-extrabold text-pink-900 mb-2">{complaints}</p>
            <p className="text-xs text-pink-600 font-semibold">{((complaints / totalRecords) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Emotion Distribution */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
          Distribusi Emosi
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <h3 className="text-base font-semibold text-gray-700 mb-5 text-center">Distribusi Emosi</h3>
            <div className="w-full" style={{height: '320px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={(entry) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 90 + 35;
                      const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
                      const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill={emotionColors[entry.name] || '#6b7280'}
                          textAnchor={x > entry.cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          fontSize="12"
                          fontWeight="600"
                        >
                          {`${entry.name} ${entry.percentage}%`}
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={emotionColors[entry.name] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <h3 className="text-base font-semibold text-gray-700 mb-5 text-center">Jumlah per Emosi</h3>
            <div className="w-full" style={{height: '320px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 15, bottom: 20, left: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="emotion" tick={{fontSize: 11}} />
                  <YAxis tick={{fontSize: 11}} />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} (${props.payload.percentage}%)`,
                      'Count'
                    ]}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb'}}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={emotionColors[entry.emotion.toLowerCase()] || '#6b7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Context Breakdown */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
          Rincian Konteks
        </h2>
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wide">Emotion</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wide">Sarcasm</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wide">Complaint</th>
                </tr>
              </thead>
              <tbody>
                {contextData.map((item, idx) => (
                  <tr key={idx} className={`border-t border-gray-100 hover:bg-purple-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-3 text-gray-800 font-semibold capitalize">{item.emotion}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-block bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-lg text-sm">
                        {item.sarcasm}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-block bg-red-100 text-red-700 font-bold px-3 py-1 rounded-lg text-sm">
                        {item.complaint}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Analisis Kata Kunci
          </h2>
          <select 
            value={selectedEmotion}
            onChange={(e) => setSelectedEmotion(e.target.value)}
            className="bg-white border-2 border-purple-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <option value="all">🌐 Semua Emosi (1,715)</option>
            <option value="anger">ANGER 😡(1,445)</option>
            <option value="sadness">SADNESS 😞(185)</option>
            <option value="happiness">HAPPINESS 😊(53)</option>
            <option value="love">LOVE ❤️(17)</option>
            <option value="fear">FEAR 😨(15)</option>
          </select>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="mb-5 text-center">
            <h3 className="text-lg font-bold uppercase tracking-wide" style={{color: emotionColors[selectedEmotion] || '#ef4444'}}>
              {selectedEmotion === 'all' ? 'SEMUA EMOSI' : selectedEmotion.toUpperCase()}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Top keywords dari analisis komentar</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl p-8 min-h-[280px] flex flex-wrap items-center justify-center gap-3 shadow-inner">
            {topKeywords.map(([keyword, count], idx) => {
              const maxCount = topKeywords[0][1];
              const size = Math.max(14, Math.min(44, 14 + (count / maxCount) * 30));
              const opacity = 0.65 + (count / maxCount) * 0.35;
              return (
                <span
                  key={idx}
                  style={{
                    fontSize: `${size}px`,
                    opacity: opacity,
                    color: emotionColors[selectedEmotion] || '#ef4444'
                  }}
                  className="font-bold hover:scale-110 transition-transform cursor-pointer"
                  title={`${keyword}: ${count} kemunculan`}
                >
                  {keyword}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sarcasm & Complaint Charts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
          Analisis Konteks Mendalam
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-700">Deteksi Sarkasme</h3>
              <p className="text-xs text-gray-500 mt-1">Distribusi per emosi</p>
            </div>
            <div className="w-full" style={{height: '280px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sarcasmData} margin={{ top: 10, right: 15, bottom: 20, left: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="emotion" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px'}} />
                  <Legend wrapperStyle={{fontSize: '11px'}} />
                  <Bar dataKey="False" stackId="a" fill="#fed7aa" name="Tidak Sarkasme" />
                  <Bar dataKey="True" stackId="a" fill="#fb923c" radius={[8, 8, 0, 0]} name="Sarkasme" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="mb-6">
              <div>
                <h3 className="text-base font-semibold text-gray-700">Analisis Keluhan</h3>
                <p className="text-xs text-gray-500 mt-1">Distribusi per emosi</p>
              </div>
            </div>
            <div className="w-full" style={{height: '280px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complaintData} margin={{ top: 10, right: 15, bottom: 20, left: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="emotion" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px'}} />
                  <Legend wrapperStyle={{fontSize: '11px'}} />
                  <Bar dataKey="False" stackId="a" fill="#fecaca" name="Bukan Keluhan" />
                  <Bar dataKey="True" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} name="Keluhan" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Comments */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
          Contoh Komentar
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 shadow-md border border-orange-200 hover:shadow-lg transition-all">
            <div className="mb-6">
              <div>
                <h3 className="text-base font-semibold text-orange-700">Komentar Sarkastik</h3>
                <p className="text-xs text-orange-600 mt-1">Contoh sarcasm terdeteksi</p>
              </div>
            </div>
            <div className="space-y-3">
              {sarcasmComments.map((comment, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 hover:bg-orange-50 transition-all border border-orange-100 shadow-sm">
                  <div className="flex items-start">
                    <span className="text-orange-500 font-bold mr-2 text-sm">•</span>
                    <p className="text-gray-700 text-xs leading-relaxed flex-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 shadow-md border border-red-200 hover:shadow-lg transition-all">
            <div className="mb-6">
              <div>
                <h3 className="text-base font-semibold text-red-700">Komentar Keluhan</h3>
                <p className="text-xs text-red-600 mt-1">Contoh complaint terdeteksi</p>
              </div>
            </div>
            <div className="space-y-3">
              {complaintComments.map((comment, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 hover:bg-red-50 transition-all border border-red-100 shadow-sm">
                  <div className="flex items-start">
                    <span className="text-red-500 font-bold mr-2 text-sm">•</span>
                    <p className="text-gray-700 text-xs leading-relaxed flex-1">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center pb-6">
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-5 shadow-md inline-block">
          <p className="text-gray-700 font-medium text-sm">
           TikTok Comments Emotion Analysis
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Total {totalRecords.toLocaleString()} komentar dianalisis
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmotionAnalysis;