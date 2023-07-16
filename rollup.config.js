// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
import serve from "rollup-plugin-serve";
// import css from 'rollup-plugin-import-css'
import postcss from 'rollup-plugin-postcss';

const IS_PRODUCTION = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/App/index.tsx',
    output: {
        dir: 'build',
        format: 'cjs'
    },
    plugins: [
        nodeResolve(),
        typescript(),
        postcss({
            extract: true,
            modules: true,
        }),
        !IS_PRODUCTION && serve({
            port: 5500,
            contentBase: 'build'
        })
    ]
};
