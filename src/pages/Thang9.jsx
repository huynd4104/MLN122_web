import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ── DATA ──────────────────────────────────────────────────────────────────────
const ASSET_TYPES = [
    { id: "real_estate", icon: "🏠", label: "Bất động sản", color: "#f97316", borderColor: "rgba(249,115,22,0.7)", bgColor: "rgba(249,115,22,0.18)", risk: "Khủng hoảng nợ dưới chuẩn Subprime 2008 — Hàng triệu gia đình mất nhà.", riskOnSelfPop: 13, inflateSpeed: 28 },
    { id: "stock", icon: "📈", label: "Cổ phiếu", color: "#22c55e", borderColor: "rgba(34,197,94,0.7)", bgColor: "rgba(34,197,94,0.18)", risk: "S&P 500 giảm 57% từ 2007–2009, xóa đi 11 nghìn tỷ USD.", riskOnSelfPop: 9, inflateSpeed: 25 },
    { id: "tech", icon: "💻", label: "Công nghệ", color: "#38bdf8", borderColor: "rgba(56,189,248,0.7)", bgColor: "rgba(56,189,248,0.18)", risk: "Bong bóng Dot-com 2000 — NASDAQ sụt 78%, hàng nghìn startup phá sản.", riskOnSelfPop: 7, inflateSpeed: 22 },
    { id: "bank", icon: "🏦", label: "Ngân hàng", color: "#ef4444", borderColor: "rgba(239,68,68,0.8)", bgColor: "rgba(239,68,68,0.22)", risk: "Domino ngân hàng — Lehman kéo theo Bear Stearns, AIG, Merrill Lynch. Tín dụng toàn cầu đóng băng.", riskOnSelfPop: 20, inflateSpeed: 26, isBank: true },
    { id: "crypto", icon: "₿", label: "Crypto", color: "#fbbf24", borderColor: "rgba(251,191,36,0.7)", bgColor: "rgba(251,191,36,0.18)", risk: "Terra/LUNA 2022 — 60 tỷ USD bốc hơi trong 72 giờ.", riskOnSelfPop: 10, inflateSpeed: 20 },
];

const TIMELINE_EVENTS = [
    { year: "2001", label: "Dotcom", icon: "💻", color: "#38bdf8", desc: "Bong bóng Dotcom vỡ — NASDAQ giảm 78%. FED cắt lãi suất kích thích kinh tế, vô tình thổi phồng bong bóng bất động sản." },
    { year: "2003", label: "Housing Boom", icon: "🏠", color: "#f97316", desc: "Bùng nổ bất động sản — Lãi suất thấp + cho vay dưới chuẩn dễ dãi. Ngân hàng đóng gói nợ xấu thành CDO bán khắp thế giới." },
    { year: "2007", label: "Subprime", icon: "⚠️", color: "#fbbf24", desc: "Khủng hoảng Subprime — Người vay mất khả năng trả nợ hàng loạt. Bear Stearns mất 1.6 tỷ USD. Domino bắt đầu đổ." },
    { year: "2008", label: "Lehman", icon: "💥", color: "#ef4444", desc: "Lehman Brothers sụp đổ 15/9/2008 — Phá sản 613 tỷ USD lớn nhất lịch sử. Mỹ bơm 700 tỷ USD cứu trợ." },
];

const QUOTES = [
    { text: "Lịch sử cho thấy chủ nghĩa tư bản tạo ra những cuộc khủng hoảng định kỳ — đó là mâu thuẫn nội tại không thể tránh khỏi giữa sản xuất xã hội hóa và chiếm hữu tư nhân.", author: "Karl Marx", icon: "📕" },
    { text: "Lạm phát là thuế mà không cần thông qua Quốc hội. Phá sản ngân hàng là kết quả tất yếu của sự can thiệp thiếu kiềm chế.", author: "Milton Friedman", icon: "💭" },
    { text: "Thị trường có thể duy trì phi lý trí lâu hơn bạn có thể duy trì khả năng thanh toán.", author: "John Maynard Keynes", icon: "📖" },
    { text: "Chúng ta đã xây dựng một hệ thống tài chính phức tạp đến mức không ai hiểu rõ nó — cho đến khi nó sụp đổ.", author: "Alan Greenspan, 2008", icon: "🏛️" },
];

