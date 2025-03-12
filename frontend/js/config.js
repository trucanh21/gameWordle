const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-render-app.onrender.com/api'
    : 'http://localhost:3000/api';

export const ENDPOINTS = {
    WORD_OF_DAY: `${API_URL}/word-of-the-day`,
    CHECK_WORD: (word) => `${API_URL}/check/${word}`,
    CHECK_NICKNAME: `${API_URL}/check-nickname`,
    SAVE_RESULT: `${API_URL}/save-result`,
    LEADERBOARD: `${API_URL}/leaderboard`
}; 