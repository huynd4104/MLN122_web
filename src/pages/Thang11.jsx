import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";

// ── DATA ─────────────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
    {
        year: "2009",
        label: "Ra đời",
        icon: "🎉",
        color: "#fbbf24",
        rev: "$50 Triệu",
        desc:
            "Alibaba khởi xướng Singles' Day 11/11 như ngày khuyến mãi đầu tiên (doanh thu ~50M USD).",
    },
    {
        year: "2013",
        label: "Kỷ lục",
        icon: "🔥",
        color: "#34d399",
        rev: "$5.7 Tỷ",
        desc:
            "Doanh thu chính thức 5.7 tỷ USD (52 giờ), vượt Black Friday Mỹ toàn năm.",
    },
    {
        year: "2019",
        label: "Đỉnh cao",
        icon: "🏆",
        color: "#ef4444",
        rev: "$38.4 Tỷ",
        desc:
            "GMV 38.4 tỷ USD (268.4 tỷ NDT) trong 24h, tăng 25% so với 30.8 tỷ 2018.",
    },
    {
        year: "2023",
        label: "Toàn cầu",
        icon: "🌐",
        color: "#38bdf8",
        rev: "~$84 Tỷ",
        desc:
            "Alibaba + Tmall + Taobao + Lazada/Shopee VN hưởng lợi. E-commerce VN tăng 25%/năm.",
    },
];


const CART_ITEMS = [
    { id: 1, name: "Tai nghe Bluetooth", price: 199000, img: "🎧", oldPrice: 400000 },
    { id: 2, name: "Áo thun Local", price: 250000, img: "👕", oldPrice: 500000 },
    { id: 3, name: "Giày Sneaker", price: 1500000, img: "👟", oldPrice: 3000000 },
    { id: 4, name: "Bàn phím cơ", price: 890000, img: "⌨️", oldPrice: 1500000 },
    { id: 5, name: "Màn hình 27inch", price: 3500000, img: "🖥️", oldPrice: 5500000 },
    { id: 6, name: "Laptop Gaming", price: 15990000, img: "💻", oldPrice: 25000000 },
];

const FLASH_PRODUCTS = [
    { id: 1, name: "AirPods Pro", emoji: "🎧", oldPrice: 6000000, salePrice: 2490000, stock: 10 },
    { id: 2, name: "iPhone 16 Pro", emoji: "📱", oldPrice: 35000000, salePrice: 18500000, stock: 5 },
    { id: 3, name: "RTX 5090", emoji: "🖥️", oldPrice: 55000000, salePrice: 21000000, stock: 3 },
    { id: 4, name: "PS5 Slim", emoji: "🎮", oldPrice: 15000000, salePrice: 5990000, stock: 8 },
    { id: 5, name: "MacBook Air M4", emoji: "💻", oldPrice: 42000000, salePrice: 19900000, stock: 4 },
    { id: 6, name: "Dyson V15", emoji: "🌀", oldPrice: 18000000, salePrice: 7200000, stock: 12 },
    { id: 7, name: "Samsung QD-OLED", emoji: "📺", oldPrice: 40000000, salePrice: 14990000, stock: 6 },
    { id: 8, name: "Máy ảnh Sony A7V", emoji: "📷", oldPrice: 70000000, salePrice: 28000000, stock: 3 },
];

const SD_SCENARIOS = [
    {
        id: "normal",
        label: "Bình thường",
        icon: "📊",
        desc: "Thị trường cân bằng ổn định.",
        supply: 50,
        demand: 50,
        color: "#60a5fa",
    },
    {
        id: "sale11",
        label: "Ngày 11/11",
        icon: "🛒",
        desc: "Hàng triệu người mua cùng lúc, nhưng hàng hoá có hạn — giá leo thang tức thì!",
        supply: 20,
        demand: 90,
        color: "#f87171",
    },
    {
        id: "chip",
        label: "Khan hiếm chip",
        icon: "💾",
        desc: "Chip bán dẫn đứt chuỗi cung ứng (COVID-2020), cầu lớn mà cung sụp đổ.",
        supply: 15,
        demand: 75,
        color: "#fb923c",
    },
    {
        id: "flood",
        label: "Bão mùa lũ",
        icon: "🌊",
        desc: "Thần Thor giận dỗi, hàng tồn kho chất đống, giả cả lao dốc thê thảm!",
        supply: 85,
        demand: 20,
        color: "#34d399",
    },
];

const CORE_IDEAS = [
    {
        id: "luu_thong_tu_ban",
        label: "Lưu thông tư bản",
        icon: "💰",
        border: "border-blue-400",
        bg: "bg-blue-900/40",
        desc:
            "Trong nền kinh tế thị trường, tư bản vận động thông qua quá trình trao đổi hàng hóa và tiền tệ. Hàng hóa được bán để thu tiền, sau đó tiền lại được dùng để mua hàng hóa khác, tạo nên chu trình lưu thông liên tục của tư bản trong nền kinh tế.",
        borderColor: "#3b82f6",
    },
    {
        id: "cung_cau",
        label: "Cung - Cầu",
        icon: "⚖️",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc:
            "Giá cả hàng hóa trên thị trường chịu ảnh hưởng trực tiếp bởi quan hệ cung và cầu. Khi nhu cầu của người mua lớn hơn lượng hàng hóa cung cấp, giá thường tăng; ngược lại, khi nguồn cung vượt quá nhu cầu, giá sẽ có xu hướng giảm.",
        borderColor: "#34d399",
    },
    {
        id: "nen_tang",
        label: "Nền tảng số",
        icon: "💻",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc:
            "Các nền tảng thương mại điện tử đóng vai trò trung gian kết nối người bán và người mua. Thông qua phí dịch vụ, hoa hồng và quảng cáo, các nền tảng này thu lợi nhuận từ quá trình lưu thông hàng hóa và tăng tốc độ trao đổi trên thị trường.",
        borderColor: "#a78bfa",
    },
    {
        id: "tieu_dung",
        label: "Tiêu dùng cưỡng bức",
        icon: "🛒",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc:
            "Hoạt động quảng cáo, tiếp thị và thuật toán gợi ý sản phẩm có thể kích thích nhu cầu mua sắm vượt quá nhu cầu thực tế. Điều này thúc đẩy người tiêu dùng chi tiêu nhiều hơn và làm cho quá trình lưu thông hàng hóa diễn ra nhanh hơn.",
        borderColor: "#f97316",
    },
];

