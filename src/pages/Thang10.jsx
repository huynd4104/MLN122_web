import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Link } from "react-router-dom";

// --- DATA ---
const TICKER_DATA = [
    { sym: "FORD", chg: "-12%" }, { sym: "GM", chg: "-18%" },
    { sym: "RCA", chg: "-20%" }, { sym: "GE", chg: "-15%" },
    { sym: "US STEEL", chg: "-14%" }, { sym: "AT&T", chg: "-13%" },
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

const DowJonesChart = ({ dowValue, dowColor, shakeProgress, isCrashed }) => {
    // Shaking alert between 0.05 and 0.15 where the crash essentially begins
    const isShaking = shakeProgress;
    const dowValueStr = useTransform(dowValue, v => Math.round(v));
    return (
        <motion.div
            className="sticky top-24 mx-auto w-full max-w-sm bg-black/80 border border-neutral-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl z-30"
            animate={isShaking ? { x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] } : {}}
            transition={{ repeat: isShaking ? Infinity : 0, duration: 0.15 }}
        >
            <div className="flex flex-col items-center text-center">
                <h3 className="text-xs text-white/50 font-bold tracking-widest uppercase mb-2">Chỉ số Dow Jones</h3>

                <motion.div
                    className="text-6xl font-black drop-shadow-xl font-mono flex justify-center items-baseline"
                    style={{ color: dowColor }}
                >
                    <motion.span>{dowValueStr}</motion.span>
                    <span className="text-lg ml-1 text-white/30">điểm</span>
                </motion.div>

                {/* Shake Alert */}
                <AnimatePresence>
                    {isShaking && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/95 rounded-2xl pointer-events-none z-10 border-2 border-red-500 p-2"
                        >
                            <span className="text-4xl font-black text-white mix-blend-overlay tracking-tighter mb-1">SỤP ĐỔ!</span>
                            <span className="text-xs font-bold text-white">BÁN THÁO (SELL SELL)</span>
                        </motion.div>
                    )}
                    {isCrashed && !isShaking && (
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
    const [cash, setCash] = useState(20);
    const deposits = 100;
    const isCollapsed = cash <= 0;

    return (
        <div className="my-16 bg-black/60 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-2">🏦 Bank Run (Tháo chạy khỏi ngân hàng)</h3>
            <p className="text-neutral-400 text-sm mb-6">Mọi người hoảng loạn rút tiền, nhưng ngân hàng chỉ giữ một phần tiền mặt...</p>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <div className="bg-neutral-900 p-5 rounded-2xl w-full max-w-xs text-center border border-neutral-800">
                    <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Dự trữ Tiền mặt</div>
                    <div className={`text-5xl font-black ${isCollapsed ? 'text-red-500' : 'text-green-500'}`}>${cash}</div>
                    <div className="text-xs text-neutral-500 mt-2">Tổng tiền gửi: ${deposits}</div>
                </div>

                <button
                    onClick={() => setCash(c => Math.max(0, c - 5))}
                    disabled={isCollapsed}
                    className={`px-8 py-4 rounded-xl font-black text-lg transition-all ${isCollapsed ? 'bg-red-900 text-red-400 cursor-not-allowed' : 'bg-white text-black hover:scale-105 hover:bg-red-500 hover:text-white active:scale-95'}`}
                >
                    {isCollapsed ? 'HẾT TIỀN!' : 'RÚT TIỀN ($5)'}
                </button>
            </div>

            <AnimatePresence>
                {isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center"
                    >
                        <div className="text-3xl font-black text-red-500 mb-2">💥 BANK COLLAPSE!</div>
                        <p className="text-red-300 text-sm">Hệ thống sụp đổ! Tin đồn lan truyền khiến hàng tỷ đô bốc hơi.</p>
                        <div className="flex justify-center gap-4 mt-6 text-4xl">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i} initial={{ opacity: 1, rotate: 0 }}
                                    animate={{ opacity: 0.3, rotate: -90, y: 20, color: '#ef4444' }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    🏦
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const VisualDomino = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const countries = [
        { c: "USA", d: "1929" }, { c: "Đức", d: "1931" },
        { c: "Anh", d: "1931" }, { c: "Nhật", d: "1932" }
    ];

    return (
        <div ref={ref} className="my-16 flex flex-col items-center">
            <h3 className="text-lg font-bold text-neutral-400 mb-8 uppercase tracking-widest">Hiệu ứng Domino Toàn Cầu</h3>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                {countries.map((item, i) => (
                    <React.Fragment key={i}>
                        <motion.div
                            className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center min-w-[100px]"
                            initial={{ y: -50, opacity: 0, rotate: -20 }}
                            animate={inView ? { y: 0, opacity: 1, rotate: 0 } : {}}
                            transition={{ delay: i * 0.5, type: "spring" }}
                        >
                            <div className="text-3xl mb-2">🏦</div>
                            <div className="font-bold text-white">{item.c}</div>
                            <div className="text-xs text-red-500">{item.d}</div>
                        </motion.div>
                        {i < countries.length - 1 && (
                            <motion.div
                                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: i * 0.5 + 0.3 }}
                                className="text-red-600 font-bold text-xl"
                            >
                                →
                            </motion.div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const PolicySimulator = () => {
    const [result, setResult] = useState(null);
    const policies = [
        { id: 'none', label: 'Không can thiệp', res: 'Thị trường sụp đổ hoàn toàn. Tỷ lệ thất nghiệp chạm đáy, người dân biểu tình.', color: 'border-neutral-500' },
        { id: 'print', label: 'In tiền', res: 'Lạm phát tăng vọt, tiền mất giá, không giải quyết được vấn đề việc làm.', color: 'border-amber-500' },
        { id: 'works', label: 'Công trình công cộng', res: 'Tạo việc làm, phục hồi kinh tế. (Giống với chính sách New Deal).', color: 'border-green-500' },
        { id: 'close', label: 'Đóng cửa ngân hàng', res: 'Bank Holiday! Ngừng sự hoảng loạn tạm thời để tái cấu trúc.', color: 'border-blue-500' },
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
    const dowJones = useTransform(smoothProgress, [0, 0.1, 0.25, 0.8], [381, 350, 100, 41]);
    const uiColor = useTransform(smoothProgress, [0, 0.25, 0.8], ["#22c55e", "#ef4444", "#7f1d1d"]);
    const unemploy = useTransform(smoothProgress, [0, 0.8], [3, 25]);
    const prod = useTransform(smoothProgress, [0, 0.8], [0, -46]);
    const trade = useTransform(smoothProgress, [0, 0.8], [0, -65]);

    // Screen Shake effect at the very top (Black Thursday region)
    const [isShaking, setIsShaking] = useState(false);
    const [isCrashed, setIsCrashed] = useState(false);
    useEffect(() => {
        return smoothProgress.onChange((v) => {
            setIsShaking(v > 0.12 && v < 0.25);
            setIsCrashed(v >= 0.25);
        });
    }, [smoothProgress]);

    // New Deal Activation State
    const [newDealEnabled, setNewDealEnabled] = useState(false);

    return (
        <motion.div
            ref={containerRef}
            className="min-h-screen text-white/90 selection:bg-red-500 selection:text-white"
            style={{ backgroundColor: newDealEnabled ? '#022c22' : '#0a0000', transition: 'background-color 2s ease' }}
            animate={isShaking ? { x: [-5, 5, -5, 5, 0], y: [-2, 2, -2, 2, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.1 }}
        >
            <StockTicker />
            <CrisisLevelBar progress={crisisLevel} />
            <DynamicIndicators unemploy={unemploy} prod={prod} trade={trade} color={uiColor} />

            <div className="max-w-4xl mx-auto px-6 py-24 pb-48 relative z-10">
                <div className="mb-12">
                    <Link to="/" className="text-neutral-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
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
                        Thị trường tự do không điều tiết đã đẩy lòng tham lên đến đỉnh điểm. Và rồi, bong bóng vỡ...
                    </p>
                </div>

                {/* Main Interactive Map */}
                <DowJonesChart dowValue={dowJones} dowColor={uiColor} shakeProgress={isShaking} isCrashed={isCrashed} />

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
                </div>
            </div>
        </motion.div>
    );
}
