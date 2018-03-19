var displayValues = [
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
            { name: 'state' }
        ]
    }
]

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
    { file: 'ntvOther' }
], 'ntv-other')

insertCards([
    { file: 'ntvInput' }
], 'ntv-input')

insertCards([
    { file: 'connection', id: 'connection-div' },
    { file: 'timer' },
    { file: 'positionControl' }
], 'main')

insertCards([
    { file: 'commandCreator' },
    { file: 'commandList' }
], 'command')