import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, Repeat, SkipForward, SkipBack, Play, Pause, Music } from 'lucide-react';

// Sample music data - you can replace these URLs with your own music files
const musicList = [
  {
    title: "Peaceful Piano",
    artist: "John Smith",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Electronic Beats",
    artist: "Sarah Johnson",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Jazz Fusion",
    artist: "Mike Davis",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (!isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = Number(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        setVolume(1);
        setIsMuted(false);
        audioRef.current.volume = 1;
      } else {
        setVolume(0);
        setIsMuted(true);
        audioRef.current.volume = 0;
      }
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      handleNext();
    }
  };

  const handlePrevious = () => {
    setCurrentTrack(prev => (prev === 0 ? musicList.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrack(prev => (prev === musicList.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch(error => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg overflow-hidden`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{musicList[currentTrack].title}</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Music className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
              </div>
            </div>
            
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{musicList[currentTrack].artist}</p>
            
            {showQueue && (
              <div className={`mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <h2 className="text-lg font-semibold mb-3">Queue</h2>
                <div className="space-y-2">
                  {musicList.map((track, index) => (
                    <div
                      key={index}
                      onClick={() => selectTrack(index)}
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${
                        index === currentTrack
                          ? 'bg-blue-500 text-white'
                          : `${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{track.title}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {track.artist}
                        </p>
                      </div>
                      {index === currentTrack && isPlaying && (
                        <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <audio
              ref={audioRef}
              src={musicList[currentTrack].url}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              preload="metadata"
            />

            <div className="mb-4">
              <input
                type="range"
                ref={progressBarRef}
                value={currentTime}
                min={0}
                max={duration || 0}
                onChange={handleProgressChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={handlePrevious}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              
              <button
                onClick={() => setRepeat(!repeat)}
                className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  repeat ? 'text-blue-500' : ''
                }`}
              >
                <Repeat className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;