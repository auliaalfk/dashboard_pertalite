import { Home, TrendingUp, MessageSquare, Smile, Sparkles, Users } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sentiment', label: 'Analisis Sentimen', icon: TrendingUp },
    { id: 'topic', label: 'Pemodelan Topik', icon: MessageSquare },
    { id: 'emotion', label: 'Analisis Emosi', icon: Smile }, // ✅ Changed from 'emoji' to 'emotion'
    { id: 'about', label: 'Tentang', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-purple-200 shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-2 rounded-xl">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
              Pertalite Insights
            </h1>
            <p className="text-xs text-gray-500">TikTok Analytics</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-purple-100'
                }`}
              >
                <Icon className="size-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}