import { describe, it, expect } from 'vitest';
import { getRecommendations, getContextualMessage } from '../utils/recommendations';

const TODAY = new Date().toISOString().split('T')[0];

const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const mockActions = [
  { id: 1, title: 'Use public transit',   category: 'Transport', impact: 0.8, difficulty: 'Easy' },
  { id: 2, title: 'Plant-based meal',     category: 'Diet',      impact: 0.5, difficulty: 'Easy' },
  { id: 3, title: 'Switch to LED bulbs',  category: 'Energy',    impact: 0.3, difficulty: 'Easy' },
  { id: 4, title: 'Buy secondhand',       category: 'Shopping',  impact: 0.2, difficulty: 'Easy' },
  { id: 5, title: 'Cycle to work',        category: 'Transport', impact: 1.2, difficulty: 'Medium' },
];

/* ── getRecommendations ─────────────────────────────────── */
describe('getRecommendations', () => {
  it('returns at most 3 suggestions', () => {
    const result = getRecommendations([], mockActions);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('excludes actions already logged today', () => {
    const completed = [{ id: 1, completedAt: TODAY, category: 'Transport', impact: 0.8 }];
    const result = getRecommendations(completed, mockActions);
    expect(result.every(a => a.id !== 1)).toBe(true);
  });

  it('returns empty array when all actions logged today', () => {
    const completed = mockActions.map(a => ({ ...a, completedAt: TODAY }));
    expect(getRecommendations(completed, mockActions)).toHaveLength(0);
  });

  it('still suggests actions logged on a previous day', () => {
    const completed = [{ id: 1, completedAt: yesterday(), category: 'Transport', impact: 0.8 }];
    const result = getRecommendations(completed, mockActions);
    expect(result.some(a => a.id === 1)).toBe(true);
  });

  it('gives a score bonus to actions in the weakest category', () => {
    const completed = [
      { id: 1, completedAt: yesterday(), category: 'Transport', impact: 0.8 },
      { id: 5, completedAt: yesterday(), category: 'Transport', impact: 1.2 },
    ];
    const result = getRecommendations(completed, mockActions);
    // Non-Transport actions should carry the +5 weakest-category bonus in their _score
    const nonTransport = result.filter(a => a.category !== 'Transport');
    expect(nonTransport.length).toBeGreaterThan(0);
    nonTransport.forEach(a => {
      expect(a._score).toBeGreaterThanOrEqual(a.impact * 10 + 5);
    });
  });

  it('sorts by impact when categories are equal', () => {
    const result = getRecommendations([], mockActions);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1]._score).toBeGreaterThanOrEqual(result[i]._score);
    }
  });
});

/* ── getContextualMessage ───────────────────────────────── */
describe('getContextualMessage', () => {
  it('warns about streak when nothing logged today and streak > 1', () => {
    const completed = [{ completedAt: yesterday() }];
    const msg = getContextualMessage(completed, 5);
    expect(msg.type).toBe('warn');
    expect(msg.text).toContain('5-day streak');
  });

  it('returns neutral when no history and no streak', () => {
    const msg = getContextualMessage([], 0);
    expect(msg.type).toBe('neutral');
  });

  it('returns good type after first action today', () => {
    const completed = [{ completedAt: TODAY }];
    const msg = getContextualMessage(completed, 1);
    expect(msg.type).toBe('good');
  });

  it('returns good type after 3+ actions today', () => {
    const completed = [TODAY, TODAY, TODAY].map(d => ({ completedAt: d }));
    const msg = getContextualMessage(completed, 3);
    expect(msg.type).toBe('good');
    expect(msg.text).toContain('3');
  });

  it('always returns an object with text and type', () => {
    const msg = getContextualMessage([], 1);
    expect(msg).toHaveProperty('text');
    expect(msg).toHaveProperty('type');
    expect(typeof msg.text).toBe('string');
  });
});
