var loadFiles = (files) => {
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

let pagesLoading = 0
let pagesDone = 0

var insertCards = (cards, column) => {
    let firstCard = cards.shift()
    let currentPromise = insertCard(firstCard.file, column, firstCard.id)
    for (let card of cards) {
        currentPromise = currentPromise.then(() => {
            let card2 = cards.shift()
            insertCard(card2.file, column, card2.id)
        })
    }
}

var onpagesready

let insertCard = (file, column, id) => {
    return new Promise((resolve, reject) => {
        pagesLoading++
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `html/${file}.html`, true);
        xhr.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status !== 200) return;
            let div = document.createElement('div')
            div.classList.add('group')
            div.innerHTML = this.responseText
            if (id) div.id = id
            document.getElementById(`${column}-column`).appendChild(div);
            pagesDone++
            if (pagesDone === pagesLoading) {
                onpagesready()
            }
            resolve()
        };
        xhr.send();
    })
}
