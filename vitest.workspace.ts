import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import { load } from 'js-yaml'
import { defineWorkspace } from 'vitest/config'

function loadPnpmWorkspace(): string[] {
  if (!fs.existsSync(path.join('pnpm-workspace.yaml')))
    return []
  const workspaceFile = fs.readFileSync('pnpm-workspace.yaml', 'utf-8')
  const parsedFile = (load(workspaceFile) as { packages: string[] }) || { packages: [] }
  const result = (parsedFile || { packages: [] as string[] }).packages || []
  return fg.sync(result, { onlyDirectories: true, onlyFiles: false })
}

export default defineWorkspace(loadPnpmWorkspace())
