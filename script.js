const video = document.getElementById("video");
const box = document.getElementById("animationBox");
const icon = document.getElementById("gestureIcon");
const text = document.getElementById("gestureText");

function countFingers(landmarks) {
  let count = 0;

  const tips = [8, 12, 16, 20];

  for (let tip of tips) {
    if (landmarks[tip].y < landmarks[tip - 2].y) count++;
  }

  if (landmarks[4].x > landmarks[3].x) count++; // thumb

  return count;
}

function setGesture(fingers) {
  box.className = ""; // reset

  const gestures = {
    1: ["circle spin", "one.png", "1 Finger - Spin Circle"],
    2: ["square bounce", "two.png", "2 Fingers - Bouncing Square"],
    3: ["triangle grow", "three.png", "3 Fingers - Growing Triangle"],
    4: ["star shake", "four.png", "4 Fingers - Shaking Star"],
    5: ["hex spin", "five.png", "5 Fingers - Spinning Hexagon"],
    6: ["circle bounce", "six.png", "6 Fingers"],
    7: ["square grow", "seven.png", "7 Fingers"],
    8: ["triangle shake", "eight.png", "8 Fingers"],
    9: ["star spin", "nine.png", "9 Fingers"],
    10: ["hex bounce", "ten.png", "10 Fingers"]
  };

  if (gestures[fingers]) {
    box.className = gestures[fingers][0];
    icon.src = "icons/" + gestures[fingers][1];
    text.innerText = gestures[fingers][2];
  }
}

const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  if (results.multiHandLandmarks.length > 0) {
    const fingers = countFingers(results.multiHandLandmarks[0]);
    setGesture(fingers);
  }
});

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});

camera.start();