/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useSearchParams
} from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Clock,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Types ---

const COLORS = {
  primary: '#003399', // Royal Blue
  secondary: '#00AEEF', // Water Blue
  accent: '#FF9900', // Orange-Yellow
  lightGray: '#F5F7FA',
  darkGray: '#333333',
};

type Category = 'All' | 'Premium Nutrition' | 'Children Nutrition' | 'Skin Care';

interface Product {
  id: number;
  name: string;
  category: Category;
  brand: string;
  effects: string[];
  targetAudience: string[];
  description: string;
  image: string;
  tags: string[];
}

const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: '安泰 Antioxidant', 
    category: 'Premium Nutrition', 
    brand: '寶德 Bode',
    effects: ['抗氧化', '增強體力'],
    targetAudience: ['成人', '銀髮族'],
    description: '歐洲高規格製造，優質營養補充。', 
    image: 'https://picsum.photos/seed/antiox/400/400', 
    tags: ['抗氧化', '成人'] 
  },
  { 
    id: 2, 
    name: '補氣易 Breath Easy', 
    category: 'Premium Nutrition', 
    brand: '寶德 Bode',
    effects: ['呼吸道保健', '舒緩不適'],
    targetAudience: ['成人', '兒童'],
    description: '維持呼吸道健康，舒緩不適感。', 
    image: 'https://picsum.photos/seed/breath/400/400', 
    tags: ['呼吸道', '草本'] 
  },
  { 
    id: 3, 
    name: '達敏順 Probiosup', 
    category: 'Children Nutrition', 
    brand: 'Dr. 惠而',
    effects: ['消化道機能', '調整體質'],
    targetAudience: ['兒童'],
    description: '專為兒童設計的益生菌配方。', 
    image: 'https://picsum.photos/seed/probiotic/400/400', 
    tags: ['益生菌', '兒童'] 
  },
  { 
    id: 4, 
    name: '維他命C時空膠囊 Vitamin C', 
    category: 'Skin Care', 
    brand: 'Bode Beauté',
    effects: ['亮白', '緊緻'],
    targetAudience: ['女性', '愛美族'],
    description: '高濃度維他命C，亮白緊緻肌膚。', 
    image: 'https://picsum.photos/seed/vitc/400/400', 
    tags: ['亮白', '保養'] 
  },
  { 
    id: 5, 
    name: '魚油 Fish Oil', 
    category: 'Premium Nutrition', 
    brand: '寶德 Bode',
    effects: ['心血管保健', '循環順暢'],
    targetAudience: ['成人', '銀髮族'],
    description: '純淨深海魚油，富含Omega-3。', 
    image: 'https://picsum.photos/seed/fishoil/400/400', 
    tags: ['心血管', 'Omega-3'] 
  },
  { 
    id: 6, 
    name: '多胜肽時空膠囊 Multipeptide', 
    category: 'Skin Care', 
    brand: 'Bode Beauté',
    effects: ['抗老', '修復'],
    targetAudience: ['女性', '熟齡肌'],
    description: '對抗歲月痕跡，深層修復肌膚。', 
    image: 'https://picsum.photos/seed/peptide/400/400', 
    tags: ['抗老', '修復'] 
  },
  { 
    id: 7, 
    name: '寶德DHA魚油 SuperDHA', 
    category: 'Children Nutrition', 
    brand: 'Dr. 惠而',
    effects: ['大腦發育', '視力保健'],
    targetAudience: ['兒童', '學生'],
    description: '幫助兒童大腦發育，提升學習力。', 
    image: 'https://picsum.photos/seed/dha/400/400', 
    tags: ['大腦', '兒童'] 
  },
  { 
    id: 8, 
    name: '清純 Cholescaps', 
    category: 'Premium Nutrition', 
    brand: '寶德 Bode',
    effects: ['代謝調整', '膽固醇管理'],
    targetAudience: ['成人', '外食族'],
    description: '維持膽固醇健康，促進新陳代謝。', 
    image: 'https://picsum.photos/seed/choles/400/400', 
    tags: ['代謝', '成人'] 
  },
  { 
    id: 9, 
    name: '鈣力強 Calcium Plus', 
    category: 'Premium Nutrition', 
    brand: '寶德 Bode',
    effects: ['骨骼健康', '牙齒發育'],
    targetAudience: ['成人', '銀髮族', '孕婦'],
    description: '高吸收率鈣質配方，強化骨骼。', 
    image: 'https://picsum.photos/seed/calcium/400/400', 
    tags: ['骨骼', '補鈣'] 
  },
  { 
    id: 10, 
    name: '葉黃素 Lutein Eye', 
    category: 'Premium Nutrition', 
    brand: '寶德 Bode',
    effects: ['視力保健', '舒緩疲勞'],
    targetAudience: ['上班族', '學生', '3C族'],
    description: '黃金比例葉黃素，守護明亮之窗。', 
    image: 'https://picsum.photos/seed/eye/400/400', 
    tags: ['視力', '葉黃素'] 
  },
];

