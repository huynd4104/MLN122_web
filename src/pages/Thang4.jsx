import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CORE_IDEAS = [
    {
        id: "cong_nghiep_hoa",
        label: "Công nghiệp hóa",
        icon: "🏭",
        border: "border-blue-400",
        bg: "bg-blue-900/40",
        desc:
            "Quá trình chuyển dịch cơ cấu kinh tế theo hướng tăng tỷ trọng công nghiệp hiện đại, phát triển lực lượng sản xuất, tạo nền tảng vật chất - kỹ thuật cho chủ nghĩa xã hội.",
        borderColor: "#60a5fa",
    },
    {
        id: "hien_dai_hoa",
        label: "Hiện đại hóa",
        icon: "⚙️",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc:
            "Quá trình đổi mới công nghệ, quản lý, tổ chức sản xuất theo hướng hiện đại, nâng cao năng suất lao động và chất lượng sản phẩm, gắn liền với công nghiệp hóa.",
        borderColor: "#fbbf24",
    },
    {
        id: "ai_tu_dong_hoa",
        label: "Tự động hóa và AI",
        icon: "🤖",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc:
            "Ứng dụng công nghệ 4.0 (AI, robot, IoT) làm giảm thời gian lao động tất yếu, tăng năng suất lao động xã hội và giá trị thặng dư trong nền sản xuất tư bản chủ nghĩa.",
        borderColor: "#34d399",
    },
    {
        id: "luc_luong_san_xuat",
        label: "Phát triển lực lượng sản xuất",
        icon: "🔧",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc:
            "Cách mạng công nghiệp 4.0 là bước nhảy vọt về khoa học - công nghệ, đòi hỏi đổi mới quan hệ sản xuất để lực lượng sản xuất phát triển phù hợp.",
        borderColor: "#c084fc",
    },
    {
        id: "hoi_nhap_quoc_te",
        label: "Hội nhập quốc tế",
        icon: "🌍",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc:
            "Công nghiệp hóa - hiện đại hóa ở Việt Nam gắn với hội nhập kinh tế quốc tế, chủ động tham gia chuỗi giá trị toàn cầu trong bối cảnh cách mạng công nghiệp 4.0.",
        borderColor: "#38bdf8",
    },
];


