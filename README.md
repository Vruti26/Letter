

# 📮 Secret Letter Web App

This is a small and personal web app built using **Next.js**, where a user can enter their **name or nickname** to open a special letter written only for them.
They cannot see anyone else’s letters — only their own.
Simple, private, and meaningful. To experience the web version visit: `https://letter-b663qbqmw-vrutis-projects-370da7ab.vercel.app/`

---

## 🌟 What This Project Does

* Users enter their **name or nickname** to open their letter
* Every letter is stored safely inside a single `data.json` file
* Clean UI and simple flow
* Fully deployable on **Vercel**
* Easy to update letters anytime

---

## 📁 Project Structure

```
├── data.json        # All names, nicknames, and letters
├── pages/
│   ├── index.js     # Login-like page (name/nickname input)
│   ├── letter.js    # Shows the user’s letter
├── styles/
│   ├── globals.css  # Styles
└── README.md
```

---

## ✏️ How Letters Work

All personalized letters are stored in `data.json`.
Each entry looks like this:

```json
{
  "user": {
    "nickname": ["test"],
    "letter": "Your personalized letter goes here..."
  }
}
```

To add a new person:

1. Open `data.json`
2. Create a new object with:

   * `"nickname"` → list of accepted nicknames
   * `"letter"` → the letter you want them to see

## ❤️ About

This project was created to share personal messages in a simple, private, and thoughtful way — a digital version of handing someone a sealed letter.

---

If you want, I can:
✅ Add screenshots of your website
✅ Add badges (Vercel deploy badge, Next.js badge)
✅ Add a more aesthetic version with colors & emojis

Just tell me!
