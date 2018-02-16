let address = document.getElementById('connect-address')
let connect = document.getElementById('connect')

// Set function to be called on NetworkTables connect. Not implemented.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// Set function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false) // eslint-disable-line no-undef

// Sets function to be called when any NetworkTables key/value changes
// NetworkTables.addGlobalListener(onValueChanged, true);

// Function for hiding the connect box
onkeydown = key => { // eslint-disable-line no-undef
  if (key.key === 'Escape') document.body.classList.toggle('login', false)
}

/**
 * Function to be called when robot connects
 * @param {boolean} connected
 */
function onRobotConnection (connected) {
  var state = connected ? 'Robot connected!' : 'Robot disconnected.'
  console.log(state)
  document.getElementById('connected').checked = connected
}