// ── COMPONENT: REAL-TIME COUNTER ─────────────────────────────────────────────
const SalesCounter = () => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);
    const display = useTransform(rounded, (val) => "$" + val.toLocaleString());

    useEffect(() => {
        const controls = animate(count, 38000000000, {
            duration: 10,
            ease: "circOut",
        });
        return controls.stop;
    }, [count]);

    return (
        <div className="text-center my-12">
            <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Mô phỏng 24h doanh thu Alibaba (2019)</h2>
            <motion.div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                {display}
            </motion.div>
            <p className="text-blue-200/60 mt-4 text-sm max-w-lg mx-auto">
                Tốc độ lưu thông hàng hóa thần tốc trong nền kinh tế số. Chỉ trong chớp mắt, hàng tỷ đô la đã được giao dịch qua hệ thống trung gian.
            </p>
        </div>
    );
};

// ── COMPONENT: FLASH SALE SIMULATOR v2 ──────────────────────────────────────
const LEVELS = [
    { label: "Dễ", botRate: 800, duration: 8, color: "#34d399", stockCount: 15 },
    { label: "Bình thường", botRate: 500, duration: 6, color: "#fbbf24", stockCount: 10 },
    { label: "Khó", botRate: 280, duration: 5, color: "#f97316", stockCount: 6 },
    { label: "Địa ngục", botRate: 130, duration: 4, color: "#ef4444", stockCount: 3 },
];

