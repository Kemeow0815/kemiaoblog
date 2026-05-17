import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

const MEMOS_FILE_PATH = path.join(
  process.cwd(),
  "public",
  "calendar",
  "memos.json"
);

interface CalendarMemo {
  id: string;
  content: string;
  date: string;
  createdAt: number;
  updatedAt: number;
}

interface MemosData {
  id: string;
  name: string;
  version: number;
  lastUpdated: number;
  memos: CalendarMemo[];
}

// GET: 获取所有备忘
export const GET: APIRoute = async () => {
  try {
    const data = await fs.readFile(MEMOS_FILE_PATH, "utf-8");
    const memosData: MemosData = JSON.parse(data);
    return new Response(JSON.stringify(memosData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to read memos:", error);
    // 如果文件不存在，返回空数据
    const emptyData: MemosData = {
      id: "calendar-memos",
      name: "日历备忘",
      version: 1,
      lastUpdated: 0,
      memos: [],
    };
    return new Response(JSON.stringify(emptyData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

// POST: 保存所有备忘
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { memos } = body;

    if (!Array.isArray(memos)) {
      return new Response(
        JSON.stringify({ error: "Invalid memos data" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 读取现有数据
    let existingData: MemosData;
    try {
      const data = await fs.readFile(MEMOS_FILE_PATH, "utf-8");
      existingData = JSON.parse(data);
    } catch {
      existingData = {
        id: "calendar-memos",
        name: "日历备忘",
        version: 1,
        lastUpdated: 0,
        memos: [],
      };
    }

    // 更新数据
    const updatedData: MemosData = {
      ...existingData,
      lastUpdated: Date.now(),
      memos,
    };

    // 确保目录存在
    const dir = path.dirname(MEMOS_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });

    // 写入文件
    await fs.writeFile(
      MEMOS_FILE_PATH,
      JSON.stringify(updatedData, null, 2),
      "utf-8"
    );

    return new Response(
      JSON.stringify({ success: true, data: updatedData }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to save memos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save memos" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
