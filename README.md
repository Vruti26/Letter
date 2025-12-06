📮 Secret Letter Web App

A simple, elegant Next.js application where users enter their name or nickname to unlock a personalized letter written just for them.

This project is lightweight, easy to customize, and works perfectly when deployed on Vercel.

🚀 Features

🔐 Name/Nickname Unlock System
Users can enter their name or a nickname to access their unique letter.

📝 Personalized Letters Stored in data.json
All letters and nicknames are stored in a single JSON file for easy editing.

⚡ Next.js + Vercel Deployment
Fast, serverless, and hassle-free hosting.

📱 Responsive UI
Works smoothly on mobile and desktop.

📂 Project Structure
├── data.json         // Stores users, nicknames and letters
├── pages/
│   ├── index.js      // Home page where user enters name
│   ├── letter.js     // Letter display page
├── styles/
│   ├── globals.css   // Global styling
└── README.md         // Documentation

🛠️ How It Works

User enters their name or nickname on the homepage.

The system checks data.json to match the input.

If a match is found → the user's personal letter is displayed.

If not → user sees an error message.
