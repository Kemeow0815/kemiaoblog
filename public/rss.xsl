<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:content="http://purl.org/rss/1.0/modules/content/"
                xmlns:atom="http://www.w3.org/2005/Atom"
                xmlns:media="http://search.yahoo.com/mrss/">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="rss/channel/title"/> - RSS 订阅</title>
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico"/>
        <style><![CDATA[
          :root {
            --bg-primary: #faf9f7;
            --bg-secondary: #f5f3ef;
            --bg-card: #ffffff;
            --text-primary: #2c2c2c;
            --text-secondary: #5a5a5a;
            --text-muted: #8a8a8a;
            --accent: #c9a87c;
            --accent-hover: #b8956a;
            --accent-light: #f5efe8;
            --border: #e8e4df;
            --border-light: #f0ede8;
            --shadow: rgba(0, 0, 0, 0.06);
            --shadow-lg: rgba(0, 0, 0, 0.1);
            --radius: 16px;
            --radius-sm: 10px;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-primary: #1a1a1a;
              --bg-secondary: #242424;
              --bg-card: #2d2d2d;
              --text-primary: #f0f0f0;
              --text-secondary: #b0b0b0;
              --text-muted: #808080;
              --accent: #d4b896;
              --accent-hover: #e0c8a8;
              --accent-light: #3d352e;
              --border: #404040;
              --border-light: #353535;
              --shadow: rgba(0, 0, 0, 0.3);
              --shadow-lg: rgba(0, 0, 0, 0.4);
            }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.7;
            min-height: 100vh;
            padding: 48px 24px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
          }

          .header {
            margin-bottom: 40px;
            padding-bottom: 32px;
            border-bottom: 1px solid var(--border);
          }

          .feed-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: var(--accent-light);
            color: var(--accent);
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
          }

          .feed-badge::before {
            content: '';
            width: 6px;
            height: 6px;
            background: var(--accent);
            border-radius: 50%;
          }

          .header-title {
            font-family: Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif;
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text-primary);
            letter-spacing: -0.5px;
          }

          .header-desc {
            color: var(--text-secondary);
            font-size: 1rem;
            margin-bottom: 24px;
            line-height: 1.6;
          }

          .header-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }

          .meta-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 24px;
            font-size: 0.875rem;
            color: var(--text-secondary);
            transition: all 0.2s ease;
          }

          .meta-tag:hover {
            border-color: var(--accent);
            color: var(--accent);
          }

          .subscribe-section {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 28px;
            margin-bottom: 40px;
            box-shadow: 0 2px 12px var(--shadow);
          }

          .subscribe-title {
            font-family: Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-primary);
          }

          .subscribe-desc {
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-bottom: 20px;
            line-height: 1.7;
          }

          .reader-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .reader-btn {
            display: inline-flex;
            align-items: center;
            padding: 10px 18px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 0.875rem;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .reader-btn:hover {
            background: var(--accent-light);
            border-color: var(--accent);
            color: var(--accent);
            transform: translateY(-1px);
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .section-title {
            font-family: Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
          }

          .section-note {
            font-size: 0.8rem;
            color: var(--text-muted);
          }

          .articles {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .article-card {
            display: flex;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            overflow: hidden;
            transition: all 0.25s ease;
          }

          .article-card:hover {
            border-color: var(--accent);
            box-shadow: 0 4px 20px var(--shadow-lg);
            transform: translateY(-2px);
          }

          .article-content {
            flex: 1;
            padding: 24px;
            display: flex;
            flex-direction: column;
          }

          .article-header-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }

          .article-category {
            display: inline-flex;
            padding: 4px 10px;
            background: var(--accent-light);
            color: var(--accent);
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .article-date {
            font-size: 0.85rem;
            color: var(--text-muted);
          }

          .article-title {
            font-family: Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif;
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.5;
            margin-bottom: 10px;
          }

          .article-title a {
            color: var(--text-primary);
            text-decoration: none;
            transition: color 0.2s ease;
          }

          .article-title a:hover {
            color: var(--accent);
          }

          .article-desc {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.8;
            margin-bottom: 16px;
            flex: 1;
          }

          .article-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .article-tag {
            padding: 4px 10px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: 4px;
            font-size: 0.8rem;
            color: var(--text-muted);
          }

          .article-cover {
            width: 240px;
            min-height: 180px;
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
            background: var(--bg-secondary);
          }

          .article-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
          }

          .cover-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--border) 100%);
            color: var(--text-muted);
            font-size: 3rem;
            font-family: Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif;
          }

          .cover-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 16px;
            color: white;
          }

          .cover-title {
            font-family: Georgia, 'Times New Roman', 'Songti SC', 'SimSun', serif;
            font-size: 0.95rem;
            font-weight: 600;
            margin-bottom: 4px;
            line-height: 1.4;
          }

          .cover-blog {
            font-size: 0.75rem;
            opacity: 0.8;
          }

          .load-more {
            text-align: center;
            margin-top: 40px;
          }

          .load-more-btn {
            display: inline-flex;
            align-items: center;
            padding: 12px 28px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 24px;
            font-size: 0.95rem;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          }

          .load-more-btn:hover {
            background: var(--accent-light);
            border-color: var(--accent);
            color: var(--accent);
          }

          .footer {
            text-align: center;
            margin-top: 56px;
            padding-top: 32px;
            border-top: 1px solid var(--border);
            color: var(--text-muted);
            font-size: 0.875rem;
          }

          .footer-links {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 20px;
            flex-wrap: wrap;
          }

          .footer-link {
            display: inline-flex;
            padding: 8px 18px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 20px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }

          .footer-link:hover {
            background: var(--accent-light);
            border-color: var(--accent);
            color: var(--accent);
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .article-card {
            animation: fadeInUp 0.5s ease forwards;
          }

          .article-card:nth-child(1) { animation-delay: 0.04s; }
          .article-card:nth-child(2) { animation-delay: 0.08s; }
          .article-card:nth-child(3) { animation-delay: 0.12s; }
          .article-card:nth-child(4) { animation-delay: 0.16s; }
          .article-card:nth-child(5) { animation-delay: 0.20s; }

          @media (max-width: 768px) {
            body {
              padding: 24px 16px;
            }

            .header {
              margin-bottom: 32px;
              padding-bottom: 24px;
            }

            .header-title {
              font-size: 1.75rem;
            }

            .subscribe-section {
              padding: 20px;
            }

            .article-card {
              flex-direction: column;
            }

            .article-cover {
              width: 100%;
              height: 160px;
              min-height: auto;
              order: -1;
            }

            .article-content {
              padding: 20px;
            }

            .article-title {
              font-size: 1.1rem;
            }

            .reader-buttons {
              justify-content: center;
            }

            .footer-links {
              gap: 10px;
            }
          }
        ]]></style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <div class="feed-badge">RSS FEED</div>
            <h1 class="header-title"><xsl:value-of select="rss/channel/title"/></h1>
            <p class="header-desc"><xsl:value-of select="rss/channel/description"/></p>
            <div class="header-meta">
              <span class="meta-tag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <xsl:value-of select="count(rss/channel/item)"/> 篇文章
              </span>
              <span class="meta-tag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                最近更新
              </span>
              <span class="meta-tag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                订阅源页面
              </span>
            </div>
          </header>

          <div class="subscribe-section">
            <h3 class="subscribe-title">使用你喜欢的阅读器订阅</h3>
            <p class="subscribe-desc">
              这是可被 RSS / Atom 阅读器直接识别的订阅源。当前页面只是为它附上一层轻盈的玻璃外观，让封面、标题与摘要以更优雅的方式呈现。
            </p>
            <div class="reader-buttons">
              <a class="reader-btn" href="https://feedly.com/i/subscription/feed/{rss/channel/link}rss.xml" target="_blank">Feedly</a>
              <a class="reader-btn" href="https://www.inoreader.com/?add={rss/channel/link}rss.xml" target="_blank">Inoreader</a>
              <a class="reader-btn" href="https://www.newsblur.com/?url={rss/channel/link}rss.xml" target="_blank">NewsBlur</a>
              <a class="reader-btn" href="https://follow.it/?url={rss/channel/link}rss.xml" target="_blank">Follow</a>
              <a class="reader-btn" href="#">RSS Reader</a>
              <a class="reader-btn" href="{rss/channel/link}" target="_blank">访问博客</a>
            </div>
          </div>

          <div class="section-header">
            <h2 class="section-title">最新文章</h2>
            <span class="section-note">文章封面取自 feed 中的 enclosure 图片</span>
          </div>

          <div class="articles">
            <xsl:for-each select="rss/channel/item">
              <article class="article-card">
                <div class="article-content">
                  <div class="article-header-row">
                    <xsl:if test="category">
                      <span class="article-category"><xsl:value-of select="category[1]"/></span>
                    </xsl:if>
                    <span class="article-date"><xsl:value-of select="substring(pubDate, 1, 11)"/></span>
                  </div>
                  <h2 class="article-title">
                    <a href="{link}" target="_blank"><xsl:value-of select="title"/></a>
                  </h2>
                  <p class="article-desc"><xsl:value-of select="description"/></p>
                  <div class="article-tags">
                    <xsl:for-each select="category[position() &gt; 1]">
                      <span class="article-tag"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </div>
                </div>
                <div class="article-cover">
                  <xsl:choose>
                    <xsl:when test="enclosure/@url">
                      <img src="{enclosure/@url}" alt="{title}"/>
                      <div class="cover-overlay">
                        <div class="cover-title"><xsl:value-of select="title"/></div>
                        <div class="cover-blog"><xsl:value-of select="../title"/></div>
                      </div>
                    </xsl:when>
                    <xsl:otherwise>
                      <div class="cover-placeholder">
                        <xsl:value-of select="substring(title, 1, 1)"/>
                      </div>
                    </xsl:otherwise>
                  </xsl:choose>
                </div>
              </article>
            </xsl:for-each>
          </div>

          <div class="load-more">
            <button class="load-more-btn" onclick="alert('已显示全部文章')">显示更多文章</button>
          </div>

          <footer class="footer">
            <p>All rights reserved <xsl:value-of select="substring(rss/channel/lastBuildDate, 1, 4)"/>, <xsl:value-of select="rss/channel/title"/></p>
            <div class="footer-links">
              <a class="footer-link" href="{rss/channel/link}">博客主页</a>
              <a class="footer-link" href="https://github.com/withastro/astro" target="_blank">Astro 生成</a>
              <a class="footer-link" href="{rss/channel/link}about">关于作者</a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>