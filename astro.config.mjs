// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import rehypeComponents from "rehype-components";

import { admonition } from "./src/plugins/rehype-component-admonition.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { MusicCardComponent } from "./src/plugins/rehype-component-music-card.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { QuoteComponent } from "./src/plugins/rehype-component-quote.mjs";
import { BadgeComponent } from "./src/plugins/rehype-component-badge.mjs";
import { BlogHeaderComponent } from "./src/plugins/rehype-component-blog-header.mjs";
import { ChatComponent } from "./src/plugins/rehype-component-chat.mjs";
import { KeyComponent } from "./src/plugins/rehype-component-key.mjs";
import { LinkBannerComponent } from "./src/plugins/rehype-component-link-banner.mjs";
import { LinkCardComponent } from "./src/plugins/rehype-component-link-card.mjs";
import { PicComponent } from "./src/plugins/rehype-component-pic.mjs";
import { PoetryComponent } from "./src/plugins/rehype-component-poetry.mjs";
import { TabComponent } from "./src/plugins/rehype-component-tab.mjs";
import { TimelineComponent } from "./src/plugins/rehype-component-timeline.mjs";
import { customFigurePlugin } from "./src/plugins/rehype-figure-plugin.mjs";
import { codeBlockHeaderPlugin } from "./src/plugins/rehype-code-block-header.mjs";
import { proseLinkPlugin } from "./src/plugins/rehype-prose-link.mjs";
import { remarkLinkAttributes } from "./src/plugins/remark-link-attributes.mjs";
import { remarkCombined } from "./src/plugins/remark-combined.mjs";
import { remarkTypst } from "./src/plugins/remark-typst.mjs";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { remarkLqip } from "./src/plugins/remark-lqip.js";

import svelte from "@astrojs/svelte";

import { siteConfig } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: "https://momo.motues.top", // Root URL of site
  i18n: {
    locales: ["zh-cn"],
    defaultLocale: "zh-cn",
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    icon({
      include: {
        "fa6-brands": ["*"],
        "fa6-solid": ["*"],
        "simple-icons": ["*"],
        "vscode-icons": ["*"],
        "material-symbols": ["*"],
        solar: ["*"],
        uim: ["*"],
        "streamline-freehand": ["*"],
        "grommet-icons": ["*"],
        flue: ["*"],
      },
    }),
    svelte(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "one-dark-pro",
      },
      wrap: false,
    },
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkDirective,
      remarkTypst,
      parseDirectiveNode,
      remarkLinkAttributes,
      remarkCombined,
      [remarkLqip, { enable: siteConfig.theme.LQIP }],
    ],
    rehypePlugins: [
      rehypeKatex,
      proseLinkPlugin,
      customFigurePlugin,
      codeBlockHeaderPlugin,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            music: MusicCardComponent,
            quote: QuoteComponent,
            badge: BadgeComponent,
            "blog-header": BlogHeaderComponent,
            chat: ChatComponent,
            key: KeyComponent,
            "link-banner": LinkBannerComponent,
            "link-card": LinkCardComponent,
            pic: PicComponent,
            poetry: PoetryComponent,
            tab: TabComponent,
            timeline: TimelineComponent,
            note: admonition("note"),
            tip: admonition("tip"),
            important: admonition("important"),
            caution: admonition("caution"),
            warning: admonition("warning"),
          },
        },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@iconify/svelte"],
    },
  },
});
