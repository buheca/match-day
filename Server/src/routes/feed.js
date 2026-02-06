const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

/**
 * GET /api/feed
 * Returns potential matches/players for swiping
 */
router.get('/', async (req, res) => {
  try {
    const { userId, userType, limit = 10 } = req.query;
    
    if (!userId || !userType) {
      return res.status(400).json({ 
        error: 'userId and userType are required' 
      });
    }

    // Get user's swipe history
    const { data: swipes } = await supabase
      .from('swipes')
      .select('target_match_id, target_player_id')
      .eq('user_id', userId);

    let feedItems = [];

    if (userType === 'player') {
      // Get swiped match IDs (filter out nulls)
      const swipedMatchIds = swipes
        ?.filter(s => s.target_match_id)
        .map(s => s.target_match_id) || [];

      // Build query
      let query = supabase
        .from('matches')
        .select(`
          *,
          captain:users!matches_captain_id_fkey(id, name, profile_image)
        `)
        .eq('status', 'open')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(parseInt(limit));

      // Only add NOT IN clause if there are swiped matches
      if (swipedMatchIds.length > 0) {
        query = query.not('id', 'in', `(${swipedMatchIds.join(',')})`);
      }

      const { data: matches, error } = await query;

      if (error) throw error;
      feedItems = matches || [];

    } else if (userType === 'captain') {
      // Get swiped player IDs (filter out nulls)
      const swipedPlayerIds = swipes
        ?.filter(s => s.target_player_id)
        .map(s => s.target_player_id) || [];

      // Build query
      let query = supabase
        .from('users')
        .select('*')
        .eq('user_type', 'player')
        .neq('id', userId)
        .limit(parseInt(limit));

      // Only add NOT IN clause if there are swiped players
      if (swipedPlayerIds.length > 0) {
        query = query.not('id', 'in', `(${swipedPlayerIds.join(',')})`);
      }

      const { data: players, error } = await query;

      if (error) throw error;
      feedItems = players || [];
    }

    res.json({
      success: true,
      count: feedItems.length,
      data: feedItems
    });

  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ 
      error: 'Server error fetching feed',
      details: error.message 
    });
  }
});

module.exports = router;