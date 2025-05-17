# Music Zodiac 🎵✨

Music Zodiac is a web application that analyzes your Spotify listening habits and generates a personalized "music zodiac chart" - a cosmic representation of your musical taste and preferences.

## ✨ Features

- **Music Zodiac Chart**: Discover your musical identity through a personalized star chart based on your listening habits
- **Monthly Vibes**: See how your music taste evolves over time
- **Compatibility**: Compare your music taste with friends and discover your musical compatibility
- **Spotify Integration**: Seamlessly connect with your Spotify account to analyze your listening history

## 🚀 Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js with Spotify OAuth
- **Database**: Prisma ORM with Neon

## 🔧 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spotify Developer Account (for API credentials)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/pranshu05/MusicZodiac.git
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-database-connection-string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   SPOTIFY_CLIENT_ID="your-spotify-client-id"
   SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 🌌 How It Works

Music Zodiac analyzes your Spotify listening history and maps different aspects of your music taste to celestial bodies:

- **Sun**: Core musical identity and the genres that define your taste
- **Moon**: Emotional connection to music and what creates deep feelings
- **Rising**: How others perceive your music taste and first impressions
- **Venus**: Musical pleasures and what brings joy
- **Mars**: Musical energy and what drives passion
- **Mercury**: Musical communication style and intellectual curiosity
- **Jupiter**: How your music taste expands horizons and brings growth
- **Saturn**: The musical traditions and structures you value and respect
- **Neptune**: Musical dreams, inspirations, and spiritual connections
- **Pluto**: The transformative and intense aspects of your music taste
- **Uranus**: Your innovative and unconventional musical preferences

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ✨ Acknowledgements

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)