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
    }
];

export const aboutConfig = {
    top_info: {
        avatar: 'https://wsrv.nl/?url=github.com/kemeow0815.png',
        site_name: '克喵爱吃卤面',
        motto: '每一段旅行，都有终点',
        float_text: [
            '🐝 勤劳小蜜蜂',
            '🧱 踏实实在人',
            '👷‍♀️ 努力小天使',
            '🐔 乐观大白鹅',
            '阳光小少年 👱‍♀️',
            '温暖小太阳 ☀️',
            '可爱小白兔 🐰',
            '懒惰小胖猪 🐗'
        ]
    },
    personal_info: {
        name: '克喵爱吃卤面',
        gender: '男',
        address: '陕西西安',
        school: '武汉理工大学',
        grade: '二〇二一级',
        major: '人工智能',
        email: 'kemiaosw@gmail.com',
        QQ: '3162475700',
        birthday: '2003/01/01',
        bottom_img: 'https://p.liiiu.cn/i/2024/04/14/661ab09243659.png'
    },
    personality: {
        type: 'INFJ-T',
        type_name: '主人公',
        svg: 'https://jsd.268682.xyz/gh/zsxcoder/github-img@main/img/infj.avif',
        url: 'https://www.16personalities.com/ch/enfj-%E4%BA%BA%E6%A0%BC'
    },
    description_and_social_links: {
        description: '大家好！这里是喵洛阁。为什么叫喵洛阁呢？因为喵是我的昵称，而洛阁代表着温暖的小窝，这与我的性格不谋而合。我是一个充满热情、富有同情心的人，喜欢与人交流，乐于分享我的想法和见解。在这里，我会分享我的生活点滴、兴趣爱好以及对世界的观察和思考。希望我的小站能给大家带来一些启发和乐趣。',
        social_links: [
            {
                platform: 'GitHub',
                url: 'https://github.com/kemiaosw',
                icon: 'https://p.liiiu.cn/i/2024/07/27/66a461a3098aa.webp'
            },
            {
                platform: 'Gitee',
                url: 'https://gitee.com/kemiaosw',
                icon: 'https://p.liiiu.cn/i/2024/07/27/66a461c3dea80.webp'
            },
            {
                platform: 'QQ',
                url: 'https://qm.qq.com/cgi-bin/qm_share/open_source_page?uin=3162475700&jump_from=webapi',
                icon: 'https://p.liiiu.cn/i/2024/07/27/66a461b627dc2.webp'
            }
        ]
    },
    skills: {
        technical: [
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/633005bf0fd1e.jpg',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/63300647df7fa.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/63300647e1f10.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/26/6330ff27e5c9b.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/63300647dea51.png',
            'https://img02.anheyu.com/adminuploads/1/2023/05/09/645a45854e093.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/633001374747b.png'
        ],
        general: [
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/633006cc55e07.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/633006eee047b.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/633006f9ab27d.png',
            'https://img02.anheyu.com/adminuploads/1/2023/04/11/6434a635e9726.webp',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/633007087a4dc.webp',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/633005bf0fd1e.jpg',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/63300647df7fa.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/25/63300647e1f10.png',
            'https://img02.anheyu.com/adminuploads/1/2022/09/26/6330ff27e5c9b.png'
        ],
        learning: '正在持续学习中'
    },
    projects: [
        {
            name: 'Friend-Circle-lite',
            description: '轻量化友链朋友圈',
            url: 'https://github.com/kemiaosw/Friend-Circle-Lite'
        },
        {
            name: 'Momo Blog',
            description: '基于 Astro 的极简博客主题',
            url: 'https://github.com/kemiaosw/Momo'
        }
    ],
    hobbies: ['阅读', '写作', '编程', '摄影'],
    self_evaluation: {
        thoughts: '思想上乐观开朗，乐于助人，具有团队协作精神及创新意识。',
        work: '工作上极富责任心与信念感，对待工作认真负责，有较强的组织管理及动手能力。',
        summary: '人嘎嘎好！'
    }
};
