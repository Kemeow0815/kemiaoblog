import type {
    SiteConfig,
    ProfileConfig,
    LicenseConfig
} from "./types/config"

// import type { FriendLink } from "./types/friend"

export const siteConfig: SiteConfig = {
    title: "喵洛阁",
    subTitle: "KeMiao - Blog",

    favicon: "/favicon/favicon.ico", // 网站图标路径，相对于 /public 目录

    pageSize: 6, // 每页显示的文章数量
    toc: {
        enable: true,
        depth: 3 // 目录最大深度，范围在 1 到 4 之间
    },
    blogNavi: {
        enable: true // 是否在博客页脚启用博客导航
    },
    comments: {
        enable: true, // 是否启用评论
        platform: "default", // 评论平台，设置为 "default" 使用 Momo 后端，也支持 "twikoo"
        backendUrl: "https://momo-blog-comment.268682.xyz" // 评论后端 URL
    },
    theme: {
        AOS: true, // Whether to enable AOS (Animate On Scroll) for animations
        LQIP: true, // Whether to enable LQIP (Low-Quality Image Placeholder) for image placeholders
        PhotoSwipe: true // Whether to enable PhotoSwipe for image viewer
    }
}

// 友链监控配置
export const monitorConfig = {
    enable: true, // 是否启用友链监控页面
    apiUrl: "https://blog-link-monitor.268682.xyz", // 监控数据 API 地址
    pageTitle: "友链监测", // 页面标题
    pageSubTitle: "实时监控友链可访问性" // 页面副标题
}

export const profileConfig: ProfileConfig = {
    avatar: "assets/kemiaosw.png", // 相对于 /src 目录。如果以 '/' 开头则相对于 /public 目录
    name: "克喵爱吃卤面",
    description: "每一段旅行，都有终点",
    indexPage: "https://www.kemiaosw.top",
    startYear: 2024,
}

