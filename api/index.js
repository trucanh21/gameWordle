const express = require("express");
const cors = require("cors");
const app = express();
const words = require("./words.json");
const db = require('./config/db');
require('dotenv').config();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-vercel-domain.vercel.app'] 
        : ['http://localhost:3000']
}));
app.use(express.json());

let secretWord = getRandomWord();
let lastWordChange = new Date().setHours(0, 0, 0, 0);

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.words.length);
    return words.words[randomIndex].toUpperCase();
}

function checkAndResetWord() {
    const now = new Date().setHours(0, 0, 0, 0);
    if (now > lastWordChange) {
        secretWord = getRandomWord();
        lastWordChange = now;
    }
}

// API Routes
app.get("/api/word-of-the-day", (req, res) => {
    checkAndResetWord();
    res.json({ word: secretWord });
});

app.get("/api/check/:word", (req, res) => {
    const word = req.params.word.toLowerCase();
    if (words.words.includes(word)) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.post("/api/check-nickname", async (req, res) => {
    try {
        const { nickname } = req.body;
        const [rows] = await db.execute(
            'SELECT P_Nickname FROM player WHERE P_Nickname = ?',
            [nickname]
        );
        
        if (rows.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const [playToday] = await db.execute(
                'SELECT * FROM daily_plays WHERE nickname = ? AND play_date = ?',
                [nickname, today]
            );
            
            res.json({ 
                exists: true, 
                canPlay: playToday.length === 0,
                message: playToday.length > 0 ? "You have already played today" : "Welcome back!"
            });
        } else {
            res.json({ exists: false, canPlay: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/save-result", async (req, res) => {
    try {
        const { nickname, guesses } = req.body;
        const today = new Date().toISOString().split('T')[0];

        const [existingPlayer] = await db.execute(
            'SELECT P_guesses FROM player WHERE P_Nickname = ?',
            [nickname]
        );

        if (existingPlayer.length > 0) {
            if (guesses < existingPlayer[0].P_guesses) {
                await db.execute(
                    'UPDATE player SET P_guesses = ? WHERE P_Nickname = ?',
                    [guesses, nickname]
                );
            }
        } else {
            await db.execute(
                'INSERT INTO player (P_Nickname, P_guesses) VALUES (?, ?)',
                [nickname, guesses]
            );
        }

        await db.execute(
            'INSERT INTO daily_plays (nickname, play_date) VALUES (?, ?)',
            [nickname, today]
        );

        res.json({ success: true });
    } catch (error) {
        console.error("Save result error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/api/leaderboard", async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT P_Nickname, P_guesses FROM player ORDER BY P_guesses ASC LIMIT 10'
        );
        res.json(rows);
    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`)); 