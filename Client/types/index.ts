export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  venue?: string;
}

export interface User {
  id: string; // Supabase uses 'id' not '_id'
  name: string;
  email: string;
  user_type: 'player' | 'captain'; // snake_case in Supabase
  position?: string;
  skill_level?: string;
  availability?: string[];
  latitude?: number;
  longitude?: number;
  address?: string;
  bio?: string;
  profile_image: string;
}

export interface Match {
  id: string; // Supabase uses 'id' not '_id'
  captain_id: string;
  captain?: User; // Populated
  title: string;
  description?: string;
  match_date: string; // ISO timestamp
  duration: number;
  skill_level_required: string;
  latitude: number;
  longitude: number;
  address: string;
  venue?: string;
  players_needed: number;
  positions_needed: string[];
  status: 'open' | 'full' | 'completed' | 'cancelled';
  images?: string[];
}

export type SwipeDirection = 'left' | 'right';