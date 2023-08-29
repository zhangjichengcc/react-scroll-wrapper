import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import ttypescript from "ttypescript";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import fileSize from "@rollup/plugin-terser";
// import nodeExternals from 'rollup-plugin-node-externals' // 自动将NodeJS内置模块声明为外部模块。还处理npm依赖、devDependencies、peer dependencies和optionalDependencies。
// import multi from "@rollup/plugin-multi-entry";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { visualizer } from "rollup-plugin-visualizer"; // 可视化并分析Rollup包，以查看哪些模块占用了空间
import clear from "rollup-plugin-clear";
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = require("./package.json");
// path.resolve();

// 入口文件
const entry = "src/index.ts";

// 组件存放目录
const componentsDir = "src/components";
// 获取组件名称
const componentsName = fs.readdirSync(path.resolve(componentsDir));

// 获取组件入口
const componentsEntry = componentsName.map(
  (name) => `${componentsDir}/${name}/index.tsx`
);

const plugins = [
  postcss({
    namedExports: true,
    minimize: true,
    modules: true,
    use: ["less"],
  }), // 处理css、less 文件
  nodeResolve({
    extensions: [".js", ".jsx", ".ts", ".tsx", ".less"], //允许我们加载第三方模块
  }),
  clear({
    targets: ["./dist"],
  }),
  babel({
    babelHelpers: "runtime",
    exclude: /node_modules/,
  }),
  commonjs(), // 将CommonJS模块转换为ES模块
  typescript({
    typescript: ttypescript,
    // ? 由于配置文件使用了ts，所以在 tsconfig.js 配置中将 rollup.config.ts加入到了include中，这里需要将其排除，不需要打包
    exclude: ["./rollup.config.ts"],
    compilerOptions: {
      declaration: true,
      declarationDir: path.join(__dirname, "dist"),
    },
  }),
  // ? 自动识别并排除 peerDependencies 中声明的依赖，特别适用于解决在开发 React 组件库时需要将 React 和 React DOM 排除在外的情况。
  peerDepsExternal(),
  terser(), // 压缩代码
  fileSize(), // 打包完成后展示文件大小
  visualizer(),
];

const config = {
  input: [entry, ...componentsEntry],
  // 移除项目依赖
  // ? external 配置项是用于手动指定要排除在外的依赖，而 React 是你的组件库所依赖的核心依赖，它在代码中会被直接引用，因此无法通过 external 将它排除在外。
  external: [...Object.keys(pkg.devDependencies), "**/node_modules/**"],
  output: [
    {
      preserveModules: true, // 使用原始模块名作为文件名
      preserveModulesRoot: "src", // 指定输出目录
      dir: path.join(__dirname, "dist"),
      // entryFileNames: "[name].[hash].js",
      // chunkFileNames: "[name].[hash].js",
      format: "esm",
      exports: "auto",
      sourcemap: true,
      // assetFileNames: (chunkInfo) => {
      //   const { name } = chunkInfo;
      //   const { ext, dir, base } = path.parse(name!);
      //   if (ext !== ".css") return "[name].[ext]";
      //   // 规范 style 的输出格式
      //   return path.join(dir, "style", base);
      // },
    },
  ],
  plugins,
};

export default config;
