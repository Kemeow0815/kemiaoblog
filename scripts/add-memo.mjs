#!/usr/bin/env node

/**
 * 日历备忘添加工具
 * 用法: node add-memo.mjs <日期> <内容>
 * 示例: node add-memo.mjs "2026-06-20" "发布新文章"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMOS_FILE_PATH = path.join(__dirname, '..', 'public', 'calendar', 'memos.json');

function generateId() {
    return `memo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function parseDate(dateStr) {
    // 支持多种日期格式: 2026-06-20, 2026/06/20, 2026.06.20
    const normalized = dateStr.replace(/[\/\.]/g, '-');
    const parts = normalized.split('-');
    
    if (parts.length !== 3) {
        throw new Error('日期格式错误，请使用 YYYY-MM-DD 格式');
    }
    
    const [year, month, day] = parts.map(Number);
    
    if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('日期格式错误，请使用 YYYY-MM-DD 格式');
    }
    
    // 返回标准化格式
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getTimestamp(dateStr) {
    // 如果没有提供日期，使用当前时间
    if (!dateStr) {
        return Date.now();
    }
    
    const normalized = parseDate(dateStr);
    const date = new Date(normalized);
    
    if (isNaN(date.getTime())) {
        throw new Error('无效的日期');
    }
    
    return date.getTime();
}

function loadMemos() {
    try {
        const data = fs.readFileSync(MEMOS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // 文件不存在时返回默认结构
        return {
            id: 'calendar-memos',
            name: '日历备忘',
            version: 1,
            lastUpdated: 0,
            memos: []
        };
    }
}

function saveMemos(data) {
    // 确保目录存在
    const dir = path.dirname(MEMOS_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(MEMOS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function addMemo(dateStr, content) {
    if (!dateStr || !content) {
        console.error('用法: node add-memo.mjs <日期> <内容>');
        console.error('示例: node add-memo.mjs "2026-06-20" "发布新文章"');
        process.exit(1);
    }
    
    const normalizedDate = parseDate(dateStr);
    const timestamp = getTimestamp(dateStr);
    
    const data = loadMemos();
    
    const newMemo = {
        id: generateId(),
        content: content.trim(),
        date: normalizedDate,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    
    data.memos.push(newMemo);
    data.lastUpdated = Date.now();
    
    saveMemos(data);
    
    console.log('✅ 备忘添加成功！');
    console.log(`📅 日期: ${normalizedDate}`);
    console.log(`📝 内容: ${content}`);
    console.log(`⏰ 时间戳: ${timestamp}`);
    console.log(`📁 文件: ${MEMOS_FILE_PATH}`);
}

// 主程序
const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('用法: node add-memo.mjs <日期> <内容>');
    console.error('示例: node add-memo.mjs "2026-06-20" "发布新文章"');
    console.error('');
    console.error('支持的日期格式:');
    console.error('  2026-06-20');
    console.error('  2026/06/20');
    console.error('  2026.06.20');
    process.exit(1);
}

const dateStr = args[0];
const content = args.slice(1).join(' ');

try {
    addMemo(dateStr, content);
} catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
}
