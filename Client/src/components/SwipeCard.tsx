'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Calendar, Users, Award } from 'lucide-react';
import { Match, User } from '../../types';

interface SwipeCardProps {
  item: Match | User;
  onSwipe: (direction: 'left' | 'right') => void;
  type: 'match' | 'player';
}

export default function SwipeCard({ item, onSwipe, type }: SwipeCardProps) {
  // Motion values for drag tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  /**
   * Transform x position to rotation and opacity
   * As card moves left/right, it rotates and fades
   */
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  /**
   * Handle drag end - determine if swipe threshold was reached
   */
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100; // Minimum distance to trigger swipe
    const velocity = info.velocity.x; // Speed of swipe
    
    // Right swipe (Like)
    if (info.offset.x > threshold || velocity > 500) {
      onSwipe('right');
    }
    // Left swipe (Pass)
    else if (info.offset.x < -threshold || velocity < -500) {
      onSwipe('left');
    }
  };

  // Render match card
  if (type === 'match') {
    const match = item as Match;
    
    return (
      <motion.div
        className="absolute w-full h-full cursor-grab active:cursor-grabbing"
        style={{ x, y, rotate, opacity }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.05 }}
      >
        <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500">
            <img
              src={match.images?.[0] || '/football-field.jpg'}
              alt={match.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{match.title}</h2>
            
            <div className="space-y-3">
              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{match.address}</span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">
                  {new Date(match.match_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Players Needed */}
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">{match.players_needed} players needed</span>
              </div>

              {/* Skill Level */}
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm">{match.skill_level_required} level</span>
              </div>
            </div>

            {/* Captain Info */}
            {match.captain && (
            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-white/30">
              <img
                src={match.captain.profile_image}
                alt={match.captain.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <p className="text-xs text-white/70">Organized by</p>
                <p className="font-semibold">{match.captain.name}</p>
              </div>
            </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Render player card
  const player = item as User;
  
  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
    >
      <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Profile Image */}
        <div className="absolute inset-0">
          <img
            src={player.profile_image}
            alt={player.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          <h2 className="text-4xl font-bold mb-1">{player.name}</h2>
          <p className="text-xl text-white/90 mb-4">{player.position}</p>

          {/* Bio */}
          {player.bio && (
            <p className="text-sm text-white/80 mb-4 line-clamp-2">
              {player.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs text-white/70">Skill Level</p>
              <p className="font-bold">{player.skill_level}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs text-white/70">Position</p>
              <p className="font-bold">{player.position}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{player.address}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}