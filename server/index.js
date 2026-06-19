import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
}));
app.use(express.json());

// ─── Dashboard Data ──────────────────────────────────────────────────────────
const dashboardData = {
  user: {
    name: 'Alex Rivera',
    avatar: null,
    joinedDate: '2024-01-15',
    streak: 14,
    level: 'Eco Champion',
    totalOffset: 2.4,
  },
  summary: {
    currentFootprint: 5.8,       // tonnes CO2e / year
    globalAverage: 7.5,
    targetFootprint: 4.0,
    percentToTarget: 68,
    monthlyChange: -8.3,         // percent
  },
  monthlyEmissions: [
    { month: 'Jan', emissions: 7.1, target: 6.5 },
    { month: 'Feb', emissions: 6.8, target: 6.3 },
    { month: 'Mar', emissions: 6.5, target: 6.1 },
    { month: 'Apr', emissions: 6.9, target: 5.9 },
    { month: 'May', emissions: 6.2, target: 5.7 },
    { month: 'Jun', emissions: 5.8, target: 5.5 },
    { month: 'Jul', emissions: 5.6, target: 5.3 },
    { month: 'Aug', emissions: 5.9, target: 5.1 },
    { month: 'Sep', emissions: 5.4, target: 4.9 },
    { month: 'Oct', emissions: 5.1, target: 4.7 },
    { month: 'Nov', emissions: 4.9, target: 4.5 },
    { month: 'Dec', emissions: 5.8, target: 4.0 },
  ],
  breakdown: [
    { category: 'Transport', value: 38, color: '#006c49', icon: '🚗' },
    { category: 'Home Energy', value: 25, color: '#10b981', icon: '⚡' },
    { category: 'Diet', value: 22, color: '#006a61', icon: '🥗' },
    { category: 'Shopping', value: 10, color: '#2b6954', icon: '🛍️' },
    { category: 'Other', value: 5, color: '#adedd3', icon: '♻️' },
  ],
  recentActions: [
    { id: 1, title: 'Took public transit', impact: -0.8, date: '2024-06-12', category: 'Transport' },
    { id: 2, title: 'Plant-based meal', impact: -0.3, date: '2024-06-11', category: 'Diet' },
    { id: 3, title: 'LED bulbs replaced', impact: -0.5, date: '2024-06-10', category: 'Energy' },
    { id: 4, title: 'Bike to work', impact: -1.1, date: '2024-06-09', category: 'Transport' },
  ],
};

// ─── Insights Data ────────────────────────────────────────────────────────────
const insightsData = {
  aiInsights: [
    {
      id: 1,
      type: 'opportunity',
      title: 'Biggest Win: Switch to EV',
      description: 'Based on your commute data, switching to an electric vehicle could reduce your annual footprint by 1.8 tonnes CO2e — your single largest savings opportunity.',
      impact: -1.8,
      difficulty: 'Medium',
      category: 'Transport',
      priority: 'high',
    },
    {
      id: 2,
      type: 'trend',
      title: 'Diet Improvements Detected',
      description: 'Your dietary emissions dropped 18% this quarter — well above the community average of 6%. Keep expanding your plant-based meals for compounding impact.',
      impact: -0.4,
      difficulty: 'Easy',
      category: 'Diet',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Home Heating Spike',
      description: 'Your home energy usage rose 12% last month, likely from heating. A smart thermostat or additional insulation could save 0.3t CO2e and ~$180 annually.',
      impact: -0.3,
      difficulty: 'Easy',
      category: 'Energy',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Below City Average!',
      description: 'You are now 22% below the city average carbon footprint. Share your progress to inspire your network — community momentum multiplies impact.',
      impact: 0,
      difficulty: null,
      category: 'Milestone',
      priority: 'low',
    },
  ],
  comparisons: {
    user: 5.8,
    cityAverage: 7.4,
    nationalAverage: 7.5,
    sustainableTarget: 2.0,
    topStewards: 3.1,
  },
  weeklyTrend: [
    { week: 'W1', user: 6.8, average: 7.5 },
    { week: 'W2', user: 6.4, average: 7.4 },
    { week: 'W3', user: 6.1, average: 7.5 },
    { week: 'W4', user: 5.8, average: 7.4 },
    { week: 'W5', user: 5.6, average: 7.3 },
    { week: 'W6', user: 5.8, average: 7.4 },
    { week: 'W7', user: 5.4, average: 7.2 },
    { week: 'W8', user: 5.2, average: 7.3 },
  ],
  categoryTrend: [
    { month: 'Mar', transport: 2.5, energy: 1.6, diet: 1.4, other: 1.0 },
    { month: 'Apr', transport: 2.6, energy: 1.5, diet: 1.4, other: 0.9 },
    { month: 'May', transport: 2.3, energy: 1.5, diet: 1.2, other: 0.8 },
    { month: 'Jun', transport: 2.2, energy: 1.4, diet: 1.2, other: 0.8 },
  ],
};

