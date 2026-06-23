// scripts/gen-messages.cjs
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 解析命令行参数
const args = process.argv.slice(2);

// 提取出是否带有 --append 标志（如果有，就是追加模式；没有就是覆盖模式）
const isAppendMode = args.includes('--append');

// 过滤掉所有带 '--' 的参数，剩下的纯字母就是语言列表 (原样保留大小写)
let targetLanguages = args.filter(arg => !arg.startsWith('--'));

// if (targetLanguages.length === 0) {
//   console.error('❌ 错误：请至少指定一种目标语言！');
//   console.error('💡 示例：node scripts/gen-messages.cjs zh-CH en [--append]');
//   process.exit(1);
// }

const excelPath = path.join(__dirname, '../产品翻译表.xlsx'); 
const targetDir = path.join(__dirname, '../src/i18n/messages');

if (!fs.existsSync(excelPath)) {
  console.error(`未找到 Excel 翻译文件，请确保它存在于: ${excelPath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// ==================== ✨ 核心新增：自动提取语言逻辑 ====================
if (targetLanguages.length === 0) {
  // 如果没有手动指定语言，获取 Excel 第一行的所有列名（表头）
  const firstRowKeys = data.length > 0 ? Object.keys(data[0]) : [];
  
  firstRowKeys.forEach(key => {
    // 正则匹配括号里的多语言标识（如 zh-CN, en, fil）
    const match = key.match(/[（\(]([a-zA-Z-]+)[）\)]/);
    if (match) {
      targetLanguages.push(match[1]); // 提取出标识并加入列表
    }
  });

  // 去重，确保语言代码唯一
  targetLanguages = [...new Set(targetLanguages)];

  if (targetLanguages.length === 0) {
    console.error('❌ 错误：未手动指定语言，且未能从 Excel 表头括号内提取出任何有效的语言代码（如 en, zh-CN）！');
    process.exit(1);
  }

  console.log(`🤖 检测到未指定参数，已自动从 Excel 表头提取出 ${targetLanguages.length} 种语言: ${targetLanguages.join(', ')}`);
}
// ====================================================================


const results = {};
targetLanguages.forEach(lang => {
  results[lang] = {};
});

data.forEach(row => {
  // 获取当前行的所有列名 (比如 ['id', 'zh-CH', 'en'])
  const rowKeys = Object.keys(row);
  
  // 优先用 key 列作为消息 ID，兼容旧版 Excel 使用 id 列
  const keyKey = rowKeys.find(key => key.toLowerCase().includes('key'));
  const idKey = rowKeys.find(key => key.toLowerCase().includes('id'));
  const msgId = keyKey ? String(row[keyKey]).trim() : (idKey ? String(row[idKey]).trim() : undefined);

  if (msgId) {
    targetLanguages.forEach(lang => {
        // 升级后的列名匹配：允许前缀，精准提取括号内的语言代码
        const matchedKey = rowKeys.find(key => {
          const match = key.match(/[（\(]([a-zA-Z-]+)[）\)]/);
          return match ? match[1].toLowerCase() === lang.toLowerCase() : key.toLowerCase() === lang.toLowerCase();
        });
        
        // 提取并写入结果
        if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
          if (results[lang][msgId]) {
            console.warn(`警告: Excel 中发现重复的 id [${msgId}]，后面的文案 "${row[matchedKey]}" 将会覆盖前面的文案！`);
          }
          results[lang][msgId] = { defaultMessage: String(row[matchedKey]).trim() };
        }
      });
  }
});

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 区分“追加”还是“覆盖”并写入
targetLanguages.forEach(lang => {
  // 直接使用 lang，不转小写！保证生成你传入的精确大小写文件名 (例如 zh-CH.json)
  const filePath = path.join(targetDir, `${lang}.json`);
  let finalData = {};

  // 如果是追加模式，并且本地已经有这个 JSON 文件了
  if (isAppendMode && fs.existsSync(filePath)) {
    try {
      // 读取本地旧数据
      const oldContent = fs.readFileSync(filePath, 'utf-8');
      const oldData = JSON.parse(oldContent);
      
      // 把新解析出的 Excel 数据覆盖合并到老数据上
      finalData = { ...oldData, ...results[lang] };
      console.log(`- 追加合并模式: src/i18n/messages/${lang}.json`);
    } catch (error) {
      console.warn(`无法解析现有的 ${lang}.json，降级为覆盖模式。`);
      finalData = results[lang];
    }
  } else {
    // 覆盖模式（或者本地根本还没这个文件）
    finalData = results[lang];
    console.log(`全量覆盖模式: src/i18n/messages/${lang}.json`);
  }

  // 写入文件
  fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));
});

console.log('=====\n✅ 成功生成源文件！');


// [产品给的 Excel 翻译] 
// [步骤 1: 同步最新的id] ➡️ extract 先执行命令，同步最新的代码
//                      ↓
// [步骤 2: 脚本转换] ➡️ 运行‘overwrite’ 覆盖项目中的 `src/i18n/messages/zh.json`等
//   如果是追加国际化，则执行‘append ’ 命令，合并新增词条到现有文件中，稳定起见，建议执行append模式，避免覆盖掉之前的翻译内容
//                      ↓ 
// [步骤 3: 本地验证] ➡️ 运行 `sync-format` 生成compiled中的文件，去除defaultMessage
//                      ↓
// [步骤 4: 本地验证] ➡️ 运行 `check` 确保本地文件状态完全正确


// pnpm i18n:extract
// pnpm i18n:append 
// pnpm i18n:sync-format
// pnpm i18n:check
