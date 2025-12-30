---
title: Cloudflare代理支持的端口
slug: the-port-supported-by-the-cloudflare-agent-zofrod
url: /post/the-port-supported-by-the-cloudflare-agent-zofrod.html
date: '2024-03-02 08:31:13+08:00'
lastmod: '2025-12-30 14:49:42+08:00'
toc: true
isCJKLanguage: true
---



参考资料[：https://support.cloudflare.com/hc/zh-cn/articles/200169156-%E8%AF%86%E5%88%AB%E4%B8%8E-Cloudflare-%E7%9A%84%E4%BB%A3%E7%90%86%E5%85%BC%E5%AE%B9%E7%9A%84%E7%BD%91%E7%BB%9C%E7%AB%AF%E5%8F%A3]()

*了解 Cloudflare 默认代理哪些网络端口，以及如何为其他端口开启 Cloudflare 的代理。*

## 概述

Cloudflare 默认代理发往下列 HTTP/HTTPS 端口的流量。

Cloudflare 支持的 HTTP 端口：

- 80
- 8080
- 8880
- 2052
- 2082
- 2086
- 2095

Cloudflare 支持的 HTTPS 端口：

- 443
- 2053
- 2083
- 2087
- 2096
- 8443

如果您的域的流量要发送到上面列出的端口以外的其他端口，则可以：

- 通过您 Cloudflare **DNS** 页面添加子域为[灰色云记录](https://support.cloudflare.com/hc/articles/200169626)，或者
- 开启 **[Cloudflare Spectrum](https://developers.cloudflare.com/spectrum/getting-started/getting-started/)**。

通过 [WAF](https://support.cloudflare.com/hc/articles/200172016) 规则 ID 100015 针对 Pro、Business 和 Enterprise 域阻止除 80 和 443 以外的其他端口上的流量："Block requests to all ports except 80 and 443".

只有端口 80 和 443 可兼容以下服务：

- 对于启用了**中国网络**的域名的中国境内数据中心 HTTP/HTTPS 流量，
- [Cloudflare](https://www.cloudflare.com/apps/developer/docs/getting-started) **[Apps](https://www.cloudflare.com/apps/developer/docs/getting-started)** 代理，以及
- [Cloudflare](https://support.cloudflare.com/hc/articles/360021806811) **[缓存](https://support.cloudflare.com/hc/articles/360021806811)**。

[Cloudflare](https://developers.cloudflare.com/access/about/) **[Access](https://developers.cloudflare.com/access/about/)** 不支持 URL 中的端口号。  系统会从通过 Cloudflare Access 保护的 URL 请求中剥离端口号。

‍
