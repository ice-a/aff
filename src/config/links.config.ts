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
}

export const categories: Category[] = [
  { id: 'vps', name: 'VPS/服务器', icon: 'fa-server', color: '#FF6B6B' },
  { id: 'domain', name: '域名注册', icon: 'fa-globe', color: '#4ECDC4' },
  { id: 'cdn', name: 'CDN加速', icon: 'fa-bolt', color: '#45B7D1' },
  { id: 'vpn', name: 'VPN服务', icon: 'fa-vpn', color: '#00A86B' },
  { id: 'cloud', name: '云服务', icon: 'fa-cloud', color: '#96CEB4' },
  { id: 'tool', name: '开发工具', icon: 'fa-tools', color: '#FFEAA7' },
  { id: 'finance', name: '金融服务', icon: 'fa-credit-card', color: '#DDA0DD' },
  { id: 'other', name: '其他推荐', icon: 'fa-star', color: '#98D8C8' },
  { id: 'video', name: '影视', icon: 'fa-question', color: '#FFD700' },
  { id: 'muzi', name: '爱喝水的木子', icon: 'fa-question', color: '#AA6347' },
  { id: 'btc', name: '虚拟币', icon: 'fa-bitcoin', color: '#F7931A' },
];

export const affLinks: AffLink[] = [
  // VPS/服务器类
  {
    id: '1',
    title: 'DigitalOcean',
    description: '简单易用的云服务器平台，适合开发者和初创企业',
    url: 'https://m.do.co/c/98d0c1f8b37d',
    category: 'vps',
    tags: ['VPS', '云服务器', '国外主机'],
    commission: '获得$25信用额度',
    features: ['按小时计费', '全球数据中心', '简单易用', 'SSD存储'],
    color: '#0080FF',
    icon: 'fa-cloud',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Vultr',
    description: '高性能云服务器，全球16个数据中心可选',
    url: 'https://www.vultr.com/?ref=9864425',
    category: 'vps',
    tags: ['VPS', '高性能', '全球节点'],
    commission: '充值$10送$100',
    features: ['NVMe SSD', '100% SLA保证', 'DDoS防护', 'API管理'],
    color: '#0066CC',
    icon: 'fa-server',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'racknerd',
    description: '老牌VPS服务商，稳定可靠，技术支持优秀',
    url: 'https://my.racknerd.com/aff.php?aff=13897',
    category: 'vps',
    tags: ['VPS', '稳定', '技术支持'],
    commission: '注册',
    features: ['7x24技术支持', '99.9%可用性', '简单管理面板', '备份服务'],
    color: '#00A33C',
    icon: 'fa-hdd',
    createdAt: '2024-01-08'
  },
  
  // 域名注册类
  {
    id: '4',
    title: 'Namecheap',
    description: '性价比高的域名注册商，隐私保护免费',
    url: 'https://www.namecheap.com',
    category: 'domain',
    tags: ['域名', '便宜', '隐私保护'],
    commission: '最高35%佣金',
    features: ['免费Whois隐私', '低价域名', 'SSL证书', 'DNS管理'],
    color: '#E8562A',
    icon: 'fa-globe',
    createdAt: '2024-01-20'
  },
  {
    id: '5',
    title: 'Cloudflare Registrar',
    description: '成本价域名注册，无隐藏费用',
    url: 'https://www.cloudflare.com/products/registrar/',
    category: 'domain',
    tags: ['域名', '成本价', 'Cloudflare'],
    commission: '按使用量',
    features: ['成本价续费', '免费Whois隐私', '集成CDN', 'DNSSEC'],
    color: '#F48120',
    icon: 'fa-globe-americas',
    createdAt: '2024-01-18'
  },
  
  // CDN加速类
  {
    id: '6',
    title: 'Cloudflare',
    description: '全球领先的CDN和安全服务提供商',
    url: 'https://www.cloudflare.com',
    category: 'cdn',
    tags: ['CDN', '安全', 'DNS'],
    commission: '推荐奖励计划',
    features: ['全球CDN', 'DDoS防护', '免费SSL', 'WAF防火墙'],
    color: '#F48120',
    icon: 'fa-shield-alt',
    createdAt: '2024-01-12'
  },
  {
    id: '7',
    title: 'KeyCDN',
    description: '高性能CDN服务，按用量付费',
    url: 'https://www.keycdn.com',
    category: 'cdn',
    tags: ['CDN', '高性能', '按量付费'],
    commission: '最高40%佣金',
    features: ['全球节点', 'HTTP/2支持', '实时分析', 'Instant Purge'],
    color: '#E84E1B',
    icon: 'fa-bolt',
    createdAt: '2024-01-05'
  },
  
  // 云服务类
  {
    id: '8',
    title: 'AWS',
    description: '亚马逊云服务，全球最全面的云平台',
    url: 'https://aws.amazon.com',
    category: 'cloud',
    tags: ['云服务器', '全球', '企业级'],
    commission: '分层佣金',
    features: ['200+服务', '全球基础设施', '免费套餐', '企业级安全'],
    color: '#FF9900',
    icon: 'fa-amazon',
    createdAt: '2024-01-25'
  },
  {
    id: '9',
    title: '阿里云',
    description: '国内领先的云计算服务商',
    url: 'https://www.aliyun.com',
    category: 'cloud',
    tags: ['国内云', '阿里云', '稳定'],
    commission: '返利活动',
    features: ['国内节点', '丰富产品', '优惠活动', '技术支持'],
    color: '#FF6A00',
    icon: 'fa-cloud-upload-alt',
    createdAt: '2024-01-22'
  },
  
  // 开发工具类
  {
    id: '10',
    title: 'JetBrains',
    description: '专业开发工具，IDE中的最佳选择',
    url: 'https://www.jetbrains.com',
    category: 'tool',
    tags: ['IDE', '开发工具', '专业'],
    commission: '最高30%佣金',
    features: ['全系列IDE', '智能代码补全', '调试工具', '版本控制'],
    color: '#000000',
    icon: 'fa-code',
    createdAt: '2024-01-14'
  },
  {
    id: '11',
    title: 'GitHub Pro',
    description: '全球最大的代码托管平台高级版',
    url: 'https://github.com/pricing',
    category: 'tool',
    tags: ['代码托管', 'Git', '协作'],
    commission: '推荐奖励',
    features: ['私有仓库', '高级代码审查', 'GitHub Actions', 'Packages'],
    color: '#24292E',
    icon: 'fa-github',
    createdAt: '2024-01-16'
  },
  
  // 金融服务类
  {
    id: '12',
    title: 'Payoneer',
    description: '全球支付平台，跨境收款首选',
    url: 'https://www.payoneer.com',
    category: 'finance',
    tags: ['支付', '跨境', '收款'],
    commission: '注册奖励$25',
    features: ['全球收款', '多币种账户', '低费率', '快速到账'],
    color: '#FF4800',
    icon: 'fa-credit-card',
    createdAt: '2024-01-28'
  },
  
  // 其他推荐
  {
    id: '13',
    title: 'Notion',
    description: '全能工作空间和笔记工具',
    url: 'https://www.notion.so',
    category: 'other',
    tags: ['笔记', '协作', '生产力'],
    commission: '积分奖励',
    features: ['无限页面', '数据库功能', '团队协作', '模板丰富'],
    color: '#000000',
    icon: 'fa-sticky-note',
    createdAt: '2024-01-30'
  },
  {
    id: '14',
    title: 'Figma',
    description: '专业的设计协作工具',
    url: 'https://www.figma.com',
    category: 'other',
    tags: ['设计', '协作', 'UI/UX'],
    commission: '推荐计划',
    features: ['实时协作', '组件系统', '原型设计', '开发者交付'],
    color: '#F24E1E',
    icon: 'fa-paint-brush',
    createdAt: '2024-02-01'
  },
  // 影视类
  {
    id: '15',
    title: 'Netflix',
    description: '全球领先的流媒体影视平台',
    url: 'https://www.netflix.com',
    category: 'video',
    tags: ['流媒体', '影视', '全球'],
    commission: '推荐奖励',
    features: ['无广告', '全球内容', '会员等级'],
    color: '#E50914',
    icon: 'fa-film',
    createdAt: '2024-02-05'
  },
  {
    id: '16',
    title: '可可影视',
    description: '盗版影视平台',
    url: 'https://www.keke1.app/',
    category: 'video',
    tags: ['盗版', '影视', '全球'],
    commission: '盗版',
    features: ['全球内容', '会员等级'],
    color: '#E50914',
    icon: 'fa-film',
    createdAt: '2024-02-05'
  },
  {
    id: '17',
    title: '片库网',
    description: '盗版影视平台',
    url: 'https://www.zzldxny.com/',
    category: 'video',
    tags: ['盗版', '影视', '全球'],
    commission: '盗版',
    features: ['全球内容', '会员等级'],
    color: '#E50914',
    icon: 'fa-film',
    createdAt: '2024-02-05'
  },
  {
    id: '18',
    title: '搜片网',
    description: '盗版影视平台',
    url: 'https://soupian.one/',
    category: 'video',
    tags: ['盗版', '影视', '全球'],
    commission: '盗版',
    features: ['全球内容', '会员等级'],
    color: '#E50914',
    icon: 'fa-film',
    createdAt: '2024-02-05'
  },
  {
    id: '19',
    title: '瀑布盘',
    description: '盗版影视平台',
    url: 'https://www.pbpan.com/',
    category: 'video',
    tags: ['盗版', '影视', '全球'],
    commission: '盗版',
    features: ['全球内容', '会员等级'],
    color: '#E50914',
    icon: 'fa-film',
    createdAt: '2024-02-05'
  },
  {
    id: '20',
    title: '抽象头像',
    description: '盗版影视平台',
    url: 'https://avatar.020417.xyz/',
    category: 'muzi',
    tags: ['抽象', '头像'],
    commission: '抽象',
    features: ['抽象', '头像','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '21',
    title: '爬虫题库',
    description: '爬虫题库',
    url: 'https://tiku.020417.xyz/',
    category: 'muzi',
    tags: ['爬虫', '题库'],
    commission: '爬虫',
    features: ['爬虫', '题库','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '22',
    title: 'CTF工具箱',
    description: 'CTF工具箱',
    url: 'https://ctf.020417.xyz/',
    category: 'muzi',
    tags: ['CTF', '工具箱'],
    commission: 'CTF',
    features: ['CTF', '工具箱','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '23',
    title: '开发者备忘手册',
    description: '开发者备忘手册',
    url: 'https://dev.020417.xyz/',
    category: 'muzi',
    tags: ['开发者', '备忘'],
    commission: '开发者',
    features: ['开发者', '备忘','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '24',
    title: 'linux终端命令手册',
    description: 'linux终端命令手册',
    url: 'https://linux.020417.xyz/',
    category: 'muzi',
    tags: ['linux', '命令'],
    commission: '开发者',
    features: ['linux', '命令','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '25',
    title: '微信公众号素材md渲染',
    description: '微信公众号素材md渲染',
    url: 'https://md.020417.xyz/',
    category: 'muzi',
    tags: ['微信', '渲染'],
    commission: '开发者',
    features: ['微信', '渲染','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '26',
    title: '每天60s新闻',
    description: '每天60s新闻',
    url: 'https://60.020417.xyz/',
    category: 'muzi',
    tags: ['新闻', '60s'],
    commission: '开发者',
    features: ['新闻', '60s','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '27',
    title: 'colocrossing',
    description: 'colocrossing vps 1年11刀',
    url: 'https://cloud.colocrossing.com/aff.php?aff=1191',
    category: 'vps',
    tags: ['vps'],
    commission: 'vps',
    features: ['vps','自部署'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '28',
    title: 'sms接码平台',
    description: 'hero-sms 接码平台',
    url: 'https://hero-sms.com/?ref=380169',
    category: 'vps',
    tags: ['vps'],
    commission: 'vps',
    features: ['vps'],
    color: '#AA6347',
    icon: 'fa-user',
    createdAt: '2024-02-05'
  },
  {
    id: '29',
    title: '欧易钱包',
    description: '欧易钱包',
    url: 'https://www.oyuzh.life/zh-hans/join/52391770?shortCode=YbU25D',
    category: 'btc',
    tags: ['比特币', '钱包'],
    commission: '比特币',
    features: ['比特币', '钱包'],
    color: '#F7931A',
    icon: 'fa-bitcoin',
    createdAt: '2024-02-05'
  },
  {
    id: '30',
    title: 'bigme',
    description: 'bigme VPN服务',
    url: 'https://app.bigme.online/user#/register?code=ZTrIUOBr',
    category: 'vpn',
    tags: ['VPN'],
    commission: 'VPN',
    features: ['VPN'],
    color: '#00A86B',
    icon: 'fa-vpn',
    createdAt: '2024-02-05'
  },
  {
    id: '31',
    title: 'bitget',
    description: 'bitget btc交易平台',
    url: 'https://share.glassgs.com/u/XG07JNPM',
    category: 'btc',
    tags: ['btc'],
    commission: 'btc',
    features: ['btc'],
    color: '#00A86B',
    icon: 'fa-vpn',
    createdAt: '2024-02-05'
  },
  {
    id: '32',
    title: '币安',
    description: '币安 btc交易平台',
    url: 'https://www.bsmkweb.com/referral/earn-together/refer2earn-usdc/claim?hl=zh-CN&ref=GRO_28502_NVR0P&utm_source=default',
    category: 'btc',
    tags: ['btc'],
    commission: 'btc',
    features: ['btc'],
    color: '#00A86B',
    icon: 'fa-vpn',
    createdAt: '2024-02-05'
  },
  {
    id: '33',
    title: '澳门蚂蚁',
    description: '澳门蚂蚁 开卡存3000港币送2股阿里巴巴港股',
    url: 'https://m.antbank.mo/s/j1tDQ',
    category: 'btc',
    tags: ['btc'],
    commission: 'btc',
    features: ['btc'],
    color: '#00A86B',
    icon: 'fa-vpn',
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
  'linear-gradient(135deg, #90caf9 0%, #1565c0 100%)',
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
