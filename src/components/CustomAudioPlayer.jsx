import React, { useRef, useState, useEffect } from 'react';

// Create a custom audio player with Nepali themed controls
function CustomAudioPlayer({ src, onEnded, id }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      const duration = audio.duration;
      const currentTime = audio.currentTime;
      setProgress((currentTime / duration) * 100);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    });
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', onEnded);
    };
  }, [onEnded]);
  
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };
  
  return (
    <div className="custom-audio-player">
      <audio ref={audioRef} src={src} id={id} style={{ display: 'none' }} />
      
      <div className="player-controls" style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(200, 16, 46, 0.05)',
        padding: '10px',
        borderRadius: '30px'
      }}>
        <button 
          onClick={handlePlayPause}
          style={{
            backgroundColor: 'var(--nepali-red)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        
        <div className="progress-bar" style={{
          flex: '1',
          height: '6px',
          backgroundColor: 'rgba(200, 16, 46, 0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div className="progress" style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--nepali-red)',
            position: 'absolute',
            left: 0,
            transition: 'width 0.2s ease'
          }} />
        </div>
      </div>
    </div>
  );
}

export default CustomAudioPlayer;
