import { MessageCircle, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const topComments = [
  { 
    text: 'Pertalite emang paling worth it sih buat motor harian!', 
    user: '@ridho_motovlog',
    likes: 2847,
    sentiment: 'positive'
  },
  { 
    text: 'Kenapa pertalite selalu antri panjang ya? 😭', 
    user: '@dewi.cantik',
    likes: 1923,
    sentiment: 'negative'
  },
  { 
    text: 'Tips: isi pertalite pagi-pagi lebih fresh dan ga antri', 
    user: '@tips_motor',
    likes: 1654,
    sentiment: 'positive'
  },
  { 
    text: 'Harga pertalite masih aman di kantong mahasiswa 🙏', 
    user: '@mahasiswa_hemat',
    likes: 1432,
    sentiment: 'positive'
  },
  { 
    text: 'Pertalite vs Pertamax, mending mana?', 
    user: '@otomotif_id',
    likes: 1289,
    sentiment: 'neutral'
  },
];

export function TopComments() {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="size-5 text-orange-500" />
          Top Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topComments.map((comment, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white size-8 rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{comment.text}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-purple-600">{comment.user}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(comment.sentiment)}`}>
                      {comment.sentiment}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Heart className="size-3 fill-pink-500 text-pink-500" />
                      {comment.likes.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
