import React, { useEffect, useRef, useState } from "react";
import { Label, Input, UncontrolledTooltip } from "reactstrap";
import { useDispatch } from "react-redux";
import { setChatFile } from "../../../redux/actions";

function VoiceRecorder({ onAudioCapture }) {
  const dispatch = useDispatch();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    let options = { mimeType: "audio/ogg;codecs=opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "audio/mpeg" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = {}; 
      }
    }
    mediaRecorderRef.current = new MediaRecorder(stream, options);

    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const mimeType = options.mimeType || "audio/webm";
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      console.log("object", audioBlob)
      setAudioBlob(audioBlob);
      const audioURL = URL.createObjectURL(audioBlob);
      onAudioCapture(audioBlob, audioURL);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  useEffect(() => {
    //console.log('audioBlob', audioBlob)
    if (audioBlob) {
      dispatch(setChatFile(audioBlob));
    }
  }, [audioBlob]);

  return (
    <li className="list-inline-item input-file">
      <Label
        id="voice-recorder"
        className={`me-1 btn btn-link text-decoration-none font-size-16 btn-lg waves-effect`}
        onClick={recording ? stopRecording : startRecording}
      >
        <i
          className={`ri-mic-fill  ${
            recording ? "text-danger" : "text-primary"
          }`}
        ></i>
      </Label>
      <UncontrolledTooltip target="voice-recorder" placement="top">
        {recording ? "Stop Recording" : "Record Voice"}
      </UncontrolledTooltip>
    </li>
  );
}

export default VoiceRecorder;
