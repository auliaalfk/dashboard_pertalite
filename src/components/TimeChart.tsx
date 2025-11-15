import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { date: 'Sen', engagement: 2400, posts: 340 },
  { date: 'Sel', engagement: 3200, posts: 445 },
  { date: 'Rab', engagement: 2800, posts: 389 },
  { date: 'Kam', engagement: 3800, posts: 523 },
  { date: 'Jum', engagement: 4200, posts: 612 },
  { date: 'Sab', engagement: 5100, posts: 734 },
  { date: 'Min', engagement: 4600, posts: 656 },
];

export function TimeChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip 
          contentStyle={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }} 
        />
        <defs>
          <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="engagement" 
          stroke="#a855f7" 
          strokeWidth={3}
          fill="url(#engagementGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
