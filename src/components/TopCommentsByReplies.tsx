import { MessageCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const topComments = [
  { 
    text: 'AKANKAH RUMAH BAHLIL MENJADI RUMAH SAHRONI PART 2?', 
    user: '@persibbandung019',
    replies: 160,
    rank: 132,
    sentiment: 'neutral'
  },
  { 
    text: 'cung yg motornya brebet☝🏻😹', 
    user: '@adtyarmdn26_',
    replies: 160,
    rank: 137,
    sentiment: 'negative'
  },
  { 
    text: 'pantes isi BBM ga boleh pake botol😂😂😂 takut ketauan😃😃😃', 
    user: '@ashabcellular',
    replies: 94,
    rank: 133,
    sentiment: 'positive'
  },
  { 
    text: 'hari ini habis hampir 400 RB buat perbaikan motor PCX karna masalah bensin pertalite 😭😭😭', 
    user: '@ahmadfahrurrazi3',
    replies: 88,
    rank: 182,
    sentiment: 'negative'
  },
  { 
    text: 'trus sing bener kudu isi bensin opo guyss?? pliss mene wayah e tuku bensin soale', 
    user: '@onlygoatknow',
    replies: 87,
    rank: 22,
    sentiment: 'neutral'
  },
];

export function TopCommentsByReplies() {
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="size-5 text-orange-500" />
            Most Replied Comments
          </CardTitle>
          <TrendingUp className="size-4 text-orange-400" />
        </div>
        <p className="text-sm text-gray-500 mt-1">Komentar dengan replies terbanyak</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topComments.map((comment, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-md transition-all border border-orange-100"
            >
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white size-8 rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 mb-2 text-sm leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-purple-600">{comment.user}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentColor(comment.sentiment)}`}>
                      {comment.sentiment}
                    </span>
                    <div className="flex items-center gap-3 ml-auto">
                      <span className="text-xs text-orange-600 flex items-center gap-1">
                        <MessageCircle className="size-3" />
                        {comment.replies} replies
                      </span>
                    </div>
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