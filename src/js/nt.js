var scan = (parent, values) => {
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
                    NetworkTables.putValue(`/SmartDashboard/${name}`, value)
                } else {
                    let value = NetworkTables.getValue(`/SmartDashboard/${name}`, v.defaultValue)
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

var scanVars = (prefix, id) => {
    let vars = {}
    let vars2 = {}
    for (let key of NetworkTables.getKeys()) {
        if (key.startsWith(prefix)) {
            let name = key.slice(prefix.length)
            let levels = name.split('/')
            /**
             * @param {string[]} remainingLevels 
             */
            let assignKeys = (remainingLevels, finishedLevels = []) => {
                let currentObj = {}
                let currentLevel = remainingLevels.shift()
                finishedLevels.push(currentLevel)
                if (remainingLevels.length === 0) {
                    currentObj[currentLevel] = {
                        path: key
                    }
                } else {
                    currentObj[currentLevel] = assignKeys(remainingLevels)
                }
                return currentObj
            }
            let obj2 = assignKeys(levels)
            let deepAssign = (base, obj) => {
                for (let key in obj) {
                    if (base[key] != null) {
                        base[key] = deepAssign(base[key], obj[key])
                    } else {
                        base[key] = obj[key]
                    }
                }
                return base
            }
            vars = deepAssign(vars, obj2)
        }
    }
    varsHtml = ''
    let createHTML = (obj) => {
        for (let key in obj) {
            let name = key.toLowerCase().replace('_', ' ')
            name = name.charAt(0).toUpperCase() + name.slice(1)
            if (obj[key].path != null) {
                varsHtml += `<div style="height: 30px;">\n  ${name}\n`
                let value = NetworkTables.getValue(`${obj[key].path}`)
                switch (typeof (value)) {
                    case "number":
                        varsHtml += `  <input type="number" value=${value} disabled>\n`
                        break
                    case "boolean":
                        varsHtml += `  <label class="switch">\n`
                            + `  <input type="checkbox"${value ? ' checked' : ''}>\n`
                            + `  <span class="slider"></span>\n`
                            + `  </label>\n`
                        break
                    case "string":
                        varsHtml += `  <input type="text" textContent="${value}" disabled>\n`
                        break
                }
                varsHtml += '</div>\n'
            } else {
                varsHtml += `<div class="inner-group">\n`
                varsHtml += `  <h2>${name}</h2>\n`
                createHTML(obj[key])
                varsHtml += `</div>\n`
            }
        }
    }
    createHTML(vars)
    document.getElementById(id).innerHTML = varsHtml
}

NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    //no u
    document.getElementById('timer').innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60
})

let addLight = (id, key) => {
    NetworkTables.addKeyListener(key, (key, value) => {
        let color = '#000000'
        if (value) color = '#00dd00'
        else color = '#dd0000'
        document.getElementById(id).style = `background-color: ${color}`
    })
}

let addValue = (id, key) => {
    NetworkTables.addKeyListener(key, (key, value) => {
        document.getElementById(id).value = value
    })
}

addLight('high-gear-light', '/SmartDashboard/vars/motors/highGear')
addLight('slow-mode-light', '/SmartDashboard/vars/motors/slowMode')
addLight('elevator-brake-light', '/SmartDashboard/vars/elevator/brake')
addLight('teleop-light', '/SmartDashboard/vars/teleopEnabled') //this should probably change to a default key
addLight('go-climb-light', '/SmartDashboard/vars/goClimb')

addValue('arm-state', '/SmartDashboard/vars/arm/state')
addValue('elevator-height', '/SmartDashboard/vars/elevator/height')
addValue('gyro', '/SmartDashboard/vars/gyro')

document.getElementById('testingMode').onchange = (ev) => {
    NetworkTables.putValue('/SmartDashboard/testingMode', document.getElementById('testingMode').checked)
}
