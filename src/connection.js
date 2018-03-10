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
  connect.disabled = false
  connect.value = "connect"
  if (connected) {
    document.getElementById('connection-div').classList.add('enabled')
    document.getElementById('connection-div').classList.remove('disabled')
  } else {
    document.getElementById('connection-div').classList.add('disabled')
    document.getElementById('connection-div').classList.remove('enabled')
    document.getElementById('dashboard-vars').innerHTML = ''
  }

}

// On click try to connect and disable the input and the button
connect.onclick = () => {
  ipc.send('connect', `roborio-${document.getElementById('team-number').value}-frc.local`);
  connect.disabled = true
  connect.value = "connecting..."
}