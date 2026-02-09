"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load preference
  useEffect(() => {
    const saved = localStorage.getItem('babynails-lang') as Language;
    if (saved === 'en' || saved === 'zh') {
      setLanguage(saved);
    }
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem('babynails-lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    // If it's a direct lookup from the items dictionary (dynamic content)
    if (translations[language].items && translations[language].items[key]) {
      return translations[language].items[key];
    }

    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations: Record<Language, any> = {
  en: {
    nav: {
      services: "Services",
      shop: "Shop",
      about: "About",
      book: "Book Now"
    },
    hero: {
      badge: "Redefining Luxury Nails",
      title: "Artistry at Your",
      titleItalic: "Fingertips",
      subtitle: "High-end AI customized press-on nails and premium studio services in Vancouver.",
      cta: "Explore Collection",
      tryon: "Virtual Try-On"
    },
    shop: {
      badge: "The Collection",
      title: "Artisan Press-ons",
      filters: {
        all: "All Sets",
        essential: "Essential",
        boutique: "Boutique",
        couture: "Couture"
      },
      add: "Add",
      back: "Back to Collection",
      craftsmanship_desc: "Hand-crafted with precision using high-quality gel products for a professional studio look at home. Each set includes 10 nails, glue, adhesive tabs, and a preparation kit."
    },
    services: {
      badge: "Menu",
      title: "Curated",
      titleItalic: "Experiences",
      nails: {
        title: "Signature Nail Care",
        desc: "Curated manicure and pedicure experiences focusing on health, precision, and high-fashion aesthetics in Vancouver."
      },
      lashes: {
        title: "The Eyelash Atelier",
        desc: "Expertly applied lash enhancements designed to elevate your natural beauty with structural integrity."
      }
    },
    cart: {
      title: "Your Bag",
      empty: "Your bag is empty",
      start: "Start Shopping",
      total: "Total",
      checkout: "Checkout Now",
      shipping: "Free shipping on all press-on nail orders."
    },
    book: {
      badge: "Reservations",
      title: "Secure Your",
      titleItalic: "Session",
      name: "Full Name",
      email: "Email Address",
      experience: "Select Experience",
      cta: "Request Booking",
      submitting: "Sending Request...",
      disclaimer: "* All appointments are subject to studio availability.",
      success_title: "Request Received",
      success_desc: "We have received your booking request. Our team will contact you shortly to confirm your session.",
      back: "Make another reservation"
    },
    items: {
      "Classic Velvet Cat-Eye": "Midnight Velvet Cat-Eye",
      "Minimalist Milky White": "L'Ivoire Minimalist",
      "3D Chrome Molten Gold": "24K Molten Gold Sculpture",
      "French Glazed Donut": "Le Glaçage Classique",
      "Matte Gothic Noir": "Obsidian Matte Noir",
      "Blush Aura": "Rosé Aura Ethereal",
      "Cyberpunk Holo-Graphic": "Prism Holographic Digital Art",
      "Pressed Flower Clear": "Botanical Infusion Couture",
      "Luxury Coffin Marble": "Carrara Marble Elite",
      "Short Squoval Tortoise": "Heritage Tortoise Shell",
      "Jelly Tint Ombre": "Vitrail Syrup Ombré",
      "Rhinestone Encrusted": "Diamond Pavé Atelier",
      "Hand-Painted Cherry Print": "Artisanal Cerise Motif",
      "Abstract Line Art": "Modernist Linear Expression",
      "Pearl Glaze Almond": "Nacreous Pearl Luster",
      "Signature Gel Manicure": "Signature Gel Manicure",
      "Luxury Spa Pedicure": "Luxury Spa Pedicure",
      "Gel-X Extensions": "Gel-X Extensions",
      "Natural Classic Set": "Natural Classic Set",
      "Signature Hybrid Set": "Signature Hybrid Set",
      "Grand Volume Set": "Grand Volume Set",
      "Essential": "Essential",
      "Boutique": "Boutique",
      "Couture": "Couture",
      "Nails": "Nails",
      "Eyelashes": "Eyelashes",
      "Deep magnetic shimmering finish.": "A multi-dimensional magnetic finish with deep velvet depth and bespoke shimmer. Perfect for evening luxury.",
      "Semi-translucent 'clean girl' aesthetic.": "The ultimate L'Ivoire translucent finish for a sophisticated, understated 'clean girl' aesthetic and timeless elegance.",
      "High-shine metallic drips.": "Avant-garde 3D metallic artistry featuring 24K-inspired molten gold textures for a bold, sculptural statement.",
      "The Hailey Bieber classic.": "The iconic high-shine iridescent glaze. A sheer, sophisticated pearlescent finish that defines modern luxury.",
      "Sharp stiletto shape.": "A deep obsidian matte finish in a precision-engineered stiletto silhouette. Bold, architectural, and striking.",
      "Soft pink gradient 'aura'.": "An ethereal soft-focus pink gradient inspired by Korean aura aesthetics. A delicate, romantic blush for the modern romantic.",
      "Y2K inspired rainbow reflective finish.": "Multi-chromatic rainbow reflection with a digital-era holographic glow. High-fashion Y2K aesthetic meets premium craftsmanship.",
      "Real dried flowers.": "Hand-selected botanical specimens preserved in crystal-clear gel. A bespoke couture piece bringing nature to your fingertips.",
      "White marble with gold leaf veins.": "Italian Carrara-inspired marble patterns with hand-applied 24K gold leaf veining for the ultimate elite aesthetic.",
      "Classic tortoiseshell pattern.": "A sophisticated heritage pattern with rich amber and mahogany tones, hand-layered for depth and timeless style.",
      "Syrup-like translucency.": "A high-gloss, syrup-like Vitrail finish with seamless ombré transitions. Sophisticated translucency for a refined look.",
      "Full AB crystal coverage.": "A masterpiece of light-refracting Swarovski-style crystals. Full pavé coverage for maximum brilliance and red-carpet glamour.",
      "Cottagecore-inspired micro art.": "Meticulously hand-painted micro-art featuring artisanal cherry motifs. A charming, bespoke cottagecore-luxe expression.",
      "Neutral base with minimalist swirls.": "A minimalist modernist canvas featuring hand-drawn fluid lines. Architectural beauty for the contemporary art lover.",
      "Iridescent pearl finish.": "A sophisticated nacreous finish with multi-dimensional pearl luster. Classic, luminous, and undeniably chic.",
      "Luxe care + Gel": "Luxe care + Gel",
      "Soak + Treatment + Gel": "Soak + Treatment + Gel",
      "Premium extensions": "Premium extensions",
      "1:1 natural look": "1:1 natural look",
      "Texture & Volume": "Texture & Volume",
      "Dramatic glam": "Dramatic glam",
      "Detailed cuticle care, shaping, and high-quality gel polish. Includes organic oil hand massage.": "Detailed cuticle care, shaping, and high-quality gel polish. Includes organic oil hand massage.",
      "Relaxing soak, exfoliation, callous treatment, and hydrating mask with gel finish.": "Relaxing soak, exfoliation, callous treatment, and hydrating mask with gel finish.",
      "The gold standard of extensions. Lightweight, durable, and natural-looking full-cover sets.": "The gold standard of extensions. Lightweight, durable, and natural-looking full-cover sets.",
      "1:1 application for a refined, 'mascara-only' look with customized curl.": "1:1 application for a refined, 'mascara-only' look with customized curl.",
      "A sophisticated blend of classic and volume for added texture and soft fluffiness.": "A sophisticated blend of classic and volume for added texture and soft fluffiness.",
      "Multi-lash fans for a dramatic, dense, and glamorous editorial look.": "Multi-lash fans for a dramatic, dense, and glamorous editorial look."
    },
    home: {
      featured_badge: "Curated Sets",
      featured_title: "Featured",
      featured_titleItalic: "Collection",
      explore_shop: "Explore Shop",
      excellence: "Excellence",
      services_title: "Signature",
      services_titleItalic: "Treatments",
      services_subtitle: "Our services go beyond the surface. We provide curated experiences for the modern minimalist.",
      download_menu: "Download Menu",
      placeholder: "Visual Placeholder",
      service_category: "Service Category",
      starting_from: "Starting from",
      portfolio: "The Portfolio",
      gallery_title: "Artistic",
      gallery_titleItalic: "Curation",
      style1: "Modern Minimal",
      style2: "Avant-Garde",
      style3: "Pure Silk",
      style4: "Seasonal Edit 2026",
      service1: { name: "Artistic Manicure", desc: "Custom hand-painted designs on natural nails." },
      service2: { name: "Gel Extensions", desc: "Durable, high-gloss extensions with artistic shaping." },
      service3: { name: "Spa Pedicure", desc: "Revitalizing treatment with premium organic oils." }
    },
    footer: {
      instagram: "Instagram",
      pinterest: "Pinterest",
      privacy: "Privacy",
      tagline: "DESIGNED FOR THE EXTRAORDINARY.",
      brand: "BabyNails",
      location: "Est. 2026 • Vancouver, BC"
    },
    about: {
      badge: "Manifesto",
      title: "Artistry in the",
      titleItalic: "Details",
      p1: "Founded in 2026, BabyNails was born from a desire to redefine the nail salon experience. We saw a gap between the clinical and the creative—so we built a bridge.",
      p2: "Our philosophy is simple: your nails are the smallest canvas you own, and they deserve nothing less than museum-grade attention. We specialize in minimalist, high-fashion nail art that complements your personal style rather than competing with it.",
      quote: "\"We don't just do nails. We curate the tips of your fingers.\"",
      ethos: "Studio Ethos"
    },
    hero_extra: {
      studio_view: "Studio View",
      handcrafted: "Handcrafted • Artistic • Minimal •",
      scroll: "Scroll to Explore"
    },
    gallery: {
      badge: "Exhibition",
      title: "The",
      titleItalic: "Visual",
      titleEnd: "Archive",
      desc: "A curated selection of our most distinctive works. Hand-painted, hand-sculpted, handcrafted.",
      pure_silk: "Pure Silk",
      midnight_bloom: "Midnight Bloom",
      sahara_mist: "Sahara Mist",
      gilded_edge: "Gilded Edge",
      ivory_coast: "Ivory Coast",
      rose_quartz: "Rose Quartz",
      minimalist: "Minimalist",
      avant_garde: "Avant-Garde",
      seasonal: "Seasonal",
      editorial: "Editorial",
      nature: "Nature"
    },
    shop_extra: {
      no_products: "No products found in this category.",
      refining: "Refining Visual",
      quick_view: "Quick View"
    },
    product: {
      authenticating: "Authenticating Assets...",
      custom_fit: "Custom-sized to fit your natural nails perfectly",
      fast_shipping: "Fast & tracked shipping worldwide",
      reusable: "Reusable & durable (up to 3 weeks wear)",
      add_to_bag: "Add to Bag",
      virtual_tryon: "Virtual Try-On",
      curated_for_you: "Curated for You",
      more_collection: "More from the Collection",
      view_all: "View All"
    }
  },
  zh: {
    nav: {
      services: "专业服务",
      shop: "精品店",
      about: "关于我们",
      book: "立即预约"
    },
    items: {
      "Classic Velvet Cat-Eye": "午夜丝绒猫眼",
      "Minimalist Milky White": "极简象牙白",
      "3D Chrome Molten Gold": "24K 熔金艺术",
      "French Glazed Donut": "经典海莉幻彩",
      "Matte Gothic Noir": "曜石哑光黑",
      "Blush Aura": "幻粉氛围感 (韩式)",
      "Cyberpunk Holo-Graphic": "棱镜镭射艺术",
      "Pressed Flower Clear": "高级定制干花",
      "Luxury Coffin Marble": "顶级大理石纹",
      "Short Squoval Tortoise": "经典传承玳瑁",
      "Jelly Tint Ombre": "琉璃糖浆渐变",
      "Rhinestone Encrusted": "高级工坊手工镶钻",
      "Hand-Painted Cherry Print": "匠心手绘樱桃",
      "Abstract Line Art": "现代主义线条艺术",
      "Pearl Glaze Almond": "珠光母贝质感",
      "Signature Gel Manicure": "招牌凝胶美甲",
      "Luxury Spa Pedicure": "奢华水疗足浴",
      "Gel-X Extensions": "Gel-X 延长甲",
      "Natural Classic Set": "自然经典款美睫",
      "Signature Hybrid Set": "招牌混合款美睫",
      "Grand Volume Set": "浓密大容量美睫",
      "Essential": "经典基础系列",
      "Boutique": "时尚精品系列",
      "Couture": "高级定制系列",
      "Nails": "美甲服务",
      "Eyelashes": "美睫服务",
      "Deep magnetic shimmering finish.": "多维磁性饰面，带来深邃的丝绒质感与定制闪烁，尽显晚宴级的奢华。",
      "Semi-translucent 'clean girl' aesthetic.": "极致的象牙半透明质感，专为追求精致、低调‘纯欲风’与永恒优雅的女性打造。",
      "High-shine metallic drips.": "前卫的 3D 金属艺术，融合 24K 灵感的熔金纹理，打造大胆的雕塑感视觉。",
      "The Hailey Bieber classic.": "标志性的高光幻彩涂层。轻盈精致的珍珠光泽，定义现代奢华审美。",
      "Sharp stiletto shape.": "曜石般的深邃哑光质感，搭配精准设计的尖底廓形。大胆且极具建筑感。",
      "Soft pink gradient 'aura'.": "灵感源自韩式氛围美学，柔焦粉色渐变带来轻盈浪漫的视觉享受。",
      "Y2K inspired rainbow reflective finish.": "多色域彩虹反光，带来自带滤镜的镭射光泽。复古 Y2K 与高端工艺的完美结合。",
      "Real dried flowers.": "精选植物标本嵌入晶莹剔透的凝胶中。指尖上的高级定制，尽显自然之美。",
      "White marble with gold leaf veins.": "意大利卡拉拉大理石纹理，点缀手工贴金箔工艺，打造精英级的美学标准。",
      "Classic tortoiseshell pattern.": "充满韵味的传承图案，丰富的琥珀与红木色调手工层叠，展现经典的深度与风格。",
      "Syrup-like translucency.": "如琉璃般剔透的糖浆质感，配以无缝渐变，展现精致细腻的通透美感。",
      "Full AB crystal coverage.": "如施华洛世奇般耀眼的折射杰作。全手工密镶工艺，定格红毯级的璀璨瞬间。",
      "Cottagecore-inspired micro art.": "极其细腻的手绘微型艺术，呈现匠心樱桃图案。充满田园奢华风的个性表达。",
      "Neutral base with minimalist swirls.": "现代主义极简画布，饰以手工绘制的流体线条。为当代艺术爱好者而生的建筑美感。",
      "Iridescent pearl finish.": "精致的珍珠母贝质感，带有多维度的珍珠光泽。经典、灵动且不失高级感。",
      "Luxe care + Gel": "奢华护理 + 顶级凝胶",
      "Soak + Treatment + Gel": "舒缓足浴 + 深层护理 + 凝胶",
      "Premium extensions": "顶级材质延长甲",
      "1:1 natural look": "1:1 自然睫毛嫁接",
      "Texture & Volume": "质感与丰盈并存",
      "Dramatic glam": "舞台级浓密浓密效果",
      "Detailed cuticle care, shaping, and high-quality gel polish. Includes organic oil hand massage.": "细致去皮、塑形及高品质凝胶上色。包含有机精油手部按摩。",
      "Relaxing soak, exfoliation, callous treatment, and hydrating mask with gel finish.": "放松足浴、去角质、老茧处理及补水足膜，最后进行凝胶上色。",
      "The gold standard of extensions. Lightweight, durable, and natural-looking full-cover sets.": "延甲的金标准。轻盈、持久且效果极其自然的甲片。",
      "1:1 application for a refined, 'mascara-only' look with customized curl.": "1:1 精准嫁接，打造精致的‘原生感’及定制卷度。",
      "A sophisticated blend of classic and volume for added texture and soft fluffiness.": "经典款与容量款的完美结合，增加层次感与柔顺度。",
      "Multi-lash fans for a dramatic, dense, and glamorous editorial look.": "多根扇形嫁接，打造戏剧化、浓密且极具魅惑力的视觉效果。"
    },
    hero: {
      badge: "重新定义奢华美甲",
      title: "指尖上的",
      titleItalic: "艺术",
      subtitle: "位于温哥华的高端 AI 定制穿戴甲与顶级美睫美甲工作室。",
      cta: "探索系列",
      tryon: "虚拟试戴"
    },
    shop: {
      badge: "精品系列",
      title: "匠心穿戴甲",
      filters: {
        all: "全部款式",
        essential: "基础款",
        boutique: "精品款",
        couture: "高定款"
      },
      add: "加入购物车",
      back: "返回系列",
      craftsmanship_desc: "采用高品质凝胶产品手工精制，为您在家中打造专业的沙龙级妆效。每套包含 10 片指甲、胶水、果冻胶及预处理工具包。"
    },
    services: {
      badge: "服务菜单",
      title: "悦享",
      titleItalic: "体验",
      nails: {
        title: "招牌美甲护理",
        desc: "专注于健康、精准与高街时尚审美的温哥华定制美甲及足部护理体验。"
      },
      lashes: {
        title: "美睫工坊",
        desc: "专业睫毛嫁接技术，旨在通过结构完整性提升您的自然美感。"
      }
    },
    cart: {
      title: "购物袋",
      empty: "您的购物袋是空的",
      start: "去购物",
      total: "总计",
      checkout: "立即结算",
      shipping: "所有穿戴甲订单均享受免费配送。"
    },
    book: {
      badge: "在线预约",
      title: "预约您的",
      titleItalic: "专属时段",
      name: "全名",
      email: "电子邮箱",
      experience: "选择服务项目",
      cta: "提交预约请求",
      submitting: "正在提交...",
      disclaimer: "* 所有预约均需视工作室档期而定。",
      success_title: "预约请求已收到",
      success_desc: "我们已收到您的预约申请。我们的团队将很快与您联系以确认最终时段。",
      back: "发起另一项预约"
    },
    home: {
      featured_badge: "精选系列",
      featured_title: "精品",
      featured_titleItalic: "推荐",
      explore_shop: "浏览商店",
      excellence: "卓越品质",
      services_title: "招牌",
      services_titleItalic: "护理项目",
      services_subtitle: "我们的服务不仅仅停留于表面。我们为现代极简主义者提供精心策划的感官体验。",
      download_menu: "下载价目表",
      placeholder: "视觉占位",
      service_category: "服务类别",
      starting_from: "起价",
      portfolio: "作品集",
      gallery_title: "艺术",
      gallery_titleItalic: "策展",
      style1: "现代极简",
      style2: "前卫艺术",
      style3: "纯丝质感",
      style4: "2026 季节限定",
      service1: { name: "艺术美甲", desc: "在真甲上进行的定制手工彩绘设计。" },
      service2: { name: "凝胶延长", desc: "持久、高光泽的艺术塑形延长甲。" },
      service3: { name: "水疗足浴", desc: "使用顶级有机精油的焕活护理。" }
    },
    footer: {
      instagram: "Instagram",
      pinterest: "Pinterest",
      privacy: "隐私政策",
      tagline: "为非凡而设计。",
      brand: "BabyNails",
      location: "创立于 2026 • 温哥华"
    },
    about: {
      badge: "品牌宣言",
      title: "细节里的",
      titleItalic: "艺术",
      p1: "BabyNails 创立于 2026 年，源于我们重新定义美甲沙龙体验的愿望。我们发现了临床与创意之间的鸿沟——于是我们架起了一座桥梁。",
      p2: "我们的理念很简单：您的指甲是您拥有的最小的画布，它们理应获得博物馆级别的关注。我们专注于极简、高级时装风格的美甲艺术，旨在衬托您的个人风格，而非与之竞争。",
      quote: "\"我们不只是做指甲，我们为您的指尖策展。\"",
      ethos: "工作室理念"
    },
    hero_extra: {
      studio_view: "工作室一览",
      handcrafted: "匠心手作 • 艺术之美 • 极简风尚 •",
      scroll: "向下滚动探索"
    },
    gallery: {
      badge: "展览",
      title: "视觉",
      titleItalic: "典藏",
      titleEnd: "馆",
      desc: "精选我们最具特色的作品。手工彩绘、手工雕塑、匠心打造。",
      pure_silk: "纯丝质感",
      midnight_bloom: "午夜绽放",
      sahara_mist: "撒哈拉薄雾",
      gilded_edge: "镶金边缘",
      ivory_coast: "象牙海岸",
      rose_quartz: "粉晶玫瑰",
      minimalist: "极简主义",
      avant_garde: "前卫艺术",
      seasonal: "季节限定",
      editorial: "时尚大片",
      nature: "自然灵感"
    },
    shop_extra: {
      no_products: "该分类下暂无产品。",
      refining: "视觉优化中",
      quick_view: "快速查看"
    },
    product: {
      authenticating: "资源认证中...",
      custom_fit: "定制尺寸，完美贴合您的天然指甲",
      fast_shipping: "全球快速追踪配送",
      reusable: "可重复使用且耐用（最长佩戴 3 周）",
      add_to_bag: "加入购物袋",
      virtual_tryon: "虚拟试戴",
      curated_for_you: "为您精选",
      more_collection: "更多系列产品",
      view_all: "查看全部"
    }
  }
};