// --- Layout Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: '首頁', href: '/' },
    { 
      name: '產品介紹', 
      href: '/products',
      dropdown: [
        { name: '寶德 Bode 頂級營養', href: '/products?category=Premium Nutrition' },
        { name: 'Dr. 惠而 兒童營養', href: '/products?category=Children Nutrition' },
        { name: 'Bode Beauté 寶麗美膚保養', href: '/products?category=Skin Care' },
      ]
    },
    { name: '關於我們', href: '/about' },
    { name: '最新消息', href: '/news' },
    { name: '常見問題', href: '/faq' },
    { name: '聯繫我們', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <div className="text-2xl font-bold tracking-tighter" style={{ color: COLORS.primary }}>
              BODE <span style={{ color: COLORS.secondary }}>寶德榮蒙</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => item.dropdown && setIsDropdownOpen(true)}
                onMouseLeave={() => item.dropdown && setIsDropdownOpen(false)}
              >
                <Link
                  to={item.href}
                  className={`text-sm font-medium h-20 flex items-center transition-colors border-b-2 ${
                    location.pathname === item.href 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-700 border-transparent hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>

                {item.dropdown && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-b-2xl overflow-hidden"
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-6 py-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Search size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-6 bg-gray-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-3 py-3 text-sm text-gray-500 hover:text-blue-600"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="text-2xl font-bold tracking-tighter mb-6" style={{ color: COLORS.primary }}>
              BODE <span style={{ color: COLORS.secondary }}>寶德榮蒙</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              來自歐洲、高規格保健品、頂級原料精密製造、50年以上信賴。針對各需求提供效果好的營養素補充。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">產品系列</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/products" className="hover:text-blue-600 transition-colors">寶德頂級營養系列</Link></li>
              <li><Link to="/products" className="hover:text-blue-600 transition-colors">惠而兒童營養系列</Link></li>
              <li><Link to="/products" className="hover:text-blue-600 transition-colors">寶麗美膚保養系列</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">快速連結</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">關於我們</Link></li>
              <li><Link to="/news" className="hover:text-blue-600 transition-colors">最新消息</Link></li>
              <li><Link to="/faq" className="hover:text-blue-600 transition-colors">常見問題</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">訂閱電子報</h4>
            <p className="text-xs text-gray-500 mb-4">獲取最新的健康資訊與優惠活動。</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="您的 Email" 
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                訂閱
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-400">
            © 2026 寶德榮蒙有限公司. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <a href="#" className="hover:text-blue-600 transition-colors">服務條款</a>
            <a href="#" className="hover:text-blue-600 transition-colors">免責聲明</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Page Components ---

const Hero = () => {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1920&auto=format&fit=crop"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Globe size={14} />
            <span>來自歐洲的頂級守護</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            永續經營 <span style={{ color: COLORS.secondary }}>用心製造</span><br />
            的優質保健品
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            寶德榮蒙自 1966 年創立至今，超過 60 年信譽卓越。<br className="hidden md:block" />
            我們堅持使用業界最好的原料與藥品級製程，守護您與全家人的健康。
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const CompanyIntro = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-[3rem] p-12 lg:p-20 border border-blue-100 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: COLORS.secondary }}>公司簡介</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
              唯有堅持品質，才能永續經營
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              寶德榮蒙是臺灣歷史最悠久的德國進口維他命品牌。林廷燦先生於民國 53 年創立，憑藉豐富的醫學知識，積極尋找歐洲頂級藥廠，將高品質的健康守護帶回臺灣。
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">60+</div>
                <div className="text-sm text-gray-500 font-medium">年品牌信譽</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-sm text-gray-500 font-medium">歐洲原裝進口</div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://picsum.photos/seed/heritage/800/600" 
              alt="Heritage" 
              className="rounded-3xl shadow-2xl w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCategorySection = ({ 
  title, 
  subtitle, 
  description, 
  category, 
  bgColor = 'bg-white' 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  category: Category;
  bgColor?: string;
}) => {
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.category === category).slice(0, 3);
  }, [category]);

  return (
    <section className={`py-24 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
          <div className="lg:w-1/3">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: COLORS.secondary }}>{subtitle}</h2>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">{title}</h3>
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-md font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center text-blue-600 text-xs font-bold">
                    <span>了解更多</span>
                    <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-12 lg:p-20">
            <h2 className="text-3xl font-bold text-white mb-8">聯繫我們</h2>
            <p className="text-slate-400 mb-12">
              如果您對產品有任何疑問，或有合作需求，歡迎隨時與我們聯繫。
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center space-x-6 text-slate-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">電話諮詢</div>
                  <div className="text-lg font-semibold">02-1234-5678</div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-slate-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">電子郵件</div>
                  <div className="text-lg font-semibold">info@bode.com.tw</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 bg-slate-800/50 p-12 lg:p-20 border-l border-slate-700/50">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="您的姓名"
                />
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="您的電話"
                />
              </div>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="your@email.com"
              />
              <textarea 
                rows={4}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="請輸入您的問題..."
              />
              <button 
                type="submit"
                className="w-full py-4 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                style={{ backgroundColor: COLORS.primary }}
              >
                送出諮詢表單
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <Hero />
    <CompanyIntro />
    <ProductCategorySection 
      title="寶德 Bode 頂級營養"
      subtitle="Premium Nutrition"
      description="來自歐洲、高規格保健品、頂級原料精密製造、50年以上信賴。針對各需求提供效果好的營養素補充。"
      category="Premium Nutrition"
      bgColor="bg-gray-50"
    />
    <ProductCategorySection 
      title="Dr. 惠而 兒童營養"
      subtitle="Children Nutrition"
      description="專為兒童成長發育設計，嚴選純淨原料，提供全方位的健康守護，讓孩子贏在起跑點。"
      category="Children Nutrition"
      bgColor="bg-white"
    />
    <ProductCategorySection 
      title="Bode Beauté 寶麗美膚保養"
      subtitle="Skin Care"
      description="結合瑞士高科技與天然植萃，提供極緻專業的肌膚呵護，展現自然透亮的健康光采。"
      category="Skin Care"
      bgColor="bg-gray-50"
    />
    <ContactForm />
  </>
);

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as Category) || 'All';
  
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);

  // Update category if URL changes
  React.useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat as Category);
    } else {
      setActiveCategory('All');
    }
  }, [searchParams]);

  const brands = ['寶德 Bode', 'Dr. 惠而', 'Bode Beauté'];
  const effects = ['抗氧化', '呼吸道保健', '消化道機能', '亮白', '心血管保健', '抗老', '大腦發育', '代謝調整', '骨骼健康', '視力保健'];
  const audiences = ['成人', '兒童', '女性', '銀髮族', '上班族', '學生', '孕婦'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesEffect = selectedEffects.length === 0 || p.effects.some(e => selectedEffects.includes(e));
      const matchesAudience = selectedAudience.length === 0 || p.targetAudience.some(a => selectedAudience.includes(a));
      return matchesCategory && matchesBrand && matchesEffect && matchesAudience;
    });
  }, [activeCategory, selectedBrands, selectedEffects, selectedAudience]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Category Tabs Bar */}
      <div className="bg-blue-400 py-4 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4 md:space-x-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'All', name: '全部產品' },
              { id: 'Premium Nutrition', name: '寶德 Bode 頂級營養' },
              { id: 'Children Nutrition', name: 'Dr. 惠而 兒童營養' },
              { id: 'Skin Care', name: 'Bode Beauté 寶麗美膚保養' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-40 space-y-10">
              {/* Brand Filter */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">品牌系列</h4>
                <div className="space-y-3">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)}
                        />
                        <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                      </div>
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Effects Filter */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">功效</h4>
                <div className="space-y-3">
                  {effects.map(effect => (
                    <label key={effect} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all"
                          checked={selectedEffects.includes(effect)}
                          onChange={() => toggleFilter(selectedEffects, setSelectedEffects, effect)}
                        />
                        <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                      </div>
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{effect}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Audience Filter */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">適用對象</h4>
                <div className="space-y-3">
                  {audiences.map(audience => (
                    <label key={audience} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all"
                          checked={selectedAudience.includes(audience)}
                          onChange={() => toggleFilter(selectedAudience, setSelectedAudience, audience)}
                        />
                        <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                      </div>
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{audience}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-8 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                顯示 <span className="font-bold text-gray-900">{filteredProducts.length}</span> 件產品
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">排序:</span>
                <select className="text-sm font-bold bg-transparent border-none focus:ring-0 cursor-pointer">
                  <option>精選推薦</option>
                  <option>最新上市</option>
                  <option>熱銷排行</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-50 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-bold uppercase tracking-wider text-blue-600 shadow-sm">
                          {product.brand}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.effects.slice(0, 2).map(effect => (
                          <span key={effect} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                            {effect}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                        {product.description}
                      </p>
                      <button className="w-full py-3 rounded-xl bg-gray-50 text-gray-700 text-sm font-bold flex items-center justify-center space-x-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <span>查看詳情</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">找不到符合條件的產品</h3>
                <p className="text-gray-500">請嘗試調整篩選條件或清除所有過濾器。</p>
                <button 
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedEffects([]);
                    setSelectedAudience([]);
                    setActiveCategory('All');
                  }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  清除所有篩選
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-20 min-h-screen bg-white">
    {/* About Hero */}
    <section className="relative py-24 bg-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1579165466541-74e246905d4a?q=80&w=1920&auto=format&fit=crop" 
          alt="Laboratory" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">關於我們 About Us</h1>
          <p className="text-xl md:text-2xl font-light text-blue-100 max-w-3xl mx-auto leading-relaxed">
            寶德保健世家 Bode 品質代名詞
          </p>
        </motion.div>
      </div>
    </section>

    {/* New Top Section: Sustainable Quality */}
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            永續經營、用心製造的優質保健品
          </h2>
          <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-10">
            歐洲進口，頂級藥廠製造 – 秉持「堅持品質、永續經營」的企業文化
          </h3>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            <p>
              提供高品質的成份，頂級原料、專業合宜的配方及劑量，讓使用寶德產品的人可以得到最大的好處，並符合他們對健康生活的期待。
            </p>
            <p>
              寶德從 1966 年創立至今，超過 60 年信譽卓著，以口碑著稱。您的謹慎選擇，守護您和您全家人的健康。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
              寶德品牌理念 – 唯有堅持品質，才能永續經營
            </h4>
            <p className="text-gray-600 leading-relaxed">
              寶德始終堅持最高品質哲學要求，並不斷研發及技術改良，所以寶德高品質的形象與聲譽，也因使用者口耳相傳的力量，傳到世界各個角落。
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
              寶德承諾 – 嚴選原料及優良製造技術
            </h4>
            <p className="text-gray-600 leading-relaxed">
              嚴選優質原料及優良製造廠是寶德最基本的堅持，我們的製造廠通過美國聯邦藥物食品管理局或歐盟衛生局定期查核，皆符合藥物食品製造安全規範標準的藥廠製造寶德產品，是我們要求高品質的第一步。
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
              理想的配方和劑量 – 唯有良心事業，才能共創優質健康人生
            </h4>
            <p className="text-gray-600 leading-relaxed">
              營養專家針對不同族群的需求，調配適合各族群配方的系列產品，成分完整，含量適當。所以寶德推出專業配方、價格合理的產品，與您共創優質的健康人生。
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
              產品種類齊全，提供完整的營養補充
            </h4>
            <p className="text-gray-600 leading-relaxed">
              寶德系列產品種類齊全，能迎合各年齡和需求的營養需求。無論大人、小孩、繁忙的上班族、操勞家庭主婦的或銀髮族的營養補給都能獲得適當的產品。
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Bode Beauté Skin Care Section */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: COLORS.secondary }}>Bode Beauté</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
              寶麗美膚保養系列
            </h3>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Bode Beauté 寶麗軟膠囊保養品研究室在瑞士的 Cham Switzerland。我們的保養品製造廠擁有強大的實驗室與科學家，隨時提供客戶最好的科技產品。
              </p>
              <p>
                Bode Beauté 寶麗致力於高科技護膚產品之開發，在不斷研發的專屬實驗室，擁有許多世界專利，產品使用的 Vegicaps® 和 Microsponge® 為最新專利科技，運用在保養品上，讓你感受極緻專業的保養品。
              </p>
              <p>
                Bode Beauté 寶麗軟膠囊是用獨特的 Vegicaps® 包材、封裝技術。Vegicaps® 只用植物性的原料製作，沒有任何動物殘留，讓您用得更安心。
              </p>
              <p>
                無菌真空包裝技術，完整保存保養品的活性，讓每顆膠囊就像一瓶新開的保養品一樣，不會遭到外界汙染或氧化。
              </p>
              <p>
                Bode 的製造廠在生產過程的每一步驟，都嚴格要求，達到最高標準，其製造過程都在乾淨的無塵環境裡使用先進的現代設備製造，並通過歐盟以及美國 FDA 的認可，因此保證每一顆軟膠囊的品質都是最好的。
              </p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop" 
              alt="Bode Beauté Skin Care" 
              className="rounded-[3rem] shadow-2xl w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Softgel Advantages Section */}
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: COLORS.secondary }}>Bode 軟膠囊</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">劑型優勢</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            軟膠囊比傳統錠劑或硬膠囊的吸收度高，所以人體更能有效利用。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-blue-600 mb-4 font-bold text-lg">‧ 較高的生體可用率</div>
            <p className="text-gray-500 text-sm">Better total bioavailability (AUC)</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-blue-600 mb-4 font-bold text-lg">‧ 較快的吸收速率</div>
            <p className="text-gray-500 text-sm">More rapid rate of absorption (tmax)</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="text-blue-600 mb-4 font-bold text-lg">‧ 較高的血液濃度</div>
            <p className="text-gray-500 text-sm">Higher blood levels (Cmax)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 leading-relaxed">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <p>利用高準確度的精密儀器，將有效成份均勻完全注入軟膠中，量當然精準。</p>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <p>因軟膠囊有遮光及避免氧化的作用，所以可減少有效成份接觸光線或空氣的機會，因此穩定度較高。</p>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <p>軟膠囊能遮掩藥味，所以不會像錠劑容易有藥味殘留於口腔內。</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <p>軟膠囊本身的明膠因遇水而溶解，能產生滑溜感，因此容易吞食。</p>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <p>軟膠囊讓使用者服用方便、攜帶容易，因此接受度高。</p>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <p>在日常生活中常常可以接觸到軟膠囊的產品，軟膠囊是一種固體劑型，將藥品或食品萃取物盛於軟質明膠殼內而製成。無論是藥品或保健類食品，都帶給人們很大的便利性。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Bode History Section */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: COLORS.secondary }}>Bode 寶德歷史</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
              傳承半世紀的<br />健康承諾
            </h3>
            <div className="p-8 bg-blue-600 rounded-3xl text-white">
              <p className="text-lg font-medium leading-relaxed">
                我們的維他命和保健品都是以健康為優先，只堅持使用業界最好的原料和藥品級的製程。
              </p>
            </div>
          </div>
          <div className="lg:w-2/3 space-y-8 text-lg text-gray-600 leading-relaxed">
            <p>
              Bode 寶德是臺灣歷史最悠久的德國進口維他命品牌，其中最著名的產品有 Vitop 頂維他綜合維他命、Preg 保麗能婦女維他命、EPSOL-S 維他命E 還有 Pamcap 頂級濃縮南瓜籽油。
            </p>
            <p>
              林廷燦先生來自嘉義新港，他完成臺灣大學預科後就在他的家人、教授和朋友的支持下開始進口歐洲西藥和健康食品的行業。民國 53 年 (1964)，他在台北市寧靜的巷子內成立貿易公司，專門進口歐洲西藥、原料和醫療器材。林先生憑著他流利的外文和豐富的醫學知識積極去尋找歐洲頂級藥廠和原料廠。果然，在幾年的努力下，很幸運地能夠深厚認識了許多德國、瑞士和丹麥的藥廠。
            </p>
            <p>
              50 年來我們延續了林廷燦先生醫學知識和對保健領域的熱誠：努力尋找最好的原料和製程給我們的忠實客戶。我們在設計保健品就猶如在照顧自己的家人，因此只有吃了有效、吃得健康、吃的安心的頂級產品才會拿出來和大家分享。我們一直相信，只有好的產品才能禁得起時間的考驗和長久滿足客戶對健康的期望。
            </p>
            <div className="pt-8">
              <img 
                src="https://picsum.photos/seed/history/1200/600" 
                alt="Bode History" 
                className="rounded-[3rem] shadow-xl w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const NewsPage = () => (
  <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold mb-8">最新消息</h1>
    <p className="text-gray-600">獲取最新的健康資訊與公司動態。</p>
  </div>
);

const FAQPage = () => (
  <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold mb-8">常見問題</h1>
    <p className="text-gray-600">解答您對產品與服務的各種疑問。</p>
  </div>
);

const ContactPage = () => (
  <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl font-bold mb-8">聯繫我們</h1>
    <ContactForm />
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
