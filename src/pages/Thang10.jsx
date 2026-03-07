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
                <h3 className="text-xs text-white/50 font-bold tracking-widest uppercase mb-2">Chỉ số Dow Jones</h3>

                <motion.div
                    className="text-6xl font-black drop-shadow-xl font-mono flex justify-center items-baseline"
                    style={{ color: isPanic || isCrash ? '#ef4444' : isWarning ? '#eab308' : '#22c55e' }}
                >
                    <motion.span>{dowValueStr}</motion.span>
                    <span className="text-lg ml-1 text-white/30">điểm</span>
                </motion.div>

                {/* Status Alerts */}
                <div className="h-6 mt-2">
                    <AnimatePresence mode="wait">
                        {isWarning && (
                            <motion.div
                                key="warning"
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="text-yellow-500 text-xs font-bold uppercase tracking-widest"
                            >
                                ⚠️ Cảnh báo (Thị trường rung lắc)
                            </motion.div>
                        )}
                        {isPanic && (
                            <motion.div
                                key="panic"
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse"
                            >
                                🚨 Hoảng Loạn (Bán tháo Black Thursday)
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
                            className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/95 rounded-2xl pointer-events-none z-10 border-2 border-red-500 p-2"
                        >
                            <span className="text-4xl font-black text-white mix-blend-overlay tracking-tighter mb-1">HOẢNG LOẠN!</span>
                            <span className="text-xs font-bold text-white">BÁN THÁO (SELL SELL)</span>
                        </motion.div>
                    )}
                    {isCrash && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-red-400 transform rotate-12"
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

const VisualDomino = () => {
    const [tipped, setTipped] = useState(0); // 0 to 5

    const dominos = [
        { id: 1, c: "🇺🇸 Mỹ", desc: "Wall Street sụp đổ", d: "1929" },
        { id: 2, c: "🇦🇹 Áo", desc: "Creditanstalt vỡ nợ", d: "T5/1931" },
        { id: 3, c: "🇩🇪 Đức", desc: "Danatbank đóng cửa", d: "T7/1931" },
        { id: 4, c: "🇬🇧 Anh", desc: "Rời Bản vị Vàng", d: "T9/1931" },
        { id: 5, c: "🌐 Toàn cầu", desc: "Đại Suy Thoái", d: "1932" },
    ];

    const triggerDomino = () => {
        if (tipped > 0) return;
        setTipped(1);
        let count = 1;
        const interval = setInterval(() => {
            count++;
            setTipped(count);
            if (count >= 5) clearInterval(interval);
        }, 500);
    };

    return (
        <div className="my-16 bg-[#0f0000] border border-red-900/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-white mb-2">Hệ quả Domino Toàn Cầu</h3>
                <p className="text-neutral-400 text-sm">Một hệ thống tài chính liên kết chặt chẽ có nghĩa là một mồi lửa ở Mỹ sẽ thiêu rụi cả thế giới.</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-y-8 gap-x-2">
                {dominos.map((d, i) => {
                    const isFallen = tipped > i;
                    return (
                        <div key={d.id} className="flex items-center">
                            <motion.div
                                className={`w-36 h-40 rounded-2xl border-2 p-2 sm:p-4 flex flex-col justify-center items-center text-center shadow-2xl relative z-10 origin-bottom-right transition-colors ${isFallen ? 'bg-red-950 border-red-600' : 'bg-neutral-900 border-neutral-700'
                                    }`}
                                animate={isFallen ? { rotateZ: 70, x: 10, y: 15, opacity: 0.9, scale: 0.95 } : { rotateZ: 0, x: 0, y: 0, opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                            >
                                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{isFallen ? '💥' : '🏦'}</div>
                                <div className="font-black text-white text-xs sm:text-sm">{d.c}</div>
                                <div className={`text-[10px] sm:text-xs mt-1 ${isFallen ? 'text-red-300' : 'text-neutral-500'}`}>{isFallen ? d.desc : d.d}</div>
                            </motion.div>

                            {i < dominos.length - 1 && (
                                <motion.div
                                    className="text-2xl sm:text-3xl text-red-500 mx-1 sm:mx-2"
                                    animate={tipped > i ? { scale: [1, 1.5, 1], opacity: 1 } : { opacity: 0.2 }}
                                >
                                    →
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 text-center h-12 flex justify-center items-center">
                {tipped === 0 ? (
                    <button
                        onClick={triggerDomino}
                        className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-full text-sm shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95 transition-all animate-bounce"
                    >
                        Đẩy quân cờ đầu tiên (Bắt đầu Khủng hoảng)
                    </button>
                ) : tipped >= 5 ? (
                    <button
                        onClick={() => setTipped(0)}
                        className="border border-neutral-600 hover:bg-neutral-800 text-white font-bold py-2 px-6 rounded-full text-sm transition-colors active:scale-95"
                    >
                        ↺ Khôi phục lại hệ thống
                    </button>
                ) : null}
            </div>
        </div>
    );
};

const PolicySimulator = () => {
    const [result, setResult] = useState(null);
    const policies = [
        {
            id: 'none',
            label: 'Không can thiệp (Hoover)',
            res: 'Thất bại: 10.000 ngân hàng phá sản, thất nghiệp 25%, sản xuất giảm 46% (1929-1933).',
            color: 'border-neutral-500'
        },
        {
            id: 'print',
            label: 'In tiền cứu trợ',
            res: 'Giảm phát nặng hơn (-10%/năm), tiền mất giá trị, không tạo việc làm.',
            color: 'border-amber-500'
        },
        {
            id: 'works',
            label: 'New Deal (Roosevelt)',
            res: 'Thành công tương đối: WPA tạo 8.5 triệu việc làm, FDIC bảo hiểm tiền gửi, phục hồi dần đến 1936.',
            color: 'border-emerald-500'
        },
        {
            id: 'close',
            label: 'Bank Holiday',
            res: '1933: Đóng cửa 4.000 ngân hàng 4 ngày, tái cấu trúc, khôi phục niềm tin.',
            color: 'border-blue-500'
        },
    ];

    return (
        <div className="my-16 bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">🏛️ Trình mô phỏng Chính sách (1930)</h3>
            <p className="text-neutral-400 text-sm mb-6">Bạn là chính phủ. Bạn sẽ làm gì để cứu vãn nền kinh tế?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {policies.map(p => (
                    <button
                        key={p.id} onClick={() => setResult(p)}
                        className={`p-4 rounded-xl bg-neutral-900 border-l-4 ${p.color} text-left hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white`}
                    >
                        <span className="font-bold text-white">{p.label}</span>
                    </button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        key={result.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="bg-black border border-neutral-800 p-4 rounded-xl text-green-400 text-sm"
                    >
                        <div className="font-bold text-white mb-1">Kết quả:</div>
                        {result.res}
                    </motion.div>
                )}
            </AnimatePresence>
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
            className="min-h-screen text-white/90 selection:bg-red-500 selection:text-white relative"
            style={{ backgroundColor: newDealEnabled ? '#022c22' : '#0a0000', transition: 'background-color 2s ease' }}
        >
            {/* Quang học / Glitch thay vì rung lắc vật lý */}
            <AnimatePresence>
                {dowStatus === 'panic' && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-0 flex flex-col"
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

                    {/* The New Deal Activation */}
                    <motion.section
                        className="text-center bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 relative overflow-hidden"
                        animate={newDealEnabled ? { borderColor: '#22c55e', backgroundColor: '#064e3b' } : {}}
                    >
                        {newDealEnabled && (
                            <motion.div
                                className="absolute inset-0 bg-green-500/20 blur-3xl z-0"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
                            />
                        )}
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4">{newDealEnabled ? 'Thế giới phục hồi' : 'Khủng hoảng chạm đáy (1932)'}</h2>
                            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
                                {newDealEnabled
                                    ? 'Chính sách New Deal của Tổng thống Roosevelt ra đời. Sự can thiệp của nhà nước, tạo công ăn việc làm, và cải cách ngân hàng đã mở ra con đường phục hồi dần dần.'
                                    : 'Phải chăng đã đến lúc chúng ta cần một bàn tay can thiệp?'}
                            </p>
                            {!newDealEnabled && (
                                <button
                                    onClick={() => setNewDealEnabled(true)}
                                    className="bg-green-600 hover:bg-green-500 active:scale-95 transition-all text-white font-black px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                >
                                    Kí sắc lệnh NEW DEAL
                                </button>
                            )}
                            {newDealEnabled && (
                                <div className="text-green-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <span>✓ Đã kích hoạt New Deal</span>
                                </div>
                            )}
                        </div>
                    </motion.section>

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
