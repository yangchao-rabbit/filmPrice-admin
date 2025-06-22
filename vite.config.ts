import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const pathResolve = (dir: string): any => {
    // @ts-ignore
    return resolve(__dirname, '.', dir)
}

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
    // @ts-ignore
    const { VITE_PORT, VITE_PROXY_URL } = loadEnv(mode, process.cwd(), 'VITE_')

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': pathResolve('./src'),
            },
        },
        server: {
            host: 'localhost',
            port: parseInt(VITE_PORT),
            proxy: {
                '/api': {
                    target: VITE_PROXY_URL,
                    changeOrigin: true,
                },
            },
        },
    }
})
