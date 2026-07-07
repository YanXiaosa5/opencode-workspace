# AGENTS.md

Project scaffolded with `create-electron@latest --template react-ts` (electron-vite + React 19 + TypeScript + Electron 39).

## Layout

```
src/main/       — Electron main process
src/preload/    — Preload scripts
src/renderer/   — React app (with `@renderer` alias to src/renderer/src)
electron.vite.config.ts — Vite config (main, preload, renderer)
```

## Commands

| Command             | What it does                            |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start dev server + Electron window      |
| `npm run build`     | Typecheck + production build to `out/`  |
| `npm run typecheck` | `tsc --noEmit` for node + web tsconfigs |
| `npm run lint`      | ESLint (flat config)                    |
| `npm run format`    | Prettier                                |
| `npm run start`     | Preview production build                |

## Known issues

- **Electron binary download fails on slow networks.** If `npm install` times out on Electron, set `ELECTRON_MIRROR` to a Chinese mirror (e.g. `https://npmmirror.com/mirrors/electron/`) and reinstall. If the binary downloads incomplete (missing `Frameworks/`), manually download the zip, extract `Electron.app` into `node_modules/electron/dist/`, and write the relative binary path to `node_modules/electron/path.txt`.
- `path.txt` must not have a trailing newline (use `printf '%s' '...' > path.txt` or Node.js `fs.writeFileSync`).
- Dev requires a display server; headless terminals will get GPU/display errors (harmless). Use `--no-sandbox` flag if needed.

## Aliases

- `@renderer/...` → `src/renderer/src/...`

## Architecture notes

- electron-vite builds three separate targets (main, preload, renderer), each with its own tsconfig.
- `node_modules/electron` is the Electron runtime, not a dependency imported in app code.

## AI Behavior & Coding Rules

### 1. File Modification Constraints

- **Strict Separation**: Before editing any code, always check the path. Never import Node.js built-ins (`fs`, `path`, `crypto`) or full Electron modules inside `src/renderer/`.
- **Preload Interface**: To expose a new system API to React, you must follow a 3-step sequence:
  1. Add the implementation or IPC invocation in `src/main/`.
  2. Declare and expose the method via `contextBridge.exposeInMainWorld` in `src/preload/`.
  3. Update the TypeScript interface globally in `src/preload/index.d.ts` so the renderer gets autocomplete.

### 2. Component-Driven UI Architecture (New)

- **Atomic Components First**: When creating or refactoring a UI feature, ALWAYS split it into small, independent, reusable components under `src/renderer/src/components/` instead of writing giant, monolithic page files.
- **Single Responsibility**: Keep each component focused on a single piece of UI/logic. Prefer composition (nesting components) over expanding one file indefinitely. Try to keep component files under 150 lines of code.
- **State Localization**: Keep React state as close to the relevant components as possible to maximize Vite HMR efficiency and avoid full-page re-renders.

### 3. Vite & Hot Reload (HMR) Discipline

- Do **NOT** use terminal commands to kill and restart `npm run dev` just because you modified React code. Trust `electron-vite`'s hot-reloading.
- Only request a full application restart if you modified `src/main/` or `src/preload/`, as these layers do not support front-end HMR.

### 4. Pathing and Imports

- When generating code or imports in the React application, always prefer the `@renderer` alias (e.g., `@renderer/components/Button`) over relative paths (e.g., `../../components/Button`).
- Do not add `dependencies` that require native Node.js compilation to `package.json` without notifying the user, as it breaks the `electron-vite` bundle easily.

## 🔄 Automated Workflows (SOP)

### Workflow A: Developing a New Feature / IPC Bridge

When the user asks to create a new feature that requires system-level access, you MUST execute the following workflow in order:

1. **[Analyze]**: Read `src/main/` and `src/preload/` to see if similar IPC channels exist.
2. **[Implement Back-end]**: Write the main process logic and register the IPC handler in `src/main/`.
3. **[Expose API]**: Update `src/preload/index.ts` to expose the API, and immediately append the TypeScript types in `src/preload/index.d.ts`.
4. **[Implement Front-end]**: Build the React UI in `src/renderer/` using the newly exposed `@renderer` or `window.api` methods.
5. **[Verification]**: Call `npm run typecheck` via terminal to verify TypeScript compilation. If it fails, auto-fix the types and retry up to 2 times.
6. **[Visual Check]**: Use `electron-debug` MCP to connect to port 9222, verify the console has no errors, and summarize the result to the user.

### Workflow B: Code Quality & Commit Bridge

When a task is successfully completed and verified:

