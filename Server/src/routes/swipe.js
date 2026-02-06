const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

/**
 * POST /api/swipe
 * Handles swipe action and checks for mutual matches
 */
router.post('/', async (req, res) => {
  try {
    const { userId, targetId, targetType, direction } = req.body;

    if (!userId || !targetId || !targetType || !direction) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Record the swipe
    const swipeData = {
      user_id: userId,
      direction: direction,
      swiped_at: new Date().toISOString()
    };

    if (targetType === 'match') {
      swipeData.target_match_id = targetId;
    } else {
      swipeData.target_player_id = targetId;
    }

    const { error: swipeError } = await supabase
      .from('swipes')
      .insert([swipeData]);

    if (swipeError) {
      // Check if duplicate
      if (swipeError.code === '23505') {
        return res.json({ success: true, isMatch: false, message: 'Already swiped' });
      }
      throw swipeError;
    }

    let isMatch = false;
    let matchData = null;

    // Check for mutual match only if RIGHT swipe
    if (direction === 'right') {
      
      if (targetType === 'match') {
        // Player swiped right on match - check if captain swiped right on player
        const { data: match } = await supabase
          .from('matches')
          .select('*, captain:users!matches_captain_id_fkey(*)')
          .eq('id', targetId)
          .single();

        if (match) {
          // Check if captain swiped right on this player
          const { data: captainSwipe } = await supabase
            .from('swipes')
            .select('*')
            .eq('user_id', match.captain_id)
            .eq('target_player_id', userId)
            .eq('direction', 'right')
            .maybeSingle();

          if (captainSwipe) {
            // IT'S A MATCH! 🎉
            isMatch = true;

            // Add player to match
            await supabase
              .from('match_players')
              .insert([{
                match_id: targetId,
                player_id: userId,
                status: 'accepted'
              }]);

            matchData = {
              matchId: match.id,
              title: match.title,
              date: match.match_date,
              location: match.address
            };
          }
        }

      } else if (targetType === 'player') {
        // Captain swiped right on player - check if player swiped right on any captain's matches
        const { data: captainMatches } = await supabase
          .from('matches')
          .select('*')
          .eq('captain_id', userId)
          .eq('status', 'open');

        if (captainMatches && captainMatches.length > 0) {
          const matchIds = captainMatches.map(m => m.id);

          // Check if player swiped right on any of these matches
          const { data: playerSwipe } = await supabase
            .from('swipes')
            .select('*, match:matches(*)')
            .eq('user_id', targetId)
            .in('target_match_id', matchIds)
            .eq('direction', 'right')
            .maybeSingle();

          if (playerSwipe) {
            // IT'S A MATCH! 🎉
            isMatch = true;

            // Add player to match
            await supabase
              .from('match_players')
              .insert([{
                match_id: playerSwipe.target_match_id,
                player_id: targetId,
                status: 'accepted'
              }]);

            const { data: player } = await supabase
              .from('users')
              .select('name')
              .eq('id', targetId)
              .single();

            matchData = {
              matchId: playerSwipe.target_match_id,
              playerName: player?.name,
              title: playerSwipe.match?.title
            };
          }
        }
      }
    }

    res.json({
      success: true,
      isMatch: isMatch,
      matchData: matchData
    });

  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ 
      error: 'Server error processing swipe',
      details: error.message 
    });
  }
});

module.exports = router;