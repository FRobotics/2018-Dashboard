let commands = []

let commandTypes = {
    driveStraight: {
        name: 'Drive Straight',
        vars: {
            'distance': 'number'
        }
    },
    turn: {
        name: 'Turn',
        vars: {
            'angle': 'number',
            'turn left': 'checkbox'
        }
    },
    setArm: {
        name: 'Set Arm',
        vars: {
            'open': 'checkbox',
            'wait': 'number'
        }
    }
}

document.getElementById('auto-select').innerHTML =
    Object.keys(commandTypes).map(type => `<option>${commandTypes[type].name}</option>`)

var updateCommands = () => {
    let html = ''
    for (let command of commands) {
        /** @type {string[]} */
        let parts = command.split(':')
        let name = parts.splice(0, 1)[0]
        let part = 0
        for (let v in commandTypes[name].vars) {
            parts[part] = `${v}: ${parts[part]}`
            part++
        }
        html += `\n<div class="inner-group">\n<h4>${commandTypes[name].name}</h4>\n<ul>\n<li>${parts.join('\n<li>')}\n</ul>\n</div>`
    }
    document.getElementById('command-list').innerHTML = html
}

var updateCommandInfo = (command) => {
    let type = commandTypes[Object.keys(commandTypes).find(type => commandTypes[type].name === command)]
    let html = ''
    for (let v in type.vars) {
        let value
        if (type.vars[v] === 'checkbox') {
            value =
                '<label class="switch">\
                    <input type="checkbox" class="auto-var">\
                    <span class="slider"></span>\
                </label>'
        } else {
            value = `<input type="${type.vars[v]}" class="auto-var">`
        }
        html += `<div style="height: 30px;">${v} ${value}</div>\n`
    }
    document.getElementById("auto-body").innerHTML = html
}

document.getElementById("auto-select").onchange = (value) => {
    updateCommandInfo(value.target.value)
}

updateCommandInfo(commandTypes.driveStraight.name)

document.getElementById('add-command').onclick = () => {
    let command = document.getElementById("auto-select").value
    let name = Object.keys(commandTypes).find(type => commandTypes[type].name === command)
    let type = commandTypes[name]
    let parts = [name]
    for (let element of document.getElementsByClassName('auto-var')) {
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
    NetworkTables.putValue("/SmartDashboard/commands", commands)
}

document.getElementById('reset-commands').onclick = () => {
    commands = []
    NetworkTables.putValue("/SmartDashboard/commands", commands)
}