const CRISIS_SPREAD = [
    { flag: "🇺🇸", country: "USA", role: "Nguồn phát", color: "#ef4444" },
    { flag: "🇬🇧", country: "UK", role: "Ngân hàng sụp đổ", color: "#f97316" },
    { flag: "🇩🇪", country: "Đức", role: "Xuất khẩu sụt giảm", color: "#fbbf24" },
    { flag: "🇬🇷", country: "Hy Lạp", role: "Nợ công", color: "#a78bfa" },
    { flag: "🌐", country: "Toàn cầu", role: "Suy thoái", color: "#94a3b8" },
];

const COMPARE_ROWS = [
    { label: "Tín dụng", before: "Cho vay dưới chuẩn tràn lan", after: "Basel III — Vốn tối thiểu 8%", bc: "#ef4444", ac: "#22c55e" },
    { label: "Giám sát", before: "Tự điều tiết", after: "Stress test bắt buộc hàng năm", bc: "#f97316", ac: "#38bdf8" },
    { label: "Sản phẩm tài chính", before: "CDO bí ẩn, CDS không kiểm soát", after: "Công khai, bắt buộc bảo chứng", bc: "#ef4444", ac: "#22c55e" },
    { label: "Cứu trợ", before: "Không có cơ chế rõ ràng", after: "Dodd-Frank Act 2010", bc: "#f97316", ac: "#a78bfa" },
    { label: "Lãi suất", before: "Thấp kéo dài (Greenspan Put)", after: "Chính sách linh hoạt hơn", bc: "#fbbf24", ac: "#22c55e" },
];

const CORE_IDEAS = [
    { id: "1", label: "Khủng hoảng chu kỳ", icon: "📉", border: "border-red-400", bg: "bg-red-900/40", desc: "Khủng hoảng định kỳ trong chủ nghĩa tư bản (theo giáo trình: Do mâu thuẫn sản xuất - tiêu dùng dư thừa)." },
    { id: "2", label: "Bong bóng tài chính", icon: "💥", border: "border-amber-400", bg: "bg-amber-900/40", desc: "Giá tài sản tăng vọt rồi vỡ (theo giáo trình: Do đầu cơ, dẫn đến khủng hoảng tài chính)." },
    { id: "3", label: "Cạnh tranh và độc quyền", icon: "🏆", border: "border-emerald-400", bg: "bg-emerald-900/40", desc: "Cạnh tranh dẫn đến độc quyền, gây bất ổn (theo giáo trình: Tập trung tư bản tăng khủng hoảng)." },
    { id: "4", label: "Mâu thuẫn tư bản", icon: "⚖️", border: "border-purple-400", bg: "bg-purple-900/40", desc: "Mâu thuẫn giữa sản xuất xã hội hóa và chiếm hữu tư nhân (theo giáo trình: Nguyên nhân gốc rễ khủng hoảng)." },
    { id: "5", label: "Nhà nước can thiệp", icon: "🏛️", border: "border-sky-400", bg: "bg-sky-900/40", desc: "Nhà nước điều tiết để giảm khủng hoảng (theo giáo trình: Không giải quyết tận gốc mâu thuẫn)." },
];

function rnd(min, max) { return Math.random() * (max - min) + min; }
function randomAsset() { return ASSET_TYPES[Math.floor(Math.random() * ASSET_TYPES.length)]; }

