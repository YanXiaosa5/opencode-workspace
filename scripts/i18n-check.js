#!/usr/bin/env node
/**
 * Cross-platform i18n check script.
 * Extracts messages to a temp file and compares against the committed file
 * to ensure src/i18n/messages/en.json is up to date.
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')

const projectDir = path.join(__dirname, '..')
const formatjs = require.resolve('@formatjs/cli/bin/formatjs')
const enFile = path.join(projectDir, 'src', 'i18n', 'messages', 'en.json')
const tmpFile = path.join(os.tmpdir(), 'en.i18n-check.json')

execFileSync(
  process.execPath,
  [
    formatjs,
    'extract',
    'src/**/*.{ts,tsx}',
    '--ignore',
    '**/*.d.ts',
    '--out-file',
    tmpFile,
    '--flatten'
  ],
  { stdio: 'inherit', cwd: projectDir }
)

const committed = fs.readFileSync(enFile, 'utf8')
const extracted = fs.readFileSync(tmpFile, 'utf8')

try {
  fs.unlinkSync(tmpFile)
} catch (_) {
  // ignore cleanup errors
}


/* ======================================== */

const committedData = JSON.parse(committed);
const extractedData = JSON.parse(extracted);

let hasError = false;

// 代码里新加的 ID，本地 en.json 绝对不能漏掉（漏了就报错）
for (const key in extractedData) {
  if (!committedData[key]) {
    console.error(`❌ 错误：代码中存在 ID [${key}]，但在 src/i18n/messages/en.json 中未找到翻译！`);
    hasError = true;
  }
}

// 本地多出来的 Excel 词条，只警告，不卡死打包
const unusedKeys = Object.keys(committedData).filter(key => !extractedData[key]);
if (unusedKeys.length > 0) {
  console.log(`⚠️ 提示：en.json 中包含 ${unusedKeys.length} 个代码中暂未引用的 Excel 预配词条（这在追加模式下是正常的）。`);
}

// 根据核心校验结果决定是否退出
if (hasError) {
  console.error('\n❌ 校验未通过：请运行 pnpm i18n:extract 并重新同步 Excel 翻译表！');
  process.exit(1);
} else {
  console.log('✅ 国际化基线校验通过！');
}
/* ======================================== */



// if (JSON.stringify(JSON.parse(committed)) !== JSON.stringify(JSON.parse(extracted))) {
//   console.error(
//     'Error: src/i18n/messages/en.json is out of date. Run pnpm i18n:extract to update it.'
//   )
//   process.exit(1)
// }
