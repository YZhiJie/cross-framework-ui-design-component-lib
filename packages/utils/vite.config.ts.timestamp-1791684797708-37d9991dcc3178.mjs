// vite.config.ts
import { defineConfig } from "file:///Users/yangzhijie/Desktop/github_repositories/cross-framework-ui-design/node_modules/.pnpm/vite@5.0.0_@types+node@26.6.4_sass@1.105.1/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/yangzhijie/Desktop/github_repositories/cross-framework-ui-design/node_modules/.pnpm/vite-plugin-dts@4.0.0_@types+node@26.6.4_rollup@4.64.3_typescript@5.4.2_vite@5.0.0_@types+node@26.6.4_sass@1.105.1_/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///Users/yangzhijie/Desktop/github_repositories/cross-framework-ui-design/packages/utils/vite.config.ts";
var rootDir = fileURLToPath(new URL(".", __vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist/types",
      include: ["src/**/*.ts"],
      exclude: ["src/**/__tests__/**"]
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(rootDir, "src/index.ts")
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "es" ? "mjs" : "cjs"}`
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        dir: "dist"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMveWFuZ3poaWppZS9EZXNrdG9wL2dpdGh1Yl9yZXBvc2l0b3JpZXMvY3Jvc3MtZnJhbWV3b3JrLXVpLWRlc2lnbi9wYWNrYWdlcy91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3lhbmd6aGlqaWUvRGVza3RvcC9naXRodWJfcmVwb3NpdG9yaWVzL2Nyb3NzLWZyYW1ld29yay11aS1kZXNpZ24vcGFja2FnZXMvdXRpbHMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3lhbmd6aGlqaWUvRGVza3RvcC9naXRodWJfcmVwb3NpdG9yaWVzL2Nyb3NzLWZyYW1ld29yay11aS1kZXNpZ24vcGFja2FnZXMvdXRpbHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcblxuY29uc3Qgcm9vdERpciA9IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLicsIGltcG9ydC5tZXRhLnVybCkpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgZHRzKHtcbiAgICAgIGVudHJ5Um9vdDogJ3NyYycsXG4gICAgICBvdXREaXI6ICdkaXN0L3R5cGVzJyxcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoudHMnXSxcbiAgICAgIGV4Y2x1ZGU6IFsnc3JjLyoqL19fdGVzdHNfXy8qKiddLFxuICAgIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHtcbiAgICAgICAgaW5kZXg6IHJlc29sdmUocm9vdERpciwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgfSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAnY2pzJ10sXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCwgZW50cnlOYW1lKSA9PlxuICAgICAgICBgJHtlbnRyeU5hbWV9LiR7Zm9ybWF0ID09PSAnZXMnID8gJ21qcycgOiAnY2pzJ31gLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIHByZXNlcnZlTW9kdWxlczogdHJ1ZSxcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzUm9vdDogJ3NyYycsXG4gICAgICAgIGRpcjogJ2Rpc3QnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9iLFNBQVMsb0JBQW9CO0FBQ2pkLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxxQkFBcUI7QUFIc1AsSUFBTSwyQ0FBMkM7QUFLclUsSUFBTSxVQUFVLGNBQWMsSUFBSSxJQUFJLEtBQUssd0NBQWUsQ0FBQztBQUUzRCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixTQUFTLENBQUMsYUFBYTtBQUFBLE1BQ3ZCLFNBQVMsQ0FBQyxxQkFBcUI7QUFBQSxJQUNqQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLFFBQ0wsT0FBTyxRQUFRLFNBQVMsY0FBYztBQUFBLE1BQ3hDO0FBQUEsTUFDQSxTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFFBQVEsY0FDakIsR0FBRyxTQUFTLElBQUksV0FBVyxPQUFPLFFBQVEsS0FBSztBQUFBLElBQ25EO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUM7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNOLGlCQUFpQjtBQUFBLFFBQ2pCLHFCQUFxQjtBQUFBLFFBQ3JCLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