// ── BUBBLE ────────────────────────────────────────────────────────────────────
function Bubble({ bubble, onPop, onSelfPop, getSpeed }) {
    const { id, x, y, asset } = bubble;
    const alive = useRef(false);
    const [progress, setProgress] = useState(0);
    const startTime = useRef(null);

    useEffect(() => {
        // Must reset here to handle React 18 StrictMode double-mount
        alive.current = true;
        startTime.current = Date.now();

        const tick = setInterval(() => {
            if (!alive.current) return;
            const elapsed = (Date.now() - startTime.current) / 1000;
            const dur = asset.inflateSpeed / getSpeed();
            const p = Math.min(elapsed / dur, 1);
            setProgress(p);
            if (p >= 1) {
                alive.current = false;
                clearInterval(tick);
                onSelfPop(id, asset);
            }
        }, 100);

        return () => {
            alive.current = false;
            clearInterval(tick);
        };
        // eslint-disable-next-line
    }, []);

    const handleClick = () => {
        if (!alive.current) return;
        alive.current = false;
        onPop(id, asset);
    };


    const scale = 0.35 + (1.9 - 0.35) * progress;
    const danger = progress;
    const glow = danger > 0.75 ? "rgba(239,68,68,0.95)" : danger > 0.5 ? "rgba(249,115,22,0.8)" : asset.borderColor;
    const size = 58;

    return (
        <motion.div
            className="absolute cursor-pointer flex items-center justify-center select-none"
            style={{ left: x, top: y, width: size, height: size, transform: `translate(-50%,-50%) scale(${scale})`, borderRadius: "50%", background: asset.bgColor, border: `2.5px solid ${glow}`, boxShadow: `0 0 ${10 + danger * 22}px ${glow}`, zIndex: 10 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            onClick={handleClick}
        >
            <span style={{ fontSize: size * 0.44, lineHeight: 1 }}>{asset.icon}</span>
            {danger > 0.65 && (
                <motion.div className="absolute -top-1 -right-1" style={{ fontSize: 10 }}
                    animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.45, repeat: Infinity }}>⚠️</motion.div>
            )}
        </motion.div>
    );
}

