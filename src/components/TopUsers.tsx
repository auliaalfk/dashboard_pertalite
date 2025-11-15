import { Users, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const topUsers = [
  { username: '@ashabcellular', totalLikes: 16008 },
  { username: '@persibbandung019', totalLikes: 6214 },
  { username: '@hanyaorangbiasa2809', totalLikes: 5823 },
  { username: '@andi010791', totalLikes: 5799 },
  { username: '@inii.nayaa', totalLikes: 5760 },
  { username: '@argapranata77', totalLikes: 5034 },
  { username: '@bd03520', totalLikes: 4409 },
  { username: '@langzrdn', totalLikes: 3278 },
  { username: '@adtyarmdn26_', totalLikes: 2113 },
  { username: '@ytnandogamer', totalLikes: 2049 },
];

export function TopUsers() {
  return (
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
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topUsers.map((user, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 hover:shadow-md transition-all border border-yellow-100"
            >
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white size-12 rounded-full flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate">{user.username}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs text-gray-500">Rank #{index + 1}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-orange-600">{user.totalLikes.toLocaleString()}</p>
                <p className="text-xs text-gray-500">total likes</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}