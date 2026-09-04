import { CategoryData } from '../types';

export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: 'common',
    name: '常用网站',
    icon: '🌐',
    items: [
      { title: '南宫远推特', url: 'https://x.com/nangongyuan/', desc: '南宫远的推特X账号' },
      { title: '南宫远微博', url: 'https://weibo.com/u/6184008812', desc: '南宫远的官方微博' },
      { title: '微信公众号', url: 'https://mp.weixin.qq.com/', desc: '微信公众平台官网' },
      { title: '抖音', url: 'https://www.douyin.com/', desc: '抖音短视频平台' },
      { title: '哔哩哔哩', url: 'https://www.bilibili.com/', desc: '国内知名视频弹幕网站' },
      { title: '知乎', url: 'https://www.zhihu.com/', desc: '专业的问答社区' },
      { title: '微信视频号', url: 'https://channels.weixin.qq.com/', desc: '微信视频号创作者平台' },
      { title: '万能视频下载', url: 'https://snapany.com/zh', desc: '多平台视频下载工具' },
      { title: 'Cloudflare', url: 'https://dash.cloudflare.com/', desc: 'CDN与网络安全服务' },
      { title: 'Gmail', url: 'https://mail.google.com/', desc: '谷歌邮箱' },
      { title: 'Google Keep', url: 'https://keep.google.com/u/0/#home', desc: '谷歌云笔记备忘' },
      { title: 'IP.im', url: 'https://ip.im/', desc: 'IP地址查询工具' }
    ]
  },
  {
    id: 'ai',
    name: 'AI导航',
    icon: '🤖',
    items: [
      { title: 'ChatGPT', url: 'https://chatgpt.com/', desc: 'OpenAI的对话AI助手' },
      { title: 'Google AI Studio', url: 'https://aistudio.google.com/prompts/new_chat', desc: '谷歌AI开发平台' },
      { title: 'Claude', url: 'https://claude.ai/', desc: 'Anthropic的AI助手' },
      { title: 'Gemini', url: 'https://gemini.google.com/app', desc: '谷歌多模态AI' },
      { title: 'Grok', url: 'https://grok.com/', desc: 'X平台AI助手' },
      { title: '豆包', url: 'https://www.doubao.com/chat/', desc: '字节跳动AI助手' }
    ]
  },
  {
    id: 'blockchain',
    name: '区块链导航',
    icon: '⛓️',
    items: [
      { title: 'Bitcoin.org', url: 'https://bitcoin.org/', desc: '比特币官方中文网站' },
      { title: 'btc.ngy123.com', url: 'https://btc.ngy123.com/', desc: '南宫远比特币导航' },
      { title: 'OKLink', url: 'https://www.oklink.com/zh-hans', desc: '区块链数据浏览器' },
      { title: 'Coinglass', url: 'https://www.coinglass.com/zh', desc: '加密货币行情与数据' },
      { title: 'CoinMarketCap', url: 'https://coinmarketcap.com/', desc: '加密货币市值排名' },
      { title: 'PANews', url: 'https://www.panewslab.com/zh', desc: '专业的区块链新闻平台' },
      { title: 'BIP-0039', url: 'https://github.com/bitcoin/bips/tree/master/bip-0039', desc: '比特币助记词规范' },
      { title: 'FuckBTC', url: 'https://fuckbtc.com/', desc: '加密货币资讯网站' },
      { title: '比特币富豪榜', url: 'https://bitinfocharts.com/zh/top-100-richest-bitcoin-addresses.html', desc: '比特币地址余额排行榜' }
    ]
  },
  {
    id: 'tools',
    name: '工具',
    icon: '🛠️',
    items: [
      { title: '新闻大全', url: 'https://newsnow.busiyi.world/c/focus', desc: '实时新闻聚合平台' },
      { title: '推特热帖排行', url: 'https://www.attentionvc.ai/article?window=all&lang=zh', desc: '推特热门内容排行榜' },
      { title: 'V2EX', url: 'https://v2ex.com/', desc: '程序员创意社区' },
      { title: 'GitHub', url: 'https://github.com/coin1234567/', desc: '全球最大代码托管平台' },
      { title: '激战2数据库', url: 'https://gw2.wishingstarmoye.com/', desc: 'Guild Wars 2数据查询' },
      { title: '激战2贴吧', url: 'https://tieba.baidu.com/f?kw=%BC%A4%D5%BD2', desc: '激战2玩家社区' },
      { title: '阿虚同学的储物间', url: 'https://www.axutongxue.com/', desc: '资源分享网站' },
      { title: '免费教育邮箱', url: 'https://edumail.su/', desc: '免费教育邮箱申请' }
    ]
  },
  {
    id: 'exchanges',
    name: '交易所导航',
    icon: '💰',
    items: [
      { title: '币安', url: 'https://accounts.binance.com/zh-TW/register?ref=10022763', desc: '全球最大的加密货币交易所' },
      { title: 'OKX', url: 'https://www.okx.com/zh-hans/join/1847115', desc: '全球领先的加密货币交易平台' },
      { title: 'Gate.io', url: 'https://www.gatewebsite.com/zh/signup?ref_type=102&ref=UwdFUQ', desc: '知名加密货币交易所' },
      { title: 'Bitget', url: 'https://www.beeeye.xyz/zh-CN/referral/register?clacCode=MNZREPYS', desc: '知名加密货币交易所' }
    ]
  },
  {
    id: 'friends',
    name: '友情链接',
    icon: '🔗',
    items: [
      { title: 'btc.ngy123.com', url: 'https://btc.ngy123.com/', desc: '比特币导航站，百度搜"比特币导航"排第一' },
      { title: 'fabi.ngy123.com', url: 'https://fabi.ngy123.com/', desc: '全球法币排行榜，百度搜"法币排行"排第四' },
      { title: 'eth.ngy123.com', url: 'https://eth.ngy123.com/', desc: '以太坊资源导航' },
      { title: 'gxs.ngy123.com', url: 'https://gxs.ngy123.com/', desc: '高晓松资源下载' },
      { title: 'btczy.ngy123.com', url: 'https://btczy.ngy123.com/', desc: '比特币资源下载站' },
      { title: 'binance.ngy123.com', url: 'https://binance.ngy123.com/', desc: '币安资源导航' },
      { title: 'okx.ngy123.com', url: 'https://okx.ngy123.com/', desc: 'OKX资源导航' },
      { title: 'xuexi.ngy123.com', url: 'https://xuexi.ngy123.com/', desc: '学习资源导航' },
      { title: 'thlm.com', url: 'https://thlm.com/', desc: '天黑路明 · 照亮财富自由之路' },
      { title: 'www.wangpan8.com', url: 'https://www.wangpan8.com/', desc: '网盘资源搜索与导航' }
    ]
  }
];
