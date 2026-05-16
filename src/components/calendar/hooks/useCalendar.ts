/**
 * useCalendar - Custom hooks for Calendar component
 */

/**
 * Get the first day of the month (0-6, where 0 is Monday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
    return (new Date(year, month, 1).getDay() + 6) % 7;
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Generate calendar grid data
 */
export function generateCalendarGrid(
    year: number,
    month: number,
): { day: number; dateKey: string; hasPost: boolean; postCount: number }[] {
    const daysInMonth = getDaysInMonth(year, month);
    const grid: {
        day: number;
        dateKey: string;
        hasPost: boolean;
        postCount: number;
    }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        grid.push({ day, dateKey, hasPost: false, postCount: 0 });
    }

    return grid;
}

/**
 * Check if a date is today
 */
export function isToday(
    year: number,
    month: number,
    day: number,
    todayYear: number,
    todayMonth: number,
    todayDate: number,
): boolean {
    return year === todayYear && month === todayMonth && day === todayDate;
}

/**
 * Format month key for comparison
 */
export function formatMonthKey(year: number, month: number): string {
    return `${year}-${month}`;
}

/**
 * Format date key for comparison
 */
export function formatDateKey(
    year: number,
    month: number,
    day: number,
): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Get posts for a specific date
 */
export function getPostsForDate(
    dateKey: string,
    postDateMap: Record<string, { id: string; title: string; date: string }[]>,
): { id: string; title: string; date: string }[] {
    return postDateMap[dateKey] || [];
}

/**
 * Get posts for a specific month
 */
export function getPostsForMonth(
    monthKey: string,
    postsByMonth: Record<string, { id: string; title: string; date: string }[]>,
): { id: string; title: string; date: string }[] {
    return postsByMonth[monthKey] || [];
}

/**
 * Process posts data and build indexes
 */
export function processPostsData(
    posts: { date: string; id: string; title: string }[],
): {
    postDateMap: Record<string, { id: string; title: string; date: string }[]>;
    postsByMonth: Record<string, { id: string; title: string; date: string }[]>;
    stats: {
        hasPostInYear: Record<string, boolean>;
        hasPostInMonth: Record<string, boolean>;
        minYear: number;
        maxYear: number;
    };
} {
    const postDateMap: Record<
        string,
        { id: string; title: string; date: string }[]
    > = {};
    const postsByMonth: Record<
        string,
        { id: string; title: string; date: string }[]
    > = {};
    const stats = {
        hasPostInYear: {} as Record<string, boolean>,
        hasPostInMonth: {} as Record<string, boolean>,
        minYear: new Date().getFullYear(),
        maxYear: new Date().getFullYear() + 5,
    };

    if (!posts || posts.length === 0) {
        return { postDateMap, postsByMonth, stats };
    }

    posts.forEach((post) => {
        const [yStr, mStr] = post.date.split("-");
        const year = parseInt(yStr);
        const month = parseInt(mStr);
        stats.hasPostInYear[year] = true;
        stats.hasPostInMonth[`${year}-${month}`] = true;
        if (year < stats.minYear) {
            stats.minYear = year;
        }

        const dateKey = post.date;
        const monthKey = `${year}-${month - 1}`;

        if (!postDateMap[dateKey]) {
            postDateMap[dateKey] = [];
        }
        postDateMap[dateKey].push(post);

        if (!postsByMonth[monthKey]) {
            postsByMonth[monthKey] = [];
        }
        postsByMonth[monthKey].push(post);
    });

    return { postDateMap, postsByMonth, stats };
}

/**
 * Get current post ID from URL path
 */
export function getCurrentPostId(
    path: string,
    allPostsData: { id: string; date: string; title: string }[],
): string | null {
    if (!allPostsData || allPostsData.length === 0) {
        return null;
    }
    const decodedPath = decodeURIComponent(path);
    const normalizedPath = decodedPath.endsWith("/")
        ? decodedPath.slice(0, -1)
        : decodedPath;
    const matchedPost = allPostsData.find((post) =>
        normalizedPath.endsWith(`/${post.id}`),
    );
    return matchedPost ? matchedPost.id : null;
}

// Memo storage key for localStorage
const MEMO_STORAGE_KEY = "calendar-memos";

/**
 * Load memos from localStorage
 */
export function loadMemosFromStorage(): import("../types").CalendarMemo[] {
    if (typeof window === "undefined") {
        return [];
    }
    try {
        const stored = localStorage.getItem(MEMO_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error("Failed to load memos from storage:", error);
    }
    return [];
}

/**
 * Save memos to localStorage
 */
export function saveMemosToStorage(
    memos: import("../types").CalendarMemo[],
): void {
    if (typeof window === "undefined") {
        return;
    }
    try {
        localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
    } catch (error) {
        console.error("Failed to save memos to storage:", error);
    }
}

/**
 * Build memo date map from memos array
 */
export function buildMemoDateMap(
    memos: import("../types").CalendarMemo[],
): Record<string, import("../types").CalendarMemo[]> {
    const memoDateMap: Record<string, import("../types").CalendarMemo[]> = {};
    memos.forEach((memo) => {
        if (!memoDateMap[memo.date]) {
            memoDateMap[memo.date] = [];
        }
        memoDateMap[memo.date].push(memo);
    });
    return memoDateMap;
}

/**
 * Generate unique ID for memo
 */
export function generateMemoId(): string {
    return `memo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new memo
 */
export function createMemo(
    content: string,
    date: string,
): import("../types").CalendarMemo {
    const now = Date.now();
    return {
        id: generateMemoId(),
        content: content.trim(),
        date,
        createdAt: now,
        updatedAt: now,
    };
}

/**
 * Update an existing memo
 */
export function updateMemo(
    memos: import("../types").CalendarMemo[],
    memoId: string,
    content: string,
): import("../types").CalendarMemo[] {
    return memos.map((memo) =>
        memo.id === memoId
            ? { ...memo, content: content.trim(), updatedAt: Date.now() }
            : memo,
    );
}

/**
 * Delete a memo
 */
export function deleteMemo(
    memos: import("../types").CalendarMemo[],
    memoId: string,
): import("../types").CalendarMemo[] {
    return memos.filter((memo) => memo.id !== memoId);
}
