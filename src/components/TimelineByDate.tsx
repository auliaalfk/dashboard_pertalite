import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const data = [
  { date: '31 Okt', comments: 243 },
  { date: '1 Nov', comments: 378 },
  { date: '2 Nov', comments: 323 },
  { date: '3 Nov', comments: 212 },
  { date: '4 Nov', comments: 134 },
  { date: '5 Nov', comments: 117 },
  { date: '6 Nov', comments: 154 },
  { date: '7 Nov', comments: 137 },
  { date: '8 Nov', comments: 55 },
  { date: '9 Nov', comments: 16 },
];

export function TimelineByDate() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-5 text-purple-500" />
          Daily Comment Activity & Engagement Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#888"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#888"
              tick={{ fontSize: 12 }}
              label={{ value: 'Comments', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }} 
            />
            <defs>
              <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="comments" 
              stroke="#a855f7" 
              strokeWidth={3}
              fill="url(#commentsGradient)" 
              name="Comments"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}