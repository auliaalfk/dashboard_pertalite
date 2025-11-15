import { Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const topComments = [
  { 
    text: 'pantes isi BBM ga boleh pake botol😂😂😂 takut ketauan😃😃😃', 
    user: '@ashabcellular',
    likes: 16008,
    rank: 133,
    sentiment: 'positive'
  },
  { 
    text: 'AKANKAH RUMAH BAHLIL MENJADI RUMAH SAHRONI PART 2?', 
    user: '@persibbandung019',
    likes: 6214,
    rank: 132,
    sentiment: 'neutral'
  },
  { 
    text: 'IDEKU BAGUS KAN ? 🤣', 
    user: '@hanyaorangbiasa2809',
    likes: 5823,
    rank: 57,
    sentiment: 'positive'
  },
  { 
    text: 'bukan salah pom,,, MEREKA HANYA MENJUAL,,,KEBIJAKAN OLEH MENTRI BILANG PAKAI ETANOL', 
    user: '@andi010791',
    likes: 5799,
    rank: 131,
    sentiment: 'neutral'
  },
  { 
    text: 'MBAKK SAMA BANGET DEMI ALLAH AKU GA IKHLASSSSS, BIARIN NTAR TAK TUNTUT DI AKHIRAT😭😞', 
    user: '@inii.nayaa',
    likes: 5760,
    rank: 2,
    sentiment: 'negative'
  },
];

export function TopCommentsByLikes() {
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
            <Heart className="size-5 text-pink-500" />
            Most Liked Comments
          </CardTitle>
          <TrendingUp className="size-4 text-pink-400" />
        </div>
        <p className="text-sm text-gray-500 mt-1">Komentar dengan likes terbanyak</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topComments.map((comment, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 hover:shadow-md transition-all border border-pink-100"
            >
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white size-8 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <span className="text-xs text-pink-600 flex items-center gap-1">
                        <Heart className="size-3 fill-pink-500 text-pink-500" />
                        {comment.likes.toLocaleString()}
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