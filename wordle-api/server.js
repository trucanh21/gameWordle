const express = require("express");
const cors = require("cors");
const app = express();
const words = require("./words.json");
const db = require('./config/db');

app.use(cors());
app.use(express.json());

let secretWord = getRandomWord();
let lastWordChange = new Date().setHours(0, 0, 0, 0); // Đặt thời gian reset từ mới vào đầu ngày

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.words.length);
    return words.words[randomIndex].toUpperCase();
}

// Kiểm tra và reset từ mới mỗi ngày
function checkAndResetWord() {
    const now = new Date().setHours(0, 0, 0, 0);
    if (now > lastWordChange) {
        secretWord = getRandomWord();
        lastWordChange = now;
    }
}



// Khởi tạo database
async function initDatabase() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS player (
                P_Nickname VARCHAR(100) NOT NULL PRIMARY KEY,
                P_guesses INT NOT NULL
            ) CHARACTER SET = UTF8
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS daily_plays (
                nickname VARCHAR(100) NOT NULL,
                play_date DATE NOT NULL,
                PRIMARY KEY (nickname, play_date)
            ) CHARACTER SET = UTF8
        `);

        console.log("✅ Database initialized successfully");
    } catch (error) {
        console.error("❌ Database initialization error:", error);
    }
}

initDatabase();

// Kiểm tra nickname có tồn tại không
app.post("/check-nickname", async (req, res) => {
    try {
        const { nickname } = req.body;
        const [rows] = await db.execute(
            'SELECT P_Nickname FROM player WHERE P_Nickname = ?',
            [nickname]
        );

        if (rows.length > 0) {
            // Nickname đã tồn tại, kiểm tra xem hôm nay đã chơi chưa
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

app.get("/word-of-the-day", (req, res) => {
    checkAndResetWord();
    res.json({ word: secretWord });
});

app.get("/check/:word", (req, res) => {
    const word = req.params.word.toLowerCase();
    if (words.words.includes(word)) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

// Lưu hoặc cập nhật kết quả người chơi
app.post("/save-result", async (req, res) => {
    try {
        const { nickname, guesses } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Kiểm tra xem người chơi đã tồn tại chưa
        const [existingPlayer] = await db.execute(
            'SELECT P_guesses FROM player WHERE P_Nickname = ?',
            [nickname]
        );

        if (existingPlayer.length > 0) {
            // Cập nhật điểm nếu kết quả mới tốt hơn
            if (guesses < existingPlayer[0].P_guesses) {
                await db.execute(
                    'UPDATE player SET P_guesses = ? WHERE P_Nickname = ?',
                    [guesses, nickname]
                );
            }
        } else {
            // Thêm người chơi mới
            await db.execute(
                'INSERT INTO player (P_Nickname, P_guesses) VALUES (?, ?)',
                [nickname, guesses]
            );
        }

        // Ghi nhận lượt chơi hôm nay
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

// Lấy bảng xếp hạng tuần
app.get("/leaderboard", async (req, res) => {
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

app.listen(3000, () => console.log("✅ Server chạy tại http://localhost:3000"));