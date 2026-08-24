/**
 * Proximity and Smart Matching Utilities
 */

// Calculate Haversine distance in meters between two coordinates [lat, lng]
export function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return Infinity;
  }
  const R = 6371e3; // Earth's radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Civic Duplicate Detection
 * Checks if a proposed location is within `thresholdMeters` (default 30m) of an existing active issue.
 */
export function findNearbyCivicDuplicates(newLat, newLng, newCategory, existingIssues, thresholdMeters = 35) {
  if (!newLat || !newLng || !Array.isArray(existingIssues)) return [];

  const candidates = existingIssues.filter(issue => issue.status !== 'resolved');

  const matches = [];

  for (const issue of candidates) {
    if (issue.location && typeof issue.location.lat === 'number' && typeof issue.location.lng === 'number') {
      const distance = calculateDistanceInMeters(newLat, newLng, issue.location.lat, issue.location.lng);
      
      if (distance <= thresholdMeters) {
        const isSameCategory = issue.category === newCategory;
        // Higher relevance if same category
        matches.push({
          issue,
          distanceMeters: distance,
          isSameCategory,
          confidence: isSameCategory ? 95 : 75,
        });
      }
    }
  }

  // Sort by closest distance first
  return matches.sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/**
 * Text tokenization and Jaccard similarity for keyword matching
 */
function tokenizeText(text) {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  return new Set(words);
}

function calculateJaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionCount++;
  }
  const unionSize = setA.size + setB.size - intersectionCount;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

/**
 * Smart Lost & Found Cross-Match Engine
 * Calculates similarity between a 'lost' item and a 'found' item.
 */
export function calculateLostFoundSimilarity(itemA, itemB) {
  // If both are lost or both are found, skip (or lower score)
  if (itemA.type === itemB.type) return { score: 0, reasons: [] };

  const reasons = [];
  let score = 0;

  // 1. Category Matching (35%)
  if (itemA.category && itemB.category && itemA.category === itemB.category) {
    score += 35;
    reasons.push('Identical item category');
  }

  // 2. Keyword & Description Overlap (35%)
  const textA = `${itemA.title} ${itemA.description} ${itemA.color || ''} ${itemA.brand || ''}`;
  const textB = `${itemB.title} ${itemB.description} ${itemB.color || ''} ${itemB.brand || ''}`;
  const tokensA = tokenizeText(textA);
  const tokensB = tokenizeText(textB);
  const textSim = calculateJaccardSimilarity(tokensA, tokensB);

  if (textSim > 0.1) {
    const textScore = Math.min(35, Math.round(textSim * 70));
    score += textScore;
    
    // Find common keywords for explanation
    const commonKeywords = [...tokensA].filter(x => tokensB.has(x)).slice(0, 3);
    if (commonKeywords.length > 0) {
      reasons.push(`Matching keywords: "${commonKeywords.join(', ')}"`);
    }
  }

  // 3. Location Proximity (20%)
  if (itemA.location?.lat && itemA.location?.lng && itemB.location?.lat && itemB.location?.lng) {
    const dist = calculateDistanceInMeters(
      itemA.location.lat,
      itemA.location.lng,
      itemB.location.lat,
      itemB.location.lng
    );

    if (dist <= 40) {
      score += 20;
      reasons.push(`Found within ${dist}m of reported spot`);
    } else if (dist <= 150) {
      score += 15;
      reasons.push(`Within ${dist}m walking area`);
    } else if (dist <= 400) {
      score += 8;
      reasons.push(`Same campus zone (${dist}m)`);
    }
  } else if (itemA.locationName && itemB.locationName) {
    const locA = itemA.locationName.toLowerCase();
    const locB = itemB.locationName.toLowerCase();
    if (locA.includes(locB) || locB.includes(locA)) {
      score += 15;
      reasons.push(`Matching location: ${itemA.locationName}`);
    }
  }

  // 4. Time Proximity (10%)
  if (itemA.timestamp && itemB.timestamp) {
    const dateA = new Date(itemA.timestamp).getTime();
    const dateB = new Date(itemB.timestamp).getTime();
    const diffHours = Math.abs(dateA - dateB) / (1000 * 60 * 60);

    if (diffHours <= 24) {
      score += 10;
      reasons.push('Reported within 24 hours of each other');
    } else if (diffHours <= 72) {
      score += 5;
      reasons.push('Reported within 3 days');
    }
  }

  // Cap at 98% (unless manual verification)
  const finalScore = Math.min(98, Math.max(0, score));

  return {
    score: finalScore,
    reasons,
    isHighConfidence: finalScore >= 65,
  };
}

/**
 * Find top match candidates for a specific lost or found post
 */
export function findMatchesForPost(targetPost, allPosts, minConfidence = 45) {
  if (!targetPost || !Array.isArray(allPosts)) return [];

  const candidates = allPosts.filter(
    p => p.id !== targetPost.id && p.type !== targetPost.type && p.status !== 'reunited'
  );

  const matchedList = [];

  for (const item of candidates) {
    const matchResult = calculateLostFoundSimilarity(targetPost, item);
    if (matchResult.score >= minConfidence) {
      matchedList.push({
        matchedItem: item,
        score: matchResult.score,
        reasons: matchResult.reasons,
        isHighConfidence: matchResult.isHighConfidence,
      });
    }
  }

  return matchedList.sort((a, b) => b.score - a.score);
}
