const CATEGORIES = ['Transport', 'Diet', 'Energy', 'Shopping'];

export function getRecommendations(completedActions, allActions) {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyStr = thirtyDaysAgo.toISOString().split('T')[0];

  const todayLoggedIds = new Set(
    completedActions.filter(a => a.completedAt === today).map(a => a.id)
  );

  const categoryCounts = {};
  completedActions
    .filter(a => a.completedAt >= thirtyStr)
    .forEach(a => { categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1; });

  const weakestCategory = [...CATEGORIES].sort(
    (a, b) => (categoryCounts[a] || 0) - (categoryCounts[b] || 0)
  )[0];

  return allActions
    .filter(a => !todayLoggedIds.has(a.id))
    .map(a => ({
      ...a,
      _score: a.impact * 10 + (a.category === weakestCategory ? 5 : 0),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 3);
}

export function getContextualMessage(completedActions, streak) {
  const today = new Date().toISOString().split('T')[0];
  const todayCount = completedActions.filter(a => a.completedAt === today).length;

  if (todayCount === 0 && streak > 1)
    return { text: `Your ${streak}-day streak is at risk — log at least one action today to keep it alive.`, type: 'warn' };
  if (todayCount === 0)
    return { text: 'No actions logged yet today. Even one small step makes a difference.', type: 'neutral' };
  if (todayCount === 1)
    return { text: 'Good start! One more action today would double your daily impact.', type: 'good' };
  if (todayCount >= 3)
    return { text: `Outstanding — ${todayCount} actions logged today. You're making a real difference.`, type: 'good' };
  return { text: `${todayCount} actions logged today — keep the momentum going!`, type: 'good' };
}
