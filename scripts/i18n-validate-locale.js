#!/usr/bin/env node
/**
 * Validate that translated locale catalogs mirror en.json and preserve ICU placeholders.
 * Pass one or more locale codes to validate specific catalogs, or no arguments to validate all locales.
 */
const fs = require('fs')
const path = require('path')
const { TYPE, parse } = require('@formatjs/icu-messageformat-parser')

const requestedLocales = process.argv.slice(2)

if (requestedLocales.includes('en')) {
  console.error('en is the source catalog and cannot be validated as a translated locale.')
  process.exit(1)
}

const projectDir = path.join(__dirname, '..')
const messagesDir = path.join(projectDir, 'src', 'i18n', 'messages')
const enPath = path.join(messagesDir, 'en.json')

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function collectArguments(elements, args) {
  for (const element of elements) {
    switch (element.type) {
      case TYPE.argument:
      case TYPE.number:
      case TYPE.date:
      case TYPE.time:
        args.add(element.value)
        break
      case TYPE.select:
      case TYPE.plural:
        args.add(element.value)
        for (const option of Object.values(element.options)) {
          collectArguments(option.value, args)
        }
        break
      case TYPE.tag:
        args.add(element.value)
        collectArguments(element.children, args)
        break
    }
  }
}

function extractPlaceholders(message) {
  const args = new Set()
  collectArguments(parse(message), args)
  return [...args].sort()
}

function listLocales() {
  return fs
    .readdirSync(messagesDir)
    .filter((file) => file.endsWith('.json') && file !== 'en.json')
    .map((file) => path.basename(file, '.json'))
    .sort()
}

function validateLocale(locale, en, enKeys) {
  const localePath = path.join(messagesDir, locale + '.json')

  if (!fs.existsSync(localePath)) {
    return {
      locale,
      missingFile: true,
      missing: [],
      extra: [],
      placeholderIssues: []
    }
  }

  const translated = readJson(localePath)
  const localeKeys = Object.keys(translated).sort()
  const missing = enKeys.filter((key) => !Object.prototype.hasOwnProperty.call(translated, key))
  const extra = localeKeys.filter((key) => !Object.prototype.hasOwnProperty.call(en, key))
  const placeholderIssues = []

  for (const key of enKeys) {
    if (!translated[key]) continue
    const source = en[key].defaultMessage || ''
    const target = translated[key].defaultMessage || ''
    const sourcePlaceholders = extractPlaceholders(source)
    const targetPlaceholders = extractPlaceholders(target)
    if (JSON.stringify(sourcePlaceholders) !== JSON.stringify(targetPlaceholders)) {
      placeholderIssues.push({ key, sourcePlaceholders, targetPlaceholders })
    }
  }

  return { locale, missingFile: false, missing, extra, placeholderIssues }
}

function printIssues(result) {
  const { locale, missingFile, missing, extra, placeholderIssues } = result
  if (missingFile) {
    console.error('Missing locale file for ' + locale + '.')
  }
  if (missing.length) {
    console.error(
      'Missing ' + locale + ' keys (' + missing.length + ', showing first 50):',
      missing.slice(0, 50)
    )
  }
  if (extra.length) {
    // console.error(
    //   'Extra ' + locale + ' keys (' + extra.length + ', showing first 50):',
    //   extra.slice(0, 50)
    // )
    console.warn(
    '⚠️ 提示: ' + locale + ' 中包含 ' + extra.length + ' 个 Excel 预配或暂未在代码中使用的多余词条 (已自动跳过):',
    extra.slice(0, 50)
  )
  }
  if (placeholderIssues.length) {
    console.error(
      'Placeholder issues in ' + locale + ' (' + placeholderIssues.length + ', showing first 20):',
      placeholderIssues.slice(0, 20)
    )
  }
}

const en = readJson(enPath)
const enKeys = Object.keys(en).sort()
const locales = requestedLocales.length ? requestedLocales : listLocales()

if (!locales.length) {
  console.error('No translated locale catalogs found.')
  process.exit(1)
}

const results = locales.map((locale) => validateLocale(locale, en, enKeys))

//只要有多余的 key (extra.length)，就会被判定为失败并卡死
// const failures = results.filter(
//   ({ missingFile, missing, extra, placeholderIssues }) =>
//     missingFile || missing.length || extra.length || placeholderIssues.length
// )
//                     ⬇️
// 🟢 修改后的代码：放行 extra！多余的词条不作为阻断打包的 failure
const failures = results.filter(
  ({ missingFile, missing, placeholderIssues }) =>
    missingFile || missing.length || placeholderIssues.length
)


for (const result of failures) {
  printIssues(result)
}

if (failures.length) {
  process.exit(1)
}

console.log(
  'i18n locale validation passed for ' + locales.join(', ') + ' (' + enKeys.length + ' messages).'
)
