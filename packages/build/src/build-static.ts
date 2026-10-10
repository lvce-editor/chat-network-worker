import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

const sharedProcessPath = join(root, 'node_modules', '@lvce-editor', 'shared-process', 'index.js')
const sharedProcess = await import(pathToFileURL(sharedProcessPath).toString())

process.env.PATH_PREFIX = '/chat-network-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

await cp(join(root, '.tmp', 'dist-chat-network-worker', 'dist'), join(root, 'dist', commitHash, 'packages', 'chat-network-worker', 'dist'), {
  recursive: true,
})
const indexPath = join(root, 'dist', 'index.html')
const content = await readFile(indexPath, 'utf8')
const configElement = content.match(/<script id="Config" type="application\/json">([\s\S]*?)<\/script>/)
if (!configElement) {
  throw new Error('Static runtime config not found')
}
const config = JSON.parse(configElement[1])
const key = 'develop.chatNetworkWorkerPath'
if (!config.workerUrls?.[key]) {
  throw new Error('Chat network worker URL not found')
}
config.workerUrls[key] = `/chat-network-worker/${commitHash}/packages/chat-network-worker/dist/chatNetworkWorkerMain.js`
await writeFile(
  indexPath,
  content.replace(configElement[0], `<script id="Config" type="application/json">${JSON.stringify(config, null, 2)}</script>`),
)
await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
