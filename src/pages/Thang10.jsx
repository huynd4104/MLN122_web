import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Link } from "react-router-dom";

// --- DATA ---
const TICKER_DATA = [
    { sym: "FORD", chg: "-23%" }, { sym: "GM", chg: "-38%" },
    { sym: "RCA", chg: "-42%" }, { sym: "GE", chg: "-24%" },
    { sym: "US STEEL", chg: "-27%" }, { sym: "AT&T", chg: "-19%" },
    { sym: "STD OIL", chg: "-11%" }, { sym: "CHRYSLER", chg: "-17%" }
];

// --- COMPONENTS ---

const StockTicker = () => {
    return (
        <div className="fixed top-0 left-0 w-full bg-black/90 text-red-500 font-mono text-xs py-1.5 z-50 border-b border-red-900 overflow-hidden whitespace-nowrap">
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="inline-block"
            >
                {Array(5).fill(TICKER_DATA).flat().map((t, i) => (
                    <span key={i} className="mx-4 font-bold">
                        {t.sym} <span className="text-red-600">{t.chg} ▼</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

const CrisisLevelBar = ({ progress }) => {
    const width = useTransform(progress, v => `${v}%`);
    const formattedProgress = useTransform(progress, v => Math.round(v));
    return (
        <div className="fixed top-7 left-0 w-full h-1.5 z-50 bg-neutral-900">
            <motion.div
                className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                style={{ width }}
            />
            <div className="absolute top-2 left-2 text-[10px] text-red-500 font-black uppercase tracking-widest">
                Crisis Level: <motion.span>{formattedProgress}</motion.span>%
            </div>
        </div>
    );
};

const DynamicIndicators = ({ unemploy, prod, trade, color }) => {
    const unemployStr = useTransform(unemploy, v => `${Math.round(v)}%`);
    const prodStr = useTransform(prod, v => `${Math.round(v)}%`);
    const tradeStr = useTransform(trade, v => `${Math.round(v)}%`);

    return (
        <motion.div
            className="fixed bottom-4 right-4 z-40 bg-black/80 border border-red-900/50 rounded-xl p-3 backdrop-blur-md shadow-2xl"
            style={{ borderColor: color }}
        >
            <div className="text-[10px] text-red-500/80 font-bold uppercase tracking-widest mb-2 border-b border-red-900/50 pb-1">Dữ liệu Kinh tế</div>
            <div className="space-y-2">
                <div className="flex justify-between gap-4 text-xs font-mono">
                    <span className="text-white/60">Tỷ lệ thất nghiệp:</span>
                    <motion.span style={{ color }} className="font-bold">
                        {unemployStr}
                    </motion.span>
                </div>
                <div className="flex justify-between gap-4 text-xs font-mono">
                    <span className="text-white/60">Sản xuất Công nghiệp:</span>
                    <motion.span style={{ color }} className="font-bold">
                        {prodStr}
                    </motion.span>
                </div>
                <div className="flex justify-between gap-4 text-xs font-mono">
                    <span className="text-white/60">Thương mại Toàn cầu:</span>
                    <motion.span style={{ color }} className="font-bold">
                        {tradeStr}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

const DowJonesChart = ({ dowValue, dowStatus }) => {
    const dowValueStr = useTransform(dowValue, v => Math.round(v));

    // Determine the shaking based on status
    const isWarning = dowStatus === 'warning';
    const isPanic = dowStatus === 'panic';
    const isCrash = dowStatus === 'crash';

    return (
        <motion.div
            className="sticky top-24 mx-auto w-full max-w-sm bg-black/80 border border-neutral-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl z-30"
            animate={isPanic ? { x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] } : isWarning ? { y: [-1, 1, 0] } : {}}
            transition={{ repeat: (isPanic || isWarning) ? Infinity : 0, duration: isPanic ? 0.3 : 0.8 }}
        >
            <div className="flex flex-col items-center text-center">
                <h3 className="relative z-20 text-lh text-white/50 font-bold tracking-widest uppercase mb-2">Chỉ số Dow Jones</h3>

                <motion.div
                    className="relative z-20 text-6xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-mono flex justify-center items-baseline"
                    style={{ color: isPanic || isCrash ? '#ef4444' : isWarning ? '#eab308' : '#22c55e' }}
                >
                    <motion.span>{dowValueStr}</motion.span>
                    <span className="text-lg ml-1 text-white/90 font-bold">điểm</span>
                </motion.div>

                {/* Status Alerts */}
                <div className="relative z-20 h-6 mt-2">
                    <AnimatePresence mode="wait">
                        {isWarning && (
                            <motion.div
                                key="warning"
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="text-yellow-500 text-xs font-bold uppercase tracking-widest"
                            >
                                ⚠️ Cảnh báo
                            </motion.div>
                        )}
                        {isPanic && (
                            <motion.div
                                key="panic"
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse"
                            >
                                🚨 Hoảng Loạn
                            </motion.div>
                        )}
                        {isCrash && (
                            <motion.div
                                key="crash"
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="text-red-800 text-xs font-bold uppercase tracking-widest"
                            >
                                💥 Sụp đổ hoàn toàn
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Full Overlay for Panic Area */}
                <AnimatePresence>
                    {isPanic && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 rounded-2xl pointer-events-none z-10 border-2 border-red-500 overflow-hidden"
                        >
                            <span className="text-3xl sm:text-4xl font-black text-white/60 mix-blend-overlay tracking-tighter rotate-[-5deg]">
                                BÁN THÁO (SELL SELL)
                            </span>
                        </motion.div>
                    )}
                    {isCrash && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute -top-3 -right-3 bg-red-600 text-white text-[12px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-red-400 transform rotate-12"
                        >
                            Đáy vực sâu
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const BankRunGame = () => {
    const [vault, setVault] = useState(20);
    const [fail, setFail] = useState(false);
    const [queue, setQueue] = useState([]);

    const withdraw = () => {
        if (fail) return;

        // add person to queue
        const newPerson = { id: Date.now() + Math.random() };
        setQueue(q => [...q, newPerson]);

        setTimeout(() => {
            setVault(v => {
                if (v >= 5) {
                    return v - 5;
                } else {
                    setFail(true);
                    return v;
                }
            });
        }, 800);
    };

    return (
        <div className="my-16 bg-[#050b14] border border-blue-900/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <h3 className="text-2xl font-black text-white mb-2">🏦 Phân hạch Ngân Hàng (Bank Run)</h3>
            <p className="text-blue-200/60 text-sm mb-8">
                Hệ thống <strong>Dự trữ phân đoạn (Fractional Reserve)</strong>: Tiền gửi không nằm im trong két. Ngân hàng đã mang 80% đi đầu tư kiếm lời. Điều gì xảy ra khi tất cả cùng hoảng loạn đòi rút tiền một lúc?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual of bank structure */}
                <div className="flex flex-col gap-4">
                    <div className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 relative">
                        <div className="flex justify-between text-xs text-neutral-400 mb-3 font-bold uppercase tracking-widest">
                            <span>Tổng Tiền Gửi Sổ Sách: $100</span>
                        </div>
                        <div className="h-14 w-full flex bg-neutral-950 rounded-xl overflow-hidden border border-neutral-700 shadow-inner">
                            <div className="h-full bg-blue-600/30 flex items-center justify-center font-bold text-xs text-blue-400 border-r border-blue-900/50 text-center px-2" style={{ width: '80%' }}>
                                Khoản vay ($80)
                            </div>
                            <div className="h-full relative flex items-center justify-center font-bold text-[10px] sm:text-xs transition-colors duration-300" style={{ width: '20%', backgroundColor: vault > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.2)' }}>
                                <div className="absolute left-0 bottom-0 top-0 bg-green-500/80 transition-all duration-300" style={{ width: `${(vault / 20) * 100}%` }}></div>
                                <span className={`relative z-10 ${vault === 0 ? 'text-red-500' : 'text-emerald-400'}`}>Két: ${vault}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <button
                            onClick={withdraw}
                            className={`w-full font-black py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${fail
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                                : 'bg-red-600 hover:bg-red-500 active:scale-95 text-white shadow-red-900/50 border border-red-500'
                                }`}
                        >
                            {fail ? '🔒 NGÂN HÀNG ĐÃ ĐÓNG CỬA' : '🗣️ Tung tin hoảng loạn & Rút tiền! ($5)'}
                        </button>

                        {fail && (
                            <button
                                onClick={() => { setVault(20); setFail(false); setQueue([]); }}
                                className="mt-4 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-full transition-colors active:scale-95 shadow-md border border-neutral-600 flex items-center gap-2"
                            >
                                ↺ Mở cửa lại Ngân hàng
                            </button>
                        )}
                    </div>
                </div>

                {/* People representation */}
                <div className="bg-black/40 border border-neutral-800 p-6 rounded-2xl min-h-[220px] flex flex-col items-center justify-center relative">
                    {fail ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                            <div className="text-6xl mb-4">💥</div>
                            <div className="text-red-500 font-black text-3xl mb-2">VỠ NỢ TỨC THÌ!</div>
                            <p className="text-red-400/80 text-xs px-2">Két sắt cạn kiệt, ngân hàng không thể thanh khoản. Biểu tình nổ ra, giông bão tài chính chính thức lan rộng.</p>
                        </motion.div>
                    ) : (
                        <div className="w-full">
                            <div className="text-center text-xs font-bold text-neutral-500 uppercase mb-6 tracking-widest border-b border-neutral-800 pb-2">Đám đông chờ rút tiền</div>
                            <div className="flex flex-wrap justify-center gap-2 min-h-[60px]">
                                <AnimatePresence>
                                    {queue.map((p) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, scale: 0, x: 20 }}
                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0, y: -20 }}
                                            className="text-3xl"
                                        >
                                            🤬
                                        </motion.div>
                                    ))}
                                    {queue.length === 0 && <div className="text-neutral-600 text-xs w-full text-center mt-2">(Chưa có người nào)</div>}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── ANIMATED COUNTER HOOK ──
const useAnimatedCounter = (target, duration = 1200) => {
    const [val, setVal] = useState(0);
    const prevTarget = useRef(0);
    useEffect(() => {
        const start = prevTarget.current;
        prevTarget.current = target;
        if (target === 0) { setVal(0); return; }
        const startTime = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(start + (target - start) * ease));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration]);
    return val;
};

const VisualDomino = () => {
    const [tipped, setTipped] = useState(0);
    const [expandedIdx, setExpandedIdx] = useState(null);
    const timeoutsRef = useRef([]);

    const dominos = [
        {
            id: 1, flag: "🇺🇸", country: "Hoa Kỳ", event: "Wall Street Sụp đổ",
            date: "24/10/1929",
            detail: "Dow Jones mất 89% giá trị. 16 triệu cổ phiếu bị bán tháo trong 1 ngày.",
            unemploy: 3.2, gdpDrop: 0, banksFail: 659,
            damage: 30,
            headline: "📰 'Black Thursday' — Phố Wall chìm trong hỗn loạn",
        },
        {
            id: 2, flag: "🇦🇹", country: "Áo", event: "Creditanstalt Vỡ nợ",
            date: "Tháng 5/1931",
            detail: "Ngân hàng lớn nhất Trung Âu phá sản, kéo theo toàn bộ hệ thống tín dụng khu vực.",
            unemploy: 16, gdpDrop: 22, banksFail: 140,
            damage: 65,
            headline: "📰 Creditanstalt vỡ nợ — Châu Âu bắt đầu rung chuyển",
        },
        {
            id: 3, flag: "🇩🇪", country: "Đức", event: "Danatbank Đóng cửa",
            date: "Tháng 7/1931",
            detail: "Danatbank phá sản, chính phủ đóng cửa toàn bộ hệ thống ngân hàng 2 ngày. Thất nghiệp vọt 30%.",
            unemploy: 30, gdpDrop: 31, banksFail: 300,
            damage: 120,
            headline: "📰 Đức: Tất cả ngân hàng đóng cửa khẩn cấp — Nền cộng hòa lung lay",
        },
        {
            id: 4, flag: "🇬🇧", country: "Anh", event: "Rời Bản vị Vàng",
            date: "Tháng 9/1931",
            detail: "Anh từ bỏ Gold Standard sau 200 năm. 25 quốc gia đồng loạt theo sau, hệ thống tiền tệ thế giới tan vỡ.",
            unemploy: 22, gdpDrop: 5, banksFail: 40,
            damage: 200,
            headline: "📰 Anh rời Gold Standard — Trật tự tiền tệ 200 năm sụp đổ",
        },
        {
            id: 5, flag: "🌐", country: "Toàn Cầu", event: "Đại Suy Thoái",
            date: "1932",
            detail: "GDP thế giới giảm 15%. Thương mại toàn cầu giảm 66%. 30 triệu người thất nghiệp. Mầm mống Thế chiến II được gieo.",
            unemploy: 25, gdpDrop: 15, banksFail: 10000,
            damage: 500,
            headline: "📰 Đại Suy Thoái: Nền kinh tế thế giới chạm đáy lịch sử",
        },
    ];

    const totalDamage = dominos.slice(0, tipped).reduce((s, d) => s + d.damage, 0);
    const totalUnemploy = tipped > 0 ? dominos[tipped - 1].unemploy : 0;
    const totalBanksFail = dominos.slice(0, tipped).reduce((s, d) => s + d.banksFail, 0);

    const animDamage = useAnimatedCounter(totalDamage * 1000, 1000);
    const animUnemploy = useAnimatedCounter(totalUnemploy * 10, 800);
    const animBanks = useAnimatedCounter(totalBanksFail, 1000);

    // Mỗi domino cách nhau đúng 2 giây — người dùng kịp đọc headline
    const STEP_DELAY = 2000;

    const triggerDomino = () => {
        if (tipped > 0) return;
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        dominos.forEach((_, i) => {
            const t = setTimeout(() => setTipped(i + 1), i * STEP_DELAY);
            timeoutsRef.current.push(t);
        });
    };

    const resetDomino = () => {
        timeoutsRef.current.forEach(clearTimeout);
        setTipped(0);
        setExpandedIdx(null);
    };

    useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

    const latestHeadline = tipped > 0 ? dominos[tipped - 1].headline : null;

    return (
        <div className="my-16 bg-[#0f0000] border border-red-900/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            {/* Scan line overlay when crisis active */}
            {tipped > 0 && (
                <div className="absolute inset-0 pointer-events-none opacity-5"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.5) 3px, rgba(255,0,0,0.5) 4px)' }}
                />
            )}

            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white mb-2">Hệ quả Domino Toàn Cầu</h3>
                <p className="text-neutral-400 text-sm">Một mồi lửa ở Mỹ đủ để thiêu rụi cả thế giới — nhấn để xem chuỗi sụp đổ.</p>
            </div>

            {/* Global Damage Counters */}
            <AnimatePresence>
                {tipped > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-3 gap-3 mb-8"
                    >
                        {[
                            { label: 'Tài sản bốc hơi', value: `$${(animDamage / 1000).toFixed(0)}B`, icon: '💸' },
                            { label: 'Thất nghiệp (đỉnh)', value: `${(animUnemploy / 10).toFixed(1)}%`, icon: '👷' },
                            { label: 'Ngân hàng phá sản', value: animBanks.toLocaleString(), icon: '🏦' },
                        ].map(s => (
                            <div key={s.label} className="bg-red-950/40 border border-red-900/50 rounded-2xl p-3 text-center">
                                <div className="text-xl mb-1">{s.icon}</div>
                                <div className="text-lg font-black text-red-400 font-mono">{s.value}</div>
                                <div className="text-[10px] text-neutral-500 mt-0.5 font-bold uppercase tracking-wide">{s.label}</div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Domino Row — wrapper gives room for fallen tiles */}
            <div className="relative pb-24">
                <div className="flex justify-center items-end gap-2 sm:gap-6">
                    {dominos.map((d, i) => {
                        const isFallen = tipped > i;
                        const isExpanded = expandedIdx === i;
                        return (
                            <motion.div
                                key={d.id}
                                className={`w-14 sm:w-20 h-24 sm:h-32 rounded-xl border-2 flex flex-col justify-center items-center text-center shadow-2xl origin-bottom cursor-pointer select-none flex-shrink-0
                                ${isFallen ? 'bg-red-950 border-red-600' : 'bg-neutral-900 border-neutral-700 hover:border-neutral-500'}`}
                                animate={isFallen
                                    ? { rotateZ: 75, x: 10, y: 14, opacity: 0.85, scale: 0.92 }
                                    : { rotateZ: 0, x: 0, y: 0, opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 100, damping: 13 }}
                                onClick={() => isFallen && setExpandedIdx(isExpanded ? null : i)}
                            >
                                <motion.div
                                    className="text-2xl sm:text-4xl mb-1"
                                    animate={isFallen ? { scale: [1, 1.4, 1] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    {isFallen ? '💥' : d.flag}
                                </motion.div>
                                <div className="font-black text-white text-[10px] sm:text-sm leading-tight px-1">{d.country}</div>
                                <div className="text-[9px] sm:text-[11px] text-neutral-400 mt-1 px-1">{d.date}</div>
                                {isFallen && (
                                    <div className="text-[8px] sm:text-[10px] text-red-400 mt-1 font-black uppercase tracking-wide">👆 XEM</div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Expanding detail card */}
            <AnimatePresence mode="wait">
                {expandedIdx !== null && tipped > expandedIdx && (() => {
                    const d = dominos[expandedIdx];
                    return (
                        <motion.div
                            key={expandedIdx}
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="bg-red-950/30 border border-red-800/50 rounded-2xl p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="text-2xl mr-2">{d.flag}</span>
                                        <span className="font-black text-white">{d.event}</span>
                                        <span className="ml-2 text-xs text-red-400 font-bold">— {d.date}</span>
                                    </div>
                                    <button onClick={() => setExpandedIdx(null)} className="text-neutral-600 hover:text-white text-sm ml-4">✕</button>
                                </div>
                                <p className="text-neutral-300 text-sm leading-relaxed mb-4">{d.detail}</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { l: 'Thất nghiệp', v: `${d.unemploy}%`, c: 'text-orange-400' },
                                        { l: 'GDP giảm', v: d.gdpDrop > 0 ? `-${d.gdpDrop}%` : 'N/A', c: 'text-red-400' },
                                        { l: 'Ngân hàng vỡ', v: d.banksFail.toLocaleString(), c: 'text-yellow-400' },
                                    ].map(s => (
                                        <div key={s.l} className="text-center bg-black/30 rounded-xl p-2">
                                            <div className={`text-base font-black ${s.c}`}>{s.v}</div>
                                            <div className="text-[9px] text-neutral-500 font-bold uppercase">{s.l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* Running headline ticker */}
            <AnimatePresence mode="wait">
                {latestHeadline && (
                    <motion.div
                        key={tipped}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 border border-red-900/30 bg-black/50 rounded-xl px-4 py-2.5 flex items-center gap-3"
                    >
                        <span className="w-2 h-2 flex-shrink-0 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-neutral-200">{latestHeadline}</span>
                        <span className="ml-auto text-[10px] text-neutral-600 font-mono flex-shrink-0">{dominos[tipped - 1]?.date}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <div className="text-center flex justify-center items-center gap-4">
                {tipped === 0 ? (
                    <motion.button
                        onClick={triggerDomino}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-full text-sm shadow-[0_0_24px_rgba(220,38,38,0.6)] active:scale-95 transition-colors"
                    >
                        💥 Đẩy quân cờ đầu tiên
                    </motion.button>
                ) : tipped >= 5 ? (
                    <button
                        onClick={resetDomino}
                        className="border border-neutral-600 hover:bg-neutral-800 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors active:scale-95"
                    >
                        ↺ Khôi phục hệ thống
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-red-400 text-sm font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Khủng hoảng đang lan rộng…
                    </div>
                )}
            </div>
        </div>
    );
};


// ── POLICY SIMULATOR (ENHANCED) ──────────────────────────────────────
const POLICY_DATA = {
    none: {
        id: 'none',
        label: 'Không can thiệp (Hoover)',
        icon: '🚫',
        color: '#737373',
        colorCls: 'border-neutral-500',
        bgCls: 'bg-neutral-900',
        tagColor: 'bg-neutral-700 text-neutral-200',
        tag: 'Thất bại Hoàn toàn',
        score: 12,
        // [unemploy%, gdp_index, jobs_M, trust%] per year 1930-1936
        timeline: [
            { year: 1930, unemploy: 8.7, gdp: 88, jobs: 43.0, trust: 55, headline: '📰 Hoover: "Nền kinh tế về cơ bản là vững chắc"' },
            { year: 1931, unemploy: 15.9, gdp: 74, jobs: 37.5, trust: 34, headline: '📰 10.000 ngân hàng đóng cửa trong một năm' },
            { year: 1932, unemploy: 23.6, gdp: 59, jobs: 31.8, trust: 18, headline: '📰 Đám đông biểu tình ở Washington — Hoover gọi quân đội' },
            { year: 1933, unemploy: 24.9, gdp: 54, jobs: 29.2, trust: 9, headline: '📰 Tỷ lệ thất nghiệp chạm đỉnh 25% — Đại Suy Thoái đạt cực điểm' },
            { year: 1934, unemploy: 21.7, gdp: 60, jobs: 31.1, trust: 14, headline: '📰 Không có dấu hiệu phục hồi — Quốc hội kêu gọi hành động' },
            { year: 1935, unemploy: 20.1, gdp: 65, jobs: 32.5, trust: 18, headline: '📰 Mỹ tụt hậu so với châu Âu trong phục hồi kinh tế' },
            { year: 1936, unemploy: 16.9, gdp: 73, jobs: 35.8, trust: 25, headline: '📰 8 năm sau Black Thursday — Vết thương vẫn chưa lành' },
        ],
    },
    print: {
        id: 'print',
        label: 'In tiền cứu trợ',
        icon: '🖨️',
        color: '#f59e0b',
        colorCls: 'border-amber-500',
        bgCls: 'bg-amber-950/30',
        tagColor: 'bg-amber-700 text-amber-100',
        tag: 'Lạm phát Nguy hiểm',
        score: 28,
        timeline: [
            { year: 1930, unemploy: 9.2, gdp: 85, jobs: 42.1, trust: 50, headline: '💸 Cục Dự trữ Liên bang bơm tiền khẩn cấp vào thị trường' },
            { year: 1931, unemploy: 14.1, gdp: 70, jobs: 38.0, trust: 40, headline: '💸 Lạm phát tăng 8% — Giá thực phẩm leo thang' },
            { year: 1932, unemploy: 19.5, gdp: 63, jobs: 33.0, trust: 28, headline: '💸 Đồng đô la mất 30% giá trị — Kiều hối tháo chạy' },
            { year: 1933, unemploy: 22.0, gdp: 58, jobs: 30.1, trust: 20, headline: '💸 Người dân đổ xô mua vàng, tích trữ hàng hóa thiết yếu' },
            { year: 1934, unemploy: 20.4, gdp: 62, jobs: 31.0, trust: 22, headline: '💸 Stagflation: Vừa thất nghiệp cao vừa giá cả tăng' },
            { year: 1935, unemploy: 18.0, gdp: 68, jobs: 33.5, trust: 27, headline: '💸 IMF cảnh báo Mỹ: "Dừng ngay việc in tiền vô tội vạ"' },
            { year: 1936, unemploy: 15.5, gdp: 75, jobs: 36.0, trust: 33, headline: '💸 Kinh tế phục hồi chậm, đồng USD mất tín nhiệm dài hạn' },
        ],
    },
    works: {
        id: 'works',
        label: 'New Deal (Roosevelt)',
        icon: '🦅',
        color: '#22c55e',
        colorCls: 'border-emerald-500',
        bgCls: 'bg-emerald-950/30',
        tagColor: 'bg-emerald-700 text-emerald-100',
        tag: 'Phục Hồi Thành Công',
        score: 82,
        timeline: [
            { year: 1930, unemploy: 8.7, gdp: 88, jobs: 43.0, trust: 55, headline: '🦅 Roosevelt đắc cử: "Tôi cam kết New Deal cho người Mỹ"' },
            { year: 1931, unemploy: 14.0, gdp: 76, jobs: 39.5, trust: 52, headline: '🦅 WPA triển khai: 1 triệu công nhân xây dựng hạ tầng' },
            { year: 1932, unemploy: 16.0, gdp: 80, jobs: 40.0, trust: 60, headline: '🦅 FDIC thành lập — Tiền gửi ngân hàng được bảo hiểm $5,000' },
            { year: 1933, unemploy: 14.3, gdp: 84, jobs: 42.0, trust: 65, headline: '🦅 CCC tạo 500,000 việc làm tại các công viên quốc gia' },
            { year: 1934, unemploy: 12.0, gdp: 89, jobs: 44.5, trust: 70, headline: '🦅 8.5 triệu người có việc làm nhờ các chương trình New Deal' },
            { year: 1935, unemploy: 9.5, gdp: 94, jobs: 46.0, trust: 76, headline: '🦅 Social Security Act được ký — Lưới an sinh xã hội ra đời' },
            { year: 1936, unemploy: 7.1, gdp: 100, jobs: 47.5, trust: 82, headline: '🦅 GDP phục hồi về mức 1929 — "Nước Mỹ đang đứng dậy!"' },
        ],
    },
    close: {
        id: 'close',
        label: 'Bank Holiday + Tái cấu trúc',
        icon: '🏦',
        color: '#60a5fa',
        colorCls: 'border-blue-500',
        bgCls: 'bg-blue-950/30',
        tagColor: 'bg-blue-700 text-blue-100',
        tag: 'Ổn định Từng bước',
        score: 61,
        timeline: [
            { year: 1930, unemploy: 8.7, gdp: 88, jobs: 43.0, trust: 55, headline: '🏦 Đề xuất đóng cửa ngân hàng 4 ngày để kiểm định' },
            { year: 1931, unemploy: 13.0, gdp: 79, jobs: 40.5, trust: 62, headline: '🏦 Bank Holiday: 4.000 ngân hàng đóng cửa khẩn cấp' },
            { year: 1932, unemploy: 15.5, gdp: 82, jobs: 41.0, trust: 66, headline: '🏦 Chỉ 4.590 trong 8.000 ngân hàng đủ tiêu chuẩn mở cửa lại' },
            { year: 1933, unemploy: 14.0, gdp: 86, jobs: 42.5, trust: 70, headline: '🏦 Niềm tin ngân hàng phục hồi — Tiền gửi tăng 8% trong tháng' },
            { year: 1934, unemploy: 12.5, gdp: 88, jobs: 44.0, trust: 72, headline: '🏦 Hệ thống ngân hàng ổn định — Lãi suất tín dụng giảm' },
            { year: 1935, unemploy: 11.0, gdp: 91, jobs: 45.0, trust: 75, headline: '🏦 Tái cấu trúc hoàn tất — 90% tài sản độc hại được xử lý' },
            { year: 1936, unemploy: 9.5, gdp: 95, jobs: 46.5, trust: 78, headline: '🏦 Hệ thống ngân hàng Mỹ vững mạnh nhất trong 10 năm qua' },
        ],
    },
};

const INDICATORS = [
    { key: 'unemploy', label: 'Thất nghiệp', unit: '%', invert: true, icon: '👷', max: 30, goodThreshold: 10 },
    { key: 'gdp', label: 'GDP Index', unit: '', invert: false, icon: '📈', max: 110, goodThreshold: 90 },
    { key: 'jobs', label: 'Việc làm', unit: 'M', invert: false, icon: '🏭', max: 50, goodThreshold: 44 },
    { key: 'trust', label: 'Niềm tin XH', unit: '%', invert: false, icon: '🤝', max: 100, goodThreshold: 65 },
];

const MiniBar = ({ value, max, invert, color, goodThreshold }) => {
    const pct = Math.min(100, (value / max) * 100);
    const isGood = invert ? value <= goodThreshold : value >= goodThreshold;
    const barColor = isGood ? '#22c55e' : color;
    return (
        <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
            <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: barColor }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />
        </div>
    );
};

const PolicySimulator = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [running, setRunning] = useState(false);
    const [yearIdx, setYearIdx] = useState(-1); // -1 = not started
    const [simulationComplete, setSimulationComplete] = useState(false);
    const intervalRef = useRef(null);

    const policy = selectedId ? POLICY_DATA[selectedId] : null;
    const currentData = policy && yearIdx >= 0 ? policy.timeline[yearIdx] : null;

    const handleSelect = (id) => {
        clearInterval(intervalRef.current);
        setSelectedId(id);
        setRunning(false);
        setYearIdx(-1);
        setSimulationComplete(false);
    };

    const handleRun = () => {
        if (!policy || running) return;
        setRunning(true);
        setSimulationComplete(false);
        setYearIdx(0);
        let idx = 0;
        intervalRef.current = setInterval(() => {
            idx++;
            if (idx >= policy.timeline.length) {
                clearInterval(intervalRef.current);
                setRunning(false);
                setSimulationComplete(true);
            } else {
                setYearIdx(idx);
            }
        }, 2500);
    };

    const handleReset = () => {
        clearInterval(intervalRef.current);
        setRunning(false);
        setYearIdx(-1);
        setSimulationComplete(false);
    };

    useEffect(() => () => clearInterval(intervalRef.current), []);

    const scoreColor = !policy ? '#737373'
        : policy.score >= 70 ? '#22c55e'
            : policy.score >= 40 ? '#f59e0b'
                : '#ef4444';

    const isFinished = simulationComplete;

    return (
        <div className="my-16 relative">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-full px-4 py-1.5 mb-4">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Phòng Tình huống Khẩn cấp — Washington D.C. 1930</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-2">🏛️ Trình mô phỏng Chính sách</h3>
                <p className="text-neutral-400 text-sm max-w-xl">
                    Bạn là <strong className="text-white">Tổng thống Hoa Kỳ</strong>. Nền kinh tế đang sụp đổ. Mỗi quyết định sẽ định hình số phận của <em>hàng triệu người dân</em>. Chọn chiến lược của bạn và chạy mô phỏng.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* LEFT: Policy Picker */}
                <div className="lg:col-span-2 flex flex-col gap-3">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">① Chọn Chính sách</div>
                    {Object.values(POLICY_DATA).map(p => (
                        <motion.button
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedId === p.id
                                ? `border-[${p.color}] ${p.bgCls} shadow-lg`
                                : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-600'
                                }`}
                            style={selectedId === p.id ? { borderColor: p.color, boxShadow: `0 0 20px ${p.color}30` } : {}}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{p.icon}</span>
                                <div>
                                    <div className="font-bold text-white text-sm leading-tight">{p.label}</div>
                                    <div className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${p.tagColor}`}>{p.tag}</div>
                                </div>
                                {selectedId === p.id && (
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="ml-auto text-lg"
                                    >✓</motion.div>
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* RIGHT: Simulator Panel */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {!policy ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-neutral-700/50 rounded-3xl text-neutral-600"
                            >
                                <div className="text-5xl mb-4">🏛️</div>
                                <div className="font-bold text-sm">Chọn một chính sách để bắt đầu</div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={policy.id}
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="bg-neutral-900/80 border border-neutral-700 rounded-3xl p-5 backdrop-blur-sm"
                            >
                                {/* Top: Score + Controls */}
                                <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-800">
                                    <div>
                                        <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Điểm Phục Hồi Dự kiến</div>
                                        <div className="flex items-baseline gap-1">
                                            <motion.span
                                                className="text-5xl font-black"
                                                style={{ color: scoreColor }}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            >{policy.score}</motion.span>
                                            <span className="text-neutral-500 text-lg">/100</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {yearIdx === -1 && !running && (
                                            <motion.button
                                                onClick={handleRun}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 bg-white text-black font-black text-sm px-5 py-2.5 rounded-xl shadow-lg hover:bg-neutral-200 transition-colors"
                                            >
                                                ▶ Chạy mô phỏng
                                            </motion.button>
                                        )}
                                        {running && (
                                            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold border border-amber-700/50 bg-amber-900/20 px-4 py-2 rounded-xl">
                                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                                Đang mô phỏng…
                                            </div>
                                        )}
                                        {(yearIdx >= 0) && (
                                            <button
                                                onClick={handleReset}
                                                className="text-xs text-neutral-500 hover:text-white border border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-xl transition-colors"
                                            >↺ Đặt lại</button>
                                        )}
                                    </div>
                                </div>

                                {/* Year tracker */}
                                <div className="mb-5">
                                    <div className="text-xs text-neutral-500 uppercase tracking-widest mb-3">② Tiến trình theo năm</div>
                                    <div className="flex gap-1.5">
                                        {policy.timeline.map((t, i) => (
                                            <div
                                                key={t.year}
                                                className={`flex-1 flex flex-col items-center gap-1 ${isFinished ? 'cursor-pointer hover:scale-105 transition-transform hover:brightness-125' : ''}`}
                                                onClick={() => { if (isFinished) setYearIdx(i); }}
                                                title={isFinished ? `Xem dữ liệu năm ${t.year}` : undefined}
                                            >
                                                <motion.div
                                                    className="w-full h-1.5 rounded-full"
                                                    animate={{
                                                        backgroundColor: i < yearIdx ? policy.color
                                                            : i === yearIdx ? policy.color
                                                                : '#374151'
                                                    }}
                                                    style={i === yearIdx ? { boxShadow: `0 0 8px ${policy.color}` } : {}}
                                                />
                                                <span className={`text-[9px] font-bold ${i <= yearIdx ? 'text-white' : 'text-neutral-600'}`}>{t.year}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Economic Indicators */}
                                <div className="mb-5">
                                    <div className="text-xs text-neutral-500 uppercase tracking-widest mb-3">③ Chỉ số Kinh tế</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {INDICATORS.map(ind => {
                                            const val = currentData ? currentData[ind.key] : (policy.timeline[0][ind.key]);
                                            const displayVal = currentData ? val : '—';
                                            return (
                                                <div key={ind.key} className="bg-neutral-950/60 rounded-2xl p-3 border border-neutral-800">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs text-neutral-400 font-bold">{ind.icon} {ind.label}</span>
                                                        <motion.span
                                                            key={`${ind.key}-${yearIdx}`}
                                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                                            className="text-sm font-black text-white"
                                                        >
                                                            {currentData ? `${val}${ind.unit}` : '—'}
                                                        </motion.span>
                                                    </div>
                                                    {currentData ? (
                                                        <MiniBar
                                                            value={val}
                                                            max={ind.max}
                                                            invert={ind.invert}
                                                            color={policy.color}
                                                            goodThreshold={ind.goodThreshold}
                                                        />
                                                    ) : (
                                                        <div className="w-full bg-neutral-800 rounded-full h-2.5" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Newspaper Headline */}
                                <AnimatePresence mode="wait">
                                    {currentData && (
                                        <motion.div
                                            key={`headline-${yearIdx}`}
                                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.35 }}
                                            className="bg-neutral-950 border border-neutral-700 rounded-2xl px-4 py-3"
                                        >
                                            <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mb-1.5">
                                                📰 The New York Times — {currentData.year}
                                            </div>
                                            <div className="text-sm font-bold text-white leading-snug">{currentData.headline}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Final Result Banner */}
                                <AnimatePresence>
                                    {isFinished && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 rounded-2xl p-4 border text-center"
                                            style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}18` }}
                                        >
                                            <div className="text-3xl mb-1">
                                                {policy.score >= 70 ? '🏆' : policy.score >= 40 ? '⚠️' : '💀'}
                                            </div>
                                            <div className="font-black text-lg text-white" style={{ color: scoreColor }}>
                                                {policy.score >= 70 ? 'Phục Hồi Thành Công!'
                                                    : policy.score >= 40 ? 'Phục Hồi Không Hoàn Toàn'
                                                        : 'Nền Kinh Tế Sụp Đổ'}
                                            </div>
                                            <div className="text-xs text-neutral-400 mt-1">
                                                Điểm cuối kỳ: <strong style={{ color: scoreColor }}>{policy.score}/100</strong>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const HumanImpact = () => {
    return (
        <div className="my-16 py-10 border-t border-b border-neutral-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                    <h3 className="text-2xl font-black text-white mb-4">Mặt trái của tự do vô tổ chức</h3>
                    <p className="text-neutral-400 mb-4 leading-relaxed tracking-wide text-sm">
                        <strong>Thực tế 1929-1933:</strong> Thất nghiệp 25% (15 triệu người), sản xuất công nghiệp giảm 46%, GDP Mỹ giảm 30%, 10.000 ngân hàng phá sản, <strong className="text-yellow-300">Dust Bowl</strong> khiến 2.5 triệu nông dân di cư.
                    </p>

                    <p className="text-neutral-400 mb-4 leading-relaxed tracking-wide text-sm">
                        Bong bóng vỡ không chỉ là những con số trên bảng Ticker. Hàng triệu người mất việc làm tạo thành những dòng người chờ bánh mì dài dằng dặc (Bread lines).
                        Nông dân miền Trung Tây nước Mỹ đối mặt với thảm họa thiên nhiên <strong>Dust Bowl</strong>.
                    </p>
                    <blockquote className="border-l-4 border-red-600 pl-4 py-2 mt-6">
                        <p className="text-xl italic text-neutral-300">"Brother, can you spare a dime?"</p>
                        <footer className="text-xs text-neutral-500 mt-2">— Bài hát biểu tượng của thời kỳ Đại Suy Thoái</footer>
                    </blockquote>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <div className="text-5xl mb-4">🍞</div>
                        <div className="font-bold text-neutral-300">Bread lines</div>
                        <div className="text-xs text-neutral-500 mt-1">Dòng người tuyệt vọng</div>
                    </div>
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                        <div className="text-5xl mb-4">🌪️</div>
                        <div className="font-bold text-neutral-300">Dust Bowl</div>
                        <div className="text-xs text-neutral-500 mt-1">Nông nghiệp tàn lụi</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── NEW DEAL SECTION (ENHANCED) ──────────────────────────────────────
const NEW_DEAL_PROGRAMS = [
    {
        id: 'wpa', icon: '🔨', name: 'WPA', full: 'Works Progress Administration',
        color: '#f59e0b', colorDim: '#92400e',
        desc: 'Tạo việc làm xây dựng hạ tầng: cầu đường, trường học, bưu điện.',
        stat: '8,500,000', statLabel: 'công nhân được tuyển dụng',
        delay: 0,
    },
    {
        id: 'fdic', icon: '🏦', name: 'FDIC', full: 'Federal Deposit Insurance Corp.',
        color: '#60a5fa', colorDim: '#1e3a5f',
        desc: 'Bảo hiểm tiền gửi tối đa $5,000 — Chấm dứt làn sóng rút tiền hàng loạt.',
        stat: '$5,000', statLabel: 'bảo hiểm mỗi tài khoản',
        delay: 600,
    },
    {
        id: 'ccc', icon: '🌲', name: 'CCC', full: 'Civilian Conservation Corps',
        color: '#34d399', colorDim: '#064e3b',
        desc: 'Tuyển 2.5 triệu thanh niên trồng rừng, bảo tồn thiên nhiên.',
        stat: '2,500,000', statLabel: 'thanh niên được đào tạo',
        delay: 1200,
    },
    {
        id: 'ssa', icon: '👴', name: 'SSA', full: 'Social Security Act',
        color: '#a78bfa', colorDim: '#3b0764',
        desc: 'Lưới an sinh xã hội đầu tiên — Chế độ hưu trí, trợ cấp thất nghiệp.',
        stat: '42,000,000', statLabel: 'lao động được bảo vệ',
        delay: 1900,
    },
];

const NewDealSection = ({ newDealEnabled, onActivate }) => {
    const [signing, setSigning] = useState(false);
    const [signed, setSigned] = useState(false);
    const [visibleCards, setVisibleCards] = useState(0);
    const signTimeouts = useRef([]);

    const handleSign = () => {
        if (signing || signed) return;
        setSigning(true);
        const t1 = setTimeout(() => {
            setSigned(true);
            setSigning(false);
            onActivate();
            // Reveal program cards one by one
            NEW_DEAL_PROGRAMS.forEach((p, i) => {
                const t = setTimeout(() => setVisibleCards(i + 1), p.delay + 300);
                signTimeouts.current.push(t);
            });
        }, 1800);
        signTimeouts.current.push(t1);
    };

    useEffect(() => () => signTimeouts.current.forEach(clearTimeout), []);

    // Animated jobs counter
    const jobsTarget = visibleCards > 0 ? 8500000 : 0;
    const jobsCounter = useAnimatedCounter(jobsTarget, 2000);

    return (
        <motion.section
            className="relative rounded-3xl overflow-hidden border"
            animate={signed
                ? { borderColor: '#22c55e', backgroundColor: '#052e16' }
                : { borderColor: '#262626', backgroundColor: '#0a0a0a' }
            }
            transition={{ duration: 1.5 }}
            style={{ padding: '3rem' }}
        >
            {/* Radial glow when signed */}
            <AnimatePresence>
                {signed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, transparent 70%)' }}
                    />
                )}
            </AnimatePresence>

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="text-xs font-bold uppercase tracking-widest mb-3 inline-block px-3 py-1 rounded-full border"
                        animate={signed
                            ? { borderColor: '#22c55e', color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)' }
                            : { borderColor: '#525252', color: '#737373', backgroundColor: 'transparent' }
                        }
                    >
                        {signed ? '✓ MARCH 4, 1933 — Washington D.C.' : 'Khủng hoảng chạm đáy — 1932'}
                    </motion.div>
                    <h2 className="text-3xl font-black text-white mb-3">
                        {signed ? '🦅 The New Deal đã ra đời' : 'Nước Mỹ cần một cuộc cách mạng?'}
                    </h2>
                    <p className="text-neutral-400 max-w-xl mx-auto text-sm">
                        {signed
                            ? 'Roosevelt ký một loạt sắc lệnh lịch sử. Nhà nước can thiệp, bơm sức sống vào nền kinh tế đang hấp hối.'
                            : '"The only thing we have to fear is fear itself." — Tổng thống Roosevelt tuyên thệ nhậm chức.'}
                    </p>
                </div>

                {/* Signing Button / Animation / Signed indicator */}
                {!signed && (
                    <div className="flex justify-center mb-8">
                        <AnimatePresence mode="wait">
                            {!signing ? (
                                <motion.button
                                    key="btn"
                                    onClick={handleSign}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(34,197,94,0.5)' }}
                                    whileTap={{ scale: 0.96 }}
                                    className="relative bg-green-600 hover:bg-green-500 text-white font-black px-10 py-5 rounded-2xl text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500"
                                >
                                    <span className="mr-2">✍️</span> Kí sắc lệnh NEW DEAL
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="signing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="relative w-64 h-16 border border-green-800/50 bg-green-950/20 rounded-xl flex items-center px-4 overflow-hidden">
                                        <motion.div
                                            className="text-2xl absolute left-4"
                                            animate={{ x: [0, 180], rotate: [-15, -15] }}
                                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                                        >✍️</motion.div>
                                        <motion.div
                                            className="absolute left-10 top-1/2 -translate-y-1/2 h-0.5 bg-green-400 rounded-full"
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: '70%', opacity: 1 }}
                                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                                        />
                                    </div>
                                    <p className="text-green-400 text-sm font-bold animate-pulse">Đang ký sắc lệnh…</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Program Cards */}
                {signed && (
                    <>
                        {/* Jobs counter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mb-6"
                        >
                            <div className="text-xs text-green-500/70 font-bold uppercase tracking-widest mb-1">Tổng việc làm được tạo ra</div>
                            <div className="text-5xl font-black text-green-400 font-mono">
                                {jobsCounter.toLocaleString()}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {NEW_DEAL_PROGRAMS.map((p, i) => (
                                <AnimatePresence key={p.id}>
                                    {visibleCards > i && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30, scale: 0.92 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                                            className="rounded-2xl border p-4 relative overflow-hidden"
                                            style={{ borderColor: p.colorDim, backgroundColor: `${p.color}0d` }}
                                        >
                                            {/* Glow accent */}
                                            <div
                                                className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                                                style={{ backgroundColor: p.color }}
                                            />
                                            <div className="pl-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-2xl">{p.icon}</span>
                                                    <div>
                                                        <span className="font-black text-white text-base">{p.name}</span>
                                                        <span className="ml-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: p.color }}>{p.full}</span>
                                                    </div>
                                                </div>
                                                <p className="text-neutral-400 text-xs mb-3 leading-relaxed">{p.desc}</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xl font-black" style={{ color: p.color }}>{p.stat}</span>
                                                    <span className="text-[10px] text-neutral-500">{p.statLabel}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            ))}
                        </div>

                        {visibleCards >= NEW_DEAL_PROGRAMS.length && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 text-center text-green-400 font-bold flex items-center justify-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                Nước Mỹ đang đứng dậy — GDP phục hồi về mức 1929 vào năm 1936
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.section>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function Thang10Page() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

    // Animated values based on scroll progress
    const crisisLevel = useTransform(smoothProgress, [0, 0.8], [10, 100]);
    const dowJones = useTransform(smoothProgress, [0, 0.05, 0.25, 0.8], [381, 305, 198, 41]); const uiColor = useTransform(smoothProgress, [0, 0.25, 0.8], ["#22c55e", "#ef4444", "#7f1d1d"]);
    const unemploy = useTransform(smoothProgress, [0, 0.8], [3.2, 25]);
    const prod = useTransform(smoothProgress, [0, 0.8], [100, 54]);
    const trade = useTransform(smoothProgress, [0, 0.8], [100, 35]);

    // Dow Jones Threshold Logic
    const [dowStatus, setDowStatus] = useState('normal');

    useEffect(() => {
        return dowJones.onChange((v) => {
            if (v < 200) {
                setDowStatus('crash');   // < 200: Sụp đổ
            } else if (v < 300) {
                setDowStatus('panic');   // 200 - 300: Hoảng loạn
            } else if (v <= 350) {
                setDowStatus('warning'); // 300 - 350: Cảnh báo
            } else {
                setDowStatus('normal');  // > 350
            }
        });
    }, [dowJones]);

    // New Deal Activation State
    const [newDealEnabled, setNewDealEnabled] = useState(false);

    return (
        <motion.div
            ref={containerRef}
            className="min-h-screen text-white/90 selection:bg-red-500 selection:text-white relative isolate"
            style={{ backgroundColor: newDealEnabled ? '#022c22' : '#0a0000', transition: 'background-color 2s ease' }}
        >
            {/* Quang học / Glitch thay vì rung lắc vật lý */}
            <AnimatePresence>
                {dowStatus === 'warning' && (
                    <motion.div
                        key="warning-bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 pointer-events-none -z-10"
                    >
                        <motion.div
                            className="absolute inset-0"
                            animate={{ opacity: [0.2, 0.9, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            style={{
                                background: "radial-gradient(ellipse at center, transparent 20%, rgba(234, 179, 8, 0.15) 50%, rgba(234, 179, 8, 0.5) 100%)",
                                mixBlendMode: 'screen'
                            }}
                        />
                    </motion.div>
                )}
                {dowStatus === 'panic' && (
                    <motion.div
                        key="panic-bg"
                        className="fixed inset-0 pointer-events-none -z-10 flex flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Chớp đỏ cực mạnh */}
                        <motion.div
                            className="absolute inset-0 bg-red-600 mix-blend-screen"
                            animate={{ opacity: [0, 0.2, 0, 0.4, 0.1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.25, ease: "circIn" }}
                        />

                        {/* Sọc nhiễu ngang dịch chuyển */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                            style={{
                                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255, 0, 0, 0.2) 4px, rgba(255, 0, 0, 0.2) 8px)'
                            }}
                            animate={{ y: [0, 8, -8, 4, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                        />

                        {/* Viền đỏ (Vignette) bo lấy màn hình */}
                        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(255,0,0,0.4)] mix-blend-screen" />

                        {/* Một dải nhiễu trắng mạnh lướt ngẫu nhiên */}
                        <motion.div
                            className="absolute left-0 right-0 h-10 bg-white/20 mix-blend-screen blur-sm"
                            animate={{
                                top: ['-20%', '120%'],
                                opacity: [0, 1, 0, 0.6, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 0.5 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <StockTicker />
            <CrisisLevelBar progress={crisisLevel} />
            <DynamicIndicators unemploy={unemploy} prod={prod} trade={trade} color={uiColor} />

            <div className="max-w-4xl mx-auto px-6 py-24 pb-48 relative z-10">
                <div className="mb-12">
                    <Link to="/" className="inline-block bg-red-900/30 text-red-500 border border-red-900/50 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors hover:bg-red-900/50 hover:text-red-400">
                        ← Trở về dòng thời gian
                    </Link>
                </div>

                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-red-900/30 text-red-500 border border-red-900/50 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                        Tháng 10, 1929
                    </motion.div>
                    <motion.h1
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        BLACK <br /><span className="text-red-600">THURSDAY</span>
                    </motion.h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Ngày <strong className="text-red-400">24/10/1929</strong>: Thị trường chứng khoán Phố Wall sụp đổ, mở đầu <strong className="text-yellow-300">Đại Suy Thoái 1929-1933</strong> — khủng hoảng kinh tế lớn nhất thế kỷ 20.
                    </p>
                </div>

                {/* Main Interactive Map */}
                <DowJonesChart dowValue={dowJones} dowStatus={dowStatus} />

                <div className="mt-8 text-center max-w-2xl mx-auto">
                    <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                        Chỉ số Dow Jones là thước đo sức khỏe của thị trường chứng khoán Mỹ. Trước khủng hoảng, nó neo ở đỉnh cao <strong className="text-green-400">381 điểm</strong>.
                    </p>
                    <p className="text-sm text-neutral-300 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                        <strong className="text-white">Ý nghĩa: </strong>
                        Khi điểm số bốc hơi từ 381 xuống chỉ còn 41 điểm vào năm 1932, điều đó tương đương với việc <strong className="text-red-400">gần 90% tài sản và giá trị các công ty lớn nhất nước Mỹ đã bị xóa sổ hoàn toàn</strong>. Cuộc sống của hàng triệu gia đình phút chốc rơi vào cảnh trắng tay.
                    </p>
                </div>

                <div className="space-y-32 mt-24">
                    <section>
                        <h2 className="text-3xl font-black mb-6">Sự cố hệ thống</h2>
                        <p className="text-neutral-400 leading-relaxed mb-8">Khi một niềm tin mù quáng vào thị trường tự do bị sụp đổ, hiệu ứng Domino là không thể tránh khỏi. Các hệ thống ngân hàng liên kết chặt chẽ trở thành tử huyệt.</p>
                        <BankRunGame />
                        <VisualDomino />
                    </section>

                    <section>
                        <HumanImpact />
                    </section>

                    <section>
                        <PolicySimulator />
                    </section>

                    {/* Marx Quote */}
                    <div className="text-center py-24 border-t border-neutral-800">
                        <div className="text-5xl mb-6">📕</div>
                        <h3 className="text-2xl font-bold mb-6 text-red-500">Lời tiên tri của Marx đã ứng nghiệm?</h3>
                        <blockquote className="text-xl md:text-2xl italic font-serif text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                            "Nguyên nhân sâu xa của các cuộc khủng hoảng tư bản chủ nghĩa... chính là mâu thuẫn giữa tính chất xã hội hóa ngày càng cao của lực lượng sản xuất với hình thức chiếm hữu tư nhân tư bản chủ nghĩa."
                        </blockquote>
                        <div className="mt-4 text-neutral-500 font-bold tracking-widest uppercase text-xs">— Karl Marx</div>
                    </div>

                    {/* The New Deal Activation — ENHANCED */}
                    <NewDealSection newDealEnabled={newDealEnabled} onActivate={() => setNewDealEnabled(true)} />

                    {/* ── VIDEO EMBED ── */}
                    <motion.section className="mt-20 pt-16 border-t border-slate-800 pb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 p-2 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-700/50 bg-black">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src="https://www.youtube.com/embed/dMFEA3y9J0U"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
}
