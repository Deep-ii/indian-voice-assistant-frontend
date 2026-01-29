let mediaRecorder;
let audioChunks = [];
let isRecording = false;

const micBtn = document.getElementById("micBtn");
const micText = document.getElementById("micText");
const statusText = document.getElementById("status");
const audioPlayer = document.getElementById("audioPlayer");
const pulse = document.getElementById("pulse");

micBtn.onclick = async () => {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
};

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

  mediaRecorder.start();
  isRecording = true;

  micBtn.classList.add("recording");
  micText.textContent = "Stop Listening";

  statusText.textContent = "Listening...";
  statusText.className = "status listening";

  pulse.classList.add("active");
}

function stopRecording() {
  mediaRecorder.stop();
  isRecording = false;

  micBtn.classList.remove("recording");
  micText.textContent = "Start Listening";

  statusText.textContent = "Processing...";
  statusText.className = "status processing";

  pulse.classList.remove("active");

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    sendAudioToBackend(audioBlob);
  };
}

async function sendAudioToBackend(audioBlob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  const response = await fetch("http://localhost:8000/voice", {
    method: "POST",
    body: formData
  });

  const audioResponseBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioResponseBlob);

  audioPlayer.src = audioUrl;
  audioPlayer.play();

  statusText.textContent = "Speaking...";
  statusText.className = "status speaking";

  audioPlayer.onended = () => {
    statusText.textContent = "Idle";
    statusText.className = "status idle";
  };
}
