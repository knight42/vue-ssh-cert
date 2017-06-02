#!/usr/bin/node
'use strict'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'

import { PRIKEY, PASSPHRASE } from '../config'

function genCert(keypath, identity,
  { host = false, principals = '', expire = '', options = '' } = {})
{
  const args = ['-q', '-s', PRIKEY, '-P', PASSPHRASE, '-I', identity]
  if (expire) {
    args.push('-V', expire)
  }
  if (host) {
    args.push('-h')
  }
  if (principals) {
    args.push('-n', principals)
  }
  args.push(keypath)
  return new Promise((ful, rej) => {
    const p = spawn('ssh-keygen', args)
    p.on('error', rej)
    p.on('close', (code) => {
      if (code != 0) return rej(code)
      const o = path.parse(keypath)
      const certPath = path.join(o.dir, `${o.name}-cert${o.ext}`)
      fs.readFile(certPath, 'utf8', (err, data) => {
        if (err) rej(err)
        else ful(data)
      })
    })
  })
}

export default genCert
