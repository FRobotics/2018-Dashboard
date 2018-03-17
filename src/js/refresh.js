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

/** @type {Updater} */
let refresher;
let refreshRate = 200

let refresh = () => {
  if (robotConnected) {
    scanVars('/SmartDashboard/vars/', 'dashboard-vars')
    scanVars('/SmartDashboard/vars2/', 'dashboard-vars2')
  }
  updateCommands()
  updateConnection()
}

refresher = new Updater(refresh, 200)
refresher.start()
