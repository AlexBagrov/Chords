import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function loadResvg() {
  try {
    return require('@resvg/resvg-js')
  } catch {
    const { execSync } = await import('node:child_process')
    execSync('npm install --no-save @resvg/resvg-js png-to-ico', {
      cwd: root,
      stdio: 'inherit',
    })
    return require('@resvg/resvg-js')
  }
}

const { Resvg } = await loadResvg()
const pngToIcoModule = require('png-to-ico')
const pngToIco = pngToIcoModule.default ?? pngToIcoModule

const svgPath = path.join(root, 'public/icons/app-icon.svg')
const svg = fs.readFileSync(svgPath)

function renderPng(size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  })
  return resvg.render().asPng()
}

const png512 = renderPng(512)
fs.writeFileSync(path.join(root, 'public/icons/app-icon.png'), png512)
fs.writeFileSync(path.join(root, 'public/icons/pwa-512.png'), png512)
fs.writeFileSync(path.join(root, 'public/icons/pwa-192.png'), renderPng(192))

const ico = await pngToIco([
  renderPng(16),
  renderPng(32),
  renderPng(48),
  renderPng(64),
  renderPng(128),
  renderPng(256),
])
fs.writeFileSync(path.join(root, 'public/icons/app-icon.ico'), ico)

console.log('Updated app-icon.png / .ico and pwa-192/512.png')
