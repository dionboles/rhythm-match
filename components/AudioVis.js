import { useEffect, useRef } from 'react';
//@ts-check
const WIDTH = 1500;
const HEIGHT = 1500;
let analyzer;
let bufferLength;

const handleError = (err) => console.log('err getting mic');

const AudioVis = (props) => {
  const canvasRef = useRef(null);
  const textRef = useRef('');
  function drawTimeData(timeData) {
    analyzer.getByteTimeDomainData(timeData);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ffc600';
    ctx.beginPath();
    const sliceWith = WIDTH / bufferLength;
    let x = 0;
    timeData.forEach((data, i) => {
      const v = data / 128;
      const y = (v * HEIGHT) / 2;
      if (i == 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWith;
    });
    ctx.stroke();
    requestAnimationFrame(() => drawTimeData(timeData));
  }
  async function getAudio() {
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch(handleError);
      const audioCtx = new AudioContext();
      analyzer = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyzer);
      analyzer.fftSize = 2 ** 8;
      bufferLength = analyzer.frequencyBinCount;
      const timeData = new Uint8Array(bufferLength);
      const frequencyData = new Uint8Array(bufferLength);
      drawTimeData(timeData);
    } catch (e) {}
  }

  function handleResult({ results }) {
    const words = results[results.length - 1][0].transcript;
    console.log(words);
    let text = textRef.current;
    text.innerText = '';
    text.innerText = words;
  }

  useEffect(() => {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = handleResult;
    recognition.start();
    getAudio();
  }, [getAudio]);

  return (
    <div>
      <p
        ref={textRef}
        style={{
          display: 'flex',
          fontSize: '9rem',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}></p>
      <canvas ref={canvasRef} height={HEIGHT} width={WIDTH} />;
    </div>
  );
};

export default AudioVis;
