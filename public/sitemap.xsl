<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap — Prima Dance</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f0f0d; color: #e0e0e0; padding: 2rem; }
          h1 { font-size: 1.8rem; margin-bottom: .5rem; color: #fff; }
          p.desc { color: #888; margin-bottom: 2rem; font-size: .9rem; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: .75rem 1rem; background: #1a1a18; color: #aaa; font-size: .75rem; text-transform: uppercase; letter-spacing: .1em; border-bottom: 1px solid #2a2a28; }
          td { padding: .75rem 1rem; border-bottom: 1px solid #1a1a18; font-size: .85rem; }
          a { color: #fff; text-decoration: none; }
          a:hover { text-decoration: underline; color: #ccc; }
          tr:hover td { background: #1a1a18; }
          .priority { display: inline-block; padding: .15rem .5rem; border-radius: 3px; font-size: .75rem; font-weight: 600; }
          .p-high { background: #1a3a1a; color: #4ade80; }
          .p-med { background: #3a3a1a; color: #facc15; }
          .p-low { background: #2a2a2a; color: #888; }
        </style>
      </head>
      <body>
        <h1>🗺️ Sitemap — Prima Dance</h1>
        <p class="desc">
          <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs indexed
        </p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Priority</th>
              <th>Change Freq</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <xsl:sort select="sitemap:priority" order="descending"/>
              <tr>
                <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                <td>
                  <xsl:choose>
                    <xsl:when test="sitemap:priority &gt;= 0.8">
                      <span class="priority p-high"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sitemap:priority &gt;= 0.5">
                      <span class="priority p-med"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="priority p-low"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