// ─── Action Library ───────────────────────────────────────────────────────────
const actionsData = [
  // Transport
  { id: 1, title: 'Bike to Work', category: 'Transport', impact: 1.1, difficulty: 'Easy', points: 80, description: 'Replace a car commute with cycling for a zero-emission journey.', completed: true, bookmarked: false, duration: 'Daily', tags: ['Active', 'Free'] },
  { id: 2, title: 'Use Public Transit', category: 'Transport', impact: 0.8, difficulty: 'Easy', points: 60, description: 'Take the bus or metro instead of driving to cut emissions by up to 75%.', completed: false, bookmarked: true, duration: 'Daily', tags: ['Low Cost'] },
  { id: 3, title: 'Carpool to Work', category: 'Transport', impact: 0.6, difficulty: 'Easy', points: 50, description: 'Share your commute with colleagues and split emissions.', completed: false, bookmarked: false, duration: 'Daily', tags: ['Social'] },
  { id: 4, title: 'Switch to EV', category: 'Transport', impact: 1.8, difficulty: 'Hard', points: 200, description: 'Electric vehicles produce 50-70% less CO2e over their lifetime vs. gas cars.', completed: false, bookmarked: true, duration: 'One-time', tags: ['High Impact', 'Investment'] },
  { id: 5, title: 'Work from Home', category: 'Transport', impact: 0.9, difficulty: 'Medium', points: 70, description: 'Eliminating even 2 commute days/week cuts transport emissions significantly.', completed: true, bookmarked: false, duration: 'Weekly', tags: ['Flexible'] },

  // Diet
  { id: 6, title: 'Meatless Monday', category: 'Diet', impact: 0.3, difficulty: 'Easy', points: 30, description: 'One meat-free day per week reduces annual food emissions by ~5%.', completed: true, bookmarked: false, duration: 'Weekly', tags: ['Healthy', 'Cheap'] },
  { id: 7, title: 'Reduce Beef Consumption', category: 'Diet', impact: 0.6, difficulty: 'Medium', points: 60, description: 'Beef produces 20x more GHG than plant protein. Swapping twice a week matters.', completed: false, bookmarked: false, duration: 'Regular', tags: ['High Impact', 'Healthy'] },
  { id: 8, title: 'Buy Local & Seasonal', category: 'Diet', impact: 0.2, difficulty: 'Easy', points: 25, description: 'Local food travels less, meaning lower transportation emissions.', completed: false, bookmarked: true, duration: 'Regular', tags: ['Community', 'Fresh'] },
  { id: 9, title: 'Reduce Food Waste', category: 'Diet', impact: 0.4, difficulty: 'Easy', points: 40, description: 'Food waste accounts for 8% of global GHGs. Plan meals and use leftovers.', completed: true, bookmarked: false, duration: 'Daily', tags: ['Saves Money'] },

  // Energy
  { id: 10, title: 'Switch to LED Bulbs', category: 'Energy', impact: 0.3, difficulty: 'Easy', points: 35, description: 'LED bulbs use 75% less energy than traditional incandescents.', completed: true, bookmarked: false, duration: 'One-time', tags: ['Cheap', 'Saves Money'] },
  { id: 11, title: 'Install Smart Thermostat', category: 'Energy', impact: 0.5, difficulty: 'Easy', points: 55, description: 'Smart thermostats reduce heating/cooling energy use by 10-23%.', completed: false, bookmarked: true, duration: 'One-time', tags: ['Investment', 'Saves Money'] },
  { id: 12, title: 'Solar Panel Installation', category: 'Energy', impact: 2.2, difficulty: 'Hard', points: 250, description: 'Residential solar can offset 1-2 tonnes CO2e annually depending on location.', completed: false, bookmarked: false, duration: 'One-time', tags: ['High Impact', 'Investment'] },
  { id: 13, title: 'Unplug Idle Electronics', category: 'Energy', impact: 0.1, difficulty: 'Easy', points: 15, description: 'Standby power accounts for 5-10% of household energy use.', completed: true, bookmarked: false, duration: 'Daily', tags: ['Habit', 'Free'] },
  { id: 14, title: 'Switch to Green Energy Tariff', category: 'Energy', impact: 1.0, difficulty: 'Easy', points: 100, description: 'Choose a 100% renewable energy provider to zero out your home electricity emissions.', completed: false, bookmarked: false, duration: 'One-time', tags: ['High Impact'] },

  // Shopping
  { id: 15, title: 'Buy Secondhand', category: 'Shopping', impact: 0.4, difficulty: 'Easy', points: 40, description: 'Extending the life of clothing by 9 months reduces carbon, water & waste by 20-30%.', completed: false, bookmarked: true, duration: 'Regular', tags: ['Saves Money', 'Creative'] },
  { id: 16, title: 'Avoid Fast Fashion', category: 'Shopping', impact: 0.3, difficulty: 'Medium', points: 35, description: 'Fashion is responsible for 10% of global GHG. Choose quality over quantity.', completed: true, bookmarked: false, duration: 'Regular', tags: ['Mindful'] },
  { id: 17, title: 'Repair Instead of Replace', category: 'Shopping', impact: 0.2, difficulty: 'Medium', points: 25, description: 'Repairing electronics and appliances avoids the embodied carbon of new products.', completed: false, bookmarked: false, duration: 'As Needed', tags: ['Saves Money', 'Skill'] },
];

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  res.json(dashboardData);
});

