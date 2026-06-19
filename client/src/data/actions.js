const actionsData = [
  // Transport
  { id: 1,  title: 'Bike to Work',                category: 'Transport', impact: 1.1, difficulty: 'Easy',   points: 80,  description: 'Replace a car commute with cycling for a zero-emission journey.',                                duration: 'Daily',    tags: ['Active', 'Free'] },
  { id: 2,  title: 'Use Public Transit',           category: 'Transport', impact: 0.8, difficulty: 'Easy',   points: 60,  description: 'Take the bus or metro instead of driving to cut emissions by up to 75%.',                   duration: 'Daily',    tags: ['Low Cost'] },
  { id: 3,  title: 'Carpool to Work',              category: 'Transport', impact: 0.6, difficulty: 'Easy',   points: 50,  description: 'Share your commute with colleagues and split emissions.',                                    duration: 'Daily',    tags: ['Social'] },
  { id: 4,  title: 'Switch to EV',                 category: 'Transport', impact: 1.8, difficulty: 'Hard',   points: 200, description: 'Electric vehicles produce 50-70% less CO2e over their lifetime vs. gas cars.',               duration: 'One-time', tags: ['High Impact', 'Investment'] },
  { id: 5,  title: 'Work from Home',               category: 'Transport', impact: 0.9, difficulty: 'Medium', points: 70,  description: 'Eliminating even 2 commute days/week cuts transport emissions significantly.',                duration: 'Weekly',   tags: ['Flexible'] },
  // Diet
  { id: 6,  title: 'Meatless Monday',              category: 'Diet',      impact: 0.3, difficulty: 'Easy',   points: 30,  description: 'One meat-free day per week reduces annual food emissions by ~5%.',                           duration: 'Weekly',   tags: ['Healthy', 'Cheap'] },
  { id: 7,  title: 'Reduce Beef Consumption',      category: 'Diet',      impact: 0.6, difficulty: 'Medium', points: 60,  description: 'Beef produces 20x more GHG than plant protein. Swapping twice a week matters.',              duration: 'Regular',  tags: ['High Impact', 'Healthy'] },
  { id: 8,  title: 'Buy Local & Seasonal',         category: 'Diet',      impact: 0.2, difficulty: 'Easy',   points: 25,  description: 'Local food travels less, meaning lower transportation emissions.',                           duration: 'Regular',  tags: ['Community', 'Fresh'] },
  { id: 9,  title: 'Reduce Food Waste',            category: 'Diet',      impact: 0.4, difficulty: 'Easy',   points: 40,  description: 'Food waste accounts for 8% of global GHGs. Plan meals and use leftovers.',                    duration: 'Daily',    tags: ['Saves Money'] },
  // Energy
  { id: 10, title: 'Switch to LED Bulbs',          category: 'Energy',    impact: 0.3, difficulty: 'Easy',   points: 35,  description: 'LED bulbs use 75% less energy than traditional incandescents.',                             duration: 'One-time', tags: ['Cheap', 'Saves Money'] },
  { id: 11, title: 'Install Smart Thermostat',     category: 'Energy',    impact: 0.5, difficulty: 'Easy',   points: 55,  description: 'Smart thermostats reduce heating/cooling energy use by 10-23%.',                            duration: 'One-time', tags: ['Investment', 'Saves Money'] },
  { id: 12, title: 'Solar Panel Installation',     category: 'Energy',    impact: 2.2, difficulty: 'Hard',   points: 250, description: 'Residential solar can offset 1-2 tonnes CO2e annually depending on location.',               duration: 'One-time', tags: ['High Impact', 'Investment'] },
  { id: 13, title: 'Unplug Idle Electronics',      category: 'Energy',    impact: 0.1, difficulty: 'Easy',   points: 15,  description: 'Standby power accounts for 5-10% of household energy use.',                                duration: 'Daily',    tags: ['Habit', 'Free'] },
  { id: 14, title: 'Switch to Green Energy Tariff',category: 'Energy',    impact: 1.0, difficulty: 'Easy',   points: 100, description: 'Choose a 100% renewable energy provider to zero out your home electricity emissions.',       duration: 'One-time', tags: ['High Impact'] },
  // Shopping
  { id: 15, title: 'Buy Secondhand',               category: 'Shopping',  impact: 0.4, difficulty: 'Easy',   points: 40,  description: 'Extending the life of clothing by 9 months reduces carbon, water & waste by 20-30%.',       duration: 'Regular',  tags: ['Saves Money', 'Creative'] },
  { id: 16, title: 'Avoid Fast Fashion',           category: 'Shopping',  impact: 0.3, difficulty: 'Medium', points: 35,  description: 'Fashion is responsible for 10% of global GHG. Choose quality over quantity.',                duration: 'Regular',  tags: ['Mindful'] },
  { id: 17, title: 'Repair Instead of Replace',    category: 'Shopping',  impact: 0.2, difficulty: 'Medium', points: 25,  description: 'Repairing electronics and appliances avoids the embodied carbon of new products.',           duration: 'As Needed',tags: ['Saves Money', 'Skill'] },
];

export default actionsData;
