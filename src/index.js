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
  { name: 'leftMotor', defaultValue: 0 },
  { name: 'rightMotor', defaultValue: 0 },
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
          let value = document.getElementById(name).value
          NetworkTables.putValue(name, value)
        } else {
          let value = NetworkTables.getValue(name, v.defaultValue)
          document.getElementById(name).value = value
        }
      }
    }
  }
  if (document.getElementById('refreshRate') != null && document.getElementById('refreshRate').textContent != refreshRate) {
    refresher.wait = document.getElementById('refreshRate').textContent;
  }
}

let refresh = () => {
  scan('', displayValues)
}

refresher = new Updater(refresh, 200)
refresher.start()
