
'use client';

import { useState, useEffect } from 'react';
import SwipeCard from '../../components/SwipeCard';
import { Match, User, SwipeDirection } from '../../../types';
import { Heart, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
  const [feed, setFeed] = useState<(Match | User)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with real user ID from Supabase
  // Get this from: Supabase Dashboard → Table Editor → users → copy John's UUID
  const userId = '62e2814d-810e-409e-8be6-876f866d9f62'; // ⚠️ Değiştir!
  const userType = 'player'; // or 'captain'

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/feed?userId=${userId}&userType=${userType}&limit=20`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFeed(data.data);
        } else {
          setError('Failed to fetch feed');
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [userId, userType]);

  const handleSwipe = async (direction: SwipeDirection) => {
    if (currentIndex >= feed.length) return;
    
    const currentItem = feed[currentIndex];
    const targetType = userType === 'player' ? 'match' : 'player';
    
    try {
      const response = await fetch('http://localhost:5000/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          targetId: currentItem.id, // Supabase uses 'id' not '_id'
          targetType: targetType,
          direction: direction
        })
      });

      const data = await response.json();

      if (data.isMatch) {
        alert(`🎉 It's a Match! ${JSON.stringify(data.matchData)}`);
      }

      setCurrentIndex(prev => prev + 1);

    } catch (error) {
      console.error('Swipe error:', error);
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (currentIndex >= feed.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            No more {userType === 'player' ? 'matches' : 'players'}!
          </h2>
          <p className="text-gray-600 mb-6">Check back later for new opportunities</p>
          <Link 
            href="/"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800">MatchDay</h1>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} / {feed.length}
            </p>
          </div>
          <div className="w-6"></div>
        </div>

        <div className="relative h-[600px] mb-8">
          {feed.slice(currentIndex, currentIndex + 3).map((item, index) => (
            <div
              key={item.id}
              className="absolute w-full h-full transition-all duration-300"
              style={{
                zIndex: 10 - index,
                transform: `scale(${1 - index * 0.05}) translateY(${index * 8}px)`,
                opacity: index === 0 ? 1 : 0.5,
              }}
            >
              {index === 0 && (
                <SwipeCard
                  item={item}
                  onSwipe={handleSwipe}
                  type={userType === 'player' ? 'match' : 'player'}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-8">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            aria-label="Pass"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
            aria-label="Like"
          >
            <Heart className="w-8 h-8 text-green-500" />
          </button>
        </div>
      </div>
    </div>
  );
}