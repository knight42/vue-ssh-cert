#!/usr/bin/node

import fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'

import genCert from './lib'

const server = new Koa()
const router = new Router()
const port = process.env['PROT'] || 3000
const tmpKeyPath = '/tmp/id_rsa.pub'

server.use(serve(__dirname))

//payload = {
  //pubkey: '',
  //identity: '',
  //host: false,
  //principals: '',
  //expire: '',
//}

router.post('/api/sign', (ctx) => {
  const payload = ctx.request.body
  if (process.env['DEBUG']) {
    console.log(payload)
  }
  fs.writeFileSync(tmpKeyPath, payload.pubkey)
  return genCert(tmpKeyPath, payload.identity, {
    host: payload.host,
    principals: payload.principals,
    expire: payload.expire
  })
  .then(cert => ctx.body = cert)
  .catch(err => {
    console.error('Unexpected error: %s', err)
  })
})

server
   .use(bodyParser())
   .use(router.routes())
   .listen(port, () => console.log(`listening on ${port}`))
