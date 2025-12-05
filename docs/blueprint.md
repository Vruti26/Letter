# **App Name**: Secret Letters

## Core Features:

- Secure Login: Verify users by matching their name and nickname against stored credentials. Access granted only upon successful match.
- Private Letter Display: Display the user's personal letter on a dedicated page, ensuring that only their letter is accessible.
- Data Storage: Store user credentials (name, nickname) and their corresponding letters in a JSON file.
- Animated Error Handling: Display an animated error message when the login fails due to incorrect name/nickname combination.
- Landing Page Animation: Create a hero section on the landing page with an animated text reveal using GSAP.
- Letter Opening Animation: Implement a visually appealing GSAP animation for the letter page that simulates opening an envelope and revealing the content.
- 404 Page Animation: Show a custom 404 page with an animated sad emoji if the letter is not found.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) for a mysterious and emotional feel.
- Background color: Very dark indigo (#1A0033), a desaturated version of the primary, appropriate for a dark scheme.
- Accent color: Violet (#8A2BE2), an analogous color, brighter and more saturated than the primary.
- Headline font: 'Playfair' serif for elegant headers. Body font: 'PT Sans' sans-serif, for readable, modern body text.
- Note: currently only Google Fonts are supported.
- Employ a modern glassmorphism card style for the login page with subtle parallax scrolling on the login background.
- Utilize GSAP for smooth fade-ins, slide-ups, and animated text reveals across the website. Implement an error shake animation on the login page upon incorrect credentials. Use GSAP to simulate the effect of an animated unfolding letter.