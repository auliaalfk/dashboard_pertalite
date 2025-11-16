import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import SentimentAnalysis from './components/SentimentAnalysis';
import { TopicModeling } from './components/TopicModeling';
import EmotionAnalysis from './components/EmotionAnalysis'; 
import { About } from './components/About';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'sentiment':
        return <SentimentAnalysis />;
      case 'topic':
        return <TopicModeling />;
      case 'emotion': // ✅ Changed from 'emoji' to 'emotion'
        return <EmotionAnalysis />;
      case 'about':
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}