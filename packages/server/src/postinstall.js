import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const indexPath = join(root, 'node_modules', '@lvce-editor', 'static-server', 'static', 'index.html')
const content = await readFile(indexPath, 'utf8')
const configElement = content.match(/<script id="Config" type="application\/json">([\s\S]*?)<\/script>/)
if (!configElement) {
  throw new Error('Server runtime config not found')
}
const config = JSON.parse(configElement[1])
const key = 'develop.chatNetworkWorkerPath'
if (!config.workerUrls?.[key]) {
  throw new Error('Chat network worker URL not found')
}
const workerPath = join(root, '.tmp', 'dist-chat-network-worker', 'dist', 'chatNetworkWorkerMain.js')
config.workerUrls[key] = `/remote/${pathToFileURL(workerPath).pathname.slice(1)}`
const newContent = content.replace(configElement[0], `<script id="Config" type="application/json">${JSON.stringify(config, null, 2)}</script>`)
await writeFile(indexPath, newContent)