1. **[Lint & Format]**: Automatically run `npm run lint` and `npm run format`. Fix any minor style issues yourself.
2. **[Git Status]**: Run `git status` and `git diff` to review all your modifications.
3. **[Propose Commit]**: Generate a concise, standard Semantic Commit Message (e.g., `feat(ipc): add local file saving bridge`) and ask the user for confirmation to commit.

## 🛠️ Workspace Skills

### Skill 1: `diagnose-ipc` (Electron IPC 跨进程链路诊断)

- **Description**: Automatically traces, inspects, and fixes broken communication between the React front-end and the Electron Main process.
- **Trigger**: Explicitly invoked by the user, or automatically triggered when an IPC call returns `undefined`, hangs, or throws `TypeError: window.api... is not a function`.
- **Action Plan**:
  1. **Scan Main**: Locate the corresponding `ipcMain.handle` or `ipcMain.on` in `src/main/` to verify the channel string matches exactly (case-sensitive).
  2. **Scan Preload**: Inspect `src/preload/index.ts` to ensure the channel is correctly wrapped and exposed via `contextBridge.exposeInMainWorld`.
  3. **Scan Types**: Open `src/preload/index.d.ts` to verify the TypeScript interface accurately describes the arguments and return types.
  4. **Scan Renderer**: Check the invoking component in `src/renderer/` for proper `async/await` handling.
  5. **Auto-Fix**: Automatically patch whichever layer is broken or out of sync, then run `npm run typecheck` to confirm.

### Skill 2: `free-debug-port` (9222 调试端口强力清理)

- **Description**: Detects and terminates any rogue processes occupying the port `9222`, ensuring `electron-debug` MCP can connect successfully.
- **Trigger**: Triggered when `electron-debug` MCP or the browser throws a `Connection Refused (ECONNREFUSED)` error on port 9222.
- **Action Plan**:
  1. Run a silent command to check the port owner (e.g., `lsof -i :9222` on macOS).
  2. If a PID is identified, safely terminate or force-kill the process (e.g., `kill -9 <PID>`).
  3. Wait 1 second, verify the port is free, and then guide the user to restart the dev server via `npm run dev` to reset the CDP bridge.

### Skill 3: `optimize-bundle` (编译体积与打包依赖瘦身)

- **Description**: Audits the project dependencies and configuration to prevent oversized production builds or unbundled native modules.
- **Trigger**: Invoked when prepping for a production build, or when `npm run build` fails due to packaging issues.
- **Action Plan**:
  1. Read `package.json` and verify that no development-only tools (like `@types/*`, `eslint`, `vite`) are mistakenly placed in `dependencies` instead of `devDependencies`.
  2. Check `electron.vite.config.ts` to ensure native Node.js C++ modules (if any) are correctly marked as `external` so they don't crash the Vite bundler.
  3. Provide the user with a structural summary of potential bloat before they package the app via `electron-builder`.

## Internationalization (i18n) Workflow & Requirements

When adding, modifying, or deleting any i18n text or translations in the codebase, you **MUST** follow the rigid 3-step workflow described below. Do not skip any step, and do not manually modify compiled files.

### The i18n Pipeline

1. **Step 1: Extract from Source Code (CRITICAL GROUNDWORK)**
   - **Action**: Before handling any external translations, always extract the latest internationalization IDs and default messages from the source code components. This ensures `en.json` (or your base file) aligns with the codebase.
   - **Command**: `pnpm i18n:extract`

2. **Step 2: Translate via Script (Do Not Edit JSON Manually)**
   - **Action**: Scan the user's prompt for explicit mode keywords and the languages involved. You MUST dynamically build and run the command:
     - 🔹 If the user says **"覆盖"**: Prepare the base command `pnpm run i18n:overwrite`.
     - 🔹 If the user says **"追加"**: Prepare the base command `pnpm run i18n:append`.
     - ⚠️ **CRITICAL Refusal**: If _neither_ "追加" nor "覆盖" is mentioned in the prompt, you **MUST STOP IMMEDIATELY** and reply: _"请明确告知本次国际化操作是【追加】还是【覆盖】。"_
   - **Dynamic Language Extraction**: Extract the exact target language codes from the user's input or the Excel sheet headers (e.g., `zh-CH`, `en`, `ja`, `ko`). Append them dynamically to the command.
     - _Example 1_: If the user says _"帮我追加中文和英文"_, run: `pnpm run i18n:append zh-CH en`
   - **Target**: This will update/restore the corresponding files like `src/i18n/messages/zh-CH.json` by merging or overwriting with Excel data, effectively "reviving" any keys that Step 1 might have temporarily cleaned up.

3. **Step 3: Compile for Production**
   - **Action**: Compile the raw JSON message files into a clean format required by `react-intl`.
   - **Command**: `pnpm i18n:format`

