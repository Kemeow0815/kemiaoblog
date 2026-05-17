#!/usr/bin/env node

/**
 * 日历备忘删除工具
 * 用法: node delete-memo.mjs <序号>
 * 示例: node delete-memo.mjs 1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMOS_FILE_PATH = path.join(__dirname, '..', 'public', 'calendar', 'memos.json');

function loadMemos() {
    try {
        const data = fs.readFileSync(MEMOS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ 无法读取备忘文件:', error.message);
        process.exit(1);
    }
}

function saveMemos(data) {
    fs.writeFileSync(MEMOS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function listMemosWithIndex() {
    const data = loadMemos();
    
    if (data.memos.length === 0) {
        console.log('暂无备忘');
        return { data, indexedMemos: [] };
    }
    
    // 按日期排序
    const sortedMemos = [...data.memos].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    console.log('📅 备忘列表:');
    sortedMemos.forEach((memo, index) => {
        console.log(`  ${index + 1}. [${memo.date}] ${memo.content}`);
    });
    
    return { data, indexedMemos: sortedMemos };
}

function deleteMemo(index) {
    if (isNaN(index) || index < 1) {
        console.error('❌ 请提供有效的序号');
        process.exit(1);
    }
    
    const { data, indexedMemos } = listMemosWithIndex();
    
    if (index > indexedMemos.length) {
        console.error('❌ 序号超出范围');
        process.exit(1);
    }
    
    const memoToDelete = indexedMemos[index - 1];
    
    // 从原始数据中删除
    const originalIndex = data.memos.findIndex(m => m.id === memoToDelete.id);
    if (originalIndex === -1) {
        console.error('❌ 找不到要删除的备忘');
        process.exit(1);
    }
    
    data.memos.splice(originalIndex, 1);
    data.lastUpdated = Date.now();
    
    saveMemos(data);
    
    console.log('✅ 备忘删除成功！');
    console.log(`📅 日期: ${memoToDelete.date}`);
    console.log(`📝 内容: ${memoToDelete.content}`);
}

// 主程序
const args = process.argv.slice(2);

if (args.length === 0) {
    // 没有参数，只显示列表
    listMemosWithIndex();
    console.log('\n用法: node delete-memo.mjs <序号>');
    console.log('示例: node delete-memo.mjs 1');
    process.exit(0);
}

const index = parseInt(args[0], 10);

try {
    deleteMemo(index);
} catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
}
