import { useRef, useState } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audio_enabled, setaudio_enabled] = useState(false);

  //   useEffect(() => {
  //     const audio = audioRef.current;

  //     if (audio) {
  //       // Play the audio when the component mounts
  //       audio.play().catch((error) => {
  //         console.error("Error playing audio: ", error);
  //       });
  //     }
  //   }, []);

  function playAudio() {
    const audio = audioRef.current;

    if (audio) {
      // Play the audio when the component mounts
      audio.play().catch((error) => {
        console.error("Error playing audio: ", error);
      });
    }
    setaudio_enabled(true);
  }

  return (
    <div>
      {/* Hidden audio element and loop*/}
      {audio_enabled === false && (
        <button onClick={playAudio}>Enable audio</button>
      )}
      <audio ref={audioRef} src="/cp2077RP.mp3" loop />
    </div>
  );
};

export default AudioPlayer;
