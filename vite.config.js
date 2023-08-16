import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
import { transformBooleanProp } from '@vue-macros/boolean-prop';

export default defineConfig({
    plugins: [
        Vue({
            template: {
                compilerOptions: {
                    nodeTransforms: [transformBooleanProp()]
                }
            }
        }),
        ReactivityTransform(),
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: 'VIcon',
                }),
            ]
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    enabledCollections: ['ri'],
                }),
            ]
        }),
        Icons({
            compiler: 'vue3',
            autoInstall: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
