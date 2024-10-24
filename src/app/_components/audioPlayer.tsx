import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      // Play the audio when the component mounts
      audio.play().catch((error) => {
        console.error("Error playing audio: ", error);
      });
    }
  }, []);

  return (
    <div>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/cp2077RP.mp3" loop />
    </div>
  );
};

export default AudioPlayer;
