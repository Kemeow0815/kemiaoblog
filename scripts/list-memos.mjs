#!/usr/bin/env node

/**
 * 日历备忘列表工具
 * 用法: node list-memos.mjs
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

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
}

function listMemos() {
    const data = loadMemos();
    
    console.log('📅 日历备忘列表');
    console.log('=' .repeat(50));
    console.log(`名称: ${data.name}`);
    console.log(`版本: ${data.version}`);
    console.log(`最后更新: ${formatDate(data.lastUpdated)}`);
    console.log(`备忘数量: ${data.memos.length}`);
    console.log('=' .repeat(50));
    
    if (data.memos.length === 0) {
        console.log('暂无备忘');
        return;
    }
    
    // 按日期排序
    const sortedMemos = [...data.memos].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    let currentMonth = '';
    
    sortedMemos.forEach((memo, index) => {
        const date = new Date(memo.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthKey !== currentMonth) {
            currentMonth = monthKey;
            console.log(`\n📌 ${monthKey}`);
        }
        
        console.log(`  ${index + 1}. [${memo.date}] ${memo.content}`);
    });
    
    console.log('\n' + '='.repeat(50));
}

listMemos();
