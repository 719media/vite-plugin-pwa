import { join } from 'path'
import { existsSync } from 'fs'
import type { Plugin, ResolvedConfig } from 'vite'
import { generateSW, injectManifest } from 'workbox-build'
import { generateSimpleSWRegister, injectServiceWorker } from './html'
import { generateRegisterSW } from './modules'
import { ResolvedVitePWAOptions, VitePWAOptions } from './types'
import { resolveOptions } from './options'
import { FILE_MANIFEST, FILE_SW_REGISTER, VIRTUAL_MODULES, VIRTUAL_MODULES_MAP } from './constants'

export { cachePreset } from './cache'

export function VitePWA(userOptions: Partial<VitePWAOptions> = {}): Plugin[] {
  let viteConfig: ResolvedConfig
  let options: ResolvedVitePWAOptions

  return [
    {
      name: 'vite-plugin-pwa',
      enforce: 'post',
      apply: 'build',
      configResolved(config) {
        viteConfig = config
        options = resolveOptions(userOptions, viteConfig)
      },
      transformIndexHtml: {
        enforce: 'post',
        transform(html) {
          return injectServiceWorker(html, options)
        },
      },
      generateBundle(_, bundle) {
        bundle[FILE_MANIFEST] = {
          isAsset: true,
          type: 'asset',
          name: undefined,
          source: `${JSON.stringify(options.manifest, null, options.minify ? 0 : 2)}\n`,
          fileName: FILE_MANIFEST,
        }
        if (options.injectRegister === 'import' && !existsSync(join(viteConfig.root, 'public', FILE_SW_REGISTER))) {
          bundle[FILE_SW_REGISTER] = {
            isAsset: true,
            type: 'asset',
            name: undefined,
            source: generateSimpleSWRegister(options),
            fileName: FILE_SW_REGISTER,
          }
        }
      },
      async closeBundle() {
        if (!viteConfig.build.ssr) {
          if (options.strategies === 'injectManifest')
            await injectManifest(options.injectManifest)
          else
            await generateSW(options.workbox)
        }
      },
    },
    {
      name: 'vite-plugin-pwa:virtual',
      configResolved(config) {
        viteConfig = config
        options = resolveOptions(userOptions, viteConfig)
      },
      resolveId(id, importer, _, ssr) {
        if (ssr || options.injectRegister !== 'register')
          return undefined
        return VIRTUAL_MODULES.includes(id) ? id : undefined
      },
      load(id, ssr) {
        if (ssr || options.injectRegister !== 'register')
          return undefined
        if (VIRTUAL_MODULES.includes(id)) {
          return generateRegisterSW(
            options,
            viteConfig.command === 'build' ? 'build' : 'dev',
            VIRTUAL_MODULES_MAP[id],
          )
        }
      },
    },
  ]
}

export type { VitePWAOptions as Options }
