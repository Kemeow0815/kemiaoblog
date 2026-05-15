import { gitCommitConfig } from "../config";

/// <reference types="astro/client" />

export interface CommitFileInfo {
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    status: "added" | "removed" | "modified" | "renamed";
    blob_url: string;
}

export interface CommitInfo {
    sha: string;
    shortSha: string;
    date: string;
    message: string;
    author: string;
    totalAdditions: number;
    totalDeletions: number;
    files: CommitFileInfo[];
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
            if (response.status === 403 || response.status === 429) {
                const retryAfter = response.headers.get("retry-after");
                const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2 ** i * 1000;
                await new Promise((r) => setTimeout(r, waitTime));
                continue;
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise((r) => setTimeout(r, 2 ** i * 1000));
        }
    }
    throw new Error("All retries failed");
}

function getRepoUrl(): string {
    const { repoOwner, repoName } = gitCommitConfig;
    return `https://api.github.com/repos/${repoOwner}/${repoName}`;
}

export async function getLatestCommit(): Promise<CommitInfo | null> {
    try {
        const headers: Record<string, string> = {
            "Accept": "application/vnd.github.v3+json",
        };

        const token = import.meta.env.PUBLIC_GITHUB_TOKEN;
        if (token) {
            headers["Authorization"] = `token ${token}`;
        }

        const response = await fetchWithRetry(
            `${getRepoUrl()}/commits?per_page=1`,
            { headers }
        );

        const commits = await response.json();
        if (commits && commits.length > 0) {
            const commit = commits[0];
            const files = (commit.files || []).map((f: any) => ({
                filename: f.filename,
                additions: f.additions || 0,
                deletions: f.deletions || 0,
                changes: f.changes || 0,
                status: f.status as CommitFileInfo["status"],
                blob_url: f.blob_url,
            }));
            return {
                sha: commit.sha,
                shortSha: commit.sha.substring(0, 7),
                date: commit.commit.author.date,
                message: commit.commit.message,
                author: commit.commit.author.name,
                totalAdditions: files.reduce((s: number, f: CommitFileInfo) => s + f.additions, 0),
                totalDeletions: files.reduce((s: number, f: CommitFileInfo) => s + f.deletions, 0),
                files,
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching git info:", error);
        return null;
    }
}

export async function getCommitHistory(limit = 100): Promise<CommitInfo[]> {
    try {
        const headers: Record<string, string> = {
            "Accept": "application/vnd.github.v3+json",
        };

        const token = import.meta.env.PUBLIC_GITHUB_TOKEN;
        if (token) {
            headers["Authorization"] = `token ${token}`;
        }

        const listResponse = await fetchWithRetry(
            `${getRepoUrl()}/commits?per_page=${limit}`,
            { headers }
        );

        const list = await listResponse.json();
        const commits = await Promise.all(
            list.map(async (c: any) => {
                // fetch full commit details for file list
                const detailRes = await fetchWithRetry(
                    `${getRepoUrl()}/commits/${c.sha}`,
                    { headers }
                );
                const detail = await detailRes.json();
                const files: CommitFileInfo[] = (detail.files || []).map((f: any) => ({
                    filename: f.filename,
                    additions: f.additions || 0,
                    deletions: f.deletions || 0,
                    changes: f.changes || 0,
                    status: f.status as CommitFileInfo["status"],
                    blob_url: f.blob_url,
                }));
                return {
                    sha: c.sha,
                    shortSha: c.sha.substring(0, 7),
                    date: c.commit.author.date,
                    message: c.commit.message,
                    author: c.commit.author.name,
                    totalAdditions: files.reduce((s: number, f: CommitFileInfo) => s + f.additions, 0),
                    totalDeletions: files.reduce((s: number, f: CommitFileInfo) => s + f.deletions, 0),
                    files,
                };
            })
        );
        return commits;
    } catch (error) {
        console.error("Error fetching commit history:", error);
        return [];
    }
}

/**
 * 格式化相对时间（北京时间）
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return '刚刚';
    }

    const diffInMinute = Math.floor(diffInSeconds / 60);
    if (diffInMinute < 60) {
        return `${diffInMinute} 分钟前`;
    }

    const diffInHour = Math.floor(diffInMinute / 60);
    if (diffInHour < 24) {
        return `${diffInHour} 小时前`;
    }

    const diffInDay = Math.floor(diffInHour / 24);
    if (diffInDay < 30) {
        return `${diffInDay} 天前`;
    }

    const diffInMonth = Math.floor(diffInDay / 30);
    if (diffInMonth < 12) {
        return `${diffInMonth} 个月前`;
    }

    const diffInYear = Math.floor(diffInDay / 365);
    return `${diffInYear} 年前`;
}

/**
 * 格式化绝对日期（UTC 转北京时间）
 */
export function formatDate(dateString: string): string {
    // 解析 UTC 时间并转换为北京时间（+8小时）
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[3]);
        let hour = parseInt(match[4]) + 8; // UTC+8
        let finalDay = day;
        let finalMonth = month;
        let finalYear = year;

        // 处理跨天
        if (hour >= 24) {
            hour -= 24;
            finalDay++;
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            if (finalDay > daysInMonth) {
                finalDay = 1;
                finalMonth++;
                if (finalMonth > 11) {
                    finalMonth = 0;
                    finalYear++;
                }
            }
        }

        return `${finalYear}-${String(finalMonth + 1).padStart(2, '0')}-${String(finalDay).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${match[5]}`;
    }
    // 兜底：使用本地时间
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
}