4. **Step 4: Verification & Sanity Check**
   - **Action**: Run the check script to verify syntax and baseline matching.
   - **Command**: `pnpm i18n:check`
   - **⚠️ Exception Rule for New Keys**: If `pnpm i18n:check` reports warnings about **"Unused keys"** (keys present in JSON but not yet referenced in source code), this is EXPECTED for newly imported translations. You **MUST NOT** delete these keys from the JSON files. Consider the task successful as long as there are no missing keys (missing translations for existing code) or syntax crashes.

---

### Strict Enforcement Rules for Agent (opencode)

- **Execution Order**: You **MUST** run all three commands sequentially whenever i18n text changes.
- **Environment Troubleshooting**: If you encounter an error stating that the configured global bin directory `/Users/yanmaipian/Library/pnpm/bin` is not in PATH during execution, you must dynamically bypass it (e.g., by falling back to local `npx` or adjusting your execution path) to ensure the commands complete successfully.
- **Definition of Task Completion**: The task is only considered complete when `pnpm i18n:check` passes with zero errors, and all generated files are correctly updated in the workspace.
- **⚠️ DO NOT COMMIT OR PUSH**: Your responsibility ends with generating and verifying the local files. **Do not** run `git commit`, `git push`, or use any git tools to stage/commit the changes. Leave the modified workspace as-is for the developer to review and commit manually.
- If `pnpm i18n:check` fails, you **MUST** inspect the error terminal output, fix the source code or messages, and re-run the entire pipeline until it passes.


# 桌面端 UI 文本样式强制规范

你在修改任何设置、外观、关于、隐私等面板的组件时，必须严格遵守以下文本样式 Tokens。禁止使用任何规范之外的字号、字重与颜色组合。

## 一、 文本 Tokens 映射表

| 文本类型 / 语义 | 字号 (Font Size) | 字重 (Font Weight) | 颜色十六进制 (Color) | 特殊技术要求 |
| :--- | :--- | :--- | :--- | :--- |
| **页面大标题** (如“外观”) | `20px` | `700` (Bold) | `#191C1D` | - |
| **页面说明文字** | `14px` | `500` (Medium) | `#6B7280` | - |
| **二级标题** (主题/语言/隐私/帮助) | `16px` | `400` (Regular) | `#3F434B` | - |
| **版本号** | `20px` | `400` (Regular) | `#3F434B` | 必须强制使用等宽字体 (`font-family: monospace`) |
| **设置项名称** | `14px` | `400` (Regular) | `#3F434B` | - |
| **描述和提示文字** | `14px` | `400` (Regular) | `#878787` | - |
| **下拉框文字** | `14px` | `400` (Regular) | `#3F434B` | - |
| **普通浅蓝按钮文字** | `14px` | `400` (Regular) | `#485054` | - |
| **未选中的主题按钮** | `14px` | `400` (Regular) | `#878787` | - |
| **选中的主题按钮** | `14px` | `400` (Regular) | `#FFFFFF` | - |

---

## 二、 AI 自动化全量修改执行策略

AI 助理（如 Cline / Cursor）在对相关目录进行代码重构时，**必须严格遵守以下流式流水线步骤与核心铁律**：

### 1. 核心铁律 (Core Rules)
* **精准替换**：严格按照规范中的字号、字重和颜色进行代码替换。严禁为了省事使用相近色，必须精准替换为对应的 `#十六进制` 颜色、`px` 值及字重。
* **质量卡点**：**每完成一个文件的修改，请自动运行编译或格式化进行检查**，确保没有打破原本的布局结构。如果编译报错，必须立即在当前步骤修复，严禁带着报错继续修改下一个文件。
* **拒绝盲猜**：**遇到拿不准语义的文本，停下来提示我，不要盲目猜测。**

### 2. 标准重构流水线 (Step-by-Step Pipeline)
* **步骤 [扫描]**：在编辑文件前，先完全读取该文件内容，对其中包含的文案进行“语义分类”（例如：识别出某行文字属于“二级标题”，某行属于“描述和提示文字”）。
* **步骤 [映射]**：严格执行“精准替换”铁律，转换为当前项目使用的样式方案（若是 Tailwind 请使用对应 class，若是 inline-style/CSS 请直接使用属性值）。
* **步骤 [等宽处理]**：审查到“版本号”相关文案时，检查并补全等宽字体样式。
* **步骤 [验证]**：执行“质量卡点”铁律，运行本地的格式化/编译命令（如 `npm run lint` 或 `npm run build` 相关校验）。
* **步骤 [原子化中断]**：**单次对话仅允许修改一个文件。** 完成一个文件的修改、编译验证无误后，必须主动停止并阻断，等待用户点击确认（Approve），切勿在单次请求中连续洗盘多个文件。


