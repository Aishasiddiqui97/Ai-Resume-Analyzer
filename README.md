# AI Resume Analyzer

An intelligent resume analysis tool powered by AI that provides detailed feedback, scoring, and suggestions to improve your resume.

🔗 **Live Demo**: [https://ai-resume-analyzer-ebon-eight.vercel.app/](https://ai-resume-analyzer-ebon-eight.vercel.app/)

## Features

- 📄 Upload and analyze resumes in PDF format
- 🤖 AI-powered analysis using Gemini API
- 📊 Comprehensive scoring and feedback
- 💡 Actionable suggestions for improvement
- 📈 Skills analysis and visualization
- 🎨 Modern, responsive UI with 3D elements

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API keys for:
  - Google Gemini API
  - OpenRouter API (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aishasiddiqui97/Ai-Resume-Analyzer.git
cd Ai-Resume-Analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `OPENROUTER_API_KEY` | Your OpenRouter API key (optional) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for production use Vercel URL) |

**Note**: Never commit your `.env.local` file to version control.

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The app is currently deployed at: [https://ai-resume-analyzer-ebon-eight.vercel.app/](https://ai-resume-analyzer-ebon-eight.vercel.app/)

## Project Structure

```
resume-analyzer/
├── app/                  # Next.js app directory
│   ├── analyze/         # Analysis page
│   ├── api/             # API routes
│   └── history/         # History page
├── components/          # React components
├── lib/                 # Utility functions and types
└── public/              # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using Next.js and AI
