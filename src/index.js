onpagesready = () => {
    loadFiles([
        'networktables',
        'command',
        'connection',
        'nt',
        'refresh'
    ])
}

insertCards([
    {file: 'ntvOther'}
], 'ntv-other')

insertCards([
    {file: 'ntvInput'}
], 'ntv-input')

insertCards([
    {file: 'connection', id: 'connection-div'},
    {file: 'timer'},
    {file: 'positionControl'}
], 'main')

insertCards([
    {file: 'commandCreator'},
    {file: 'commandList'}
], 'command')