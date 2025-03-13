# 🎮 Wordle Game Multiplayer

A multiplayer version of the popular word-guessing game Wordle, where players can compete with each other and see their rankings on a leaderboard.

## Table of Contents

- [Overview](#overview)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My Process](#my-process)
  - [Built With](#built-with)
  - [Features](#features)
- [How To Run](#how-to-run)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Author](#author)
- [Deployment](#deployment)

## Overview

### Screenshots

![Game Interface](/frontend/resources/images/game-screenshot.png)
![Game Interface](/frontend/resources/images/game-screenshot1.png)
![Game Interface](/frontend/resources/images/gamewordle-screenshot4.png)
![Leaderboard](/frontend/resources/images/gamewordle-screenshot3.png)
![Game Interface](/frontend/resources/images/gamewordle-screenshot2.png)

## My Process

### Built With

- Frontend:
  - HTML5
  - CSS3 (Custom properties, Flexbox)
  - Vanilla JavaScript
  - LocalStorage for game state
- Backend:
  - Node.js
  - Express.js
  - MySQL Database
  - CORS for security

### Features

- 🎯 Daily word changes automatically
- 👥 Multiplayer support with unique nicknames
- 📊 Global leaderboard
- 🎮 One game per day per player
- 🏆 Best score tracking
- 📱 Responsive design for all devices

## How To Run

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/wordle-game.git
cd wordle-game
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file in the root directory

```env
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=wordle_game
PORT=3000
```

4. Set up the database

```sql
CREATE DATABASE wordle_game CHARACTER SET = UTF8;
USE wordle_game;

CREATE TABLE player (
    P_Nickname VARCHAR(100) NOT NULL PRIMARY KEY,
    P_guesses INT NOT NULL
) CHARACTER SET = UTF8;

CREATE TABLE daily_plays (
    nickname VARCHAR(100) NOT NULL,
    play_date DATE NOT NULL,
    PRIMARY KEY (nickname, play_date)
) CHARACTER SET = UTF8;
```

### Running Locally

1. Start the backend server

```bash
npm run dev
```

2. Open the frontend

- Open `frontend/index.html` in your browser
- Or use a local server like Live Server in VS Code

## Author

- GitHub - [@Lanta](https://github.com/trucanh21)

## Acknowledgments

- Original Wordle game by Josh Wardle
- Font 'Nerko One' from Google Fonts
- Icons and images from [source]

## Deployment

### Frontend (Vercel)

1. Fork this repository
2. Sign up on [Vercel](https://vercel.com)
3. Import your repository
4. Configure:
   - Root Directory: frontend
   - Framework Preset: Other
5. Deploy

### Backend (Render)

1. Sign up on [Render](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables from `.env`
