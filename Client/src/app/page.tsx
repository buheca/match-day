import Link from 'next/link';

import { Users, MapPin, Trophy } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">⚽ MatchDay</h1>
          <p className="text-2xl font-light">Tinder for Football</p>
        </div>

        {/* Description */}
        <p className="text-lg mb-12 text-white/90">
          Swipe to find football matches and players near you. 
          Connect with captains looking for players or join exciting games!
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition">
            <Users className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Find Players</h3>
            <p className="text-sm text-white/80">Connect with football enthusiasts</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition">
            <MapPin className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Nearby Matches</h3>
            <p className="text-sm text-white/80">Discover games in your area</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Skill Matching</h3>
            <p className="text-sm text-white/80">Play at your level</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          href="/feed"
          className="inline-block bg-white text-green-600 px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
        >
          Start Swiping 🔥
        </Link>
      </div>
    </div>
  );
}