import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { hour: '00:00', posts: 234 },
  { hour: '03:00', posts: 145 },
  { hour: '06:00', posts: 389 },
  { hour: '09:00', posts: 678 },
  { hour: '12:00', posts: 892 },
  { hour: '15:00', posts: 1245 },
  { hour: '18:00', posts: 1567 },
  { hour: '21:00', posts: 1123 },
];

export function EngagementChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="hour" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip 
          contentStyle={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }} 
        />
        <Bar dataKey="posts" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
