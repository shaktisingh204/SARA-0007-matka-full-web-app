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
    { name: 'MILAN MORNING', open_time: '10:15', close_time: '11:15' },
    { name: 'KALYAN MORNING', open_time: '11:00', close_time: '12:02' },
    { name: 'MILAN DAY', open_time: '15:10', close_time: '17:10' },
    { name: 'RAJDHANI DAY', open_time: '15:15', close_time: '17:15' },
    { name: 'KALYAN', open_time: '16:15', close_time: '18:15' },
    { name: 'MILAN NIGHT', open_time: '21:05', close_time: '23:05' },
    { name: 'RAJDHANI NIGHT', open_time: '21:25', close_time: '23:35' },
    { name: 'MAIN BAZAR', open_time: '21:35', close_time: '23:59' },
    { name: 'ALWAYS OPEN', open_time: '00:00', close_time: '23:59' },
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
