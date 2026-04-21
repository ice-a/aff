// AFF链接数据配置
// 在此文件中添加或修改你的AFF链接

export interface AffLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  commission: string;
  features: string[];
  color: string;
  icon?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export const categories: Category[] = [
  {
    id: 'btc',
    name: '数字货币',
    icon: 'fa-bitcoin',
    color: '#F7931A',
    description: '比特币、以太坊等数字货币交易平台'
  },
  {
    id: 'vpn',
    name: 'VPN服务',
    icon: 'fa-shield-alt',
    color: '#00A86B',
    description: '全球VPN服务，保护您的网络隐私'
  },
  {
    id: 'vps',
    name: '云服务器',
    icon: 'fa-server',
    color: '#FF6B6B',
    description: '高性能VPS和云服务器提供商'
  },
  {
    id: 'domain',
    name: '域名注册',
    icon: 'fa-globe',
    color: '#4ECDC4',
    description: '域名注册、续费和管理服务'
  },
  {
    id: 'cdn',
    name: 'CDN加速',
    icon: 'fa-bolt',
    color: '#45B7D1',
    description: '内容分发网络加速服务'
  },
  {
    id: 'cloud',
    name: '云服务',
    icon: 'fa-cloud',
    color: '#96CEB4',
    description: '云计算和存储服务'
  },
  {
    id: 'tool',
    name: '开发工具',
    icon: 'fa-code',
    color: '#FFEAA7',
    description: '开发者工具和IDE'
  },
  {
    id: 'finance',
    name: '金融服务',
    icon: 'fa-credit-card',
    color: '#DDA0DD',
    description: '支付、银行和金融相关服务'
  },
  {
    id: 'other',
    name: '其他推荐',
    icon: 'fa-star',
    color: '#98D8C8',
    description: '其他优质服务和工具'
  },
  {
    id: 'video',
    name: '影视娱乐',
    icon: 'fa-film',
    color: '#FFD700',
    description: '视频流媒体和娱乐服务'
  },
  {
    id: 'muzi',
    name: '个人项目',
    icon: 'fa-user-astronaut',
    color: '#AA6347',
    description: '个人开发的项目和工具'
  },
];

