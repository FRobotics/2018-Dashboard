let connectButton = document.getElementById('connect')

let connect = (teamNumber) => {
  if (!teamNumber) teamNumber = document.getElementById('team-number').value
  if (teamNumber) {
    ipc.send('connect', `roborio-${document.getElementById('team-number').value}-frc.local`);
    connectButton.disabled = true
    connectButton.value = 'connecting...'
  }
}

var robotConnected = false

// Set function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);
/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
  if(connected) ipc.send('msg', 'Robot connected!');
  document.getElementById('connected').checked = connected
  robotConnected = connected
  connectButton.value = "connect"
  let connectionDiv = document.getElementById('connection-div')
  if (connected) {
    connectionDiv.classList.add('enabled')
    connectionDiv.classList.remove('disabled')
  } else {
    connectionDiv.classList.add('disabled')
    connectionDiv.classList.remove('enabled')
    document.getElementById('dashboard-vars').innerHTML = ''
    document.getElementById('dashboard-vars2').innerHTML = ''
  }
  if (!connected) {
    connect()
  }
}

// On click try to connect and disable the input and the button
connectButton.onclick = () => {
  if (connectButton.value === 'connect') {
    connect()
  } else {
    ipc.send('disconnect')
    connectButton.disabled = false
    connectButton.value = 'connect'
  }
}

var updateConnection = () => {
  if (
    (document.getElementById("team-number").value.toString().length > 0
    && connectButton.value !== 'connecting...')
    || connectButton.value === 'disconnect'
  ) connectButton.disabled = false
  else connectButton.disabled = true
  if (robotConnected) connectButton.value = 'disconnect'
}
