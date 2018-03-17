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
            'open': 'boolean',
            'wait': 'number'
        }
    }
}

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
        html += `<p>${v} <input type="${type.vars[v]}" class="auto-var"></p>\n`
    }
    document.getElementById("auto-body").innerHTML = html
}

document.getElementById("auto-select").onchange = (value) => {
    updateCommandInfo(value.target.value)
}

updateCommandInfo('Drive Straight')

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
    NetworkTables.putValue("commands", commands)
}

document.getElementById('reset-commands').onclick = () => {
    commands = []
    NetworkTables.putValue("commands", commands)
}
