//#!/usr/bin/env node
'use strict'

const path = require('path')
const { exec } = require('child_process')

function fastFolderSize(target, cb) {
  // windows
  let p=path.join(__dirname, '../../../bin','du.exe');
  if(!require('fs').existsSync(p)){
    p=path.join(__dirname, '../../bin','du.exe');
  }

  if (process.platform === 'win32') {

    return exec(
      `"${p}" -nobanner -accepteula -q -c "${target}"`,
     // { cwd: target},
      (err, stdout) => {
        if (err) return cb(err)

        // query stats indexes from the end since path can contain commas as well
        const stats = stdout.split('\n')[1].split(',')

        cb(null, +stats.slice(-2)[0])
      }
    )
  }

  // mac
  if (process.platform === 'darwin') {
    return exec(`du -sk .`, { cwd: target }, (err, stdout) => {
      if (err) return cb(err)

      const match = /^(\d+)/.exec(stdout)

      const bytes = Number(match[1]) * 1024

      cb(null, bytes)
    })
  }

  // others
  return exec(`du -sb .`, { cwd: target }, (err, stdout) => {
    if (err) return cb(err)

    const match = /^(\d+)/.exec(stdout)

    const bytes = Number(match[1])

    cb(null, bytes)
  })
}

module.exports = fastFolderSize

if (require.main === module) {
  fastFolderSize(process.argv.slice(2)[0], (err, bytes) => {
    if (err) {
      throw err
    }

    console.log(bytes)
  })
}
