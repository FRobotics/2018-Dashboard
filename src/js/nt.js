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
                varsHtml += `  ${name}\n`
                let value = NetworkTables.getValue(`${obj[key].path}`)
                switch (typeof (value)) {
                    case "number":
                        varsHtml += `  <input type="number" value=${value} disabled>\n`
                        break
                    case "boolean":
                        varsHtml += `  <label class="switch">\n`
                            + `  <input type="checkbox" checked=${value}>\n`
                            + `  <span class="slider"></span>\n`
                            + `  </label>\n`
                        break
                    case "string":
                        varsHtml += `  <input type="text" textContent="${value}" disabled>\n`
                        break
                }
                varsHtml += '<br>\n'
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

NetworkTables.addKeyListener('/robot/time', (key, value) => { // eslint-disable-line no-undef
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
  document.getElementById('timer').innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60
})