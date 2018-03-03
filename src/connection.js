let connect = document.getElementById('connect')

// Set function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);
/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection(connected) {
  var state = connected ? 'Robot connected!' : 'Robot disconnected.';
  console.log(state);
  document.getElementById('connected').checked = connected
  connect.disabled = false
  connect.value = "connect"
}

// On click try to connect and disable the input and the button
connect.onclick = () => {
  ipc.send('connect', `roborio-${document.getElementById('team-number').value}-frc.local`);
  connect.disabled = true
  connect.value = "connecting..."
}