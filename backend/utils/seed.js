require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose  = require('mongoose');
const connectDB = require('../config/db');
const Tournament = require('../models/Tournament');

const seedTournaments = [
  { name: 'Cricko Premier League',  date: '2026-06-10', location: 'Mumbai',  status: 'Open',     teams: 6, maxPlayers: 10, fee: '500',  description: 'The flagship CRICKO tournament featuring the top 6 teams.' },
  { name: 'Champions Knockout Cup', date: '2026-07-02', location: 'Chennai', status: 'Upcoming', teams: 4, maxPlayers: 10, fee: '800',  description: 'Fast-paced knockout format with 4 elite teams.' },
  { name: 'Summer Cricket Bash',    date: '2026-05-28', location: 'Delhi',   status: 'Full',     teams: 8, maxPlayers: 10, fee: '300',  description: 'The largest CRICKO event with 8 teams and 40+ matches.' },
];

const seed = async () => {
  await connectDB();
  const existing = await Tournament.countDocuments();
  if (existing === 0) {
    await Tournament.insertMany(seedTournaments);
    console.log('Seeded 3 tournaments into MongoDB.');
  } else {
    console.log(`Skipping seed — ${existing} tournaments already exist.`);
  }
  mongoose.connection.close();
};

seed();
