const fs = require('fs')
const resolve = require('path').resolve
const join = require('path').join
const program = require('commander')
const spawn = require('cross-spawn')

program
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-c, --ci', 'Use ci mode instead of install')
    .option('-t, --test', 'Run the test scripts for each package')
    .option('-i, --integrity', 'Runs the integrity checks on each project')
    .option('-p, --packages <items>', 'Paths to packages to bootstrap (comma separated)', (value) =>
        value.split(','),
    )
    .option('--install <npmPackage>', 'Install a package')
    .option('--clean')
    .parse(process.argv)

const options = program.opts()
if (!options.packages || !options.packages.length) {
    throw new Error('No packages defined for bootstrapping')
}

let mode = 'install'
let requiresRun = false
const additionalArgs = []
if (options.ci) {
    mode = 'ci'
} else if (options.test) {
    mode = 'test'
} else if (options.integrity) {
    mode = 'integrity-check'
    requiresRun = true
} else if (options.install) {
    additionalArgs.push(options.install)
} else if (options.clean) {
    requiresRun = true
    mode = 'full-clean'
}

options.packages.forEach(function (path) {
    console.log(`Running ${path} in ${mode} mode...`)

    const packagePath = resolve(__dirname, '../', path)

    if (!fs.existsSync(join(packagePath, '/package.json'))) {
        throw new Error('No package.json found at ' + packagePath)
    }

    const args = requiresRun ? ['run', mode, ...additionalArgs] : [mode, ...additionalArgs]

    spawn.sync('npm', args, {
        env: process.env,
        cwd: packagePath,
        stdio: 'inherit',
    })
})