// ── DOMINO SCREEN ─────────────────────────────────────────────────────────────
function DominoFall({ score, onRestart }) {
    return (
        <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 overflow-y-auto"
            style={{ background: "rgba(0,0,0,0.94)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="text-2xl sm:text-3xl font-black text-red-400 mb-1 tracking-widest uppercase text-center"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                💥 GLOBAL FINANCIAL CRISIS
            </motion.div>
            <motion.div className="text-white/50 text-sm mb-5 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                Điểm của bạn: <span className="text-yellow-300 font-black text-xl">{score}</span>
            </motion.div>
            <div className="flex items-end gap-3 mb-6">
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div key={i} className="text-4xl sm:text-5xl"
                        style={{ transformOrigin: "bottom center" }}
                        initial={{ rotate: 0, opacity: 1 }}
                        animate={{ rotate: 85, opacity: 0.2 }}
                        transition={{ delay: 0.6 + i * 0.2, duration: 0.45, ease: "easeIn" }}>🏦</motion.div>
                ))}
            </div>
            <motion.p className="text-sm text-red-300/80 max-w-sm text-center mb-5 leading-relaxed"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                Mâu thuẫn giữa <span className="text-yellow-300 font-bold">sản xuất xã hội hóa</span> và{" "}
                <span className="text-red-400 font-bold">chiếm hữu tư nhân</span> — nguyên nhân gốc rễ sụp đổ hệ thống tư bản.
            </motion.p>
            <motion.div className="w-full max-w-lg rounded-2xl border border-red-500/30 overflow-hidden mb-5"
                style={{ background: "rgba(15,5,5,0.95)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }}>
                <div className="p-3 border-b border-red-500/20 text-white font-black text-sm text-center"
                    style={{ background: "linear-gradient(90deg,#7f1d1d,#991b1b60)" }}>⚖️ Trước vs Sau Khủng hoảng 2008</div>
                <div className="p-3 overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead><tr>
                            <th className="text-left text-white/40 py-1 pr-3 w-24">Tiêu chí</th>
                            <th className="text-center text-red-300 font-black pb-1 px-2">⛔ Trước 2008</th>
                            <th className="text-center text-green-300 font-black pb-1 px-2">✅ Sau 2008</th>
                        </tr></thead>
                        <tbody>
                            {COMPARE_ROWS.map(r => (
                                <tr key={r.label} className="border-t border-white/5">
                                    <td className="py-2 pr-3 text-white/50 font-semibold">{r.label}</td>
                                    <td className="py-2 px-2 text-center"><span className="px-2 py-0.5 rounded-lg font-bold inline-block" style={{ background: `${r.bc}18`, color: r.bc, border: `1px solid ${r.bc}35` }}>{r.before}</span></td>
                                    <td className="py-2 px-2 text-center"><span className="px-2 py-0.5 rounded-lg font-bold inline-block" style={{ background: `${r.ac}18`, color: r.ac, border: `1px solid ${r.ac}35` }}>{r.after}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
            <motion.button className="px-8 py-3 rounded-xl font-black text-base text-white"
                style={{ background: "linear-gradient(90deg,#b91c1c,#ef4444)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                onClick={onRestart}>🔄 Chơi lại</motion.button>
        </motion.div>
    );
}

// ── QUOTES (đồng bộ Thang8) ───────────────────────────────────────────────────
function QuotesSection() {
    const [cur, setCur] = useState(0);
    const [dir, setDir] = useState(1);
    const go = useCallback((idx, d) => { setDir(d); setCur((idx + QUOTES.length) % QUOTES.length); }, []);
    const variants = {
        enter: d => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0 },
        exit: d => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
    };
    return (
        <motion.section className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
            <h2 className="text-center text-base font-bold text-yellow-300 uppercase tracking-widest mb-4">💬 Trích dẫn Kinh điển</h2>
            <div className="relative rounded-2xl border border-yellow-500/25 overflow-hidden" style={{ background: "rgba(30,20,5,0.85)", backdropFilter: "blur(12px)" }}>
                <div className="absolute top-4 left-5 text-6xl text-yellow-400/12 font-serif leading-none select-none">"</div>
                <button onClick={() => go(cur - 1, -1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-400/20 text-yellow-300/60 hover:text-yellow-300 transition-all focus:outline-none">‹</button>
                <button onClick={() => go(cur + 1, 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-400/20 text-yellow-300/60 hover:text-yellow-300 transition-all focus:outline-none">›</button>
                <div className="overflow-hidden px-10 pt-8 pb-4">
                    <AnimatePresence mode="wait" custom={dir}>
                        <motion.div key={cur} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3 }}
                            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18}
                            onDragEnd={(_, info) => { if (info.offset.x < -50) go(cur + 1, 1); else if (info.offset.x > 50) go(cur - 1, -1); }}
                            className="relative z-10 cursor-grab active:cursor-grabbing select-none">
                            <div className="text-3xl mb-3 text-center">{QUOTES[cur].icon}</div>
                            <p className="text-yellow-100 text-sm leading-relaxed text-center italic mb-3">"{QUOTES[cur].text}"</p>
                            <div className="text-yellow-400/70 text-xs text-center font-semibold uppercase tracking-widest">— {QUOTES[cur].author}</div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="flex justify-center gap-2 pb-4">
                    {QUOTES.map((_, i) => (
                        <button key={i} onClick={() => go(i, i > cur ? 1 : -1)} className="rounded-full transition-all duration-300 focus:outline-none"
                            style={{ width: cur === i ? "20px" : "8px", height: "8px", background: cur === i ? "#fbbf24" : "rgba(255,255,255,0.2)" }} />
                    ))}
                </div>
            </div>
        </motion.section>
    );
}

// ── GAME COMPONENT ────────────────────────────────────────────────────────────
function BubbleGame({ onScoreChange }) {
    const [started, setStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [bubbles, setBubbles] = useState([]);
    const [risk, setRisk] = useState(0);
    const [score, setScore] = useState(0);
    const [shaking, setShaking] = useState(false);
    const [contagion, setContagion] = useState(false);
    const [popup, setPopup] = useState(null);
    const [hoveredTL, setHoveredTL] = useState(null);
    const [easterEgg, setEasterEgg] = useState(false);

    // Mutable refs — don't trigger re-renders, safe inside intervals/callbacks
    const riskRef = useRef(0);
    const speedRef = useRef(1);
    const nextId = useRef(0);
    const spawnRef = useRef(null);
    const isAlive = useRef(false); // tracks if game is running

    const showPopup = (text, color) => {
        setPopup({ text, color });
        setTimeout(() => setPopup(null), 3500);
    };

    const doEndGame = () => {
        isAlive.current = false;
        clearInterval(spawnRef.current);
        setBubbles([]);
        setGameOver(true);
    };

    const addRisk = (amount, assetId) => {
        const next = Math.min(100, riskRef.current + amount);
        riskRef.current = next;
        setRisk(next);
        speedRef.current = 1 + (next / 100) * 0.85;
        if (assetId === "bank") {
            setContagion(true);
            setTimeout(() => setContagion(false), 3000);
        }
        if (next >= 100) doEndGame();
    };

    const spawnOne = () => {
        if (!isAlive.current) return;
        setBubbles(prev => {
            if (prev.length >= 8) return prev;
            return [...prev, { id: nextId.current++, x: `${rnd(10, 90)}%`, y: `${rnd(12, 85)}%`, asset: randomAsset() }];
        });
    };

    const startGame = () => {
        // Reset everything
        riskRef.current = 0;
        speedRef.current = 1;
        nextId.current = 0;
        isAlive.current = true;
        clearInterval(spawnRef.current);
        setBubbles([]);
        setRisk(0);
        setScore(0);
        setShaking(false);
        setContagion(false);
        setPopup(null);
        setEasterEgg(false);
        setGameOver(false);
        setStarted(true);
        onScoreChange(0);

        // Spawn initial bubbles
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (!isAlive.current) return;
                setBubbles(prev => [...prev, {
                    id: nextId.current++,
                    x: `${rnd(10, 90)}%`,
                    y: `${rnd(12, 85)}%`,
                    asset: randomAsset(),
                }]);
            }, i * 800);
        }

        // Keep spawning
        spawnRef.current = setInterval(spawnOne, 4500);
    };

    useEffect(() => () => { isAlive.current = false; clearInterval(spawnRef.current); }, []);

    // Click = defuse = good, NO risk increase
    const onPop = (id, asset) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        showPopup(`✅ ${asset.icon} ${asset.label} bị dập tắt kịp thời!`, asset.color);
        setScore(prev => {
            const ns = prev + 10;
            onScoreChange(ns);
            if (ns >= 100 && !easterEgg) setEasterEgg(true);
            return ns;
        });
    };

    // Self-pop = crisis = bad, risk increases
    const onSelfPop = (id, asset) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        showPopup(`💥 ${asset.icon} ${asset.label} TỰ NỔ! ${asset.risk}`, "#ef4444");
        setShaking(true); setTimeout(() => setShaking(false), 600);
        addRisk(asset.riskOnSelfPop, asset.id);
    };

    const getSpeed = () => speedRef.current;

    const riskColor = risk >= 80 ? "#ef4444" : risk >= 50 ? "#f97316" : risk >= 25 ? "#fbbf24" : "#22c55e";
    const spreadLit = Math.ceil((risk / 100) * CRISIS_SPREAD.length);

    return (
        <>
            {gameOver && <DominoFall score={score} onRestart={startGame} />}

            {/* Timeline */}
            <div className="mb-5">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-3 text-center">⏱ Trục Thời Gian Khủng hoảng 2008</p>
                <div className="relative flex items-start justify-between">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 mx-4" />
                    {TIMELINE_EVENTS.map((t, i) => (
                        <div key={t.year} className="relative flex flex-col items-center flex-1 min-w-[68px] z-10">
                            <motion.button className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm focus:outline-none"
                                style={{ borderColor: t.color, background: hoveredTL === i ? t.color : "rgba(5,10,30,0.9)", color: hoveredTL === i ? "#000" : t.color, boxShadow: hoveredTL === i ? `0 0 14px ${t.color}99` : undefined }}
                                onMouseEnter={() => setHoveredTL(i)} onMouseLeave={() => setHoveredTL(null)}
                                onTouchStart={() => setHoveredTL(p => p === i ? null : i)}
                                whileHover={{ scale: 1.15 }}>{t.icon}</motion.button>
                            <div className="mt-1 text-xs font-black" style={{ color: t.color }}>{t.year}</div>
                            <div className="text-white/30 text-center leading-tight" style={{ fontSize: 9 }}>{t.label}</div>
                        </div>
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    {hoveredTL !== null && (
                        <motion.div key={hoveredTL} className="mt-3 rounded-xl border p-3"
                            style={{ borderColor: TIMELINE_EVENTS[hoveredTL].color + "50", background: `${TIMELINE_EVENTS[hoveredTL].color}12` }}
                            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                            <div className="flex gap-2 items-start">
                                <span className="text-lg">{TIMELINE_EVENTS[hoveredTL].icon}</span>
                                <div>
                                    <div className="font-black text-xs mb-1" style={{ color: TIMELINE_EVENTS[hoveredTL].color }}>
                                        {TIMELINE_EVENTS[hoveredTL].year} — {TIMELINE_EVENTS[hoveredTL].label}
                                    </div>
                                    <p className="text-blue-100 text-xs leading-relaxed">{TIMELINE_EVENTS[hoveredTL].desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Risk bar */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold" style={{ color: riskColor }}>
                        {risk >= 80 ? "🚨 Nguy hiểm cực cao" : risk >= 50 ? "⚠️ Rủi ro cao" : risk >= 25 ? "⚡ Rủi ro trung bình" : "✅ Ổn định"}
                    </span>
                    <span className="text-xs font-black" style={{ color: riskColor }}>Risk: {risk}%</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div className="h-full rounded-full" animate={{ width: `${risk}%` }}
                        style={{ background: `linear-gradient(90deg,#22c55e,${riskColor})` }} transition={{ duration: 0.4 }} />
                </div>
                <AnimatePresence>
                    {risk >= 70 && risk < 100 && (
                        <motion.p className="mt-1.5 text-xs text-red-300 font-semibold text-center"
                            initial={{ opacity: 0 }} animate={{ opacity: [0.5, 1, 0.5] }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.9, repeat: Infinity }}>
                            ⚠️ Mâu thuẫn sản xuất xã hội hóa &amp; chiếm hữu tư nhân đang đạt đỉnh điểm!
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Crisis spread map */}
            <div className="mb-5 rounded-xl border border-white/8 p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-3 text-center">🌐 Dòng chảy Khủng hoảng</p>
                <div className="flex items-end justify-center gap-2 flex-wrap">
                    {CRISIS_SPREAD.map((c, i) => (
                        <div key={c.country} className="flex items-center gap-2">
                            <motion.div className="flex flex-col items-center gap-0.5"
                                animate={i < spreadLit ? { scale: [1, 1.08, 1] } : {}}
                                transition={{ duration: 0.7, repeat: i < spreadLit ? Infinity : 0, repeatDelay: 2 }}>
                                <div className={`text-3xl transition-all duration-500 ${i < spreadLit ? "" : "opacity-20 grayscale"}`}>{c.flag}</div>
                                <div className="text-sm font-black transition-colors duration-500" style={{ color: i < spreadLit ? c.color : "#475569" }}>{c.country}</div>
                                <div className="text-xs font-medium text-white/40">{c.role}</div>
                            </motion.div>
                            {i < CRISIS_SPREAD.length - 1 && (
                                <motion.div className="text-xl font-bold mb-6"
                                    style={{ color: i < spreadLit - 1 ? "#ef4444" : "#334155" }}
                                    animate={i < spreadLit - 1 ? { opacity: [0.4, 1, 0.4], x: [0, 3, 0] } : { opacity: 0.2 }}
                                    transition={{ duration: 0.8, repeat: Infinity }}>→</motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Alerts */}
            <AnimatePresence>
                {contagion && (
                    <motion.div className="mb-2 rounded-xl border border-red-500/60 p-2 text-center" style={{ background: "rgba(127,29,29,0.55)" }}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-red-300 font-black text-xs">🏦 HIỆU ỨNG LAN TRUYỀN NGÂN HÀNG! — Tốc độ bong bóng tăng!</p>
                    </motion.div>
                )}
                {easterEgg && (
                    <motion.div className="mb-2 rounded-xl border border-yellow-400/40 p-2 text-center" style={{ background: "rgba(120,80,0,0.35)" }}
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <p className="text-yellow-300 font-black text-xs">🏆 Bạn đã sống sót qua bong bóng — nhưng nền kinh tế thì không!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Asset legend — outside arena for visibility */}
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
                {ASSET_TYPES.map(a => (
                    <div key={a.id} className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold"
                        style={{ background: a.bgColor, border: `1.5px solid ${a.borderColor}`, color: a.color }}>
                        <span className="text-sm">{a.icon}</span> {a.label}
                    </div>
                ))}
            </div>

            {/* Game arena */}
            <motion.div className="relative rounded-xl border border-red-800/40 overflow-hidden"
                style={{ background: "rgba(4,8,28,0.92)", height: 300 }}
                animate={shaking ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
                transition={{ duration: 0.5 }}>


                {/* Score in arena */}
                <div className="absolute top-2 right-2 z-20 text-center bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-2.5 py-1">
                    <div className="text-yellow-300 font-black text-xl leading-none">{score}</div>
                    <div className="text-yellow-600/80" style={{ fontSize: 9 }}>điểm</div>
                </div>

                {/* START overlay — shown before game begins */}
                {!started && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-30"
                        style={{ background: "rgba(4,8,28,0.88)", backdropFilter: "blur(4px)" }}>
                        <div className="text-5xl mb-3">🏦</div>
                        <p className="text-white font-black text-lg mb-1">Mô phỏng Rủi ro Hệ thống</p>
                        <p className="text-blue-300/70 text-sm text-center max-w-xs mb-5 px-4 leading-relaxed">
                            Click bong bóng để dập tắt. Bong bóng tự nổ → Risk tăng.<br />Risk 100% → Khủng hoảng toàn cầu!
                        </p>
                        <button
                            className="px-8 py-3 rounded-xl font-black text-base text-white cursor-pointer"
                            style={{ background: "linear-gradient(90deg,#b91c1c,#ef4444)" }}
                            onClick={startGame}
                        >⚡ Bắt đầu Game</button>
                    </div>
                )}

                {started && !gameOver && (
                    <p className="absolute bottom-2 w-full text-center pointer-events-none"
                        style={{ color: "rgba(96,165,250,0.4)", fontSize: 11 }}>
                        — Click bong bóng để dập tắt · Đừng để chúng tự nổ! —
                    </p>
                )}

                {/* Bubbles */}
                {started && !gameOver && bubbles.map(b => (
                    <Bubble key={b.id} bubble={b} onPop={onPop} onSelfPop={onSelfPop} getSpeed={getSpeed} />
                ))}

                {/* Popup */}
                <AnimatePresence>
                    {popup && (
                        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center rounded-xl p-3"
                            style={{ background: "rgba(10,5,20,0.92)", border: `1px solid ${popup.color}50`, maxWidth: "88%" }}
                            initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                            <p className="text-xs font-semibold leading-relaxed" style={{ color: popup.color }}>{popup.text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LehmanCollapsePage() {
    const [score, setScore] = useState(0);
    const [gameKey, setGameKey] = useState(0);

    return (
        <div className="min-h-screen text-white overflow-x-hidden"
            style={{ background: "linear-gradient(135deg,#450a0a 0%,#7f1d1d 40%,#451a03 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

            {/* Starfield */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(28)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-yellow-300"
                        style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 65}%`, opacity: Math.random() * 0.5 + 0.15 }}
                        animate={{ opacity: [0.15, 0.85, 0.15] }}
                        transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2.5 }} />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">

                {/* Back */}
                <div className="pt-6 mb-2">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-sm">
                        ← Về Trang Chủ
                    </Link>
                </div>

                {/* Header */}
                <motion.header className="text-center pt-6 pb-8" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1 text-yellow-300 text-sm font-semibold mb-4 tracking-widest uppercase"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        📅 Tháng 9 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-2xl sm:text-4xl font-black leading-tight mb-2 whitespace-nowrap" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 9: </span><span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sự sụp đổ của Lehman Brothers</span>
                    </motion.h1>
                </motion.header>

                {/* Event Card */}
                <motion.section className="rounded-2xl border border-red-500/30 p-6 mb-8 relative overflow-hidden"
                    style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">🏦💥</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">15 tháng 9, 2008</div>
                            <h2 className="text-xl font-bold text-white mb-2">Sự sụp đổ của Lehman Brothers — Khủng hoảng tài chính toàn cầu</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Ngày 15/9/2008, <strong className="text-yellow-300">Lehman Brothers</strong> — ngân hàng đầu tư lớn thứ 4 Mỹ — nộp đơn phá sản với nợ 613 tỷ USD, do bong bóng bất động sản vỡ và khủng hoảng subprime. Đây là vụ phá sản lớn nhất lịch sử Mỹ.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Sự kiện khởi đầu khủng hoảng tài chính 2008, dẫn đến suy thoái toàn cầu, thất nghiệp tăng, thị trường chứng khoán sụp đổ. Nó minh họa tính chu kỳ của khủng hoảng tư bản và rủi ro bong bóng tài chính.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Core Ideas */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-5">
                        ✦ Tư tưởng cốt lõi ✦
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {CORE_IDEAS.map((idea, i) => (
                            <motion.div key={idea.id} className={`rounded-xl border ${idea.border} ${idea.bg} p-4 flex gap-3 items-start`}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }} whileHover={{ scale: 1.02 }}>
                                <div className="text-2xl flex-shrink-0">{idea.icon}</div>
                                <div>
                                    <div className="font-bold text-white text-sm mb-1">{idea.label}</div>
                                    <div className="text-blue-300 text-xs leading-relaxed">{idea.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Quotes */}
                <QuotesSection />

                {/* Video */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                    <div className="flex justify-center">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/KAu_ozSNL64"
                            title="Lehman Brothers Collapse" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen className="rounded-xl shadow-lg w-full max-w-lg" />
                    </div>
                </motion.section>

                {/* Game section */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <div className="rounded-t-2xl p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#7f1d1d,#b91c1c,#ef4444)" }}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-white">🌐 Mô phỏng Rủi ro Hệ thống</h2>
                                <p className="text-red-200 text-sm mt-0.5">Click bong bóng trước khi chúng tự nổ · Ngăn chặn khủng hoảng lan rộng</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-center bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2 min-w-16">
                                    <div className="text-yellow-300 font-black text-2xl leading-none">{score}</div>
                                    <div className="text-yellow-600 text-xs mt-0.5">điểm</div>
                                </div>
                                <button onClick={() => setGameKey(k => k + 1)}
                                    className="bg-red-800 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                                    🔄 Chơi lại
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-x border-b border-red-800/40 rounded-b-2xl" style={{ background: "rgba(8,5,25,0.95)" }}>
                        <BubbleGame key={gameKey} onScoreChange={setScore} />
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
