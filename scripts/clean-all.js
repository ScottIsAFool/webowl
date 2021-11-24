const fs = require('fs')
const program = require('commander')
const resolve = require('path').resolve

const foldersToRemove = ['node_modules', 'dist', 'build']

program
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-p, --packages <items>', 'Paths to packages to bootstrap (comma separated)', (value) =>
        value.split(','),
    )
    .parse(process.argv)

const options = program.opts()
if (!options.packages || options.packages.length === 0) {
    throw new Error('No packages defined')
}

options.packages.forEach(function (path) {
    const packagePath = resolve(__dirname, '../', path)
    foldersToRemove.forEach(function (folder) {
        const folderPath = resolve(packagePath, folder)
        deletePath(folderPath)
    })
})

const rootNodeModules = resolve(__dirname, '../', 'node_modules')
deletePath(rootNodeModules)

function deletePath(path) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true })
    }
}
