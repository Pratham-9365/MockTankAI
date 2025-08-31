import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import CameraPreview from "../CameraPreview/CameraPreview";
import "./Simulation.css";
import { FaMicrophone, FaStop, FaChartLine, FaUser, FaBuilding } from "react-icons/fa";
import henry from "../../assets/henry.mp4";
import shreya from "../../assets/shreya.mp4";
import ananya from "../../assets/ananya.mp4";

const ShimmerLoading = () => (
  <div className="shimmer-container">
    <div className="shimmer-bar"></div>
    <div className="shimmer-bar" style={{ width: "80%" }}></div>
  </div>
);

const Simulation = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [investorResponse, setInvestorResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isInvestorSpeaking, setIsInvestorSpeaking] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const recognitionRef = useRef(null);

  const videoRefShreya = useRef(null);
  const videoRefAnanya = useRef(null);
  const videoRefHenry = useRef(null);

  const investorVideoRefs = {
    "Shreya Malhotra": videoRefShreya,
    "Ananya Mehra": videoRefAnanya,
    "Henry Collins": videoRefHenry,
  };

  // Get available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Welcome message on page load
  useEffect(() => {
    const initialMessage = "Hello. When you're ready to present your pitch, press the 'Start Pitch' button below.";
    setInvestorResponse(initialMessage);
    
    const speakTimeout = setTimeout(() => {
        setActiveSpeaker("Ananya Mehra");
        speakText(initialMessage, "Ananya Mehra");
    }, 500);

    return () => clearTimeout(speakTimeout);
  }, [availableVoices]);

  // Pause videos when user is speaking or loading
  useEffect(() => {
    if (isRecording || isLoading) {
      Object.values(investorVideoRefs).forEach(ref => ref.current && ref.current.pause());
      return;
    }
    
    if (activeSpeaker && isInvestorSpeaking) {
      for (const [name, ref] of Object.entries(investorVideoRefs)) {
        if (ref.current) {
          if (name === activeSpeaker) {
            ref.current.play().catch(error => console.error("Video play failed:", error));
          } else {
            ref.current.pause();
          }
        }
      }
    } else {
      Object.values(investorVideoRefs).forEach(ref => ref.current && ref.current.pause());
    }
  }, [isLoading, activeSpeaker, isInvestorSpeaking, isRecording]);

  const fetchAiResponse = async (text) => {
    try {
      const response = await fetch(
        "https://mocktankbackend-i0js.onrender.com/submit_text_to_chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approvedText: text }),
        }
      );
      const data = await response.json();
      console.log("AI Response:", data);
      return data;
    } catch (err) {
      console.error("Error calling AI API:", err);
      return { error: "Failed to get AI response" };
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    
    recognition.onresult = async (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      
      if (finalTranscript.trim()) {
        setUserSpeech(finalTranscript.trim());
        setIsLoading(true);
        setDisplayedResponse("");
        setInvestorResponse("");
        setActiveSpeaker(null);
        
        // Pause all investor videos while user is speaking
        Object.values(investorVideoRefs).forEach(ref => ref.current && ref.current.pause());
        
        const aiResponse = await fetchAiResponse(finalTranscript.trim());
        setIsLoading(false);
        
        if (aiResponse && aiResponse[1]?.[1]?.content) {
          const fullResponseText = aiResponse[1][1].content;
          const parts = fullResponseText.split(/:(.*)/s);
          
          if (parts.length > 1) {
            const speakerName = parts[0].trim();
            const messageText = parts[1].trim();
            setActiveSpeaker(speakerName);
            setInvestorResponse(messageText);
            speakText(messageText, speakerName);
          } else {
            setActiveSpeaker("Ananya Mehra");
            setInvestorResponse(fullResponseText);
            speakText(fullResponseText, "Ananya Mehra");
          }
        }
      }
    };
    
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [availableVoices]);

  useEffect(() => {
    if (investorResponse) {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= investorResponse.length) {
          setDisplayedResponse(investorResponse.substring(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [investorResponse]);

  const handleStartRecording = () => {
    if (recognitionRef.current) {
      setUserSpeech("");
      setInvestorResponse("");
      setDisplayedResponse("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Get appropriate voice for each investor
  const getVoiceForInvestor = (investorName) => {
    // Filter for female voices
    const femaleVoices = availableVoices.filter(
      voice => voice.lang.startsWith('en-') && 
              (voice.name.includes('Female') || voice.gender === 'female')
    );
    
    if (femaleVoices.length === 0) return null;
    
    // Assign different voices to different investors
    if (investorName === "Shreya Malhotra") {
      return femaleVoices[0 % femaleVoices.length];
    } else if (investorName === "Ananya Mehra") {
      return femaleVoices[1 % femaleVoices.length];
    } else {
      // For Henry Collins, use a male voice if available
      const maleVoices = availableVoices.filter(
        voice => voice.lang.startsWith('en-') && 
                (voice.name.includes('Male') || voice.gender === 'male')
      );
      return maleVoices.length > 0 ? maleVoices[0] : femaleVoices[0];
    }
  };

  const speakText = (text, speakerName) => {
    if (!text || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceForInvestor(speakerName);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = "en-US";
    utterance.onstart = () => setIsInvestorSpeaking(true);
    utterance.onend = () => setIsInvestorSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="exec-simulation-page">
      <Navbar />
      <div className="exec-layout">
        {/* Investors */}
        <div className="investor-gallery">
          <div className={`investor-card ${activeSpeaker === 'Shreya Malhotra' && isInvestorSpeaking ? "speaking" : ""}`}>
            <div className="investor-video-placeholder">
              <video ref={videoRefShreya} src={shreya} muted playsInline loop></video>
            </div>
            <p className="investor-name">Shreya Malhotra</p>
          </div>
          
          {/* CHANGE: Removed the 'main' class from the line below */}
          <div className={`investor-card ${activeSpeaker === 'Ananya Mehra' && isInvestorSpeaking ? "speaking" : ""}`}>
            <div className="investor-video-placeholder">
              <video ref={videoRefAnanya} src={ananya} muted loop playsInline></video>
            </div>
            <p className="investor-name">Ananya Mehra</p>
          </div>

          <div className={`investor-card ${activeSpeaker === 'Henry Collins' && isInvestorSpeaking ? "speaking" : ""}`}>
            <div className="investor-video-placeholder">
              <video
                ref={videoRefHenry}
                src={henry}
                muted
                playsInline
                loop
              ></video>
            </div>
            <p className="investor-name">Henry Collins</p>
          </div>
        </div>

        {/* Right side panels */}
        <div className="main-content-grid">
          {/* Transcript */}
          <div className="content-panel conversation-panel">
            <h3 className="panel-header">Conversation Transcript</h3>
            <div className="conversation-log">
              <div className="log-bubble user">
                <div className="bubble-header">
                  <FaUser /> You
                </div>
                <p className="bubble-text">
                  {userSpeech || "Your transcribed speech will appear here..."}
                </p>
              </div>

              <div className="log-bubble investor">
                <div className="bubble-header" >
                  <FaBuilding /> {activeSpeaker || "Investor"}
                </div>
                <div className="bubble-text">
                  {isLoading ? (
                    <ShimmerLoading />
                  ) : (
                    <p>
                      {displayedResponse}
                      {isInvestorSpeaking && <span className="typing-cursor"></span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User camera + controls */}
          <div className="content-panel user-panel">
            <h3 className="panel-header">Your Feed & Controls</h3>
            <div className="camera-container">
              <CameraPreview />
            </div>
            <div className="controls-container">
              <button
                className={`exec-button primary ${isRecording ? "recording" : ""}`}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
                {isRecording ? "Stop Pitch" : "Start Pitch"}
              </button>
              <button className="exec-button secondary">
                <FaChartLine />
                Deep Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;