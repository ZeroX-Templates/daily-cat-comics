
import React, { useState, useEffect, useCallback } from 'react';
import { generateCatComicStripStory, generateCatCartoon } from './services/geminiService';
import { getDailyPrompt } from './constants/prompts';
import { CatIcon, PawIcon, WarningIcon } from './components/icons';

type ComicPanel = {
  imageUrl: string;
  caption: string;
};

type Comic = {
  title: string;
  panels: ComicPanel[];
};

type AppState = {
  status: 'loading' | 'success' | 'error';
  comic: Comic | null;
  error: string | null;
};

type HeaderInfo = {
  date: string;
  time: string;
  countdown: string;
};

// --- Helper Components ---

const LoadingState: React.FC = () => (
  <div className="text-center text-slate-600 font-sans p-8">
    <div className="animate-pulse">
      <CatIcon className="w-24 h-24 mx-auto text-slate-400" />
    </div>
    <p className="mt-4 text-lg font-semibold">Drawing today's comic strip...</p>
    <p className="text-slate-500">Our feline artist is deep in thought.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center bg-red-50 border-2 border-red-200 rounded-lg p-8 text-red-800 font-sans">
    <WarningIcon className="w-16 h-16 mx-auto text-red-400" />
    <h3 className="mt-4 text-xl font-bold">Oh no, a creative block!</h3>
    <p className="mt-2 text-red-700">{message}</p>
    <p className="mt-4 text-sm text-red-600">Please try refreshing. The cat may have knocked over the ink bottle.</p>
  </div>
);

const ComicStrip: React.FC<{ comic: Comic }> = ({ comic }) => (
  <div className="w-full">
    <h2 className="font-doodle text-3xl text-center text-slate-800 mb-4">{comic.title}</h2>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {comic.panels.map((panel, index) => (
        <div key={index} className="bg-white border-2 border-slate-900 rounded-md shadow-lg flex flex-col">
          <div className="aspect-square bg-slate-100 flex items-center justify-center border-b-2 border-slate-900">
            {panel.imageUrl ? (
              <img src={panel.imageUrl} alt={panel.caption} className="w-full h-full object-contain p-1" />
            ) : (
              <div className="w-full h-full bg-slate-200 animate-pulse"></div>
            )}
          </div>
          <div className="p-3 text-center bg-white flex-grow flex items-center justify-center">
            <p className="font-doodle text-lg text-slate-800 leading-tight">"{panel.caption}"</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main App Component ---

function App() {
  const [state, setState] = useState<AppState>({
    status: 'loading',
    comic: null,
    error: null,
  });
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({ date: '', time: '', countdown: '' });
  const [currentPrompt, setCurrentPrompt] = useState(getDailyPrompt());

  const fetchDailyComic = useCallback(async (theme: string) => {
    setState(s => ({ ...s, status: 'loading', comic: null, error: null }));
    try {
      // 1. Generate the story (title, panel descriptions, captions)
      const story = await generateCatComicStripStory(theme);

      // 2. Generate an image for each panel's description
      const imageUrls = await Promise.all(
        story.panels.map(panel => generateCatCartoon(panel.imagePrompt))
      );

      // 3. Combine images with captions to form the final comic
      const finalComic: Comic = {
        title: story.title,
        panels: story.panels.map((panel, index) => ({
          imageUrl: imageUrls[index],
          caption: panel.caption,
        })),
      };

      setState({
        status: 'success',
        comic: finalComic,
        error: null,
      });

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setState(s => ({
        ...s,
        status: 'error',
        error: `API Error: ${errorMessage}`,
        comic: null,
      }));
    }
  }, []);

  useEffect(() => {
    fetchDailyComic(currentPrompt);

    const timerId = setInterval(() => {
      const now = new Date();
      const timeZone = 'America/New_York';

      // Check if day has changed, and if so, fetch new comic
      const dailyPrompt = getDailyPrompt();
      if (dailyPrompt !== currentPrompt) {
        setCurrentPrompt(dailyPrompt);
        fetchDailyComic(dailyPrompt);
      }

      // --- Calculate Header Info ---
      const date = now.toLocaleDateString('en-US', {
        timeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const time = now.toLocaleTimeString('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      // --- Calculate Countdown ---
      const etNow = new Date(now.toLocaleString('en-US', { timeZone }));
      const midnightET = new Date(etNow);
      midnightET.setHours(24, 0, 0, 0);
      const diff = midnightET.getTime() - etNow.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      const countdown = `${hours}:${minutes}:${seconds}`;
      
      setHeaderInfo({ date, time: `${time} ET`, countdown });

    }, 1000);

    return () => clearInterval(timerId);
  }, [fetchDailyComic, currentPrompt]);

  const renderContent = () => {
    switch (state.status) {
      case 'loading':
        return <LoadingState />;
      case 'error':
        return <ErrorState message={state.error!} />;
      case 'success':
        return <ComicStrip comic={state.comic!} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <header className="text-center mb-6 w-full max-w-5xl">
        <div className="flex items-center justify-center gap-3">
          <PawIcon className="w-8 h-8 text-amber-600 transform -rotate-12" />
          <h1 className="font-doodle text-4xl sm:text-5xl font-bold text-slate-800">
            Daily Doodle Comic
          </h1>
          <PawIcon className="w-8 h-8 text-amber-600 transform rotate-12" />
        </div>
        <div className="mt-4 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-lg p-3 text-slate-700 shadow-sm max-w-md mx-auto">
            <p className="font-semibold text-base sm:text-lg">{headerInfo.date}</p>
            <div className="flex justify-center items-baseline gap-4 text-xs sm:text-sm mt-1">
                <p><span className="font-semibold">Time:</span> {headerInfo.time}</p>
                <p><span className="font-semibold">Next Comic In:</span> {headerInfo.countdown}</p>
            </div>
        </div>
      </header>
      
      <main className="w-full max-w-5xl">
        {renderContent()}
      </main>

      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>A new comic appears every day at midnight ET. Come back tomorrow for more!</p>
        <p className="mt-1">Powered by React & Gemini</p>
      </footer>
    </div>
  );
}

export default App;
