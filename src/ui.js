class Updater {
  /**
   * @param {function} func
   * @param {number} wait
   */
  constructor(func, wait) {
    this.func = func
    this.wait = wait
    this.stop = false
  }

  start() {
    setTimeout(() => {
      this.func()
      if (!this.stop) this.start()
    }, this.wait)
  }

  stop() {
    this.stop = true
  }
}

// HACK: Kill Jarrett Aiken.

/**
 * @typedef DisplayValue
 * @prop {string} name
 * @prop {} [defaultValue]
 * @prop {DisplayValue[]} [values]
 * @prop {boolean} [input]
 */

/** @type {DisplayValue} */
let displayValues = [
  { name: 'leftEncoder', defaultValue: 0 },
  { name: 'rightEncoder', defaultValue: 0 },
  { name: 'leftMotor', defaultValue: 1 },
  { name: 'rightMotor', defaultValue: 2 },
  { name: 'shift', defaultValue: false },
  { name: 'compressor', defaultValue: false },
  { name: 'gyro', defaultValue: 0 },
  {
    name: 'drivePosControl',
    values: [
      { name: 'target', defaultValue: 0, input: true },
      { name: 'maxSpeed', defaultValue: 0, input: true },
      { name: 'minSpeed', defaultValue: 0, input: true },
      { name: 'rate', defaultValue: 0, input: true },
      { name: 'deadband', defaultValue: 0, input: true }
    ]
  },
  {
    name: 'arm',
    values: [
      { name: 'open', defaultValue: true },
      { name: 'inProgress', defaultValue: false }
    ]
  },
  {
    name: 'auto',
    values: [
      { name: 'location', defaultValue: '' },
      { name: 'steps', defaultValue: [] }
    ]
  },
  {
    name: 'controller',
    values: [
      {
        name: 'leftStick', values: [
          { name: 'xAxis', defaultValue: 0 },
          { name: 'yAxis', defaultValue: 0 }
        ]
      },
      {
        name: 'rightStick', values: [
          { name: 'xAxis', defaultValue: 0 },
          { name: 'yAxis', defaultValue: 0 }
        ]
      },
      {
        name: 'buttons',
        values: [
          { name: 'A', defaultValue: false },
          { name: 'B', defaultValue: false },
          { name: 'X', defaultValue: false },
          { name: 'Y', defaultValue: false },
          { name: 'leftBumper', defaultValue: false },
          { name: 'rightBumper', defaultValue: false },
          { name: 'start', defaultValue: false },
          { name: 'back', defaultValue: false }
        ]
      }
    ]
  },
  {
    name: 'vision',
    values: [
      { name: 'targetFound', defaultValue: false },
      { name: 'onTarget', defaultValue: false }
    ]
  }
]

/** @type {Updater} */
let refresher;
let refreshRate = 200

/**
 * @param {string} parent
 * @param {DisplayValue[]} values
 */
let scan = (parent, values) => {
  for (let v of values) {
    let name = `${parent}${v.name}`
    if (v.values != null) {
      scan(`${name}/`, v.values)
    } else {
      if (document.getElementById(name) != null) {
        if (v.input) {
          let element = document.getElementById(name)
          let value = null
          switch (element.type) {
            case "number":
              value = element.value
              break
            case "checkbox":
              value = element.checked
              break
            case "text":
              value = element.textContent
              break
          }
          NetworkTables.putValue(`SmartDashboard/${name}`, value)
        } else {
          let value = NetworkTables.getValue(`SmartDashboard/${name}`, v.defaultValue)
          let element = document.getElementById(name)
          switch (element.type) {
            case "number":
              element.value = value
              break
            case "checkbox":
              element.checked = value
              break
            case "text":
              element.textContent = value
              break
          }
        }
      }
    }
  }
  if (document.getElementById('refreshRate') != null && document.getElementById('refreshRate').textContent != refreshRate) {
    refresher.wait = document.getElementById('refreshRate').textContent;
  }
}

let commands = []

let updateCommands = () => {
  let html = ''
  for(let command of commands) {
    /** @type {string[]} */
    let parts = command.split(':')
    let name = parts.splice(0, 1)[0]
    html += `\n<h4>${name}</h4>\n<ul>\n<li>${parts.join('\n<li>')}\n</ul>`
  }
  document.getElementById('command-list').innerHTML = html
}

let refresh = () => {
  scan('', displayValues)
  updateCommands()
}

refresher = new Updater(refresh, 200)
refresher.start()

document.getElementById("auto-select").onchange = (value) => {
  switch (value.target.value) {
    case "None":
      document.getElementById("auto-body").innerHTML = ''
      break
    case "Drive Straight":
      document.getElementById("auto-body").innerHTML = '<p>Distance <input type="number" id="autoPart1"></p>'
      break
    case "Turn":
      document.getElementById("auto-body").innerHTML = '<p>Angle <input type="number" id="autoPart1"></p>'
        + '<p>Turn Left <label class="switch">' +
        '<input type="checkbox" id="inProgress"><span class="slider round"></span></label></p>'
      break
    case "Set Arm":
      document.getElementById("auto-body").innerHTML = '<p>Direction <input type="number" id="autoPart1"></p>'
        + '<p>Wait <input type="number" id="autoPart2"></p>'
      break
  }
}

document.getElementById('add-command').onclick = () => {
  let name = "none"
  switch (document.getElementById("auto-select").value) {
    case "Drive Straight":
      name = "driveStraight"
      break
    case "Turn":
      name = "turn"
      break
    case "Set Arm":
      name = "setArm"
      break
  }
  let parts = [name]
  for (let i = 1; document.getElementById(`autoPart${i}`) != null; i++) {
    let element = document.getElementById(`autoPart${i}`)
    switch (element.type) {
      case "number":
        parts.push(element.value)
        break
      case "checkbox":
        parts.push(element.checked)
        break
    }
  }
  commands.push(parts.join(':'))
  NetworkTables.putValue("commands", commands)
}

document.getElementById('reset-commands').onclick = () => {
  commands = []
  NetworkTables.putValue("commands", commands)
}