export const affLinks: AffLink[] = [
  // VPS/服务器类
  {
    id: 'digitalocean',
    title: 'DigitalOcean',
    description: '简单易用的云服务器平台，适合开发者和初创企业。提供SSD存储、全球数据中心、按小时计费等企业级功能。',
    url: 'https://m.do.co/c/98d0c1f8b37d',
    category: 'vps',
    tags: ['VPS', '云服务器', '国外主机', '开发者友好'],
    commission: '获得$25信用额度',
    features: ['按小时计费', '全球12个数据中心', 'SSD存储', 'API管理', '快照备份', '负载均衡'],
    color: '#0080FF',
    icon: 'fa-cloud',
    createdAt: '2024-01-15'
  },
  {
    id: 'vultr',
    title: 'Vultr',
    description: '高性能云服务器，全球17个数据中心可选。支持按小时计费，提供NVMe SSD存储。',
    url: 'https://www.vultr.com/?ref=9864425',
    category: 'vps',
    tags: ['VPS', '高性能', '全球节点', 'NVMe'],
    commission: '充值$10送$100',
    features: ['NVMe SSD存储', '100% SLA保证', 'DDoS防护', 'API管理', '自动备份', 'IPv6支持'],
    color: '#0066CC',
    icon: 'fa-server',
    createdAt: '2024-01-10'
  },
  {
    id: 'racknerd',
    title: 'RackNerd',
    description: '性价比极高的VPS服务商，提供多种配置选择。技术支持响应迅速，稳定性优秀。',
    url: 'https://my.racknerd.com/aff.php?aff=13897',
    category: 'vps',
    tags: ['VPS', '性价比', '技术支持', '稳定'],
    commission: '注册即可获得优惠',
    features: ['7x24技术支持', '99.9%可用性保证', 'KVM虚拟化', '多机房选择', 'DDOS防护', '即时开通'],
    color: '#00A33C',
    icon: 'fa-hdd',
    createdAt: '2024-01-08'
  },

  // 域名注册类
  {
    id: 'namecheap',
    title: 'Namecheap',
    description: '性价比高的域名注册商，提供免费的Whois隐私保护。用户界面简洁，管理方便。',
    url: 'https://www.namecheap.com',
    category: 'domain',
    tags: ['域名', '便宜', '隐私保护', 'SSL证书'],
    commission: '最高35%佣金',
    features: ['免费Whois隐私', '低价域名注册', 'SSL证书', 'DNS管理', '域名转移', '批量管理'],
    color: '#E8562A',
    icon: 'fa-globe',
    createdAt: '2024-01-20'
  },
  {
    id: 'cloudflare-registrar',
    title: 'Cloudflare Registrar',
    description: '成本价域名注册，无隐藏费用。与Cloudflare CDN完美集成，提供顶级安全性。',
    url: 'https://www.cloudflare.com/products/registrar/',
    category: 'domain',
    tags: ['域名', '成本价', 'Cloudflare', '安全'],
    commission: '按使用量计算',
    features: ['成本价续费', '免费Whois隐私', '集成CDN', 'DNSSEC', '快速DNS解析', '安全保护'],
    color: '#F48120',
    icon: 'fa-globe-americas',
    createdAt: '2024-01-18'
  },

  // CDN加速类
  {
    id: 'cloudflare',
    title: 'Cloudflare',
    description: '全球领先的CDN和安全服务提供商，提供网站加速、DDoS防护、SSL证书等服务。',
    url: 'https://www.cloudflare.com',
    category: 'cdn',
    tags: ['CDN', '安全', 'DNS', 'SSL'],
    commission: '推荐奖励计划',
    features: ['全球CDN网络', 'DDoS防护', '免费SSL', 'WAF防火墙', 'DNS管理', '性能优化'],
    color: '#F48120',
    icon: 'fa-shield-alt',
    createdAt: '2024-01-12'
  },
  {
    id: 'keycdn',
    title: 'KeyCDN',
    description: '高性能CDN服务，按用量付费。支持HTTP/2、实时统计、即时清除缓存等高级功能。',
    url: 'https://www.keycdn.com',
    category: 'cdn',
    tags: ['CDN', '高性能', '按量付费', 'HTTP/2'],
    commission: '最高40%佣金',
    features: ['全球节点分布', 'HTTP/2支持', '实时分析', 'Instant Purge', '自定义SSL', 'API管理'],
    color: '#E84E1B',
    icon: 'fa-bolt',
    createdAt: '2024-01-05'
  },

  // 云服务类
  {
    id: 'aws',
    title: 'Amazon Web Services',
    description: '亚马逊云服务，全球最全面的云平台。提供200+种云服务，适合企业级应用。',
    url: 'https://aws.amazon.com',
    category: 'cloud',
    tags: ['云服务器', '全球', '企业级', 'AI/ML'],
    commission: '分层佣金制度',
    features: ['200+云服务', '全球基础设施', '免费套餐', '企业级安全', 'AI/ML服务', '自动扩展'],
    color: '#FF9900',
    icon: 'fa-amazon',
    createdAt: '2024-01-25'
  },
  {
    id: 'aliyun',
    title: '阿里云',
    description: '国内领先的云计算服务商，提供丰富的云产品和解决方案。适合中国用户访问。',
    url: 'https://www.aliyun.com',
    category: 'cloud',
    tags: ['国内云', '阿里云', '稳定', '中文支持'],
    commission: '新用户优惠活动',
    features: ['国内节点优势', '丰富产品线', '优惠活动', '中文技术支持', '合规认证', '混合云方案'],
    color: '#FF6A00',
    icon: 'fa-cloud-upload-alt',
    createdAt: '2024-01-22'
  },

  // 开发工具类
  {
    id: 'jetbrains',
    title: 'JetBrains',
    description: '专业开发工具套件，提供IntelliJ IDEA、PyCharm、WebStorm等顶级IDE。',
    url: 'https://www.jetbrains.com',
    category: 'tool',
    tags: ['IDE', '开发工具', '专业', '多语言'],
    commission: '最高30%佣金',
    features: ['全系列IDE', '智能代码补全', '调试工具', '版本控制', '重构工具', '团队协作'],
    color: '#000000',
    icon: 'fa-code',
    createdAt: '2024-01-14'
  },
  {
    id: 'github-pro',
    title: 'GitHub Pro',
    description: '全球最大的代码托管平台高级版，提供私有仓库、高级协作功能。',
    url: 'https://github.com/pricing',
    category: 'tool',
    tags: ['代码托管', 'Git', '协作', 'CI/CD'],
    commission: '推荐奖励计划',
    features: ['私有仓库', '高级代码审查', 'GitHub Actions', 'Packages', '项目管理', '团队协作'],
    color: '#24292E',
    icon: 'fa-github',
    createdAt: '2024-01-16'
  },

  // 金融服务类
  {
    id: 'payoneer',
    title: 'Payoneer',
    description: '全球支付平台，专为跨境收款设计。支持150+种货币，低手续费快速到账。',
    url: 'https://www.payoneer.com',
    category: 'finance',
    tags: ['支付', '跨境', '收款', '多币种'],
    commission: '注册奖励$25',
    features: ['全球收款', '多币种账户', '低手续费', '快速到账', '预付卡', 'API集成'],
    color: '#FF4800',
    icon: 'fa-credit-card',
    createdAt: '2024-01-28'
  },

  // 其他推荐
  {
    id: 'notion',
    title: 'Notion',
    description: '全能工作空间和笔记工具，集笔记、数据库、项目管理于一体。',
    url: 'https://www.notion.so',
    category: 'other',
    tags: ['笔记', '协作', '生产力', '数据库'],
    commission: '积分奖励计划',
    features: ['无限页面', '数据库功能', '团队协作', '模板丰富', 'API集成', '多平台同步'],
    color: '#000000',
    icon: 'fa-sticky-note',
    createdAt: '2024-01-30'
  },
  {
    id: 'figma',
    title: 'Figma',
    description: '专业的设计协作工具，支持实时协作、原型设计、设计系统管理。',
    url: 'https://www.figma.com',
    category: 'other',
    tags: ['设计', '协作', 'UI/UX', '原型'],
    commission: '推荐奖励计划',
    features: ['实时协作', '组件系统', '原型设计', '开发者交付', '设计系统', '版本历史'],
    color: '#F24E1E',
    icon: 'fa-paint-brush',
    createdAt: '2024-02-01'
  },

  // 数字货币类
  {
    id: 'binance',
    title: '币安',
    description: '全球领先的数字货币交易平台，提供现货、合约、理财等全方位服务。',
    url: 'https://www.bsmkweb.com/referral/earn-together/refer2earn-usdc/claim?hl=zh-CN&ref=GRO_28502_NVR0P&utm_source=default',
    category: 'btc',
    tags: ['数字货币', '交易', '合约', '理财'],
    commission: '交易手续费返佣',
    features: ['现货交易', '合约交易', '理财产品', 'Launchpad', '质押挖矿', '移动App'],
    color: '#F3BA2F',
    icon: 'fa-bitcoin',
    createdAt: '2024-02-05'
  },
  {
    id: 'bitget',
    title: 'Bitget',
    description: '创新型数字货币衍生品交易平台，提供合约、期权、跟单交易等服务。',
    url: 'https://share.glassgs.com/u/XG07JNPM',
    category: 'btc',
    tags: ['数字货币', '合约', '跟单', '期权'],
    commission: '交易返佣计划',
    features: ['合约交易', '期权交易', '跟单系统', '现货交易', '理财产品', 'API交易'],
    color: '#1F2937',
    icon: 'fa-chart-line',
    createdAt: '2024-02-05'
  },
  {
    id: 'okx-wallet',
    title: 'OKX钱包',
    description: '欧易钱包，安全可靠的数字货币钱包，支持多链资产管理。',
    url: 'https://www.oyuzh.life/zh-hans/join/52391770?shortCode=YbU25D',
    category: 'btc',
    tags: ['数字货币', '钱包', '多链', '安全'],
    commission: '注册奖励',
    features: ['多链支持', '资产管理', 'DeFi接入', 'NFT支持', '安全保障', '跨链桥'],
    color: '#000000',
    icon: 'fa-wallet',
    createdAt: '2024-02-05'
  },

  // VPN服务类
  {
    id: 'bigme-vpn',
    title: 'Bigme VPN',
    description: '高速稳定的VPN服务，支持全球多个节点，保护您的网络隐私。',
    url: 'https://app.bigme.online/user#/register?code=ZTrIUOBr',
    category: 'vpn',
    tags: ['VPN', '隐私保护', '高速', '多节点'],
    commission: '推荐奖励',
    features: ['全球节点', '高速连接', '隐私保护', '多设备支持', '无广告', '24/7客服'],
    color: '#00A86B',
    icon: 'fa-shield-alt',
    createdAt: '2024-02-05'
  },

  // 个人项目类
  {
    id: 'abstract-avatar',
    title: '抽象头像生成器',
    description: 'AI驱动的抽象头像生成工具，为您的项目或社交媒体创建独特头像。',
    url: 'https://avatar.020417.xyz/',
    category: 'muzi',
    tags: ['AI', '头像', '抽象', '生成器'],
    commission: '开源项目',
    features: ['AI生成', '多种风格', '自定义参数', '批量下载', 'API接口', '开源代码'],
    color: '#AA6347',
    icon: 'fa-user-astronaut',
    createdAt: '2024-02-05'
  },
  {
    id: 'crawler-tiktok',
    title: '爬虫题库',
    description: '编程爬虫学习题库，包含各种网站爬取实例和解决方案。',
    url: 'https://tiku.020417.xyz/',
    category: 'muzi',
    tags: ['爬虫', '题库', '学习', '编程'],
    commission: '教育项目',
    features: ['实例丰富', '详细教程', '代码示例', '在线练习', '进度跟踪', '社区讨论'],
    color: '#AA6347',
    icon: 'fa-database',
    createdAt: '2024-02-05'
  },
  {
    id: 'ctf-tools',
    title: 'CTF工具箱',
    description: '网络安全CTF竞赛必备工具集合，包含密码学、逆向工程、Web安全等工具。',
    url: 'https://ctf.020417.xyz/',
    category: 'muzi',
    tags: ['CTF', '网络安全', '工具', '竞赛'],
    commission: '安全社区',
    features: ['工具齐全', '分类清晰', '在线使用', '教程文档', '更新及时', '社区支持'],
    color: '#AA6347',
    icon: 'fa-tools',
    createdAt: '2024-02-05'
  },
  {
    id: 'dev-handbook',
    title: '开发者备忘手册',
    description: '开发者常用命令和配置备忘，涵盖Linux、Git、Docker等技术栈。',
    url: 'https://dev.020417.xyz/',
    category: 'muzi',
    tags: ['开发者', '备忘', '命令', '配置'],
    commission: '开发者工具',
    features: ['命令查询', '配置模板', '分类整理', '搜索功能', '离线可用', '持续更新'],
    color: '#AA6347',
    icon: 'fa-book',
    createdAt: '2024-02-05'
  },
  {
    id: 'linux-commands',
    title: 'Linux终端命令手册',
    description: '全面的Linux命令参考手册，包含详细说明和使用示例。',
    url: 'https://linux.020417.xyz/',
    category: 'muzi',
    tags: ['Linux', '命令', '终端', '手册'],
    commission: '系统管理',
    features: ['命令大全', '详细说明', '使用示例', '分类浏览', '快速搜索', '收藏功能'],
    color: '#AA6347',
    icon: 'fa-terminal',
    createdAt: '2024-02-05'
  },
  {
    id: 'md-renderer',
    title: '微信公众号Markdown渲染器',
    description: '专为微信公众号优化的Markdown渲染工具，支持自定义样式和主题。',
    url: 'https://md.020417.xyz/',
    category: 'muzi',
    tags: ['Markdown', '微信', '渲染', '公众号'],
    commission: '写作工具',
    features: ['微信优化', '自定义样式', '实时预览', '主题切换', '导出功能', '语法高亮'],
    color: '#AA6347',
    icon: 'fa-file-alt',
    createdAt: '2024-02-05'
  },
  {
    id: 'daily-news',
    title: '每日60秒新闻',
    description: '精选每日重要新闻，60秒快速了解世界动态。',
    url: 'https://60.020417.xyz/',
    category: 'muzi',
    tags: ['新闻', '60秒', '每日', '精选'],
    commission: '资讯服务',
    features: ['每日更新', '精选内容', '快速阅读', '多平台同步', '历史存档', '订阅推送'],
    color: '#AA6347',
    icon: 'fa-newspaper',
    createdAt: '2024-02-05'
  },

  // 其他VPS服务
  {
    id: 'colocrossing',
    title: 'ColoCrossing',
    description: '性价比极高的VPS和独立服务器提供商，特别适合需要高性能计算的用户。',
    url: 'https://cloud.colocrossing.com/aff.php?aff=1191',
    category: 'vps',
    tags: ['VPS', '独立服务器', '性价比', '高性能'],
    commission: '长期合作伙伴',
    features: ['1年11刀VPS', '独立服务器', 'SSD存储', '多机房选择', '24/7支持', 'DDoS防护'],
    color: '#2C3E50',
    icon: 'fa-server',
    createdAt: '2024-02-05'
  },

  // 短信服务
  {
    id: 'hero-sms',
    title: 'Hero-SMS接码平台',
    description: '专业的短信接码平台，支持全球多个国家的手机号码接收验证码。',
    url: 'https://hero-sms.com/?ref=380169',
    category: 'tool',
    tags: ['短信', '接码', '验证码', '全球'],
    commission: '平台分成',
    features: ['全球号码', '实时接收', 'API接口', '多平台支持', '安全可靠', '价格实惠'],
    color: '#3498DB',
    icon: 'fa-sms',
    createdAt: '2024-02-05'
  },

  // 影视娱乐类
  {
    id: 'netflix',
    title: 'Netflix',
    description: '全球领先的流媒体影视平台，提供海量原创内容和经典影视作品。',
    url: 'https://www.netflix.com',
    category: 'video',
    tags: ['流媒体', '影视', '原创', '全球'],
    commission: '会员推荐计划',
    features: ['无广告观看', '全球内容', '原创剧集', '多设备支持', '离线下载', '个性化推荐'],
    color: '#E50914',
    icon: 'fa-play-circle',
    createdAt: '2024-02-05'
  },
];

// 精美的渐变色组合列表
export const gradientColors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff8a80 0%, #ea6100 100%)',
  'linear-gradient(135deg, #82b1ff 0%, #2962ff 100%)',
  'linear-gradient(135deg, #b39ddb 0%, #7e57c2 100%)',
  'linear-gradient(135deg, #ef9a9a 0%, #e53935 100%)',
  'linear-gradient(135deg, #80cbc4 0%, #00695c 100%)',
  'linear-gradient(135deg, #c5e1a5 0%, #558b2f 100%)',
  'linear-gradient(135deg, #ffe082 0%, #ff6f00 100%)',
  'linear-gradient(135deg, #bcaaa4 0%, #4e342e 100%)',
  'linear-gradient(135deg, #90caf9 0%, #1565c0 100%)'
];

// 根据ID获取固定的渐变色（保证每次渲染一致）
export const getRandomGradient = (id: string) => {
  // 使用ID的字符编码生成索引
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradientColors.length;
  return gradientColors[index];
};