const COMPARISONS = {
    human: {
        title: "Lao động thủ công (Con người)",
        stats: [
            { label: "Năng suất", value: "Thấp hơn, phụ thuộc kỹ năng cá nhân" },
            { label: "Thời gian", value: "Lâu hơn, dễ mệt mỏi" },
            { label: "Chi phí", value: "Cao lương, đào tạo" },
            { label: "Lỗi", value: "Dễ mắc lỗi do con người" },
            { label: "Linh hoạt", value: "Cao, thích ứng nhanh" },
        ],
        emoji: "👷♂️",
    },
    robot: {
        title: "Lao động tự động (Robot)",
        stats: [
            { label: "Năng suất", value: "Cao hơn, hoạt động liên tục" },
            { label: "Thời gian", value: "Nhanh hơn, 24/7" },
            { label: "Chi phí", value: "Ban đầu cao, sau thấp" },
            { label: "Lỗi", value: "Ít lỗi, chính xác cao" },
            { label: "Linh hoạt", value: "Thấp hơn, cần lập trình" },
        ],
        emoji: "🤖",
    },
};

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Industry40Page() {
    const [running, setRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [humanScore, setHumanScore] = useState(0);
    const [robotScore, setRobotScore] = useState(0);
    const [products, setProducts] = useState([]);
    // Event states
    const [activeEvent, setActiveEvent] = useState(null);
    const [humanSpeed, setHumanSpeed] = useState(1200); // Not used for clicker, but for events
    const [robotSpeed, setRobotSpeed] = useState(400);
    const [lastClick, setLastClick] = useState(0); // For debounce
    const simulationDuration = 10;
    // Refs for intervals
    const robotTimerRef = useRef(null);
    const eventTimerRef = useRef(null);

    // Main countdown timer
    useEffect(() => {
        let timer;
        if (running && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && running) {
            setRunning(false);
            setActiveEvent(null);
            clearInterval(robotTimerRef.current);
            clearInterval(eventTimerRef.current);
        }
        return () => clearInterval(timer);
    }, [running, timeLeft]);

    // Robot production loop (auto)
    useEffect(() => {
        if (running && robotSpeed !== null) {
            robotTimerRef.current = setInterval(() => {
                setRobotScore((prev) => prev + 1);
                spawnProduct("robot");
            }, robotSpeed);
        }
        return () => clearInterval(robotTimerRef.current);
    }, [running, robotSpeed]);

    // Random events generator
    useEffect(() => {
        if (running) {
            eventTimerRef.current = setInterval(() => {
                triggerRandomEvent();
            }, 3500);
        }
        return () => clearInterval(eventTimerRef.current);
    }, [running]);

    const triggerRandomEvent = () => {
        const events = [
            { id: "human_fatigue", icon: "👷", label: "Mệt mỏi", desc: "Không click được 2s" },
            { id: "robot_error", icon: "⚙️", label: "Robot lỗi", desc: "Tạm dừng 1s" },
            { id: "human_creativity", icon: "🧠", label: "Sáng tạo", desc: "+1 sản phẩm" },
            { id: "robot_overdrive", icon: "🔋", label: "Tăng tốc", desc: "X2 tốc độ (2s)" },
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setActiveEvent(randomEvent);
        if (randomEvent.id === "human_fatigue") {
            setHumanSpeed(null); // Disable click
            setTimeout(() => { setHumanSpeed(1200); setActiveEvent(null); }, 2000);
        } else if (randomEvent.id === "robot_error") {
            setRobotSpeed(null);
            setTimeout(() => { setRobotSpeed(400); setActiveEvent(null); }, 1000);
        } else if (randomEvent.id === "human_creativity") {
            setHumanScore(prev => prev + 1);
            spawnProduct("human");
            setTimeout(() => setActiveEvent(null), 1500);
        } else if (randomEvent.id === "robot_overdrive") {
            setRobotSpeed(200);
            setTimeout(() => { setRobotSpeed(400); setActiveEvent(null); }, 2000);
        }
    };

    const spawnProduct = (type) => {
        const id = Date.now() + Math.random();
        const baseMin = type === "human" ? 10 : 55;
        const baseMax = type === "human" ? 45 : 90;
        const xPos = baseMin + Math.random() * (baseMax - baseMin);
        setProducts((prev) => [...prev, { id, type, x: xPos }]);
        setTimeout(() => {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        }, 1500);
    };

    const startGame = () => {
        setHumanScore(0);
        setRobotScore(0);
        setTimeLeft(simulationDuration);
        setProducts([]);
        setActiveEvent(null);
        setHumanSpeed(1200);
        setRobotSpeed(400);
        setRunning(true);
    };

    const resetGame = () => {
        setRunning(false);
        clearInterval(robotTimerRef.current);
        clearInterval(eventTimerRef.current);
        setHumanScore(0);
        setRobotScore(0);
        setTimeLeft(simulationDuration);
        setProducts([]);
        setActiveEvent(null);
        setHumanSpeed(1200);
        setRobotSpeed(400);
    };

    const handleHumanClick = () => {
        if (!running || humanSpeed === null || Date.now() - lastClick < 500) return; // Debounce 500ms
        setLastClick(Date.now());
        setHumanScore((prev) => prev + 1);
        spawnProduct("human");
    };

    // Calculate progress
    const MAX_EXPECTED = 30;
    const humanProgress = Math.min(100, (humanScore / MAX_EXPECTED) * 100);
    const robotProgress = Math.min(100, (robotScore / MAX_EXPECTED) * 100);

    // Result chart calculations
    const finalMax = Math.max(humanScore, robotScore, 1);
    const productivityIncrease = humanScore > 0 ? Math.round(((robotScore - humanScore) / humanScore) * 100) : 0;

    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{
                background: "linear-gradient(135deg,#0f172a 0%,#1e40af 40%,#1e293b 100%)",
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
                        📅 Tháng 4 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 4: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Cách mạng Công nghiệp 4.0
                        </span>
                    </motion.h1>
                </motion.header>
                {/* ── EVENT CARD ── */}
                <motion.section className="rounded-2xl border border-blue-500/30 p-6 mb-8 relative overflow-hidden" style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">🤖</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">2011 - Hiện nay</div>
                            <h2 className="text-xl font-bold text-white mb-2">Cách mạng Công nghiệp 4.0 - Kỷ nguyên số</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Khái niệm <strong className="text-yellow-300">Cách mạng Công nghiệp 4.0</strong> (Industry 4.0) được chính thức đề xuất tại <strong className="text-white">Hannover Messe, Đức năm 2011</strong>, đánh dấu giai đoạn chuyển đổi số toàn diện với sự kết hợp của các công nghệ cốt lõi: trí tuệ nhân tạo (AI), Internet vạn vật (IoT), dữ liệu lớn (Big Data), điện toán đám mây, robot thông minh và sản xuất thông minh. Đây là cuộc cách mạng tiếp nối ba cuộc cách mạng trước (cơ khí hóa, điện khí hóa, điện tử hóa).
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Ở Việt Nam, Chính phủ ban hành <strong className="text-yellow-300">Chiến lược Quốc gia về Cách mạng Công nghiệp 4.0</strong> (Quyết định 749/QĐ-TTg năm 2020), xác định công nghiệp hóa - hiện đại hóa gắn với cách mạng 4.0 là nhiệm vụ trọng tâm, tạo nền tảng cho phát triển kinh tế số, xã hội số. Dưới góc nhìn kinh tế chính trị Mác – Lênin, cuộc cách mạng này thúc đẩy lực lượng sản xuất phát triển vượt bậc, đòi hỏi đổi mới quan hệ sản xuất cho phù hợp.
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
                                src="https://www.youtube.com/embed/Ft-Lr3f8XAY" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </motion.section>

                {/* ── MINI-GAME: Robot vs Con người ── */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <div className="rounded-2xl border border-blue-500/30 overflow-hidden bg-[rgba(13,27,75,0.7)] backdrop-blur-md relative">
                        {/* Event Notification Float */}
                        <AnimatePresence>
                            {activeEvent && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                                    animate={{ opacity: 1, y: 10, x: "-50%" }}
                                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                                    className="absolute top-16 left-1/2 z-50 bg-amber-500/90 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-amber-500/20 border border-amber-300 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <span className="text-xl">{activeEvent.icon}</span>
                                    <span>{activeEvent.label}: <span className="font-normal text-amber-100">{activeEvent.desc}</span></span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Header bar */}
                        <div className="p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#1d4ed8,#3b82f6)" }}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-black text-white">Robot vs Con người</h2>
                                    <p className="text-blue-300 text-xs mt-0.5">Click để human sản xuất - Robot auto</p>
                                </div>
                                <div className="flex items-center gap-2 text-white font-bold text-lg bg-blue-900/40 px-3 py-1.5 rounded-xl border border-blue-400/30">
                                    ⏱ {timeLeft}s
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button onClick={startGame} disabled={running} className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 disabled:opacity-50 disabled:bg-blue-800 disabled:text-white/50 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
                                        Start
                                    </button>
                                    <button onClick={resetGame} className="bg-blue-800/60 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Game Area */}
                        <div className="p-6 relative min-h-[300px] flex flex-col items-center justify-end overflow-hidden border-b border-blue-800/50">
                            {/* Products Animation */}
                            <AnimatePresence>
                                {products.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ y: 80, opacity: 0, scale: 0.5 }}
                                        animate={{ y: -40, opacity: 1, scale: 1.2 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute text-3xl z-0"
                                        style={{
                                            left: `${p.x}%`,
                                            bottom: `30%`,
                                            filter: p.type === 'robot' ? 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))' : 'drop-shadow(0 0 8px rgba(253, 224, 71, 0.4))'
                                        }}
                                    >
                                        📦
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {/* Production Visuals */}
                            <div className="w-full max-w-lg grid grid-cols-2 gap-10 mb-4 z-10 px-4">
                                <div className="text-center h-8 flex items-center justify-center gap-1 text-xl">
                                    {running && humanSpeed !== null && <motion.div animate={{ rotate: [0, -20, 0, 20, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>🔨</motion.div>}
                                    {running && humanSpeed === null && <span className="text-gray-400 text-sm">💤</span>}
                                </div>
                                <div className="text-center h-8 flex items-center justify-center gap-1 text-xl">
                                    {running && robotSpeed !== null && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: robotSpeed / 1000 }}>⚡</motion.div>}
                                    {running && robotSpeed === null && <span className="text-red-400 text-sm">⚠️</span>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl z-10 relative">
                                {/* Human Card - Clickable */}
                                <div className="bg-blue-900/40 border border-blue-400/30 p-4 rounded-xl flex flex-col justify-between cursor-pointer" onClick={handleHumanClick}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-2xl">👷</div>
                                        <h3 className="text-white font-bold text-sm">Con người</h3>
                                    </div>
                                    <div className="text-4xl font-black text-yellow-300 mb-3">{humanScore}</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-blue-300 uppercase tracking-wider">
                                            <span>Sản lượng</span>
                                            <span>{humanScore} sp</span>
                                        </div>
                                        <div className="h-2 w-full bg-blue-950 rounded-full overflow-hidden border border-blue-800/50">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${humanProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Robot Card */}
                                <div className="bg-blue-900/40 border border-emerald-500/30 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
                                    {running && robotSpeed === 200 && (
                                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
                                    )}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-2xl">🤖</div>
                                        <h3 className="text-white font-bold text-sm">Robot</h3>
                                    </div>
                                    <div className="text-4xl font-black text-emerald-400 mb-3">{robotScore}</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-emerald-300/70 uppercase tracking-wider">
                                            <span>Sản lượng</span>
                                            <span>{robotScore} sp</span>
                                        </div>
                                        <div className="h-2 w-full bg-blue-950 rounded-full overflow-hidden border border-emerald-900/50">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${robotProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Result Panel Overlay */}
                        <AnimatePresence>
                            {timeLeft === 0 && !running && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-blue-900/80 border-t border-blue-400/30 backdrop-blur-md"
                                >
                                    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
                                        <div className="text-center mb-6">
                                            <h3 className="inline-flex items-center gap-2 text-xl font-bold bg-yellow-400/20 text-yellow-300 px-4 py-1.5 rounded-full border border-yellow-400/30 mb-4">
                                                ✨ Kết quả mô phỏng
                                            </h3>
                                            <p className="text-white text-lg font-medium">
                                                Robot tăng năng suất: <span className="font-black text-emerald-400 text-2xl">+{productivityIncrease}%</span>
                                            </p>
                                        </div>
                                        {/* Bar Chart Comparison */}
                                        <div className="space-y-4 mb-8 bg-blue-950/50 p-4 rounded-xl border border-blue-800/50">
                                            {/* Robot Bar */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 text-right text-sm font-bold text-emerald-300">🤖 Robot</div>
                                                <div className="flex-1 h-6 bg-blue-900/50 rounded-r-md relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(robotScore / finalMax) * 100}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-r-md flex items-center justify-end px-2"
                                                    >
                                                        <span className="text-xs font-black text-emerald-900 text-shadow-sm">{robotScore}</span>
                                                    </motion.div>
                                                </div>
                                            </div>
                                            {/* Human Bar */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 text-right text-sm font-bold text-yellow-300">👷 Con người</div>
                                                <div className="flex-1 h-6 bg-blue-900/50 rounded-r-md relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(humanScore / finalMax) * 100}%` }}
                                                        transition={{ duration: 1, delay: 0.4 }}
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-r-md flex items-center justify-end px-2"
                                                    >
                                                        <span className="text-xs font-black text-yellow-900 text-shadow-sm">{humanScore}</span>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Educational Conclusion */}
                                        <div className="border-l-4 border-yellow-400 pl-4 py-1">
                                            <p className="text-blue-300 text-xs uppercase tracking-wider font-bold mb-1">
                                                Bài học Kinh tế Chính trị học Mác - Lênin
                                            </p>
                                            <p className="text-white/90 text-sm leading-relaxed italic">
                                                "Tự động hóa làm giảm thời gian lao động tất yếu, từ đó làm tăng giá trị thặng dư trong nền sản xuất."
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>
                {/* ── COMPARISONS TABLE ── */}
                <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-12">
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-6">✦ So sánh năng lực sản xuất ✦</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {Object.entries(COMPARISONS).map(([key, data]) => (
                            <div key={key} className={`rounded-xl border ${key === 'human' ? 'border-yellow-500/40 bg-yellow-900/20' : 'border-emerald-500/40 bg-emerald-900/20'} overflow-hidden backdrop-blur-sm`}>
                                <div className={`p-4 ${key === 'human' ? 'bg-yellow-500/20' : 'bg-emerald-500/20'} flex items-center gap-3 border-b ${key === 'human' ? 'border-yellow-500/30' : 'border-emerald-500/30'}`}>
                                    <div className="text-3xl">{data.emoji}</div>
                                    <h3 className={`font-bold text-lg ${key === 'human' ? 'text-yellow-300' : 'text-emerald-300'}`}>{data.title}</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    {data.stats.map((stat, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 last:border-0 gap-1 sm:gap-4">
                                            <span className="text-white/60 text-xs uppercase tracking-wider font-semibold w-24 shrink-0">{stat.label}</span>
                                            <span className="text-white/90 text-sm">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}