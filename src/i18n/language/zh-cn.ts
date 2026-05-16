import type { Translation } from "@i18n/key";

const translation: Translation = {
    header: {
        home: "首页",
        archive: "归档",
        calendar: "日历",
        about: "关于",
        friends: "友链",
        memos: "碎碎念",
        timetable: "课程表",
        guide: "导航",
        musicplayer: "音乐"
    },
    cover: {
        title: {
            home: "欢迎来到克喵的博客",
            archive: "文章归档",
            calendar: "文章日历",
            about: "关于",
            friends: "友链",
            memos: "碎碎念",
            monitor: "友链监测",
            note: "生活小记",
            wiki: "Wiki 文档"
        },
        subTitle: {
            home: "记录一些生活日常、踩坑教程和资源分享",
            archive: "共 {count} 篇文章",
            calendar: "按日期浏览文章",
            about: "我的资料卡~",
            friends: "有趣的灵魂",
            memos: "记录生活的点点滴滴",
            monitor: "实时监控友链可访问性",
            note: "不曾虚度的光",
            wiki: "知识库与文档中心"
        }
    },
    toc: "目录",
    category: "分类",
    pageNavigation: {
        previous: "上一页",
        next: "下一页",
        currentPage: "第 {currentPage} 页，共 {totalPages} 页",
    },
    button: {
        switchDarkMode: "切换明暗模式",
        backToTop: "回到顶部",
        backToBottom: "回到底部",
        meun: "菜单",
        toc: "目录",
        backToComments: "前往评论区",
    },
    search: {
        placeholder: "输入关键词开始搜索",
        noresult: "未找到相关结果",
        error: "搜索出现错误，请稍后重试"
    },
    license: {
        author: "作者",
        license: "许可协议",
        publishon: "发布时间"
    },
    blogNavi: {
        next: "下一篇",
        prev: "上一篇"
    },
    pagecard: {
        words: "字",
        minutes: "分钟",
        uncategorized: "未分类"
    },
    comments: {
        name: "昵称",
        email: "邮箱",
        site: "网站",
        required: "必填",
        optional: "选填",
        welcome: "欢迎评论",
        comments: "条评论",
        cancel: "取消",
        send: "发送",
        sending: "发送中...",
        reply: "回复",
        replyPlaceholder: "写下你的回复...",
        loadMore: "加载更多",
        loading: "正在加载评论...",
        loadFailed: "加载失败",
        submitSuccess: "提交成功",
        submitFailed: "提交失败，请稍后再试",
        fillRequired: "请填写昵称、邮箱和评论内容",
        confirmDelete: "确定要删除这条评论吗？",
        delete: "删除",
        deleteSuccess: "删除成功",
        deleteFailed: "删除失败",
        deleteError: "删除评论失败",
        characters: "字符",
        words: "单词",
        contentTooLong: "评论内容超出限制：不超过2000字或1000单词",
        replyTo: "回复",
        write: "编辑",
        preview: "预览",
        previewError: "Markdown 语法错误",
        codeFence: "代码块标记 ``` 未闭合",
        inlineCode: "行内代码标记 ` 未闭合",
        bold: "粗体",
        italic: "斜体",
        quote: "引用",
        code: "代码",
        link: "链接",
        image: "图片",
        list: "列表",
    },
    langNote: {
        note: "注意：",
        description: "当前页面不支持简体中文，使用默认语言版本"
    },
    draftNote: {
        warning: "草稿警告：",
        description: "此文章为草稿，只出现在测试环境，生产环境将不会显示。"
    },
    page404: {
        title: "404 - 虚无之境",
        subTitle: "看起来你闯入了一片代码荒原，这里还没有被开发出来。",
        backToHome: "返回首页",
        backToPreview: "返回上一页",
        errorCode: "错误代码：404 - 虚无之境",
        notice: "或许你可以尝试："
    },
    themeInfo: {
        light: "切换到 浅色 模式",
        dark: "切换到 深色 模式",
        system: "切换到 跟随系统 模式"
    },
    memoCard: {
        words: "字",
        minutes: "分钟",
        expanded: "展开阅读全文",
        collapsed: "收起内容"
    },
    memoTabs: {
        local: "本地",
        remote: "Memos",
        noData: "暂无数据"
    },
    monitor: {
        loading: "正在加载监控数据...",
        title: "友链监测"
    },
    pagination: {
        prev: "上一页",
        next: "下一页"
    },
    calendar: {
        january: "一月",
        february: "二月",
        march: "三月",
        april: "四月",
        may: "五月",
        june: "六月",
        july: "七月",
        august: "八月",
        september: "九月",
        october: "十月",
        november: "十一月",
        december: "十二月",
        monday: "一",
        tuesday: "二",
        wednesday: "三",
        thursday: "四",
        friday: "五",
        saturday: "六",
        sunday: "日"
    }
}

export default translation;