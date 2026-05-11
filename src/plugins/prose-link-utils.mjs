/**
 * ProseLink 工具函数
 * 用于处理 Markdown 链接的域名图标映射和外部链接处理
 * 参考自 blog-v3/shared/utils/icon.ts
 */

/**
 * 主域名图标映射
 * 当专门域名未匹配时使用
 */
const mainDomainIcons = {
  'bilibili.com': 'ri:bilibili-fill',
  'creativecommons.org': 'ri:creative-commons-line',
  'feishu.cn': 'icon-park-outline:new-lark',
  'github.com': 'ri:github-fill',
  'github.io': 'ri:github-fill',
  'google.cn': 'ri:google-fill',
  'google.com': 'ri:google-fill',
  'jd.com': 'arcticons:jd-sports',
  'larkoffice.com': 'icon-park-outline:new-lark',
  'microsoft.com': 'ri:microsoft-fill',
  'netlify.app': 'simple-icons:netlify',
  'pages.dev': 'simple-icons:cloudflare',
  'qq.com': 'ri:qq-fill',
  'taobao.com': 'ri:taobao-fill',
  'thisis.host': 'tabler:star-filled',
  'tmall.com': 'ri:taobao-fill',
  'v2ex.com': 'simple-icons:v2ex',
  'vercel.app': 'simple-icons:vercel',
  'zabaur.app': 'tabler:square-letter-z-filled',
  'zhihu.com': 'ri:zhihu-line',
  'csdn.net': 'simple-icons:csdn',
  'juejin.cn': 'simple-icons:juejin',
  'weibo.com': 'ri:weibo-fill',
  'twitter.com': 'ri:twitter-x-fill',
  'x.com': 'ri:twitter-x-fill',
  'youtube.com': 'ri:youtube-fill',
  'npmjs.com': 'simple-icons:npm',
  'stackoverflow.com': 'simple-icons:stackoverflow',
  'gitee.com': 'simple-icons:gitee',
  'jianshu.com': 'simple-icons:jianshu',
  'douban.com': 'simple-icons:douban',
  't.me': 'simple-icons:telegram',
  'discord.com': 'simple-icons:discord',
  'figma.com': 'simple-icons:figma',
  'notion.so': 'simple-icons:notion',
  'wikipedia.org': 'simple-icons:wikipedia',
  'reddit.com': 'simple-icons:reddit',
  'instagram.com': 'ri:instagram-fill',
  'facebook.com': 'ri:facebook-fill',
  'linkedin.com': 'ri:linkedin-fill',
  'twitch.tv': 'simple-icons:twitch',
  'tiktok.com': 'simple-icons:tiktok',
  'spotify.com': 'simple-icons:spotify',
  'apple.com': 'simple-icons:apple',
  'android.com': 'simple-icons:android',
  'linux.org': 'simple-icons:linux',
  'ubuntu.com': 'simple-icons:ubuntu',
  'debian.org': 'simple-icons:debian',
  'archlinux.org': 'simple-icons:archlinux',
  'docker.com': 'simple-icons:docker',
  'kubernetes.io': 'simple-icons:kubernetes',
  'aws.amazon.com': 'simple-icons:amazonaws',
  'azure.microsoft.com': 'simple-icons:microsoftazure',
  'cloud.google.com': 'simple-icons:googlecloud',
  'aliyun.com': 'simple-icons:alibabadotcom',
  'tencent.com': 'simple-icons:tencentqq',
  'baidu.com': 'simple-icons:baidu',
  'sogou.com': 'simple-icons:sogou',
  'bing.com': 'simple-icons:bing',
  'duckduckgo.com': 'simple-icons:duckduckgo',
  'mozilla.org': 'simple-icons:mozilla',
  'firefox.com': 'simple-icons:firefox',
  'chrome.google.com': 'simple-icons:googlechrome',
  'safari.com': 'simple-icons:safari',
  'edge.microsoft.com': 'simple-icons:microsoftedge',
  'vscode.dev': 'simple-icons:visualstudiocode',
  'jetbrains.com': 'simple-icons:jetbrains',
  'vim.org': 'simple-icons:vim',
  'neovim.io': 'simple-icons:neovim',
  'emacs.org': 'simple-icons:gnuemacs',
  'sublimetext.com': 'simple-icons:sublimetext',
  'atom.io': 'simple-icons:atom',
  'codepen.io': 'simple-icons:codepen',
  'codesandbox.io': 'simple-icons:codesandbox',
  'replit.com': 'simple-icons:replit',
  'glitch.com': 'simple-icons:glitch',
  'stackblitz.com': 'simple-icons:stackblitz',
  'gitpod.io': 'simple-icons:gitpod',
  'github.dev': 'ri:github-fill',
  'gitlab.com': 'simple-icons:gitlab',
  'bitbucket.org': 'simple-icons:bitbucket',
  'sourceforge.net': 'simple-icons:sourceforge',
  'apache.org': 'simple-icons:apache',
  'nginx.org': 'simple-icons:nginx',
  'mysql.com': 'simple-icons:mysql',
  'postgresql.org': 'simple-icons:postgresql',
  'mongodb.com': 'simple-icons:mongodb',
  'redis.io': 'simple-icons:redis',
  'elastic.co': 'simple-icons:elastic',
  'grafana.com': 'simple-icons:grafana',
  'prometheus.io': 'simple-icons:prometheus',
  'jenkins.io': 'simple-icons:jenkins',
  'travis-ci.org': 'simple-icons:travisci',
  'circleci.com': 'simple-icons:circleci',
  'appveyor.com': 'simple-icons:appveyor',
  'codecov.io': 'simple-icons:codecov',
  'coveralls.io': 'simple-icons:coveralls',
  'snyk.io': 'simple-icons:snyk',
  'dependabot.com': 'simple-icons:dependabot',
  'greenkeeper.io': 'simple-icons:greenkeeper',
  'renovatebot.com': 'simple-icons:renovate',
  'prettier.io': 'simple-icons:prettier',
  'eslint.org': 'simple-icons:eslint',
  'stylelint.io': 'simple-icons:stylelint',
  'commitlint.js.org': 'simple-icons:commitlint',
  'husky.netlify.app': 'simple-icons:husky',
  'lint-staged.com': 'simple-icons:lintstaged',
  'commitizen.github.io': 'simple-icons:commitizen',
  'semantic-release.gitbook.io': 'simple-icons:semanticrelease',
  'standardjs.com': 'simple-icons:standardjs',
  'airbnb.io': 'simple-icons:airbnb',
  'google.github.io': 'ri:google-fill',
  'facebook.github.io': 'ri:facebook-fill',
  'microsoft.github.io': 'ri:microsoft-fill',
  'vercel.com': 'simple-icons:vercel',
  'netlify.com': 'simple-icons:netlify',
  'cloudflare.com': 'simple-icons:cloudflare',
  'heroku.com': 'simple-icons:heroku',
  'railway.app': 'simple-icons:railway',
  'render.com': 'simple-icons:render',
  'fly.io': 'simple-icons:flydotio',
  'deno.com': 'simple-icons:deno',
  'bun.sh': 'simple-icons:bun',
  'nodejs.org': 'simple-icons:nodedotjs',
  'npmjs.org': 'simple-icons:npm',
  'yarnpkg.com': 'simple-icons:yarn',
  'pnpm.io': 'simple-icons:pnpm',
  'astro.build': 'simple-icons:astro',
  'nextjs.org': 'simple-icons:nextdotjs',
  'nuxt.com': 'simple-icons:nuxt',
  'svelte.dev': 'simple-icons:svelte',
  'vuejs.org': 'uim:vuejs',
  'react.dev': 'simple-icons:react',
  'angular.io': 'simple-icons:angular',
  'emberjs.com': 'simple-icons:emberdotjs',
  'preactjs.com': 'simple-icons:preact',
  'solidjs.com': 'simple-icons:solid',
  'qwik.builder.io': 'simple-icons:qwik',
  'alpinejs.dev': 'simple-icons:alpinedotjs',
  'htmx.org': 'simple-icons:htmx',
  'jquery.com': 'simple-icons:jquery',
  'lodash.com': 'simple-icons:lodash',
  'momentjs.com': 'simple-icons:momentjs',
  'date-fns.org': 'simple-icons:datefns',
  'day.js.org': 'simple-icons:dayjs',
  'axios-http.com': 'simple-icons:axios',
  'tailwindcss.com': 'simple-icons:tailwindcss',
  'windicss.org': 'simple-icons:windicss',
  'unocss.dev': 'simple-icons:unocss',
  'sass-lang.com': 'simple-icons:sass',
  'lesscss.org': 'simple-icons:less',
  'stylus-lang.com': 'simple-icons:stylus',
  'postcss.org': 'simple-icons:postcss',
  'autoprefixer.github.io': 'simple-icons:autoprefixer',
  'cssnano.co': 'simple-icons:cssnano',
  'purgecss.com': 'simple-icons:purgecss',
  'tailwindui.com': 'simple-icons:tailwindcss',
  'headlessui.com': 'simple-icons:headlessui',
  'radix-ui.com': 'simple-icons:radixui',
  'shadcn.com': 'simple-icons:shadcnui',
  'chakra-ui.com': 'simple-icons:chakraui',
  'mantine.dev': 'simple-icons:mantine',
  'ant.design': 'simple-icons:antdesign',
  'material-ui.com': 'simple-icons:mui',
  'vuetifyjs.com': 'simple-icons:vuetify',
  'element-plus.org': 'simple-icons:element',
  'arco.design': 'simple-icons:arco',
  'naiveui.com': 'simple-icons:naiveui',
  'quasar.dev': 'simple-icons:quasar',
  'primevue.org': 'simple-icons:primevue',
  'primefaces.org': 'simple-icons:primefaces',
  'primereact.org': 'simple-icons:primereact',
  'storybook.js.org': 'simple-icons:storybook',
  'chromatic.com': 'simple-icons:chromatic',
  'sketch.com': 'simple-icons:sketch',
  'adobe.com': 'simple-icons:adobe',
  'canva.com': 'simple-icons:canva',
  'dribbble.com': 'simple-icons:dribbble',
  'behance.net': 'simple-icons:behance',
  'deviantart.com': 'simple-icons:deviantart',
  'artstation.com': 'simple-icons:artstation',
  'unsplash.com': 'simple-icons:unsplash',
  'pexels.com': 'simple-icons:pexels',
  'pixabay.com': 'simple-icons:pixabay',
  'freepik.com': 'simple-icons:freepik',
  'flaticon.com': 'simple-icons:flaticon',
  'iconfinder.com': 'simple-icons:iconfinder',
  'simpleicons.org': 'simple-icons:simpleicons',
  'heroicons.com': 'simple-icons:heroicons',
  'lucide.dev': 'simple-icons:lucide',
  'phosphoricons.com': 'simple-icons:phosphoricons',
  'tabler-icons.io': 'simple-icons:tablericons',
  'fontawesome.com': 'simple-icons:fontawesome',
  'iconify.design': 'simple-icons:iconify',
  'svgrepo.com': 'simple-icons:svgrepo',
  'undraw.co': 'simple-icons:undraw',
  'humaaans.com': 'simple-icons:humaaans',
  'blush.design': 'simple-icons:blush',
  'openpeeps.com': 'simple-icons:openpeeps',
  'opendoodles.com': 'simple-icons:opendoodles',
  'openillustrations.com': 'simple-icons:openillustrations',
  'storyset.com': 'simple-icons:storyset',
  'freeillustrations.xyz': 'simple-icons:freeillustrations',
  'illlustrations.co': 'simple-icons:illlustrations',
  'iradesign.io': 'simple-icons:iradesign',
  'drawkit.io': 'simple-icons:drawkit',
  'icons8.com': 'simple-icons:icons8',
  'iconscout.com': 'simple-icons:iconscout',
  'nounproject.com': 'simple-icons:nounproject',
  'thenounproject.com': 'simple-icons:nounproject',
  'feathericons.com': 'simple-icons:feather',
  'octicons.github.com': 'simple-icons:octicons',
  'carbon-icons.com': 'simple-icons:carbon',
  'zondicons.com': 'simple-icons:zondicons',
  'evaicons.com': 'simple-icons:eva',
  'ionicons.com': 'simple-icons:ionicons',
  'material.io': 'simple-icons:materialdesign',
  'mui.com': 'simple-icons:mui',
  'bootstrap-vue.org': 'simple-icons:bootstrap',
  'bootstrap-table.com': 'simple-icons:bootstrap',
  'getbootstrap.com': 'simple-icons:bootstrap',
  'bulma.io': 'simple-icons:bulma',
  'foundation.zurb.com': 'simple-icons:foundation',
  'semantic-ui.com': 'simple-icons:semanticui',
  'purecss.io': 'simple-icons:purescript',
  'skeleton.dev': 'simple-icons:skeleton',
  'picocss.com': 'simple-icons:pico',
  'watercss.netlify.app': 'simple-icons:water',
  'mvp.css': 'simple-icons:mvp',
  'newcss.net': 'simple-icons:newcss',
  'latex.now.sh': 'simple-icons:latex',
  'latex-project.org': 'simple-icons:latex',
  'overleaf.com': 'simple-icons:overleaf',
  'sharelatex.com': 'simple-icons:sharelatex',
  'mathjax.org': 'simple-icons:mathjax',
  'katex.org': 'simple-icons:katex',
  'mermaid-js.github.io': 'simple-icons:mermaid',
  'plantuml.com': 'simple-icons:plantuml',
  'draw.io': 'simple-icons:diagramsdotnet',
  'excalidraw.com': 'simple-icons:excalidraw',
  'tldraw.com': 'simple-icons:tldraw',
  'whimsical.com': 'simple-icons:whimsical',
  'miro.com': 'simple-icons:miro',
  'lucidchart.com': 'simple-icons:lucidchart',
  'creately.com': 'simple-icons:creately',
  'diagrams.net': 'simple-icons:diagramsdotnet',
  'graphviz.org': 'simple-icons:graphviz',
  'd3js.org': 'simple-icons:d3dotjs',
  'chartjs.org': 'simple-icons:chartdotjs',
  'echarts.apache.org': 'simple-icons:apacheecharts',
  'antv.vision': 'simple-icons:antv',
  'highcharts.com': 'simple-icons:highcharts',
  'plotly.com': 'simple-icons:plotly',
  'bokeh.org': 'simple-icons:bokeh',
  'matplotlib.org': 'simple-icons:matplotlib',
  'seaborn.pydata.org': 'simple-icons:seaborn',
  'pandas.pydata.org': 'simple-icons:pandas',
  'numpy.org': 'simple-icons:numpy',
  'scipy.org': 'simple-icons:scipy',
  'scikit-learn.org': 'simple-icons:scikitlearn',
  'tensorflow.org': 'simple-icons:tensorflow',
  'pytorch.org': 'simple-icons:pytorch',
  'keras.io': 'simple-icons:keras',
  'jax.readthedocs.io': 'simple-icons:jax',
  'huggingface.co': 'simple-icons:huggingface',
  'openai.com': 'simple-icons:openai',
  'anthropic.com': 'simple-icons:anthropic',
  'claude.ai': 'simple-icons:anthropic',
  'gemini.google.com': 'simple-icons:googlegemini',
  'bard.google.com': 'simple-icons:googlebard',
  'copilot.microsoft.com': 'simple-icons:microsoftcopilot',
  'chatgpt.com': 'simple-icons:openai',
  'platform.openai.com': 'simple-icons:openai',
  'ai.google.dev': 'simple-icons:google',
  'vertexai.google.com': 'simple-icons:googlecloud',
  'sagemaker.aws': 'simple-icons:amazonsagemaker',
  'tencentcloud.com': 'simple-icons:tencentcloud',
  'huaweicloud.com': 'simple-icons:huawei',
  'baiducloud.com': 'simple-icons:baidu',
  'volcengine.com': 'simple-icons:bytedance',
  'doubao.com': 'simple-icons:bytedance',
  'coze.cn': 'simple-icons:coze',
  'dify.ai': 'simple-icons:dify',
  'langchain.com': 'simple-icons:langchain',
  'langchain-ai.com': 'simple-icons:langchain',
  'llamaindex.ai': 'simple-icons:llamaindex',
  'pinecone.io': 'simple-icons:pinecone',
  'weaviate.io': 'simple-icons:weaviate',
  'chroma.com': 'simple-icons:chroma',
  'qdrant.tech': 'simple-icons:qdrant',
  'milvus.io': 'simple-icons:milvus',
  'faiss.ai': 'simple-icons:faiss',
  'annoy.ml': 'simple-icons:annoy',
  'hnswlib.com': 'simple-icons:hnswlib',
  'memcached.org': 'simple-icons:memcached',
  'rabbitmq.com': 'simple-icons:rabbitmq',
  'kafka.apache.org': 'simple-icons:apachekafka',
  'pulsar.apache.org': 'simple-icons:apachepulsar',
  'rocketmq.apache.org': 'simple-icons:apacherocketmq',
  'nats.io': 'simple-icons:nats',
  'nsq.io': 'simple-icons:nsq',
  'zeromq.org': 'simple-icons:zeromq',
  'grpc.io': 'simple-icons:grpc',
  'protobuf.dev': 'simple-icons:protocolbuffers',
  'thrift.apache.org': 'simple-icons:apachethrift',
  'avro.apache.org': 'simple-icons:apacheavro',
  'parquet.apache.org': 'simple-icons:apacheparquet',
  'arrow.apache.org': 'simple-icons:apachearrow',
  'spark.apache.org': 'simple-icons:apachespark',
  'hadoop.apache.org': 'simple-icons:apachehadoop',
  'hive.apache.org': 'simple-icons:apachehive',
  'flink.apache.org': 'simple-icons:apacheflink',
  'storm.apache.org': 'simple-icons:apachestorm',
  'beam.apache.org': 'simple-icons:apachebeam',
  'airflow.apache.org': 'simple-icons:apacheairflow',
  'druid.apache.org': 'simple-icons:apachedruid',
  'pinot.apache.org': 'simple-icons:apachepinot',
  'kylin.apache.org': 'simple-icons:apachekylin',
  'carbondata.apache.org': 'simple-icons:apachecarbondata',
  'iceberg.apache.org': 'simple-icons:apacheiceberg',
  'hudi.apache.org': 'simple-icons:apachehudi',
  'delta.io': 'simple-icons:delta',
  'trino.io': 'simple-icons:trino',
  'prestodb.io': 'simple-icons:presto',
  'dremio.com': 'simple-icons:dremio',
  'starrocks.io': 'simple-icons:starrocks',
  'doris.apache.org': 'simple-icons:apachedoris',
  'clickhouse.com': 'simple-icons:clickhouse',
  'tidb.io': 'simple-icons:pingcap',
  'oceanbase.com': 'simple-icons:oceanbase',
  'polardb.aliyun.com': 'simple-icons:alibabadotcom',
  'rds.amazonaws.com': 'simple-icons:amazonaws',
  'cloudsql.google.com': 'simple-icons:googlecloud',
  'supabase.com': 'simple-icons:supabase',
  'firebase.google.com': 'simple-icons:firebase',
  'appwrite.io': 'simple-icons:appwrite',
  'pocketbase.io': 'simple-icons:pocketbase',
  'directus.io': 'simple-icons:directus',
  'strapi.io': 'simple-icons:strapi',
  'sanity.io': 'simple-icons:sanity',
  'contentful.com': 'simple-icons:contentful',
  'prismic.io': 'simple-icons:prismic',
  'storyblok.com': 'simple-icons:storyblok',
  'buttercms.com': 'simple-icons:buttercms',
  'cosmicjs.com': 'simple-icons:cosmic',
  'graphcms.com': 'simple-icons:graphcms',
  'hygraph.com': 'simple-icons:hygraph',
};