export const licenseConfig: LicenseConfig = {
    enable: true,
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// 友链配置 - 如使用外链数据源可注释掉此配置
// export const friendLinkConfig: FriendLink[] = [
//     {
//         name: 'Motues',
//         avatar: 'https://www.motues.top/avatar.jpg',
//         url: 'https://www.motues.top',
//         description: 'Like River!'
//     },
//     {
//         name: 'Astro',
//         avatar: 'https://avatars.githubusercontent.com/u/44914786',
//         url: 'https://astro.build',
//         description: 'Build fast websites, faster.'
//     }
//     // 在这里添加更多友链
// ]

// 导航指南配置
export interface GuideItem {
    title: string;
    description: string;
    href: string;
    icon: string;
    order?: number;
}

export const guideConfig: GuideItem[] = [
    {
        title: "课程表",
        description: "查看我的课程安排",
        href: "/timetable/",
        icon: "material-symbols:calendar-month-outline",
        order: 1
    },
    {
        title: "赞助支持",
        description: "感谢每一份支持",
        href: "/reward/",
        icon: "material-symbols:favorite-outline",
        order: 2
    },
    {
        title: "即刻短文",
        description: "查看我的所有即刻短文",
        href: "/memos/",
        icon: "solar:notes-bold-duotone",
        order: 3
    },
    {
        title: "关于我",
        description: "了解更多关于我的信息",
        href: "/about/",
        icon: "material-symbols:person-outline",
        order: 4
    },
    {
        title: "友链",
        description: "我的朋友们",
        href: "/friends/",
        icon: "material-symbols:link",
        order: 5
    },
    {
        title: "朋友圈",
        description: "查看我的朋友圈",
        href: "/fcircle/",
        icon: "grommet-icons:group",
        order: 6
    },
    {
        title: "画廊",
        description: "查看我的画廊图片",
        href: "/albums/",
        icon: "material-symbols:image",
        order: 7
    },
    {
        title: "装备",
        description: "查看我的设备清单",
        href: "/devices/",
        icon: "material-symbols:devices",
        order: 8
    },
    {
        title: "代码片段",
        description: "查看常用代码片段",
        href: "/snippets/",
        icon: "material-symbols:code",
        order: 9
    },
    {
        title: "生活小记",
        description: "记录生活的点滴瞬间",
        href: "/note/",
        icon: "material-symbols:note-alt",
        order: 10
    },
    {
        title: "Wiki 文档",
        description: "知识库与文档中心",
        href: "/wiki/",
        icon: "material-symbols:menu-book",
        order: 11
    },
    {
        title: "友链检测",
        description: "查看友链状态",
        href: "/monitor/",
        icon: "material-symbols:monitor-heart-outline",
        order: 12
    }
];

export const aboutConfig = {
    top_info: {
        avatar: 'https://imgbed.268682.xyz/v2/RyW4Ui8.gif',
        site_name: '克喵爱吃卤面',
        motto: '每一段旅行，都有终点',
        float_text: [
            '博客写作者',
            '主题魔改者',
            'Windows 11',
            'Android 16',
            '网络不说话',
            '小说爱好者',
            '平时爱摸鱼',
            'RSS爱好者',
        ]
    },
    personal_info: {
        name: 'MCY',
        gender: '男',
        address: '江苏苏州',
        school: '南京工业职业技术大学',
        grade: '二〇二三级',
        major: '自动化技术与应用',
        email: 'mcy@kemiaosw.top',
        QQ: '3813596020',
        birthday: '2005/08/17',
        bottom_img: 'https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/bg.webp'
    },
    personality: {
        type: 'INFJ-T',
        type_name: '提倡者',
        svg: 'https://jsd.268682.xyz/gh/zsxcoder/github-img@main/img/infj.avif',
        url: 'https://www.16personalities.com/infj-personality'
    },
    description_and_social_links: {
        description: '大家好！这里是克喵爱吃卤面的小站。为什么叫克喵爱吃卤面呢？「克喵」来自小说《诡秘之主》的主角，「卤面」来自《宿命之环》主角卢米安·李。你可以称呼我克喵。目前在南京就学，博客是兴趣使然，没什么技术，只会CTRL CV。不常聊天，网上找我的，我会回，但是一般不会聊久，见谅。最后，欢迎您来到我的主页！',
        social_links: [
            {
                platform: 'GitHub',
                url: 'https://github.com/Kemeow0815',
                icon: 'https://cdn.jsdmirror.com/gh/yxksw/icons@main/socials/github.svg'
            },
            {
                platform: 'Telegram',
                url: 'https://t.me/Kemeow0815',
                icon: 'https://cdn.jsdmirror.com/gh/yxksw/icons@main/socials/telegram.svg'
            },
            {
                platform: 'QQ',
                url: 'https://qm.qq.com/q/FLRZlmsESI',
                icon: 'https://cdn.jsdmirror.com/gh/yxksw/icons@main/socials/qq.svg'
            },
            {
                platform: 'Mail',
                url: 'mailto:mcy@kemiaosw.top',
                icon: 'https://cdn.jsdmirror.com/gh/yxksw/icons@main/socials/mail.svg'
            },
            {
                platform: 'BiliBili',
                url: 'https://space.bilibili.com/3546643173477234',
                icon: 'https://cdn.jsdmirror.com/gh/yxksw/icons@main/socials/bilibili.svg'
            },
        ]
    },
    skills: {
        technical: [
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/astro.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/css.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/git.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/html.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/js.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/markdown.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/ts.svg',
        ],
        general: [
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/nextjs.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/node.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/nuxt.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/php.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/vite.svg',
            'https://jsd.268682.xyz/gh/yxksw/icons@main/skills/vue.svg',
        ],
        learning: '正在持续学习中'
    },
    projects: [
        { name: 'miaoluoge-links', description: '我的友链屋', url: 'https://github.com/Kemeow0815/miaoluoge-links' },
        {
            name: 'Ke Miao Blog',
            description: '基于 Astro 的极简博客主题自改',
            url: 'https://github.com/kemiaosw/kemiaoblog'
        }
    ],
    hobbies: ['阅读', '写作', '编程', '小说'],
    self_evaluation: {
        thoughts: '思想上乐观开朗，乐于助人，具有团队协作精神及创新意识。',
        work: '工作上极富责任心与信念感，对待工作认真负责，有较强的组织管理及动手能力。',
        summary: '人嘎嘎好！'
    }
};
