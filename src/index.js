let loadFiles = (files) => {
    let currentPromise = loadFile(files.shift())
    for (let file of files) {
        currentPromise = currentPromise.then(() => { loadFile(files.shift()) })
    }
}

let loadFile = (file) => {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.onload = function () {
            resolve()
        };
        script.src = `js/${file}.js`;

        document.head.appendChild(script);
    })
}

onpagesready = () => {
    loadFiles([
        'networktables',
        'command',
        'connection',
        'nt',
        'refresh'
    ])
}

loadFile('loadPages')