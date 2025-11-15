import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

const data = [
  { hour: '00', comments: 33 },
  { hour: '01', comments: 21 },
  { hour: '02', comments: 18 },
  { hour: '03', comments: 7 },
  { hour: '04', comments: 12 },
  { hour: '05', comments: 28 },
  { hour: '06', comments: 56 },
  { hour: '07', comments: 77 },
  { hour: '08', comments: 90 },
  { hour: '09', comments: 94 },
  { hour: '10', comments: 88 },
  { hour: '11', comments: 99 },
  { hour: '12', comments: 112 },
  { hour: '13', comments: 138 },
  { hour: '14', comments: 118 },
  { hour: '15', comments: 89 },
  { hour: '16', comments: 72 },
  { hour: '17', comments: 106 },
  { hour: '18', comments: 101 },
  { hour: '19', comments: 102 },
  { hour: '20', comments: 99 },
  { hour: '21', comments: 75 },
  { hour: '22', comments: 60 },
  { hour: '23', comments: 74 },
];

export function TimelineByHour() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5 text-pink-500" />
          Hourly Distribution Pattern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="hour" 
              stroke="#888"
              tick={{ fontSize: 11 }}
              label={{ value: 'Hour (24h format)', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
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
              formatter={(value) => [`${value} comments`, 'Comments']}
            />
            <Bar dataKey="comments" fill="url(#hourGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}