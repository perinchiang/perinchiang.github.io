<p>参考资料<a href="">：https://support.cloudflare.com/hc/zh-cn/articles/200169156-%E8%AF%86%E5%88%AB%E4%B8%8E-Cloudflare-%E7%9A%84%E4%BB%A3%E7%90%86%E5%85%BC%E5%AE%B9%E7%9A%84%E7%BD%91%E7%BB%9C%E7%AB%AF%E5%8F%A3</a></p>
<p><em>了解 Cloudflare 默认代理哪些网络端口，以及如何为其他端口开启 Cloudflare 的代理。</em></p>
<h2>概述</h2>
<p>Cloudflare 默认代理发往下列 HTTP/HTTPS 端口的流量。</p>
<p>Cloudflare 支持的 HTTP 端口：</p>
<ul>
<li>80</li>
<li>8080</li>
<li>8880</li>
<li>2052</li>
<li>2082</li>
<li>2086</li>
<li>2095</li>
</ul>
<p>Cloudflare 支持的 HTTPS 端口：</p>
<ul>
<li>443</li>
<li>2053</li>
<li>2083</li>
<li>2087</li>
<li>2096</li>
<li>8443</li>
</ul>
<p>如果您的域的流量要发送到上面列出的端口以外的其他端口，则可以：</p>
<ul>
<li>通过您 Cloudflare <strong>DNS</strong> 页面添加子域为<a href="https://support.cloudflare.com/hc/articles/200169626">灰色云记录</a>，或者</li>
<li>开启 <strong><a href="https://developers.cloudflare.com/spectrum/getting-started/getting-started/">Cloudflare Spectrum</a></strong>。</li>
</ul>
<p>通过 <a href="https://support.cloudflare.com/hc/articles/200172016">WAF</a> 规则 ID 100015 针对 Pro、Business 和 Enterprise 域阻止除 80 和 443 以外的其他端口上的流量：&quot;Block requests to all ports except 80 and 443&quot;.</p>
<p>只有端口 80 和 443 可兼容以下服务：</p>
<ul>
<li>对于启用了<strong>中国网络</strong>的域名的中国境内数据中心 HTTP/HTTPS 流量，</li>
<li><a href="https://www.cloudflare.com/apps/developer/docs/getting-started">Cloudflare</a> <strong><a href="https://www.cloudflare.com/apps/developer/docs/getting-started">Apps</a></strong> 代理，以及</li>
<li><a href="https://support.cloudflare.com/hc/articles/360021806811">Cloudflare</a> <strong><a href="https://support.cloudflare.com/hc/articles/360021806811">缓存</a></strong>。</li>
</ul>
<p><a href="https://developers.cloudflare.com/access/about/">Cloudflare</a> <strong><a href="https://developers.cloudflare.com/access/about/">Access</a></strong> 不支持 URL 中的端口号。  系统会从通过 Cloudflare Access 保护的 URL 请求中剥离端口号。</p>
<p>‍</p>
