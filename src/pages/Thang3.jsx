import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CORE_IDEAS = [
    {
        id: "canh_tranh",
        label: "Cạnh tranh tư bản chủ nghĩa",
        icon: "🏆",
        border: "border-red-400",
        bg: "bg-red-900/40",
        desc:
            "Cạnh tranh giữa các nhà tư bản trong điều kiện sở hữu tư nhân tư bản chủ nghĩa thúc đẩy cải tiến kỹ thuật, hạ giá thành, mở rộng thị trường nhưng cũng làm gay gắt mâu thuẫn, dẫn tới khủng hoảng và tập trung tư bản.",
        borderColor: "#f56565",
    },
    {
        id: "doc_quyen",
        label: "Tư bản độc quyền",
        icon: "👑",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc:
            "Trình độ phát triển cao của chủ nghĩa tư bản khi tập trung sản xuất và tư bản dẫn tới hình thành các tổ chức độc quyền, chi phối giá cả, lợi nhuận và thị trường, thay thế dần cạnh tranh tự do nhưng không xóa bỏ cạnh tranh.",
        borderColor: "#fbbf24",
    },
    {
        id: "khung_hoang",
        label: "Khủng hoảng kinh tế chu kỳ",
        icon: "📉",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc:
            "Khủng hoảng kinh tế trong chủ nghĩa tư bản mang tính chu kỳ, bắt nguồn từ mâu thuẫn giữa tính chất xã hội hóa cao của sản xuất với hình thức chiếm hữu tư nhân tư bản chủ nghĩa, biểu hiện thành khủng hoảng sản xuất thừa.",
        borderColor: "#34d399",
    },
    {
        id: "nha_nuoc",
        label: "Nhà nước tư bản can thiệp",
        icon: "🏛️",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc:
            "Trong giai đoạn tư bản độc quyền nhà nước, Nhà nước tư sản sử dụng các công cụ tài khóa, tiền tệ, pháp luật để điều tiết kinh tế nhằm hạn chế khủng hoảng, bảo vệ lợi ích chung của tư bản độc quyền.",
        borderColor: "#c084fc",
    },
    {
        id: "thi_truong",
        label: "Thất bại thị trường tư bản chủ nghĩa",
        icon: "⚠️",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc:
            "Cơ chế thị trường tư bản chủ nghĩa không tự khắc phục được những khuyết tật như độc quyền, thất nghiệp, khủng hoảng chu kỳ, bất bình đẳng và các ngoại ứng tiêu cực, đòi hỏi sự can thiệp của Nhà nước tư bản.",
        borderColor: "#38bdf8",
    },
];


