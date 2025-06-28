// Generate or load permanent peer ID
const storedId = localStorage.getItem('peer-id') || crypto.randomUUID();
localStorage.setItem('peer-id', storedId);

// Show ID in UI
document.getElementById('myId').textContent = "My ID: " + storedId;

// Create PeerJS connection
const peer = new Peer(storedId);
let conn;

// Incoming connection (from other peer)
peer.on('connection', c => {
  conn = c;
  setupConnection();
});

// Outgoing connection (you initiate)
function connectToOther(id) {
  conn = peer.connect(id);
  conn.on('open', () => {
    setupConnection();
  });
}

// Common setup for both directions
function setupConnection() {
  // Receive data
  conn.on('data', data => {
    if (data.type === 'dot') updateDot(data.value);
  });

  // Dot toggle change
  document.getElementById('dotToggle').addEventListener('change', () => {
    const value = document.getElementById('dotToggle').checked;
    send({ type: 'dot', value });
    updateDot(value);
  });

  // Start cam on both devices
  startFrontCamera();
}

// Send message to peer
function send(msg) {
  if (conn && conn.open) conn.send(msg);
}

// Update dot
function updateDot(state) {
  const dot = document.getElementById('dot');
  document.getElementById('dotToggle').checked = state;
  dot.style.backgroundColor = state ? 'white' : 'black';
}

// Camera
let stream = null;
function startFrontCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' },
    audio: false
  }).then(s => {
    stream = s;
    const video = document.getElementById('video');
    video.srcObject = stream;
    video.style.display = 'block';
  }).catch(console.error);
}