/**
 * 专门域名图标映射
 * 优先级高于主域名图标
 */
const domainIcons = {
  'developer.mozilla.org': 'simple-icons:mdnwebdocs',
  'mp.weixin.qq.com': 'ri:wechat-fill',
  'learn.microsoft.com': 'ri:microsoft-fill',
};

/**
 * 从 URL 中提取完整域名
 * @param {string} url - URL 字符串
 * @returns {string} - 域名
 */
export function getDomain(url) {
  if (!url) return '';
  try {
    // 处理相对路径
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('.')) {
      return '';
    }
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * 从 URL 中提取主域名
 * @param {string} url - URL 字符串
 * @param {boolean} keepSubdomain - 是否保留子域名
 * @returns {string} - 主域名
 */
export function getMainDomain(url, keepSubdomain = false) {
  const domain = getDomain(url);
  if (!domain) return '';
  
  if (keepSubdomain) {
    return domain;
  }
  
  // 提取主域名（例如：www.example.com -> example.com）
  const parts = domain.split('.');
  if (parts.length <= 2) return domain;
  
  // 处理特殊域名（如 .co.uk）
  const specialTlds = ['co.uk', 'com.cn', 'org.cn', 'net.cn', 'gov.cn', 'com.hk', 'org.hk'];
  const lastTwo = parts.slice(-2).join('.');
  const lastThree = parts.slice(-3).join('.');
  
  if (specialTlds.includes(lastTwo)) {
    return parts.slice(-3).join('.');
  }
  
  return lastTwo;
}

/**
 * 根据 URL 获取对应的图标
 * @param {string} url - URL 字符串
 * @returns {string|null} - 图标名称或 null
 */
export function getDomainIcon(url) {
  if (!url) return null;
  
  const domain = getDomain(url);
  if (!domain) return null;
  
  // 优先检查专门域名映射
  if (domainIcons[domain]) {
    return domainIcons[domain];
  }
  
  // 检查主域名映射（不保留子域名，获取根域名）
  const mainDomain = getMainDomain(url, false);
  if (mainDomainIcons[mainDomain]) {
    return mainDomainIcons[mainDomain];
  }
  
  return null;
}

/**
 * 判断是否为外部链接
 * @param {string} url - URL 字符串
 * @returns {boolean} - 是否为外部链接
 */
export function isExtLink(url) {
  if (!url) return false;
  
  // 相对路径不是外部链接
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('.') || url.startsWith('?')) {
    return false;
  }
  
  // 检查是否为当前站点的链接
  try {
    const urlObj = new URL(url);
    // 这里可以添加当前站点的域名检查
    // 暂时认为所有绝对路径都是外部链接
    return true;
  } catch {
    return false;
  }
}

/**
 * 安全解码 URI 组件
 * @param {string} str - 需要解码的字符串
 * @returns {string} - 解码后的字符串
 */
export function safelyDecodeUriComponent(str) {
  if (!str) return '';
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
