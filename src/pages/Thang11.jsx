import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";

// ── DATA ─────────────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
    { year: "2009", label: "Ra đời", icon: "🎉", color: "#fbbf24", rev: "$50 Triệu", desc: "Alibaba khởi xướng Singles' Day như ngày khuyến mãi lớn nhất Trung Quốc." },
    { year: "2013", label: "Kỷ lục", icon: "🔥", color: "#34d399", rev: "$9 Tỷ", desc: "Doanh số vượt kỷ lục, đánh dấu sự bùng nổ của thương mại di động." },
    { year: "2019", label: "Đỉnh cao", icon: "🏆", color: "#ef4444", rev: "$38 Tỷ", desc: "Doanh số $38 tỷ USD trong 24 giờ, tốc độ lưu thông hàng hóa thần tốc." },
    { year: "2023", label: "Hiện tại", icon: "🌐", color: "#38bdf8", rev: "Hàng Trăm Tỷ Mỹ Kim", desc: "Mở rộng toàn cầu, ảnh hưởng đến E-commerce Việt Nam như Shopee, Lazada." },
];

const CART_ITEMS = [
    { id: 1, name: "Tai nghe Bluetooth", price: 199000, img: "🎧", oldPrice: 400000 },
    { id: 2, name: "Áo thun Local", price: 250000, img: "👕", oldPrice: 500000 },
    { id: 3, name: "Giày Sneaker", price: 1500000, img: "👟", oldPrice: 3000000 },
    { id: 4, name: "Bàn phím cơ", price: 890000, img: "⌨️", oldPrice: 1500000 },
    { id: 5, name: "Màn hình 27inch", price: 3500000, img: "🖥️", oldPrice: 5500000 },
    { id: 6, name: "Laptop Gaming", price: 15990000, img: "💻", oldPrice: 25000000 },
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

// ── COMPONENT: FLASH SALE SIMULATOR ─────────────────────────────────────────
const FlashSaleSimulator = () => {
    const [status, setStatus] = useState('idle'); // idle, playing, won, lost
    const [timeLeft, setTimeLeft] = useState(5.0);
    const [stock, setStock] = useState(50);

    const startGame = () => {
        setStatus('playing');
        setTimeLeft(5.0);
        setStock(50);
    };

    useEffect(() => {
        let interval;
        if (status === 'playing') {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0.1) {
                        setStatus('lost');
                        return 0;
                    }
                    return prev - 0.1;
                });

                setStock(prev => {
                    // Cầu lớn hơn cung gấp nhiều lần, rút stock rất nhanh
                    const drop = Math.floor(Math.random() * 4) + 1;
                    if (prev - drop <= 0) {
                        setStatus('lost');
                        return 0;
                    }
                    return prev - drop;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [status]);

    const handleBuy = () => {
        if (status === 'playing') {
            if (stock > 0) {
                setStatus('won');
            } else {
                setStatus('lost');
            }
        }
    };

    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-4">
                <div className="bg-red-500 text-white font-black px-3 py-1 rounded-full text-xs animate-pulse">
                    FLASH SALE
                </div>
            </div>

            <h3 className="text-xl font-black text-white mb-2">⚡ Săn Deal Thần Tốc</h3>
            <p className="text-blue-300 text-sm mb-6">Minh họa Cầu cực kỳ lớn &gt; Cung có hạn. Hàng hóa biến mất trong tích tắc!</p>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-xl flex items-center justify-center text-6xl shadow-inner border border-blue-500/50">
                    💻
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-2xl font-bold text-white">Laptop High-tech 2026</h4>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                        <span className="text-cyan-400 font-bold text-2xl">12.000.000đ</span>
                        <span className="text-slate-500 line-through text-sm">20.000.000đ</span>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-6 items-center">
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Thời gian</span>
                            <span className="font-mono text-xl text-amber-400 font-bold">{timeLeft.toFixed(1)}s</span>
                        </div>
                        <div className="w-px h-8 bg-slate-700 hidden sm:block"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Tồn kho</span>
                            <span className="font-mono text-xl text-green-400 font-bold">{stock} / 50</span>
                        </div>
                    </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col gap-2">
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.button
                                key="start"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={startGame}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all w-full"
                            >
                                CHUẨN BỊ
                            </motion.button>
                        )}
                        {status === 'playing' && (
                            <motion.button
                                key="buy"
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                onClick={handleBuy}
                                className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.8)] active:scale-95 transition-all w-full animate-bounce"
                            >
                                MUA NGAY!
                            </motion.button>
                        )}
                        {status === 'won' && (
                            <motion.div
                                key="won"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-green-600/20 border border-green-500 text-green-400 font-bold py-4 px-8 rounded-xl text-center"
                            >
                                🎉 MUA CƯỚP THÀNH CÔNG!
                            </motion.div>
                        )}
                        {status === 'lost' && (
                            <motion.div
                                key="lost"
                                initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-800 border border-red-500/50 text-red-500 font-bold py-4 px-8 rounded-xl text-center"
                            >
                                ❌ ĐÃ HẾT HÀNG!
                                <button onClick={startGame} className="block mt-2 text-xs text-white underline mx-auto">Thử lại</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// ── COMPONENT: SUPPLY DEMAND SLIDER ──────────────────────────────────────────
const SupplyDemandSimulator = () => {
    const [supply, setSupply] = useState(50);
    const [demand, setDemand] = useState(50);

    let message;
    let msgColor;
    let statusIcon;

    if (demand > supply) {
        message = "Cầu vượt Cung! Hàng hóa khan hiếm, Giá bị đẩy lên cao vút!";
        msgColor = "text-red-400";
        statusIcon = "🚀";
    } else if (supply > demand) {
        message = "Cung vượt Cầu! Hàng ế ẩm, Tồn kho lớn, Bắt buộc Đại Hạ Giá!";
        msgColor = "text-green-400";
        statusIcon = "🏷️";
    } else {
        message = "Cung Cầu Cân Bằng. Giá cả ổn định.";
        msgColor = "text-blue-400";
        statusIcon = "⚖️";
    }

    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <h3 className="text-xl font-black text-white mb-2">⚖️ Mô phỏng Quy luật Cung - Cầu</h3>
            <p className="text-blue-300 text-sm mb-8">Kéo thanh trượt để xem sự thay đổi sức mạnh thị trường ảnh hưởng tới giá cả như thế nào.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Supply */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-cyan-400 uppercase text-xs tracking-wider">Cung (Supply)</span>
                        <span className="font-mono bg-cyan-900 text-cyan-300 px-2 py-1 rounded text-xs">{supply} Đơn vị</span>
                    </div>
                    <input
                        type="range" min="10" max="100" value={supply}
                        onChange={(e) => setSupply(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                    />
                    <div className="mt-4 flex justify-center gap-1 flex-wrap h-16 overflow-hidden items-end">
                        {Array.from({ length: Math.min(supply, 40) }).map((_, i) => (
                            <motion.div key={i} layout className="text-xl opacity-80">📦</motion.div>
                        ))}
                    </div>
                </div>

                {/* Demand */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-amber-400 uppercase text-xs tracking-wider">Cầu (Demand)</span>
                        <span className="font-mono bg-amber-900 text-amber-300 px-2 py-1 rounded text-xs">{demand} Người</span>
                    </div>
                    <input
                        type="range" min="10" max="100" value={demand}
                        onChange={(e) => setDemand(Number(e.target.value))}
                        className="w-full accent-amber-500"
                    />
                    <div className="mt-4 flex justify-center gap-1 flex-wrap h-16 overflow-hidden items-end">
                        {Array.from({ length: Math.min(demand, 40) }).map((_, i) => (
                            <motion.div key={i} layout className="text-xl opacity-80">🙋</motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <motion.div
                key={message}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`text-center p-4 rounded-xl border bg-slate-900/50 flex flex-col items-center justify-center ${msgColor.replace('text', 'border')}/30`}
            >
                <div className="text-4xl mb-2">{statusIcon}</div>
                <div className={`font-bold text-lg ${msgColor}`}>{message}</div>
            </motion.div>
        </div>
    );
};

// ── COMPONENT: PLATFORM ECONOMY FLOW ─────────────────────────────────────────
const PlatformEconomyFlow = () => {
    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl h-[500px] md:h-[600px] flex flex-col">
            <h3 className="text-xl font-black text-white mb-2">🔄 Mô hình Kinh tế Nền tảng (Platform Economy)</h3>
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

// ── COMPONENT: CART ADDICTION SIMULATOR ──────────────────────────────────────
const CartAddictionSimulator = () => {
    const INITIAL_BUDGET = 10000000;
    const [budget, setBudget] = useState(INITIAL_BUDGET);
    const [cartCount, setCartCount] = useState(0);

    const isBankrupt = budget < 0;

    const handleBuy = (price) => {
        setBudget(prev => prev - price);
        setCartCount(prev => prev + 1);
    };

    const reset = () => {
        setBudget(INITIAL_BUDGET);
        setCartCount(0);
    };

    return (
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-700 pb-4">
                <div>
                    <h3 className="text-xl font-black text-white">🛒 Cạm Bẫy Tiêu Dùng</h3>
                    <p className="text-blue-300 text-sm mt-1">Nghệ thuật marketing kích thích lòng tham.</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-end">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Ngân sách của bạn</span>
                    <span className={`text-2xl font-mono font-black ${isBankrupt ? 'text-red-500' : 'text-green-400'}`}>
                        {budget.toLocaleString()}đ
                    </span>
                    <span className="text-xs text-blue-300 mt-1">Đã mua {cartCount} món</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {CART_ITEMS.map(item => (
                    <div key={item.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center hover:border-blue-400 transition-colors group">
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{item.img}</div>
                        <div className="font-bold text-sm text-white mb-1 line-clamp-1">{item.name}</div>
                        <div className="text-xs text-slate-500 line-through mb-1">{item.oldPrice.toLocaleString()}đ</div>
                        <div className="text-cyan-400 font-bold mb-3">{item.price.toLocaleString()}đ</div>
                        <button
                            onClick={() => handleBuy(item.price)}
                            className="bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold py-2 px-4 rounded w-full transition-colors focus:ring-2 ring-blue-400 outline-none"
                        >
                            THÊM GIỎ HÀNG
                        </button>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isBankrupt && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-950/80 border border-red-500 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    >
                        <div className="text-4xl mb-2">⚠️</div>
                        <h4 className="text-xl font-black text-red-500 mb-2">Báo động Đỏ: Bạn đã Nợ Nần!</h4>
                        <p className="text-red-200 text-sm leading-relaxed mb-4">
                            Sự thúc đẩy tiêu dùng quá mức bởi các nền tảng thương mại không chỉ vắt kiệt tài chính cá nhân mà còn dẫn đến lãng phí tài nguyên và rác thải khổng lồ. Đây chính là mặt trái của vòng quay lưu thông tư bản!
                        </p>
                        <button onClick={reset} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg">Làm lại cuộc đời</button>
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
                        <h2 className="text-center text-xl font-black text-cyan-400 uppercase tracking-widest mb-10">🚀 Các mốc tăng trưởng phi mã</h2>
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
                </div>
            </div>
        </div>
    );
}