const FlashSaleSimulator = () => {
    const [phase, setPhase] = useState('idle'); // idle | countdown | playing | won | lost | result
    const [levelIdx, setLevelIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [stock, setStock] = useState(15);
    const [maxStock, setMaxStock] = useState(15);
    const [timeLeft, setTimeLeft] = useState(8);
    const [botBuys, setBotBuys] = useState([]);
    const [product, setProduct] = useState(FLASH_PRODUCTS[0]);
    const [viewers, setViewers] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [resultMsg, setResultMsg] = useState('');
    const [streak, setStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const botTimerRef = useRef(null);
    const gameTimerRef = useRef(null);
    const countdownRef = useRef(null);

    const pickProduct = useCallback(() => {
        return FLASH_PRODUCTS[Math.floor(Math.random() * FLASH_PRODUCTS.length)];
    }, []);

    const stopTimers = useCallback(() => {
        clearInterval(botTimerRef.current);
        clearInterval(gameTimerRef.current);
        clearInterval(countdownRef.current);
    }, []);

    const startCountdown = useCallback((lvIdxOverride) => {
        const nextProduct = pickProduct();
        setProduct(nextProduct);
        const useLvIdx = lvIdxOverride !== undefined ? lvIdxOverride : levelIdx;
        const lv = LEVELS[useLvIdx];
        setStock(lv.stockCount);
        setMaxStock(lv.stockCount);
        setTimeLeft(lv.duration);
        setBotBuys([]);
        setViewers(Math.floor(Math.random() * 8000) + 2000);
        setCountdown(3);
        setPhase('countdown');
        let c = 3;
        countdownRef.current = setInterval(() => {
            c -= 1;
            setCountdown(c);
            if (c <= 0) {
                clearInterval(countdownRef.current);
                setPhase('playing');
            }
        }, 1000);
    }, [levelIdx, pickProduct]);

    const endRound = useCallback((won) => {
        stopTimers();
        if (won) {
            const bonus = (levelIdx + 1) * 100 + streak * 50;
            setScore(prev => prev + bonus);
            setStreak(prev => prev + 1);
            setResultMsg(`🏆 DEAL THÀNH CÔNG! +${bonus} điểm`);
            setPhase('won');
        } else {
            setStreak(0);
            setResultMsg('💀 HẾT HÀNG! BOT đã cướp mất deal của bạn!');
            setPhase('lost');
        }
    }, [levelIdx, streak, stopTimers]);

    // Bot buying loop
    useEffect(() => {
        if (phase !== 'playing') return;
        const lv = LEVELS[levelIdx];
        botTimerRef.current = setInterval(() => {
            setStock(prev => {
                if (prev <= 1) {
                    endRound(false);
                    return 0;
                }
                const drop = Math.floor(Math.random() * 2) + 1;
                const newStock = Math.max(0, prev - drop);
                setBotBuys(b => [
                    ...b.slice(-4),
                    { id: Date.now(), name: `Bot_${Math.floor(Math.random() * 9999)}`, qty: drop }
                ]);
                setViewers(v => Math.max(100, v - Math.floor(Math.random() * 15)));
                return newStock;
            });
        }, lv.botRate);
        return () => clearInterval(botTimerRef.current);
    }, [phase, levelIdx, endRound]);

    // Game countdown
    useEffect(() => {
        if (phase !== 'playing') return;
        const lv = LEVELS[levelIdx];
        gameTimerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    return 0;
                }
                return +(prev - 0.1).toFixed(1);
            });
        }, 100);
        return () => clearInterval(gameTimerRef.current);
    }, [phase, levelIdx]);

    const handleBuy = () => {
        if (phase !== 'playing') return;
        if (stock > 0) endRound(true);
        else endRound(false);
    };

    const nextRound = () => {
        const nextRoundNum = round + 1;
        setRound(nextRoundNum);
        const newLvIdx = Math.min(nextRoundNum - 1, LEVELS.length - 1);
        setLevelIdx(newLvIdx);
        startCountdown(newLvIdx);
    };

    const resetGame = () => {
        stopTimers();
        setHighScore(prev => Math.max(prev, score));
        setScore(0);
        setRound(1);
        setLevelIdx(0);
        setStreak(0);
        setPhase('idle');
    };

    useEffect(() => () => stopTimers(), [stopTimers]);

    const lv = LEVELS[levelIdx];
    const stockPct = maxStock > 0 ? (stock / maxStock) * 100 : 0;
    const timePct = phase === 'playing' ? (timeLeft / lv.duration) * 100 : 100;
    const discount = product ? Math.round((1 - product.salePrice / product.oldPrice) * 100) : 0;

    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            {/* Header badge */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-black text-white">⚡ Săn Deal Thần Tốc</h3>
                    <p className="text-blue-300 text-xs mt-1">Bot mua cạnh tranh realtime · Cầu &gt; Cung · Hàng bay trong tích tắc!</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="bg-red-500 text-white font-black px-3 py-0.5 rounded-full text-xs animate-pulse">FLASH SALE</div>
                    <div className="text-xs text-amber-400 font-bold">Kỷ lục: {highScore} điểm</div>
                </div>
            </div>

            {/* Score + Level bar */}
            <div className="flex gap-4 mb-5">
                {LEVELS.map((l, i) => (
                    <div key={l.label} className="flex-1 text-center">
                        <div className={`text-xs font-bold mb-1 ${i === levelIdx ? 'text-white' : 'text-slate-600'}`}>{l.label}</div>
                        <div className={`h-1.5 rounded-full ${i <= levelIdx ? '' : 'bg-slate-800'}`}
                            style={{ background: i <= levelIdx ? l.color : undefined }}
                        />
                    </div>
                ))}
            </div>

            {/* IDLE */}
            <AnimatePresence mode="wait">
                {phase === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-slate-300 mb-2">Bạn vs. hàng nghìn con <span className="text-red-400 font-bold">BOT</span> đang chờ cướp deal.</p>
                        <p className="text-slate-500 text-sm mb-6">Có 4 rounds — mỗi round khó hơn, bot nhanh hơn, hàng ít hơn!</p>
                        <button onClick={() => { setScore(0); setRound(1); setLevelIdx(0); setStreak(0); startCountdown(); }}
                            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black py-4 px-12 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.5)] text-lg transition-all active:scale-95">
                            BẮT ĐẦU 🔥
                        </button>
                    </motion.div>
                )}

                {/* COUNTDOWN */}
                {phase === 'countdown' && (
                    <motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                        <div className="text-sm text-slate-400 uppercase tracking-widest mb-3">Round {round} — Cấp độ <span className="font-bold" style={{ color: lv.color }}>{lv.label}</span></div>
                        <div className="text-8xl font-black mb-3" style={{ color: lv.color }}>{countdown > 0 ? countdown : '🚀'}</div>
                        <p className="text-slate-400 text-sm">Sản phẩm tiếp theo: <span className="text-white font-bold">{product?.emoji} {product?.name}</span></p>
                    </motion.div>
                )}

                {/* PLAYING */}
                {phase === 'playing' && (
                    <motion.div key="playing" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                        {/* Product card */}
                        <div className="flex items-center gap-4 bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-4">
                            <div className="w-20 h-20 rounded-xl flex items-center justify-center text-5xl shrink-0"
                                style={{ background: `linear-gradient(135deg, ${lv.color}22, ${lv.color}44)`, border: `1px solid ${lv.color}66` }}>
                                {product?.emoji}
                            </div>
                            <div className="flex-1">
                                <div className="font-black text-white text-lg">{product?.name}</div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-2xl font-black" style={{ color: lv.color }}>{product?.salePrice.toLocaleString()}đ</span>
                                    <span className="text-slate-500 line-through text-sm">{product?.oldPrice.toLocaleString()}đ</span>
                                    <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded">-{discount}%</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">👁 {viewers.toLocaleString()} người đang xem</div>
                            </div>
                        </div>

                        {/* Stock & Timer bars */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Tồn kho</span>
                                    <span className="font-mono font-bold" style={{ color: stockPct > 40 ? '#34d399' : stockPct > 20 ? '#fbbf24' : '#ef4444' }}>{stock}/{maxStock}</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div className="h-full rounded-full" animate={{ width: `${stockPct}%` }} transition={{ duration: 0.2 }}
                                        style={{ background: stockPct > 40 ? '#34d399' : stockPct > 20 ? '#fbbf24' : '#ef4444' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Thời gian</span>
                                    <span className="font-mono font-bold text-amber-400">{timeLeft.toFixed(1)}s</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div className="h-full rounded-full bg-amber-400" animate={{ width: `${timePct}%` }} transition={{ duration: 0.1 }} />
                                </div>
                            </div>
                        </div>

                        {/* Bot feed */}
                        <div className="h-20 overflow-hidden mb-4 bg-slate-950/50 rounded-xl px-3 py-2 border border-slate-800">
                            <div className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Bot feed realtime</div>
                            <AnimatePresence>
                                {botBuys.slice(-3).map(b => (
                                    <motion.div key={b.id}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                        className="text-xs text-red-400 font-mono">
                                        🤖 {b.name} vừa mua {b.qty} cái!
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* BUY BUTTON */}
                        <motion.button
                            onClick={handleBuy}
                            whileTap={{ scale: 0.93 }}
                            animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.4)', '0 0 40px rgba(239,68,68,0.9)', '0 0 20px rgba(239,68,68,0.4)'] }}
                            transition={{ boxShadow: { duration: 0.6, repeat: Infinity } }}
                            className="w-full py-5 rounded-2xl font-black text-xl text-white uppercase tracking-widest"
                            style={{ background: `linear-gradient(135deg, #dc2626, #ea580c)` }}
                        >
                            ⚡ MUA NGAY — CHỈ CÒN {stock} CÁI!
                        </motion.button>

                        {/* Streak & score */}
                        <div className="flex justify-between mt-3 text-xs text-slate-500">
                            <span>Round {round}/4</span>
                            <span className="text-white font-bold">{score} điểm {streak >= 2 ? `🔥×${streak}` : ''}</span>
                        </div>
                    </motion.div>
                )}

                {/* WON */}
                {phase === 'won' && (
                    <motion.div key="won" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                        <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.5 }} className="text-7xl mb-3">
                            🎉
                        </motion.div>
                        <div className="text-green-400 text-2xl font-black mb-1">{resultMsg}</div>
                        <p className="text-slate-400 text-sm mb-2">Tổng: <span className="text-white font-bold">{score} điểm</span> · Streak: <span className="text-orange-400 font-bold">{streak}</span></p>
                        <div className="flex gap-3 justify-center mt-4">
                            {round < 4 ? (
                                <button onClick={nextRound} className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.4)] active:scale-95 transition-all">
                                    ROUND {round + 1} →
                                </button>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="text-amber-400 font-black text-xl mb-3">🏆 HOÀN THÀNH! {score} điểm!</div>
                                    <button onClick={resetGame} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl">Chơi lại</button>
                                </motion.div>
                            )}
                            <button onClick={resetGame} className="bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl active:scale-95 transition-all">Reset</button>
                        </div>
                    </motion.div>
                )}

                {/* LOST */}
                {phase === 'lost' && (
                    <motion.div key="lost" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                        <div className="text-7xl mb-3">💀</div>
                        <div className="text-red-400 text-xl font-black mb-2">{resultMsg}</div>
                        <p className="text-slate-400 text-sm mb-6">Đây chính là thực tế ngày 11/11 — Cầu vượt Cung hàng nghìn lần, BOT và người dùng chuyên nghiệp luôn thắng!</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => startCountdown()} className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-xl active:scale-95 transition-all">Thử lại Round này</button>
                            <button onClick={resetGame} className="bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl">Reset</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── COMPONENT: SUPPLY DEMAND SIMULATOR v2 ────────────────────────────────────
const SupplyDemandSimulator = () => {
    const [supply, setSupply] = useState(50);
    const [demand, setDemand] = useState(50);
    const [activeScenario, setActiveScenario] = useState(null);
    const [animPrice, setAnimPrice] = useState(500000);
    const priceTarget = useRef(500000);
    const priceAnimRef = useRef(null);

    // Equilibrium price formula: base 500k, scales with demand/supply ratio
    const equilibriumPrice = Math.round((demand / supply) * 500000);
    const ratio = demand / supply;
    const isShortage = demand > supply + 5;
    const isSurplus = supply > demand + 5;

    const priceColor = isShortage ? '#ef4444' : isSurplus ? '#34d399' : '#60a5fa';
    const priceLabel = isShortage ? '🚀 Giá leo thang!' : isSurplus ? '🏷️ Đại hạ giá!' : '⚖️ Giá cân bằng';
    const priceDesc = isShortage
        ? 'Cầu vượt Cung — Hàng khan hiếm, người bán có lợi thế, giá bị đẩy lên cao.'
        : isSurplus
            ? 'Cung vượt Cầu — Hàng ế ẩm, tồn kho lớn, buộc phải giảm giá để kích cầu.'
            : 'Cung và Cầu cân bằng — Thị trường hoạt động hiệu quả, giá cả ổn định.';

    // Animate price number smoothly
    useEffect(() => {
        priceTarget.current = equilibriumPrice;
        clearInterval(priceAnimRef.current);
        priceAnimRef.current = setInterval(() => {
            setAnimPrice(prev => {
                const diff = priceTarget.current - prev;
                if (Math.abs(diff) < 500) { clearInterval(priceAnimRef.current); return priceTarget.current; }
                return prev + Math.round(diff * 0.12);
            });
        }, 30);
        return () => clearInterval(priceAnimRef.current);
    }, [equilibriumPrice]);

    const applyScenario = (sc) => {
        setActiveScenario(sc.id);
        setSupply(sc.supply);
        setDemand(sc.demand);
    };

    // SVG chart dimensions
    const W = 320, H = 180, PAD = 30;
    // Supply line: upward slope (price rises as supply qty offered increases)
    // Demand line: downward slope (price falls as qty demanded increases)
    // x-axis = quantity (0→100), y-axis = price (0 → 1M)
    const toSvgX = (qty) => PAD + (qty / 100) * (W - PAD * 2);
    const toSvgY = (price) => H - PAD - (price / 1200000) * (H - PAD * 2);

    // Supply curve: P = (supply/100) * 800000 * (Q/100)  → Q drives price up
    // For drawing: at Q=0, P=0; at Q=100, P = supplyMax
    const supplyPoints = Array.from({ length: 11 }, (_, i) => {
        const q = i * 10;
        const p = (supply / 100) * 1000000 * (q / 100);
        return `${toSvgX(q)},${toSvgY(p)}`;
    }).join(' ');

    // Demand curve: P = demandMax * (1 - Q/100)
    const demandPoints = Array.from({ length: 11 }, (_, i) => {
        const q = i * 10;
        const p = (demand / 100) * 1000000 * (1 - q / 100);
        return `${toSvgX(q)},${toSvgY(p)}`;
    }).join(' ');

    // Equilibrium intersection point on chart
    // At intersection: supplySlope * Q = demandSlope * (1 - Q/100) * 100
    // Approx Q_eq = 50 (midpoint), P_eq = animPrice
    const eqX = toSvgX(50);
    const eqY = toSvgY(Math.min(equilibriumPrice, 1100000));

    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <h3 className="text-xl font-black text-white mb-1">⚖️ Mô phỏng Quy luật Cung - Cầu</h3>
            <p className="text-blue-300 text-xs mb-4">Kéo slider hoặc chọn kịch bản thực tế · Đồ thị cập nhật realtime</p>

            {/* Scenario chips */}
            <div className="flex flex-wrap gap-2 mb-5">
                {SD_SCENARIOS.map(sc => (
                    <button key={sc.id} onClick={() => applyScenario(sc)}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
                        style={{
                            borderColor: activeScenario === sc.id ? sc.color : '#334155',
                            background: activeScenario === sc.id ? `${sc.color}22` : 'transparent',
                            color: activeScenario === sc.id ? sc.color : '#94a3b8',
                        }}
                    >
                        {sc.icon} {sc.label}
                    </button>
                ))}
            </div>

            {activeScenario && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-sm text-slate-300">
                    📌 {SD_SCENARIOS.find(s => s.id === activeScenario)?.desc}
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT: Chart */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col items-center">
                    <div className="text-xs text-slate-500 mb-2 self-start">Đường Cung / Cầu · Điểm giao = Giá thị trường</div>
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: 320 }}>
                        {/* Grid */}
                        {[0.25, 0.5, 0.75].map(f => (
                            <line key={f} x1={PAD} y1={toSvgY(f * 1000000)} x2={W - PAD} y2={toSvgY(f * 1000000)}
                                stroke="#1e293b" strokeWidth="1" />
                        ))}

                        {/* Supply curve (cyan) */}
                        <motion.polyline
                            points={supplyPoints}
                            fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            animate={{ stroke: '#22d3ee', points: supplyPoints }}
                            transition={{ duration: 0.4 }}
                        />
                        <text x={toSvgX(90)} y={toSvgY((supply / 100) * 900000) - 6} fill="#22d3ee" fontSize="9" fontWeight="bold">CUNG</text>

                        {/* Demand curve (amber) */}
                        <motion.polyline
                            points={demandPoints}
                            fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            animate={{ stroke: '#fb923c', points: demandPoints }}
                            transition={{ duration: 0.4 }}
                        />
                        <text x={toSvgX(5)} y={toSvgY((demand / 100) * 900000) - 6} fill="#fb923c" fontSize="9" fontWeight="bold">CẦU</text>

                        {/* Equilibrium point */}
                        <motion.circle
                            animate={{ cx: eqX, cy: Math.max(PAD + 6, Math.min(H - PAD - 6, eqY)), r: 5 }}
                            transition={{ duration: 0.4 }}
                            fill={priceColor} stroke="white" strokeWidth="1.5"
                        />
                        <motion.line
                            animate={{ x1: eqX, y1: Math.max(PAD, Math.min(H - PAD, eqY)), x2: eqX, y2: H - PAD }}
                            stroke={priceColor} strokeWidth="1" strokeDasharray="3,3"
                            transition={{ duration: 0.4 }}
                        />

                        {/* Axes */}
                        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#475569" strokeWidth="1.5" />
                        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#475569" strokeWidth="1.5" />
                        <text x={PAD - 8} y={H - PAD + 12} fill="#475569" fontSize="8">Qty</text>
                        <text x={PAD + 2} y={PAD + 2} fill="#475569" fontSize="8">Giá</text>
                    </svg>
                </div>

                {/* RIGHT: Sliders + price result */}
                <div className="flex flex-col gap-4 justify-between">
                    {/* Sliders */}
                    <div className="space-y-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-cyan-400 text-xs uppercase tracking-wider">📦 Cung (Supply)</span>
                                <span className="font-mono bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded text-xs">{supply} đơn vị</span>
                            </div>
                            <input type="range" min="5" max="100" value={supply}
                                onChange={(e) => { setSupply(Number(e.target.value)); setActiveScenario(null); }}
                                className="w-full accent-cyan-500" />
                            <div className="mt-2 h-4 flex gap-0.5 items-end">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <motion.div key={i} className="flex-1 bg-cyan-500 rounded-sm"
                                        animate={{ height: i < Math.round(supply / 5) ? '100%' : '20%', opacity: i < Math.round(supply / 5) ? 0.8 : 0.2 }}
                                        transition={{ duration: 0.2, delay: i * 0.01 }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-amber-400 text-xs uppercase tracking-wider">🙋 Cầu (Demand)</span>
                                <span className="font-mono bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded text-xs">{demand} người</span>
                            </div>
                            <input type="range" min="5" max="100" value={demand}
                                onChange={(e) => { setDemand(Number(e.target.value)); setActiveScenario(null); }}
                                className="w-full accent-amber-500" />
                            <div className="mt-2 h-4 flex gap-0.5 items-end">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <motion.div key={i} className="flex-1 bg-amber-400 rounded-sm"
                                        animate={{ height: i < Math.round(demand / 5) ? '100%' : '20%', opacity: i < Math.round(demand / 5) ? 0.8 : 0.2 }}
                                        transition={{ duration: 0.2, delay: i * 0.01 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price result */}
                    <motion.div
                        animate={{ borderColor: priceColor + '55', backgroundColor: priceColor + '11' }}
                        transition={{ duration: 0.4 }}
                        className="rounded-xl border p-4 text-center"
                    >
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Giá cân bằng thị trường</div>
                        <motion.div className="text-3xl font-black font-mono" animate={{ color: priceColor }}>
                            {animPrice.toLocaleString()}đ
                        </motion.div>
                        <div className="text-sm font-bold mt-1" style={{ color: priceColor }}>{priceLabel}</div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{priceDesc}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// ── COMPONENT: PLATFORM ECONOMY FLOW ─────────────────────────────────────────
const PlatformEconomyFlow = () => {
    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl h-[500px] md:h-[600px] flex flex-col">
            <h3 className="text-xl font-black text-white mb-2">💰 Mô hình Kinh tế Nền tảng (Platform Economy)</h3>
            <p className="text-blue-300 text-sm mb-4">Dòng tiền, Hàng hóa & Dữ liệu lưu thông qua chủ thể trung gian thay vì giao dịch trực tiếp.</p>

            <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center mt-2">
                {/* Nodes */}
                <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                    <div className="w-16 h-16 bg-blue-900 border-2 border-blue-400 rounded-full flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(96,165,250,0.5)] z-10">🙋‍♂️</div>
                    <span className="mt-2 text-xs font-bold text-blue-300 bg-black/50 px-2 py-0.5 rounded">Người Mua</span>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-8 flex flex-col items-center z-10">
                    <div className="w-20 h-20 bg-indigo-900 border-2 border-indigo-400 rounded-3xl flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(129,140,248,0.6)] z-10">💻</div>
                    <span className="mt-2 text-xs font-bold text-indigo-300 bg-black/50 px-2 py-0.5 rounded">Nền Tảng E-com</span>
                </div>

                <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                    <div className="w-16 h-16 bg-amber-900 border-2 border-amber-400 rounded-full flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(251,191,36,0.5)] z-10">🏪</div>
                    <span className="mt-2 text-xs font-bold text-amber-300 bg-black/50 px-2 py-0.5 rounded">Người Bán</span>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center z-10">
                    <div className="w-16 h-16 bg-emerald-900 border-2 border-emerald-400 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10">🚚</div>
                    <span className="mt-2 text-xs font-bold text-emerald-300 bg-black/50 px-2 py-0.5 rounded">Logistics</span>
                </div>

                {/* Flow Animations Container */}
                <div className="absolute inset-0 z-0">
                    {/* Buyer to Platform (Money) */}
                    <motion.div className="absolute flex items-center justify-center text-xl filter drop-shadow-[0_0_5px_rgba(34,197,94,1)]"
                        initial={{ left: "15%", top: "50%", opacity: 0 }}
                        animate={{ left: "45%", top: "25%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    >💰</motion.div>

                    {/* Platform to Seller (Money minus commission) */}
                    <motion.div className="absolute flex text-lg items-center justify-center filter drop-shadow-[0_0_5px_rgba(34,197,94,1)]"
                        initial={{ left: "55%", top: "25%", opacity: 0 }}
                        animate={{ left: "85%", top: "50%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >💵</motion.div>

                    {/* Platform keeps commission */}
                    <motion.div className="absolute flex text-sm text-indigo-300 items-center justify-center font-bold"
                        initial={{ left: "50%", top: "25%", opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -30 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
                    >+ Phí</motion.div>

                    {/* Platform to Logistics (Order Info) */}
                    <motion.div className="absolute flex items-center justify-center text-lg filter drop-shadow-[0_0_5px_rgba(96,165,250,1)]"
                        initial={{ left: "50%", top: "35%", opacity: 0 }}
                        animate={{ top: "70%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >📄</motion.div>

                    {/* Seller to Logistics (Give goods) */}
                    <motion.div className="absolute flex items-center justify-center text-xl filter drop-shadow-[0_0_5px_rgba(251,191,36,1)]"
                        initial={{ left: "80%", top: "60%", opacity: 0 }}
                        animate={{ left: "55%", top: "80%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    >📦</motion.div>

                    {/* Logistics to Buyer (Delivery) */}
                    <motion.div className="absolute flex items-center justify-center text-3xl filter drop-shadow-[0_0_8px_rgba(52,211,153,1)]"
                        initial={{ left: "45%", top: "80%", opacity: 0 }}
                        animate={{ left: "15%", top: "60%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                    >🛵</motion.div>
                </div>
            </div>
        </div>
    );
};

// ── COMPONENT: CART ADDICTION SIMULATOR v2 ────────────────────────────────────
const DARK_PATTERNS = [
    { id: "fomo", text: "🔴 17 người đang xem sản phẩm này!", color: "#ef4444" },
    { id: "stock", text: "⚠️ Chỉ còn 3 sản phẩm trong kho!", color: "#f97316" },
    { id: "timer", text: "⏰ Ưu đãi kết thúc sau: 00:04:32", color: "#fbbf24" },
    { id: "ship", text: "🚚 Mua thêm 200k để FREE SHIP!", color: "#34d399" },
    { id: "social", text: "👥 Bạn bè bạn đã mua sản phẩm này!", color: "#818cf8" },
    { id: "price", text: "📉 Giá giảm thêm 5% nếu mua ngay!", color: "#f472b6" },
    { id: "last", text: "🏆 Deal HOT nhất tuần — 2.341 đã mua!", color: "#fb923c" },
    { id: "combo", text: "🎁 Mua 2 tặng 1 — Cơ hội cuối!", color: "#22d3ee" },
];

const CART_ITEMS_V2 = [
    { id: 1, name: "Tai nghe Bluetooth", price: 199000, img: "🎧", oldPrice: 400000, tag: "HOT" },
    { id: 2, name: "Áo thun Local Brand", price: 250000, img: "👕", oldPrice: 500000, tag: "-50%" },
    { id: 3, name: "Giày Sneaker", price: 1500000, img: "👟", oldPrice: 3000000, tag: "DEAL" },
    { id: 4, name: "Bàn phím cơ", price: 890000, img: "⌨️", oldPrice: 1500000, tag: "HOT" },
    { id: 5, name: "Màn hình 27inch", price: 3500000, img: "🖥️", oldPrice: 5500000, tag: "-36%" },
    { id: 6, name: "Laptop Gaming", price: 15990000, img: "💻", oldPrice: 25000000, tag: "FLASH" },
];

const ADDICTION_PHASES = [
    { label: "Tò mò", color: "#60a5fa", desc: "Bạn chỉ vào xem thôi..." },
    { label: "Thích thú", color: "#fbbf24", desc: "Ồ, giá rẻ thật! Thêm vào giỏ thôi." },
    { label: "Nghiện mua", color: "#f97316", desc: "Dopamine đang chạy! Mua thêm một cái nữa thôi..." },
    { label: "Mất kiểm soát", color: "#ef4444", desc: "Tôi CẦN cái này. Tiền? Tính sau!" },
];

const CartAddictionSimulator = () => {
    const INITIAL_BUDGET = 10000000;
    const [budget, setBudget] = useState(INITIAL_BUDGET);
    const [cartItems, setCartItems] = useState([]);
    const [dopamine, setDopamine] = useState(20);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [darkPattern, setDarkPattern] = useState(DARK_PATTERNS[0]);
    const [phaseIdx, setPhaseIdx] = useState(0);
    const [showEndscreen, setShowEndscreen] = useState(false);
    const [totalSpent, setTotalSpent] = useState(0);
    const [purchaseCount, setPurchaseCount] = useState(0);
    const [justBoughtId, setJustBoughtId] = useState(null);
    const dopDecayRef = useRef(null);
    const patternRef = useRef(null);

    const spent = INITIAL_BUDGET - budget;
    const spentPct = Math.min((spent / INITIAL_BUDGET) * 100, 100);
    const dopColor = dopamine > 60 ? '#34d399' : dopamine > 30 ? '#fbbf24' : '#ef4444';

    // Dopamine slowly decays → urge to buy more
    useEffect(() => {
        dopDecayRef.current = setInterval(() => {
            setDopamine(prev => Math.max(0, prev - 0.5));
        }, 400);
        return () => clearInterval(dopDecayRef.current);
    }, []);

    // Rotate dark patterns every 3s for psychological pressure
    useEffect(() => {
        patternRef.current = setInterval(() => {
            setDarkPattern(DARK_PATTERNS[Math.floor(Math.random() * DARK_PATTERNS.length)]);
        }, 3000);
        return () => clearInterval(patternRef.current);
    }, []);

    // Update addiction phase based on purchase count
    useEffect(() => {
        if (purchaseCount >= 5) setPhaseIdx(3);
        else if (purchaseCount >= 3) setPhaseIdx(2);
        else if (purchaseCount >= 1) setPhaseIdx(1);
        else setPhaseIdx(0);
    }, [purchaseCount]);

    const handleBuy = (item) => {
        if (showEndscreen) return;
        const newBudget = budget - item.price;
        setBudget(newBudget);
        setTotalSpent(prev => prev + item.price);
        setPurchaseCount(prev => prev + 1);
        setCartItems(prev => [...prev, item]);
        setJustBoughtId(item.id);
        setTimeout(() => setJustBoughtId(null), 600);
        setDopamine(prev => Math.min(100, prev + 35));

        // Floating reward text
        const msgs = [
            `+${item.img} ${item.name}!`,
            "🎉 Thêm vào giỏ!",
            `😍 Tiết kiệm ${(item.oldPrice - item.price).toLocaleString()}đ!`,
            "✨ Siêu deal!",
            "💊 Dopamine +35",
        ];
        const newFloat = { id: Date.now(), text: msgs[Math.floor(Math.random() * msgs.length)] };
        setFloatingTexts(prev => [...prev.slice(-3), newFloat]);
        setTimeout(() => setFloatingTexts(prev => prev.filter(f => f.id !== newFloat.id)), 1500);

        if (newBudget < 0) setTimeout(() => setShowEndscreen(true), 800);
    };

    const reset = () => {
        setBudget(INITIAL_BUDGET);
        setCartItems([]);
        setDopamine(20);
        setFloatingTexts([]);
        setPhaseIdx(0);
        setShowEndscreen(false);
        setTotalSpent(0);
        setPurchaseCount(0);
        setJustBoughtId(null);
    };

    const phase = ADDICTION_PHASES[phaseIdx];
    const debtEstimate = Math.max(0, -budget);
    const wasteEstimate = Math.round(totalSpent * 0.6);

    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">

            {/* Floating reward texts */}
            <AnimatePresence>
                {floatingTexts.map(f => (
                    <motion.div key={f.id}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -60 }}
                        transition={{ duration: 1.2 }}
                        className="absolute top-16 right-6 z-50 text-sm font-black text-green-400 pointer-events-none bg-green-950/80 px-3 py-1 rounded-full border border-green-500/40 whitespace-nowrap"
                    >
                        {f.text}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-black text-white">🛒 Cạm Bẫy Tiêu Dùng</h3>
                    <p className="text-blue-300 text-xs mt-1">Thuật toán thiết kế để bạn không thể dừng lại.</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400">Ngân sách</div>
                    <motion.div
                        animate={{ color: budget < 2000000 ? '#ef4444' : budget < 5000000 ? '#fbbf24' : '#4ade80' }}
                        className="text-xl font-black font-mono"
                    >
                        {budget.toLocaleString()}đ
                    </motion.div>
                    <div className="text-xs text-slate-500">Đã mua {purchaseCount} món</div>
                </div>
            </div>

            {/* Dark Pattern Banner — rotates every 3s */}
            <AnimatePresence mode="wait">
                <motion.div key={darkPattern.id}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 px-3 py-2 rounded-lg text-xs font-bold text-center"
                    style={{ background: darkPattern.color + '18', border: `1px solid ${darkPattern.color}44`, color: darkPattern.color }}
                >
                    {darkPattern.text}
                </motion.div>
            </AnimatePresence>

            {/* Dopamine + Spent bars */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">💊 Dopamine</span>
                        <span className="font-bold" style={{ color: dopColor }}>{Math.round(dopamine)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                            animate={{ width: `${dopamine}%`, backgroundColor: dopColor }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                        {dopamine > 60 ? 'Cảm giác hạnh phúc ▲' : dopamine > 30 ? 'Đang giảm dần...' : '😰 Cần mua thêm!'}
                    </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">💸 Đã tiêu</span>
                        <span className="font-bold text-red-400">{Math.round(spentPct)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                            animate={{ width: `${spentPct}%` }} transition={{ duration: 0.4 }}
                        />
                    </div>
                    <p className="text-slate-600 text-xs mt-1">{spent.toLocaleString()}đ / {INITIAL_BUDGET.toLocaleString()}đ</p>
                </div>
            </div>

            {/* Addiction Phase bar */}
            <div className="flex gap-1 mb-2">
                {ADDICTION_PHASES.map((p, i) => (
                    <motion.div key={p.label} animate={{ opacity: i <= phaseIdx ? 1 : 0.25 }} className="flex-1 text-center">
                        <div className="h-1 rounded-full mb-1" style={{ background: i <= phaseIdx ? p.color : '#1e293b' }} />
                        <div className="text-xs font-bold truncate" style={{ color: i === phaseIdx ? p.color : '#475569' }}>{p.label}</div>
                    </motion.div>
                ))}
            </div>
            <motion.p key={phaseIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center text-xs italic mb-5" style={{ color: phase.color }}>
                "{phase.desc}"
            </motion.p>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {CART_ITEMS_V2.map(item => (
                    <motion.div key={item.id}
                        animate={justBoughtId === item.id ? { scale: [1, 1.06, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center hover:border-pink-400/60 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded z-10">
                            {item.tag}
                        </div>
                        <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform mt-2">{item.img}</div>
                        <div className="font-bold text-xs text-white mb-0.5 line-clamp-1">{item.name}</div>
                        <div className="text-xs text-slate-500 line-through">{item.oldPrice.toLocaleString()}đ</div>
                        <div className="text-pink-400 font-black text-sm mb-1">{item.price.toLocaleString()}đ</div>
                        <div className="text-xs text-green-400 mb-2">
                            Tiết kiệm {(item.oldPrice - item.price).toLocaleString()}đ
                        </div>
                        <motion.button
                            onClick={() => handleBuy(item)}
                            whileTap={{ scale: 0.93 }}
                            disabled={showEndscreen}
                            className="w-full py-2 rounded-lg font-black text-xs text-white transition-all disabled:opacity-40"
                            style={{ background: 'linear-gradient(135deg, #db2777, #7c3aed)' }}
                        >
                            🛒 MUA NGAY
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Live cart preview */}
            {cartItems.length > 0 && !showEndscreen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 mb-4">
                    <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">🛍️ Giỏ hàng ({cartItems.length} món)</div>
                    <div className="flex flex-wrap gap-1 items-center">
                        {cartItems.slice(-10).map((it, i) => (
                            <span key={i} className="text-lg">{it.img}</span>
                        ))}
                        {cartItems.length > 10 && <span className="text-xs text-slate-500 ml-1">+{cartItems.length - 10} nữa</span>}
                    </div>
                </motion.div>
            )}

            {/* ENDSCREEN */}
            <AnimatePresence>
                {showEndscreen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-gradient-to-br from-red-950/90 to-slate-950/90 border border-red-500/60 rounded-2xl p-6 shadow-[0_0_40px_rgba(220,38,38,0.3)]"
                    >
                        <div className="text-center mb-5">
                            <div className="text-5xl mb-2">💳</div>
                            <h4 className="text-xl font-black text-red-400">Ví đã cạn kiệt!</h4>
                            <p className="text-slate-400 text-xs mt-1">Kết quả của {purchaseCount} lần "mua một cái thôi"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[
                                { label: "Tiền đã tiêu", value: totalSpent.toLocaleString() + "đ", color: "#ef4444" },
                                { label: "Nợ phát sinh", value: debtEstimate.toLocaleString() + "đ", color: "#fbbf24" },
                                { label: "Ước tính lãng phí", value: wasteEstimate.toLocaleString() + "đ", color: "#fb923c" },
                                { label: "Số lần mua", value: purchaseCount + " lần", color: "#a78bfa" },
                            ].map(s => (
                                <div key={s.label} className="bg-slate-900/60 rounded-xl p-3 text-center border border-slate-800">
                                    <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
                                    <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-4 text-sm text-slate-300 leading-relaxed">
                            <div className="font-bold text-white mb-2">🧠 Tâm lý học phía sau</div>
                            <p>Các nền tảng e-commerce thiết kế <strong className="text-pink-400">dark patterns</strong>: giá gạch, countdown giả, "X người đang xem" — kích hoạt <strong className="text-amber-400">vòng lặp dopamine</strong> giống cơ chế cờ bạc. Não bộ không phân biệt được "cần" và "muốn" khi đang hưng phấn mua sắm.</p>
                        </div>

                        <button onClick={reset}
                            className="w-full py-3 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 transition-all active:scale-95">
                            ↺ Bắt đầu lại — Lần này sẽ tỉnh táo hơn!
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Thang11Page() {
    const [activeTimeline, setActiveTimeline] = useState(null);

    return (
        <div className="min-h-screen text-white/90 selection:bg-cyan-500 selection:text-black font-sans" style={{ background: "linear-gradient(to bottom, #020617, #0f172a, #1e3a8a)" }}>
            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

                {/* Back */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold uppercase tracking-widest transition-colors bg-cyan-900/20 px-4 py-2 rounded-full border border-cyan-500/30">
                        <span>←</span> Trở về dòng thời gian
                    </Link>
                </div>

                {/* Header Section */}
                <motion.header className="text-center mb-16" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/50 rounded-full px-5 py-2 text-cyan-300 text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                        📅 11 Tháng 11 · Lịch sử Thương mại
                    </motion.div>
                    <motion.h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tighter text-white">
                        NGÀY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ĐỘC THÂN</span>
                    </motion.h1>
                    <p className="text-blue-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
                        Từ một lễ hội giải trí trở thành cỗ máy luân chuyển dòng tiền khổng lồ. Tìm hiểu Cách Thương Mại Điện Tử định hình lại Quy Luật Cung - Cầu và Lòng Tham Của Con Người.
                    </p>
                </motion.header>

                <SalesCounter />

                <div className="grid grid-cols-1 space-y-12">

                    {/* Simulator Section 1 */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <FlashSaleSimulator />
                    </motion.section>

                    {/* Simulator Section 2 */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <SupplyDemandSimulator />
                    </motion.section>

                    {/* Simulator Section 3 */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <PlatformEconomyFlow />
                    </motion.section>

                    {/* Simulator Section 4 */}
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <CartAddictionSimulator />
                    </motion.section>

                    {/* Timeline */}
                    <motion.section className="pt-8 border-t border-slate-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-wider uppercase mb-4">
                                ✦ Các mốc tăng trưởng phi mã ✦
                            </h2>
                        </div>
                        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-2">
                            <div className="absolute left-1/2 md:left-5 md:right-5 top-0 bottom-0 md:bottom-auto md:top-6 w-0.5 md:w-auto md:h-0.5 bg-slate-800 -z-10" />

                            {TIMELINE_EVENTS.map((t, i) => (
                                <div key={t.year} className="relative flex flex-row md:flex-col items-center w-full md:flex-1 md:min-w-[120px] bg-slate-900/50 md:bg-transparent p-4 md:p-0 rounded-xl border border-slate-800 md:border-none">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-4 bg-slate-950 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(30,41,59,1)] z-10"
                                        style={{ borderColor: t.color }}
                                    >{t.icon}</div>

                                    <div className="ml-4 md:ml-0 md:mt-4 md:text-center w-full">
                                        <div className="text-sm font-bold opacity-70 mb-1" style={{ color: t.color }}>{t.year} — {t.label}</div>
                                        <div className="text-2xl font-black text-white mb-1 tracking-tighter">{t.rev}</div>
                                        <div className="text-xs text-slate-400 leading-relaxed md:px-2">{t.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Cơ chế lưu thông */}
                    <motion.section className="mt-20 pt-16 border-t border-slate-800 pb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-wider uppercase mb-4">
                                ✦ Cơ chế lưu thông của thị trường ✦
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {CORE_IDEAS.map((idea, index) => (
                                <motion.div
                                    key={idea.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5, boxShadow: `0 10px 30px -10px ${idea.borderColor}` }}
                                    className={`p-6 rounded-2xl border ${idea.border} ${idea.bg} backdrop-blur-sm relative overflow-hidden group`}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">
                                        {idea.icon}
                                    </div>
                                    <div className="text-4xl mb-4 relative z-10">{idea.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{idea.label}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                                        {idea.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Video Clip */}
                    <motion.section className="mt-20 pt-16 border-t border-slate-800 pb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 p-2 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-700/50 bg-black">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src="https://www.youtube.com/embed/Iw0EBKlwqig"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