app.get('/api/insights', (req, res) => {
  res.json(insightsData);
});

app.get('/api/actions', (req, res) => {
  const { category, difficulty } = req.query;
  let filtered = [...actionsData];
  if (category && category !== 'All') {
    filtered = filtered.filter(a => a.category === category);
  }
  if (difficulty && difficulty !== 'All') {
    filtered = filtered.filter(a => a.difficulty === difficulty);
  }
  res.json(filtered);
});

app.post('/api/actions/:id/complete', (req, res) => {
  const id = parseInt(req.params.id);
  const action = actionsData.find(a => a.id === id);
  if (!action) return res.status(404).json({ error: 'Action not found' });
  action.completed = !action.completed;
  res.json({ success: true, action });
});

app.post('/api/actions/:id/bookmark', (req, res) => {
  const id = parseInt(req.params.id);
  const action = actionsData.find(a => a.id === id);
  if (!action) return res.status(404).json({ error: 'Action not found' });
  action.bookmarked = !action.bookmarked;
  res.json({ success: true, action });
});

app.get('/api/stats', (req, res) => {
  res.json({
    activeStewards: 45200,
    co2Offset: 1200000,
    greenPartners: 850,
    actionsCompleted: 312000,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Green Steps API running at http://localhost:${PORT}`);
});
