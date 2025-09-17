# ✨ PDX Meteor Tracker ✨

A modern Next.js application for tracking Near Earth Objects (NEOs) and meteors approaching our planet, built with real-time data from NASA's Open Data Portal.

⚡⚡⚡ [Live Demo](https://neo-tracker.onrender.com)

## Features

- 🔭 **Real-time Meteor Tracking**: Display upcoming Near Earth Objects with detailed information
- 📊 **Rich Data Visualization**: Interactive cards showing meteor size, velocity, and approach distance
- 🚨 **Hazard Detection**: Highlight potentially hazardous asteroids
- 📸 **Astronomy Picture of the Day**: Beautiful space imagery from NASA
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and TypeScript

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: NASA Open Data Portal
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Deployment**: Render.com

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pdx-meteor-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Get your NASA API key (optional - DEMO_KEY has rate limits):
   - Visit [https://api.nasa.gov/](https://api.nasa.gov/)
   - Sign up for a free API key
   - Update `NEXT_PUBLIC_NASA_API_KEY` in `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## API Integration

The application integrates with several NASA APIs:

- **Near Earth Object Web Service (NeoWs)**: For asteroid and comet data
- **Astronomy Picture of the Day (APOD)**: For daily space imagery

## Deployment on Render.com

1. Push your code to GitHub/GitLab
2. Connect your repository to Render
3. Use the included `render.yaml` configuration
4. Set environment variables in Render dashboard:
   - `NEXT_PUBLIC_NASA_API_KEY`: Your NASA API key
5. Deploy automatically on every push to main branch

### Manual Deployment Steps

1. Sign up for [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your Git repository
4. Configure:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Plan**: Free
5. Add environment variables in the dashboard
6. Deploy!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `NEXT_PUBLIC_NASA_API_KEY` | NASA API key for data access | No (defaults to DEMO_KEY) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **NASA Open Data Portal** for providing free access to space data
- **Next.js team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
