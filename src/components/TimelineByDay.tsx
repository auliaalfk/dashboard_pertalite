import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const data = [
  { day: 'Senin', comments: 212 },
  { day: 'Selasa', comments: 134 },
  { day: 'Rabu', comments: 117 },
  { day: 'Kamis', comments: 154 },
  { day: 'Jumat', comments: 380 },
  { day: 'Sabtu', comments: 433 },
  { day: 'Minggu', comments: 339 },
];

export function TimelineByDay() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-5 text-orange-500" />
          Weekly Activity Pattern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#888"
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              stroke="#888"
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [`${value} comments`, 'Total Comments']}
            />
            <Bar dataKey="comments" fill="url(#dayGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}