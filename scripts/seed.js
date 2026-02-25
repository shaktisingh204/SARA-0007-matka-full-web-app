require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please provide MONGODB_URI in your environment variables.");
    process.exit(1);
}

// Game Schema definition inline to avoid module alias issues in standalone script
const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    open_time: { type: String, required: true },
    close_time: { type: String, required: true },
});

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

const dummyGames = [
    { name: 'MILAN MORNING', open_time: '10:15 AM', close_time: '11:15 AM' },
    { name: 'KALYAN MORNING', open_time: '11:00 AM', close_time: '12:02 PM' },
    { name: 'MILAN DAY', open_time: '03:10 PM', close_time: '05:10 PM' },
    { name: 'RAJDHANI DAY', open_time: '03:15 PM', close_time: '05:15 PM' },
    { name: 'KALYAN', open_time: '04:15 PM', close_time: '06:15 PM' },
    { name: 'MILAN NIGHT', open_time: '09:05 PM', close_time: '11:05 PM' },
    { name: 'RAJDHANI NIGHT', open_time: '09:25 PM', close_time: '11:35 PM' },
    { name: 'MAIN BAZAR', open_time: '09:35 PM', close_time: '12:05 AM' },
];

async function seed() {
    try {
        console.log(`Connecting to MongoDB at: ${MONGODB_URI.split('@').pop()}`); // Don't log credentials
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        console.log('Clearing existing games...');
        await Game.deleteMany({});

        console.log('Inserting dummy games...');
        await Game.insertMany(dummyGames);

        console.log(`Successfully seeded ${dummyGames.length} dummy games!`);

    } catch (error) {
        console.error('Error seeding games:', error);
    } finally {
        mongoose.connection.close();
    }
}

seed();
