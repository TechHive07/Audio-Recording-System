import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const timeoutRef = useRef(null)

  const startRecording = async () => {
    try {
      audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount : 1,
        }
      });
      mediaRecorderRef.current = new MediaRecorder(audioStreamRef.current, {
        audioBitsPerSecond: 16 * 1024 * 8, 
        sampleRate: 44100,
      });

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      });

      mediaRecorderRef.current.start();
      setRecording(true);

      timeoutRef.current = setTimeout(stopRecording , 7000)
    } catch (error) {
      console.error("Microphone In-accessible", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    audioStreamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const downloadAudio = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "recorded_audio.wav";
    link.click();
  };

  return (
    <>
    <div className="container">
        <h1>AUDIO RECORDING SYSTEM</h1>
      </div>
    
    <div className="container">
      {recording ? (
        <button className = "btn btn-danger" onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button className = "btn btn-success" onClick={startRecording}>Start Recording</button>
      )}
      {audioChunks.length > 0 && (
        <button className = "btn btn-primary" onClick={downloadAudio}>Download Audio</button>
      )}
    </div>
    
    </>
    
  );
};

export default AudioRecorder;