// ── Main Page ────────────────────────────────────────────────────────────────
export default function BankCrisisPage() {
    // ── Giai đoạn & Game State cho Bank Run Simulation ─────────────
    const [gameStatus, setGameStatus] = useState("start"); // 'start', 'playing', 'won', 'lost'
    const [timeElapsed, setTimeElapsed] = useState(0);

    // ── Chỉ số Bank Run ─────────────
    const [bankReserve, setBankReserve] = useState(100);
    const [panicLevel, setPanicLevel] = useState(0);

    // ── Chỉ số Kinh tế (Dashboard) ─────────────
    const [gdp, setGdp] = useState(100);
    const [unemployment, setUnemployment] = useState(5.0);
    const [inflation, setInflation] = useState(2.0);
    const [bankStability, setBankStability] = useState(100);
    const [breadPrice, setBreadPrice] = useState(1.0);
    const [printMoneyCount, setPrintMoneyCount] = useState(0);

    // ── Can thiệp thị trường ─────────────
    const [marketRegulation, setMarketRegulation] = useState(50); // 0 = Free Market, 100 = Full Control

    // ── Tin tức ─────────────
    const [newsAlert, setNewsAlert] = useState(null);

    // ── Hiệu ứng bay ra ─────────────
    const [particles, setParticles] = useState([]);

    const spawnParticles = useCallback((emoji, count = 1) => {
        const newParticles = Array.from({ length: count }).map(() => ({
            id: Math.random().toString(36).substr(2, 9),
            x: Math.random() * 60 - 30, // Random drift
            emoji,
        }));
        setParticles((prev) => [...prev, ...newParticles].slice(-20)); // Keep max 20 particles

        setTimeout(() => {
            setParticles((prev) => prev.filter(p => !newParticles.find(n => n.id === p.id)));
        }, 2000);
    }, []);

    // ── Main Game Loop ─────────────
    useEffect(() => {
        let timer;
        if (gameStatus === "playing") {
            timer = setInterval(() => {
                setTimeElapsed((prev) => {
                    const newTime = prev + 1;
                    if (newTime >= 60 && bankReserve > 0) setGameStatus("won");
                    return newTime;
                });

                // Random News (5% chance every second)
                if (Math.random() < 0.05 && !newsAlert) {
                    const events = [
                        "Tin nóng: Ngân hàng lớn tại Chicago vừa sụp đổ!",
                        "Tin nóng: Người dân biểu tình đòi rút tiền mặt!",
                        "Tin nóng: Thị trường chứng khoán bốc hơi mạnh!",
                    ];
                    setNewsAlert(events[Math.floor(Math.random() * events.length)]);
                    setPanicLevel((p) => Math.min(100, p + 25));
                    spawnParticles("😱", 3);
                    setTimeout(() => setNewsAlert(null), 5000);
                }

                // Tiền chảy ra (Bank Run)
                setBankReserve((r) => {
                    // Càng hoảng loạn rút càng nhanh, nếu Nhà nước không cản (Regulation thấp)
                    const regulationMitigation = marketRegulation / 100;
                    const drop = 1 + (panicLevel / 20) * (1 - regulationMitigation * 0.5);
                    const newReserve = r - drop;

                    if (newReserve <= 0) {
                        setGameStatus("lost");
                        return 0;
                    }
                    if (drop > 1.5) spawnParticles("💵", Math.floor(drop));
                    return newReserve;
                });

                setPanicLevel((p) => {
                    // Dự trữ < 40% -> Hoảng loạn tăng
                    let delta = 0;
                    if (bankReserve < 40) delta += 2;
                    if (marketRegulation < 20) delta += 1.5; // Quá ít can thiệp -> dễ hoảng
                    if (marketRegulation > 80) delta -= 1; // Can thiệp mạnh -> yên tâm hơn
                    return Math.max(0, Math.min(100, p + delta));
                });

                setBankStability((s) => {
                    return Math.max(0, Math.min(100, bankReserve - panicLevel * 0.5));
                });

                // Kinh tế vĩ mô biến động chậm
                if (marketRegulation < 30) setGdp((g) => Math.max(50, g - 0.5));
                if (marketRegulation > 80) setGdp((g) => Math.min(150, g + 0.2));

            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStatus, panicLevel, marketRegulation, bankReserve, newsAlert, spawnParticles]);


    // ── Chính sách (Policy Cards) ─────────────
    const policies = [
        {
            id: "bank_holiday",
            name: "Bank Holiday",
            subtitle: "Đóng cửa ngân hàng khẩn cấp",
            desc: "Tạm ngừng hoạt động toàn bộ ngân hàng để kiểm tra, ngăn dòng tiền tháo chạy và khôi phục niềm tin.",
            icon: "🔒",
            accentColor: "#3b82f6",
            glowColor: "rgba(59,130,246,0.25)",
            borderColor: "rgba(59,130,246,0.4)",
            bgGradient: "linear-gradient(135deg,rgba(29,78,216,0.25),rgba(30,58,138,0.15))",
            badgeColor: "rgba(59,130,246,0.2)",
            badgeText: "ỔN ĐỊNH",
            effects: [
                { label: "Ổn định NH", value: "+30", positive: true },
                { label: "Hoảng loạn", value: "−15", positive: true },
                { label: "Dự trữ", value: "+5", positive: true },
                { label: "Thất nghiệp", value: "+1.5%", positive: false },
            ],
            action: () => {
                setBankStability((s) => Math.min(100, s + 30));
                setPanicLevel((p) => Math.max(0, p - 15));
                setUnemployment((u) => u + 1.5);
                setBankReserve((r) => Math.min(100, r + 5));
                spawnParticles("🔒", 2);
            },
        },
        {
            id: "print_money",
            name: "Print Money",
            subtitle: "Bơm thanh khoản khẩn cấp",
            desc: "In tiền bơm thẳng vào hệ thống ngân hàng. Hiệu quả tức thời nhưng nguy cơ lạm phát phi mã nếu lạm dụng.",
            icon: "🖨️",
            accentColor: "#10b981",
            glowColor: "rgba(16,185,129,0.25)",
            borderColor: "rgba(16,185,129,0.4)",
            bgGradient: "linear-gradient(135deg,rgba(6,78,59,0.25),rgba(6,95,70,0.15))",
            badgeColor: "rgba(16,185,129,0.2)",
            badgeText: "THANH KHOẢN",
            effects: [
                { label: "Dự trữ NH", value: "+20", positive: true },
                { label: "Lạm phát", value: "+4%", positive: false },
                { label: "Giá bánh mì", value: "+0.5$", positive: false },
            ],
            action: () => {
                setBankReserve((r) => Math.min(100, r + 20));
                setInflation((i) => i + 4);
                setPrintMoneyCount((c) => {
                    const next = c + 1;
                    if (next >= 4) {
                        setBreadPrice((p) => p * 10);
                        setNewsAlert("Tin nóng: Lạm phát phi mã! Giá bánh mì tăng vọt!!");
                        setTimeout(() => setNewsAlert(null), 4000);
                    } else {
                        setBreadPrice((p) => p + 0.5);
                    }
                    return next;
                });
                spawnParticles("🖨️", 3);
            },
        },
        {
            id: "interest_cut",
            name: "Interest Rate Cut",
            subtitle: "Giảm lãi suất cơ bản",
            desc: "Hạ lãi suất để kích thích doanh nghiệp vay vốn đầu tư, giảm thất nghiệp nhưng dễ kéo dài tháo chạy.",
            icon: "📉",
            accentColor: "#f59e0b",
            glowColor: "rgba(245,158,11,0.25)",
            borderColor: "rgba(245,158,11,0.4)",
            bgGradient: "linear-gradient(135deg,rgba(120,53,15,0.25),rgba(92,32,8,0.15))",
            badgeColor: "rgba(245,158,11,0.2)",
            badgeText: "KÍCH THÍCH",
            effects: [
                { label: "GDP", value: "+5", positive: true },
                { label: "Thất nghiệp", value: "−0.8%", positive: true },
                { label: "Lạm phát", value: "+1.5%", positive: false },
                { label: "Dự trữ NH", value: "−5", positive: false },
            ],
            action: () => {
                setGdp((g) => g + 5);
                setUnemployment((u) => Math.max(2, u - 0.8));
                setInflation((i) => i + 1.5);
                setBankReserve((r) => Math.max(1, r - 5));
                spawnParticles("📉", 2);
            },
        },
        {
            id: "new_deal",
            name: "New Deal Stimulus",
            subtitle: "Đầu tư công quy mô lớn",
            desc: "Chương trình đầu tư công Roosevelt: xây cơ sở hạ tầng, tạo việc làm, kéo kinh tế ra khỏi khủng hoảng.",
            icon: "🏗️",
            accentColor: "#a855f7",
            glowColor: "rgba(168,85,247,0.25)",
            borderColor: "rgba(168,85,247,0.4)",
            bgGradient: "linear-gradient(135deg,rgba(76,29,149,0.25),rgba(59,7,100,0.15))",
            badgeColor: "rgba(168,85,247,0.2)",
            badgeText: "PHỤC HỒI",
            effects: [
                { label: "GDP", value: "+10", positive: true },
                { label: "Thất nghiệp", value: "−2.5%", positive: true },
                { label: "Ổn định NH", value: "+10", positive: true },
                { label: "Hoảng loạn", value: "−20", positive: true },
                { label: "Lạm phát", value: "+2%", positive: false },
            ],
            action: () => {
                setGdp((g) => g + 10);
                setUnemployment((u) => Math.max(2, u - 2.5));
                setInflation((i) => i + 2);
                setBankStability((s) => Math.min(100, s + 10));
                setPanicLevel((p) => Math.max(0, p - 20));
                spawnParticles("🏗️", 2);
            },
        },
    ];

    const resetGame = () => {
        setGameStatus("start");
        setTimeElapsed(0);
        setBankReserve(100);
        setPanicLevel(0);
        setGdp(100);
        setUnemployment(5.0);
        setInflation(2.0);
        setBankStability(100);
        setBreadPrice(1.0);
        setPrintMoneyCount(0);
        setMarketRegulation(50);
        setNewsAlert(null);
    };

    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{
                background: "linear-gradient(135deg,#1f2937 0%,#991b1b 40%,#1e293b 100%)", // Gray-red gradient for crisis theme
                fontFamily: "'Segoe UI',system-ui,sans-serif",
            }}
        >
            {/* Starfield */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(28)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-yellow-300"
                        style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 65}%`, opacity: Math.random() * 0.5 + 0.15 }}
                        animate={{ opacity: [0.15, 0.85, 0.15] }}
                        transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2.5 }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">

                {/* ── RETURN BUTTON ── */}
                <div className="pt-6 mb-2">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-sm">
                        ← Về Trang Chủ
                    </Link>
                </div>

                {/* ── HEADER ── */}
                <motion.header className="text-center pt-10 pb-8" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1 text-yellow-300 text-sm font-semibold mb-4 tracking-widest uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        📅 Tháng 3 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 3: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Khủng hoảng Ngân hàng Mỹ
                        </span>
                    </motion.h1>
                </motion.header>

                {/* ── EVENT CARD ── (Chi tiết về sự kiện) */}
                <motion.section className="rounded-2xl border border-red-500/30 p-6 mb-8 relative overflow-hidden" style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">🏦</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">Tháng 3, 1933</div>
                            <h2 className="text-xl font-bold text-white mb-2">Khủng hoảng Ngân hàng Mỹ - Cuộc Đại Suy Thoái</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Vào tháng 3 năm 1933, <strong className="text-yellow-300">Khủng hoảng Ngân hàng Mỹ</strong> đạt đỉnh điểm trong bối cảnh Đại Suy Thoái (Great Depression). Hàng loạt ngân hàng phá sản do người dân ồ ạt rút tiền, dẫn đến mất niềm tin vào hệ thống tài chính. Tổng thống Franklin D. Roosevelt mới nhậm chức đã tuyên bố "Bank Holiday" – đóng cửa tất cả ngân hàng từ 6-9/3/1933 để kiểm tra và tái cấu trúc.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Sự kiện này là phần của khủng hoảng kinh tế toàn cầu bắt đầu từ "Thứ Năm Đen Tối" 1929, với thất nghiệp lên đến 25%, sản xuất giảm 50%. "New Deal" sau đó được triển khai để Nhà nước can thiệp, ổn định kinh tế. Khủng hoảng minh họa thất bại của thị trường tự do, dẫn đến vai trò lớn hơn của chính phủ trong điều tiết kinh tế.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* ── CORE IDEAS ── */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-5">✦ Tư tưởng cốt lõi ✦</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {CORE_IDEAS.map((idea, i) => (
                            <motion.div key={idea.id} className={`rounded-xl border ${idea.border} ${idea.bg} p-4 flex gap-3 items-start`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
                                <div className="text-2xl flex-shrink-0">{idea.icon}</div>
                                <div>
                                    <div className="font-bold text-white text-sm mb-1">{idea.label}</div>
                                    <div className="text-blue-300 text-xs leading-relaxed">{idea.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* ── VIDEO EMBED ── */}
                <motion.section className="mt-20 pt-16 border-t border-slate-800 pb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 p-2 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-700/50 bg-black">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/xsH1WSEqqF0" title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </motion.section>

                {/* ── BANK RUN SIMULATION : THAY THẾ CHO MINI-GAME CŨ ── */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <div className="mt-6 border-t border-red-500/30 pt-10">
                        <h2 className="text-center text-2xl font-black text-yellow-300 uppercase tracking-widest mb-6 drop-shadow-md">
                            ✦ Bộ Mô Phỏng Bank Run ✦
                        </h2>

                        {/* ── MÀN HÌNH BẮT ĐẦU ── */}
                        {gameStatus === "start" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-black/40 backdrop-blur-md rounded-2xl border border-red-900/50 p-8"
                            >
                                <div className="text-6xl mb-4">🏦</div>
                                <h3 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                                    BANK RUN 1933
                                </h3>
                                <p className="text-md text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
                                    Mô phỏng tháo chạy ngân hàng. Thị trường tự do có những khuyết tật dẫn đến khủng hoảng chu kỳ. Bạn có thể sử dụng <strong className="text-white">sự can thiệp của Nhà nước</strong> để cứu vãn hệ thống tư bản hay không?
                                </p>
                                <button
                                    onClick={() => setGameStatus("playing")}
                                    className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all transform hover:scale-105"
                                >
                                    Bắt Đầu Mô Phỏng
                                </button>
                            </motion.div>
                        )}

                        {/* ── MÀN HÌNH GAME ── */}
                        {gameStatus === "playing" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                                {/* Khu vực Animation Ngân Hàng */}
                                <div className="relative bg-black/40 backdrop-blur-md rounded-2xl border border-red-900/50 p-6 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                                    <AnimatePresence>
                                        {newsAlert && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -50 }}
                                                className="absolute top-4 z-20 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wider uppercase border text-center shadow-[0_0_15px_rgba(255,0,0,0.8)]"
                                            >
                                                📰 {newsAlert}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="text-6xl z-10 relative mt-4">
                                        🏦
                                        {particles.map(p => (
                                            <motion.div
                                                key={p.id}
                                                initial={{ opacity: 1, y: 0, x: 0 }}
                                                animate={{ opacity: 0, y: 100, x: p.x }}
                                                transition={{ duration: 1.5, ease: "easeIn" }}
                                                className="absolute top-1/2 left-1/2 text-2xl"
                                            >
                                                {p.emoji}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Dòng người */}
                                    <motion.div
                                        className="mt-4 flex gap-1 text-2xl h-8 overflow-hidden justify-center"
                                        animate={{ x: [-10, 10, -10] }}
                                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                    >
                                        {Array.from({ length: Math.floor(panicLevel / 5) }).map((_, i) => (
                                            <span key={i}>{i % 2 === 0 ? "👨" : "👩"}</span>
                                        ))}
                                    </motion.div>

                                    {panicLevel > 70 && (
                                        <div className="absolute bottom-2 right-4 text-xs font-bold animate-pulse text-red-400">
                                            📉 HỖN LOẠN!
                                        </div>
                                    )}

                                    {/* Timer */}
                                    <div className="absolute top-4 right-4 text-gray-400 font-mono font-bold bg-black/50 px-2 py-1 rounded">
                                        ⏱️ {timeElapsed}/60s
                                    </div>
                                </div>

                                {/* Thanh Progress Dự Trữ & Hoảng Loạn */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.div
                                        className="bg-black/30 rounded-xl p-4 border border-gray-700"
                                        animate={panicLevel > 80 ? { x: [-3, 3, -3] } : {}}
                                        transition={{ duration: 0.2, repeat: Infinity }}
                                    >
                                        <div className="flex justify-between mb-1 text-sm">
                                            <span className="font-bold text-green-400">Dự Trữ Ngân Hàng</span>
                                            <span className="font-bold">{bankReserve.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${Math.max(0, bankReserve)}%` }}></div>
                                        </div>
                                    </motion.div>
                                    <div className="bg-black/30 rounded-xl p-4 border border-gray-700">
                                        <div className="flex justify-between mb-1 text-sm">
                                            <span className="font-bold text-red-500">Mức Độ Hoảng Loạn</span>
                                            <span className="font-bold">{panicLevel.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${Math.max(0, panicLevel)}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Slider Thị trường vs Nhà nước */}
                                <div className={`bg-gray-900/60 rounded-xl p-5 border transition-all duration-500 ${marketRegulation > 80 ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                                    marketRegulation < 20 ? 'border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]' :
                                        'border-purple-500/30'
                                    }`}>
                                    <h3 className="text-center font-bold text-purple-300 mb-3 tracking-wide text-sm">
                                        ĐIỀU TIẾT VĨ MÔ
                                    </h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`text-xs font-bold uppercase w-24 text-right transition-colors ${marketRegulation < 50 ? 'text-sky-400' : 'text-gray-500'}`}>Thị trường</span>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={marketRegulation}
                                            onChange={(e) => setMarketRegulation(Number(e.target.value))}
                                            className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer transition-all"
                                            style={{
                                                accentColor: marketRegulation > 80 ? '#ef4444' : marketRegulation < 20 ? '#38bdf8' : '#a855f7'
                                            }}
                                        />
                                        <span className={`text-xs font-bold uppercase w-24 transition-colors ${marketRegulation >= 50 ? 'text-red-400' : 'text-gray-500'}`}>Nhà nước</span>
                                    </div>

                                    <div className="bg-black/50 rounded-lg p-3 text-sm text-center border border-gray-800">
                                        <div className="font-bold mb-1">
                                            Mức độ can thiệp: <span className={
                                                marketRegulation > 80 ? 'text-red-400' :
                                                    marketRegulation < 20 ? 'text-sky-400' :
                                                        'text-purple-400'
                                            }>{marketRegulation}%</span>
                                        </div>
                                        <div className="h-10 flex items-center justify-center">
                                            {marketRegulation < 20 ? (
                                                <span className="text-sky-300 text-xs animate-pulse">⚠️ <strong>Thả nổi:</strong> Hoảng loạn tăng nhanh (+1.5/s)<br />GDP sụt giảm (-0.5/s)</span>
                                            ) : marketRegulation > 80 ? (
                                                <span className="text-red-300 text-xs animate-pulse">🛡️ <strong>Kiểm soát:</strong> Trấn an hoảng loạn (-1/s)<br />Phục hồi GDP (+0.2/s)</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">⚖️ <strong>Trung lập:</strong> Không có tác động đặc biệt.<br />Bank run diễn ra bình thường.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Chỉ số Kinh tế */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-600 text-center">
                                        <div className="text-[10px] text-gray-400 uppercase">GDP Index</div>
                                        <div className="text-lg font-bold text-white">{gdp.toFixed(1)}</div>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-600 text-center">
                                        <div className="text-[10px] text-gray-400 uppercase">Thất nghiệp</div>
                                        <div className="text-lg font-bold text-amber-400">{unemployment.toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-600 text-center">
                                        <div className="text-[10px] text-gray-400 uppercase">Lạm phát</div>
                                        <div className="text-lg font-bold text-red-400">{inflation.toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-lg border border-gray-600 text-center">
                                        <div className="text-[10px] text-gray-400 uppercase">Ổn Định NH</div>
                                        <div className="text-lg font-bold text-blue-400">{bankStability.toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-gray-800/80 p-3 rounded-lg border border-yellow-600/50 text-center">
                                        <div className="text-[10px] text-yellow-500 uppercase">Giá Bánh Mì</div>
                                        <div className="text-lg font-bold text-yellow-400">${breadPrice.toFixed(2)}</div>
                                    </div>
                                </div>

                                {/* Thẻ Chính Sách */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-px flex-1 bg-white/10" />
                                        <h3 className="font-bold text-white/60 uppercase tracking-[0.2em] text-[11px] flex items-center gap-2">
                                            <span>🏛️</span> Chính sách cứu trợ
                                        </h3>
                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {policies.map(card => (
                                            <motion.button
                                                key={card.id}
                                                onClick={card.action}
                                                className="text-left rounded-2xl p-4 relative overflow-hidden group"
                                                style={{
                                                    background: card.bgGradient,
                                                    border: `1px solid ${card.borderColor}`,
                                                    backdropFilter: "blur(8px)",
                                                }}
                                                whileHover={{
                                                    scale: 1.03,
                                                    boxShadow: `0 0 24px ${card.glowColor}`,
                                                    borderColor: card.accentColor,
                                                }}
                                                whileTap={{ scale: 0.97 }}
                                                transition={{ duration: 0.18 }}
                                            >
                                                {/* Glow sweep on hover */}
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                    style={{ background: `radial-gradient(circle at 30% 50%, ${card.glowColor}, transparent 70%)` }} />

                                                {/* Header row */}
                                                <div className="flex items-start justify-between mb-2 relative">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="text-2xl leading-none">{card.icon}</div>
                                                        <div>
                                                            <div className="font-black text-white text-sm leading-tight">{card.name}</div>
                                                            <div className="text-[11px] font-medium" style={{ color: card.accentColor }}>{card.subtitle}</div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wide flex-shrink-0"
                                                        style={{ background: card.badgeColor, color: card.accentColor, border: `1px solid ${card.borderColor}` }}>
                                                        {card.badgeText}
                                                    </span>
                                                </div>

                                                {/* Description */}
                                                <p className="text-[12px] text-white/60 leading-relaxed mb-3 relative">{card.desc}</p>

                                                {/* Effect tags */}
                                                <div className="flex flex-wrap gap-1.5 relative">
                                                    {card.effects.map((eff, i) => (
                                                        <span key={i}
                                                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                                            style={{
                                                                background: eff.positive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                                                                color: eff.positive ? "#4ade80" : "#f87171",
                                                                border: eff.positive ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
                                                            }}
                                                        >
                                                            <span>{eff.positive ? "▲" : "▼"}</span>
                                                            <span>{eff.label}</span>
                                                            <span className="font-bold">{eff.value}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                            </motion.div>
                        )}

                        {/* ── MÀN HÌNH KẾT THÚC (THUA/THẮNG) ── */}
                        {gameStatus === "lost" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-red-950/80 backdrop-blur-lg p-8 rounded-2xl border-2 border-red-500"
                            >
                                <h2 className="text-4xl font-black text-red-500 mb-4 animate-pulse">SYSTEM COLLAPSE</h2>
                                <p className="text-lg text-red-200 mb-4 font-semibold">Ngân hàng cạn kiệt dự trữ. Hệ thống sụp đổ tài chính!</p>
                                <p className="text-sm text-gray-300 max-w-lg mx-auto mb-6">
                                    Khi thị trường hoàn toàn tự do và niềm tin sụp đổ, Bank Run có thể đánh sập cả một nền kinh tế nếu không có sự can thiệp từ Nhà nước.
                                </p>
                                <button onClick={resetGame} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-full font-bold text-sm">Chơi Lại</button>
                            </motion.div>
                        )}

                        {gameStatus === "won" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center bg-emerald-950/80 backdrop-blur-lg p-8 rounded-2xl border-2 border-emerald-500"
                            >
                                <h2 className="text-4xl font-black text-emerald-400 mb-4">CRISIS STABILIZED</h2>
                                <p className="text-lg text-emerald-200 mb-4 font-semibold">Khủng hoảng đã được kiểm soát!</p>

                                <div className="bg-black/40 p-5 rounded-xl border border-emerald-800 my-4 max-w-lg mx-auto italic text-gray-300 relative">
                                    <span className="text-3xl absolute top-1 left-3 text-emerald-700">"</span>
                                    <p className="text-sm">Điều duy nhất chúng ta phải sợ hãi chính là nỗi sợ hãi.</p>
                                    <span className="text-xs font-bold text-gray-400 mt-2 block">— Franklin D. Roosevelt, 1933</span>
                                </div>

                                <p className="text-sm text-gray-200 max-w-lg mx-auto mb-6">
                                    Bạn đã chứng minh được sự cần thiết của <strong>Bàn tay Hữu hình</strong> (Nhà nước) trong việc điều tiết nền kinh tế vĩ mô, khắc phục những khuyết tật của thị trường tự do.
                                </p>

                                <button onClick={resetGame} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full font-bold text-sm">Chơi Lại</button>
                            </motion.div>
                        )}
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
