let connect = document.getElementById('connect')

var robotConnected = false

// Set function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);
/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
  ipc.send('msg', connected ? 'Robot connected!' : 'Robot disconnected.');
  document.getElementById('connected').checked = connected
  robotConnected = connected
  connect.value = "connect"
  let connectionDiv = document.getElementById('connection-div')
  if (connected) {
    connectionDiv.classList.add('enabled')
    connectionDiv.classList.remove('disabled')
  } else {
    connectionDiv.classList.add('disabled')
    connectionDiv.classList.remove('enabled')
    document.getElementById('dashboard-vars').innerHTML = ''
  }
}

// On click try to connect and disable the input and the button
connect.onclick = () => {
  ipc.send('connect', `roborio-${document.getElementById('team-number').value}-frc.local`);
  connect.value = 'connecting...'
}

var updateConnection = () => {
  if (
    document.getElementById("team-number").value.toString().length > 0
    && !robotConnected
    && connect.value !== 'connecting...'
  ) connect.disabled = false
  else connect.disabled = true
}
