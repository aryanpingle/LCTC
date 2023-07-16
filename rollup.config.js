// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
import serve from "rollup-plugin-serve";
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
// import { rimrafSync } from 'rimraf';

const IS_PRODUCTION = !process.env.ROLLUP_WATCH;

// rimrafSync("build/")

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
        copy({
            targets: [
                { src: "src/root/*", dest: "build/" }
            ]
        }),
        !IS_PRODUCTION && serve({
            port: 5500,
            contentBase: 'build'
        })
    ]
};
