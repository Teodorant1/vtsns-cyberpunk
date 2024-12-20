import { useRef, useState } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audio_enabled, setaudio_enabled] = useState(false);
  function playAudio() {
    const audio = audioRef.current;

    if (audio) {
      audio.play().catch((error) => {
        console.error("Error playing audio: ", error);
      });
    }
    setaudio_enabled(true);
  }

  return (
    <div>
      {audio_enabled === false && (
        <button onClick={playAudio}>Enable audio</button>
      )}
      <audio ref={audioRef} src="/cybermusic.mp3" loop />
    </div>
  );
};

export default AudioPlayer;
