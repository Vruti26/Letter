
# 📮 Secret Letter

A personal and private web app where you can write and share secret letters with your friends. Each person can only open their own letter using their unique name and nickname.

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://letter-b663qbqmw-vrutis-projects-370da7ab.vercel.app/)

</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge" />
</p>

## ✨ Features

- **Private Access**: Users enter their name and a secret nickname to unlock their letter.
- **Personalized Content**: Each letter is unique to the recipient.
- **Logging**: Securely logs every time a letter is opened (password-protected).
- **Elegant UI**: A clean, animated, and responsive interface built with ShadCN UI and GSAP.
- **Easy to Manage**: All letters are stored in a simple `data.json` file, making updates easy.
- **Deployable**: Ready to deploy on Vercel with one click.

---

## 📸 Screenshots

*(You can add your screenshots here. Create a folder named `screenshots` in your repository and link to them like `![Login Page](./screenshots/login.png)`)*

| Login Page | Letter View |
| :---: | :---: |
| *Your Screenshot Here* | *Your Screenshot Here* |

---

## 🛠️ Built With

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Animations**: [GSAP](https://gsap.com/)
- **Database**: [Vercel KV (Upstash Redis)](https://vercel.com/storage/kv)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/your_repository.git
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**
    Create a `.env.local` file and add your Vercel KV credentials and a password for the logs page. You can pull these from your Vercel project.
    ```bash
    # Pull from Vercel (requires Vercel CLI)
    vercel env pull .env.development.local

    # And add your logs password to the new file
    LOGS_PASSWORD="your_secret_password"
    ```
4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) to view it in the browser.

---

## ✏️ How to Add a Letter

All personalized letters are stored in `src/lib/data.json`.

1.  Open `src/lib/data.json`.
2.  Inside the `letters` object, add a new entry with the person's lowercase first name as the key.
3.  Add a `nickname` (or a list of nicknames) and the `letter` content.

**Example:**

```json
{
  "letters": {
    "jane": {
      "nickname": ["jane", "janie"],
      "letter": "Your personalized letter goes here..."
    }
  }
}
```

---

## ❤️ About This Project

This project was created to share personal messages in a simple, private, and thoughtful way—a digital version of handing someone a sealed letter. It's a small experiment in creating meaningful digital connections.
