import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────
const CORE_IDEAS = [
    { id: "cong_nghiep_hoa", label: "Công nghiệp hóa", icon: "🏭", border: "border-blue-400", bg: "bg-blue-900/40", desc: "Quá trình chuyển dịch cơ cấu kinh tế theo hướng tăng tỷ trọng công nghiệp hiện đại, phát triển lực lượng sản xuất, tạo nền tảng vật chất - kỹ thuật cho chủ nghĩa xã hội." },
    { id: "hien_dai_hoa", label: "Hiện đại hóa", icon: "⚙️", border: "border-amber-400", bg: "bg-amber-900/40", desc: "Quá trình đổi mới công nghệ, quản lý, tổ chức sản xuất theo hướng hiện đại, nâng cao năng suất lao động và chất lượng sản phẩm, gắn liền với công nghiệp hóa." },
    { id: "ai_tu_dong_hoa", label: "Tự động hóa và AI", icon: "🤖", border: "border-emerald-400", bg: "bg-emerald-900/40", desc: "Ứng dụng công nghệ 4.0 (AI, robot, IoT) làm giảm thời gian lao động tất yếu, tăng năng suất lao động xã hội và giá trị thặng dư trong nền sản xuất tư bản chủ nghĩa." },
    { id: "luc_luong_san_xuat", label: "Phát triển lực lượng sản xuất", icon: "🔧", border: "border-purple-400", bg: "bg-purple-900/40", desc: "Cách mạng công nghiệp 4.0 là bước nhảy vọt về khoa học - công nghệ, đòi hỏi đổi mới quan hệ sản xuất để lực lượng sản xuất phát triển phù hợp." },
    { id: "hoi_nhap_quoc_te", label: "Hội nhập quốc tế", icon: "🌍", border: "border-sky-400", bg: "bg-sky-900/40", desc: "Công nghiệp hóa - hiện đại hóa ở Việt Nam gắn với hội nhập kinh tế quốc tế, chủ động tham gia chuỗi giá trị toàn cầu trong bối cảnh cách mạng công nghiệp 4.0." },
];

const COMPARISONS = {
    human: { title: "Lao động thủ công (Con người)", emoji: "👷‍♂️", stats: [{ label: "Năng suất", value: "Thấp hơn, phụ thuộc kỹ năng cá nhân" }, { label: "Thời gian", value: "Lâu hơn, dễ mệt mỏi" }, { label: "Chi phí", value: "Cao lương, đào tạo" }, { label: "Lỗi", value: "Dễ mắc lỗi do con người" }, { label: "Linh hoạt", value: "Cao, thích ứng nhanh" }] },
    robot: { title: "Lao động tự động (Robot)", emoji: "🤖", stats: [{ label: "Năng suất", value: "Cao hơn, hoạt động liên tục" }, { label: "Thời gian", value: "Nhanh hơn, 24/7" }, { label: "Chi phí", value: "Ban đầu cao, sau thấp" }, { label: "Lỗi", value: "Ít lỗi, chính xác cao" }, { label: "Linh hoạt", value: "Thấp hơn, cần lập trình" }] },
};

// Robot ticks every ROBOT_TICK ms, producing `robotPpt` units per tick
// This avoids React re-render bottleneck from ultra-fast setInterval
const ROBOT_TICK = 300; // fixed tick rate
const DIFF = {
    easy: { duration: 15, robotPpt: 1, label: "Dễ", emoji: "😊", desc: "Robot chậm · 15 giây", tw: "emerald" },
    normal: { duration: 10, robotPpt: 3, label: "Bình thường", emoji: "⚡", desc: "Robot nhanh · 10 giây", tw: "yellow" },
    hard: { duration: 7, robotPpt: 6, label: "Khó", emoji: "🔥", desc: "Robot siêu nhanh · 7 giây", tw: "red" },
};

// Minimum ms between human clicks
const CLICK_COOLDOWN = 250;

const EVENTS = [
    { id: "human_fatigue", icon: "😴", label: "Mệt mỏi!", msg: "Không click được trong 2 giây!", type: "warning", recov: "Hồi phục rồi! Click tiếp nào! 💪" },
    { id: "robot_error", icon: "💥", label: "Robot lỗi!", msg: "Robot bị tắt trong 1.5 giây!", type: "error", recov: "Robot đã sửa xong! Chạy tiếp 🔄" },
    { id: "human_creativity", icon: "💡", label: "Sáng kiến!", msg: "Con người sáng tạo → +3 sản phẩm!", type: "success" },
    { id: "robot_overdrive", icon: "⚡", label: "Robot tăng tốc!", msg: "Robot x2 tốc độ trong 2 giây!", type: "info", recov: "Robot trở lại bình thường 🤖" },
    { id: "power_outage", icon: "🌑", label: "Mất điện!", msg: "Robot mất nguồn trong 2.5 giây!", type: "error", recov: "Có điện rồi! Robot khởi động ⚡" },
    { id: "ai_upgrade", icon: "🧠", label: "Nâng cấp AI!", msg: "Thuật toán mới → Robot +5 sản phẩm!", type: "info" },
    { id: "strike", icon: "✊", label: "Đình công!", msg: "Đình công! Không click được 3 giây!", type: "warning", recov: "Đình công kết thúc! Làm việc thôi ✊" },
    { id: "rush_order", icon: "📦", label: "Đơn hàng gấp!", msg: "Đơn khẩn cấp! Cả hai +2 sản phẩm!", type: "success" },
    { id: "inspiration", icon: "🌟", label: "Cảm hứng!", msg: "Click của bạn ×3 điểm trong 3 giây!", type: "success", recov: "Cảm hứng đã hết 💫" },
    { id: "maintenance", icon: "🔧", label: "Bảo trì robot!", msg: "Robot giảm 50% tốc độ trong 2 giây!", type: "warning", recov: "Bảo trì xong! Robot bình thường 🔧" },
];

const ACHIEVEMENTS = [
    { id: "speed", icon: "⚡", label: "Thần Tốc", desc: "Click 12+ lần", chk: (h, r, c, mc, d) => c >= 12, col: "#fbbf24" },
    { id: "combo", icon: "👑", label: "Combo Vương", desc: "Đạt combo ×3", chk: (h, r, c, mc, d) => mc >= 6, col: "#a855f7" },
    { id: "win", icon: "🗡️", label: "Diệt Robot", desc: "Con người vượt robot", chk: (h, r, c, mc, d) => h >= r && h > 0, col: "#34d399" },
    { id: "tie", icon: "🤝", label: "Đối Thủ Xứng Tầm", desc: "Cách biệt ≤ 3", chk: (h, r, c, mc, d) => Math.abs(h - r) <= 3 && h > 0 && r > 0, col: "#38bdf8" },
    { id: "dom", icon: "🤖", label: "Robot Thống Trị", desc: "Robot gấp đôi người", chk: (h, r, c, mc, d) => r >= h * 2 && r > 5, col: "#34d399" },
    { id: "hard", icon: "🔥", label: "Chiến Binh", desc: "Hoàn thành chế độ Khó", chk: (h, r, c, mc, d) => d === "hard", col: "#f87171" },
];

// ─── Toast ───────────────────────────────────────────────────────────────────
const TOAST_CLS = {
    info: "bg-blue-950/95 border-blue-400/50 text-blue-100",
    success: "bg-emerald-950/95 border-emerald-400/50 text-emerald-100",
    warning: "bg-amber-950/95 border-amber-400/50 text-amber-100",
    error: "bg-red-950/95 border-red-400/50 text-red-100",
    combo: "bg-purple-950/95 border-violet-400/50 text-violet-100",
    system: "bg-slate-800/95 border-slate-500/50 text-slate-100",
};

function ToastStack({ toasts }) {
    const displayToasts = toasts.slice(-3);
    return (
        <div className="fixed top-24 md:top-20 right-4 z-[99999] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 290 }}>
            <AnimatePresence>
                {displayToasts.map(t => (
                    <motion.div key={t.id}
                        initial={{ opacity: 0, x: 80, scale: 0.85 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 80, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 340, damping: 28 }}
                        className={`flex items-start gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-sm text-sm font-medium ${TOAST_CLS[t.type] ?? TOAST_CLS.info}`}
                    >
                        <span className="text-xl leading-none flex-shrink-0 pt-0.5">{t.icon}</span>
                        <div className="leading-snug">
                            {t.title && <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-0.5">{t.title}</div>}
                            {t.message}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Industry40Page() {
    const [gamePhase, setGamePhase] = useState("idle"); // idle | running | finished
    const [difficulty, setDifficulty] = useState("normal");
    const [timeLeft, setTimeLeft] = useState(DIFF.normal.duration);
    const [humanScore, setHumanScore] = useState(0);
    const [robotScore, setRobotScore] = useState(0);
    const [products, setProducts] = useState([]);
    // Human
    const [humanDisabled, setHumanDisabled] = useState(false);
    const [humanBuff, setHumanBuff] = useState(1);
    const [stamina, setStamina] = useState(100);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [totalClicks, setTotalClicks] = useState(0);
    // Robot
    const [robotDisabled, setRobotDisabled] = useState(false);
    const [robotPpt, setRobotPpt] = useState(DIFF.normal.robotPpt); // units per tick
    // Events / UI
    const [activeEvent, setActiveEvent] = useState(null);
    const [toasts, setToasts] = useState([]);

    // Refs (avoid stale closures in setInterval callbacks)
    const robotTimerRef = useRef(null);
    const eventTimerRef = useRef(null);
    const staminaTimerRef = useRef(null);
    const lastClickRef = useRef(0);
    const comboRef = useRef(0);
    const humanBuffRef = useRef(1);
    const humanDisabledRef = useRef(false);
    const robotDisabledRef = useRef(false);
    const diffRef = useRef("normal");
    const robotPptRef = useRef(DIFF.normal.robotPpt);

    // Sync refs
    useEffect(() => { comboRef.current = combo; }, [combo]);
    useEffect(() => { humanBuffRef.current = humanBuff; }, [humanBuff]);
    useEffect(() => { humanDisabledRef.current = humanDisabled; }, [humanDisabled]);
    useEffect(() => { robotDisabledRef.current = robotDisabled; }, [robotDisabled]);
    useEffect(() => { diffRef.current = difficulty; }, [difficulty]);
    useEffect(() => { robotPptRef.current = robotPpt; }, [robotPpt]);

    // ── Toast helper ──
    const toast = (message, type = "info", icon = "📢", title = "") => {
        const id = Date.now() + Math.random();
        setToasts(p => [...p, { id, message, type, icon, title }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };

    // ── Spawn products ──
    const spawn = (type) => {
        const id = Date.now() + Math.random();
        const min = type === "human" ? 5 : 55, max = type === "human" ? 44 : 90;
        setProducts(p => [...p, { id, type, x: min + Math.random() * (max - min) }]);
        setTimeout(() => setProducts(p => p.filter(x => x.id !== id)), 1500);
    };
    const spawnBurst = (type, n) => { for (let i = 0; i < n; i++) setTimeout(() => spawn(type), i * 100); };

    // ── Random events ──
    const triggerEvent = () => {
        const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        setActiveEvent(ev);
        const baseMs = DIFF[diffRef.current].robotMs;

        const disableH = (ms) => {
            setHumanDisabled(true); humanDisabledRef.current = true;
            toast(ev.msg, ev.type, ev.icon, ev.label);
            setTimeout(() => { setHumanDisabled(false); humanDisabledRef.current = false; setActiveEvent(null); toast(ev.recov, "success", "✅"); }, ms);
        };
        const disableR = (ms) => {
            setRobotDisabled(true); robotDisabledRef.current = true;
            toast(ev.msg, ev.type, ev.icon, ev.label);
            setTimeout(() => { setRobotDisabled(false); robotDisabledRef.current = false; setActiveEvent(null); toast(ev.recov, "info", "✅"); }, ms);
        };

        const basePpt = DIFF[diffRef.current].robotPpt;
        switch (ev.id) {
            case "human_fatigue": disableH(2000); break;
            case "strike": disableH(3000); break;
            case "robot_error": disableR(1500); break;
            case "power_outage": disableR(2500); break;
            case "robot_overdrive":
                toast(ev.msg, ev.type, ev.icon, ev.label);
                setRobotPpt(basePpt * 2); robotPptRef.current = basePpt * 2;
                setTimeout(() => { setRobotPpt(basePpt); robotPptRef.current = basePpt; setActiveEvent(null); toast(ev.recov, "info", "🤖"); }, 2000);
                break;
            case "maintenance":
                toast(ev.msg, ev.type, ev.icon, ev.label);
                setRobotPpt(Math.max(1, Math.floor(basePpt / 2))); robotPptRef.current = Math.max(1, Math.floor(basePpt / 2));
                setTimeout(() => { setRobotPpt(basePpt); robotPptRef.current = basePpt; setActiveEvent(null); toast(ev.recov, "info", "🔧"); }, 2000);
                break;
            case "human_creativity":
                toast(ev.msg, ev.type, ev.icon, ev.label);
                setHumanScore(p => p + 3); spawnBurst("human", 3);
                setTimeout(() => setActiveEvent(null), 1500);
                break;
            case "ai_upgrade":
                toast(ev.msg, ev.type, ev.icon, ev.label);
                setRobotScore(p => p + basePpt * 2); spawnBurst("robot", Math.min(basePpt * 2, 8));
                setTimeout(() => setActiveEvent(null), 1500);
                break;
            case "rush_order":
                toast(ev.msg, ev.type, ev.icon, ev.label);
                setHumanScore(p => p + 2); setRobotScore(p => p + 2);
                spawnBurst("human", 2); spawnBurst("robot", 2);
                setTimeout(() => setActiveEvent(null), 1500);
                break;
            case "inspiration":
                toast(ev.msg, ev.type, ev.icon, ev.label);
                setHumanBuff(3); humanBuffRef.current = 3;
                setTimeout(() => { setHumanBuff(1); humanBuffRef.current = 1; setActiveEvent(null); toast(ev.recov, "warning", "💫"); }, 3000);
                break;
            default: break;
        }
    };

    // ── Click handler ──
    const handleClick = () => {
        if (gamePhase !== "running" || humanDisabledRef.current) return;
        if (stamina <= 0) { toast("Hết thể lực rồi! Nghỉ tay tí 😮‍💨", "warning", "💤"); return; }
        const now = Date.now();
        if (now - lastClickRef.current < CLICK_COOLDOWN) return; // Reaction-time floor

        const newCombo = (now - lastClickRef.current < 700) ? comboRef.current + 1 : 0;
        setCombo(newCombo); comboRef.current = newCombo;
        setMaxCombo(prev => Math.max(prev, newCombo));

        if (newCombo === 3) toast("COMBO ×2! Đừng dừng tay! 🔥", "combo", "🔥", "Combo!");
        if (newCombo === 6) toast("COMBO ×3! Siêu đỉnh! 💥", "combo", "💥", "Super Combo!");
        if (newCombo === 10) toast("COMBO MAX! Bạn là huyền thoại! 👑", "combo", "👑", "LEGENDARY!");

        const comboMult = newCombo >= 6 ? 3 : newCombo >= 3 ? 2 : 1;
        const pts = humanBuffRef.current * comboMult;
        lastClickRef.current = now;

        setStamina(prev => {
            const next = Math.max(0, prev - 10);
            if (next < 25 && prev >= 25) toast("Gần kiệt sức! Thể lực còn ít 😓", "warning", "💪", "Cảnh báo");
            return next;
        });
        setTotalClicks(p => p + 1);
        setHumanScore(p => p + pts);
        for (let i = 0; i < Math.min(pts, 5); i++) spawn("human");
    };

    // ── Game lifecycle ──
    const startGame = () => {
        const conf = DIFF[difficulty];
        setHumanScore(0); setRobotScore(0); setProducts([]); setActiveEvent(null);
        setHumanDisabled(false); humanDisabledRef.current = false;
        setHumanBuff(1); humanBuffRef.current = 1;
        setStamina(100); setCombo(0); comboRef.current = 0;
        setMaxCombo(0); setTotalClicks(0); lastClickRef.current = 0;
        setRobotDisabled(false); robotDisabledRef.current = false;
        setRobotPpt(conf.robotPpt); robotPptRef.current = conf.robotPpt;
        setTimeLeft(conf.duration); setToasts([]);
        setGamePhase("running");
        setTimeout(() => toast(`Bắt đầu! Chế độ: ${conf.label} ${conf.emoji}`, "system", "🚀", "Game Start"), 150);
    };

    const endGame = () => {
        clearInterval(robotTimerRef.current);
        clearInterval(eventTimerRef.current);
        clearInterval(staminaTimerRef.current);
        setGamePhase("finished"); setActiveEvent(null);
        setTimeout(() => toast("Trò chơi kết thúc! Xem kết quả bên dưới 👇", "system", "🏁", "Game Over"), 200);
    };

    const resetGame = () => {
        clearInterval(robotTimerRef.current);
        clearInterval(eventTimerRef.current);
        clearInterval(staminaTimerRef.current);
        const conf = DIFF[difficulty];
        setGamePhase("idle"); setHumanScore(0); setRobotScore(0);
        setTimeLeft(conf.duration); setProducts([]); setActiveEvent(null);
        setHumanDisabled(false); humanDisabledRef.current = false;
        setHumanBuff(1); humanBuffRef.current = 1;
        setStamina(100); setCombo(0); comboRef.current = 0;
        setRobotPpt(conf.robotPpt); robotPptRef.current = conf.robotPpt;
        setMaxCombo(0); setTotalClicks(0); lastClickRef.current = 0;
        setRobotDisabled(false); robotDisabledRef.current = false;

        setToasts([]);
    };

    // ── Effects ──
    useEffect(() => {
        if (gamePhase !== "running") return;
        if (timeLeft <= 0) { endGame(); return; }
        const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(t);
    }, [gamePhase, timeLeft]);

    useEffect(() => {
        clearInterval(robotTimerRef.current);
        if (gamePhase !== "running" || robotDisabled) return;
        robotTimerRef.current = setInterval(() => {
            const ppt = robotPptRef.current;
            setRobotScore(p => p + ppt);
            spawnBurst("robot", Math.min(ppt, 4)); // cap visual spawns
        }, ROBOT_TICK);
        return () => clearInterval(robotTimerRef.current);
    }, [gamePhase, robotDisabled]);

    useEffect(() => {
        if (gamePhase !== "running") return;
        eventTimerRef.current = setInterval(triggerEvent, 3500);
        return () => clearInterval(eventTimerRef.current);
    }, [gamePhase]);

    useEffect(() => {
        if (gamePhase !== "running") return;
        staminaTimerRef.current = setInterval(() => setStamina(p => Math.min(100, p + 8)), 400);
        return () => clearInterval(staminaTimerRef.current);
    }, [gamePhase]);

    // ── Derived ──
    const comboMult = combo >= 6 ? 3 : combo >= 3 ? 2 : 1;
    const MAX_EXP = { easy: 22, normal: 30, hard: 42 }[difficulty];
    const humanProgress = Math.min(100, (humanScore / MAX_EXP) * 100);
    const robotProgress = Math.min(100, (robotScore / MAX_EXP) * 100);
    const finalMax = Math.max(humanScore, robotScore, 1);
    const prodDiff = humanScore > 0 ? Math.round(((robotScore - humanScore) / humanScore) * 100) : null;
    const earnedAch = gamePhase === "finished"
        ? ACHIEVEMENTS.filter(a => a.chk(humanScore, robotScore, totalClicks, maxCombo, difficulty))
        : [];

    const diffBtnStyle = (key) => {
        const active = difficulty === key;
        const map = { easy: active ? "bg-emerald-500 border-emerald-400 text-white" : "border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50", normal: active ? "bg-yellow-500 border-yellow-400 text-slate-900" : "border-yellow-500/40 text-yellow-300 hover:bg-yellow-900/50", hard: active ? "bg-red-500 border-red-400 text-white" : "border-red-500/40 text-red-300 hover:bg-red-900/50" };
        return `border rounded-xl px-3 py-2 text-sm font-bold transition-all ${map[key]}`;
    };

    return (
        <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e40af 40%,#1e293b 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <ToastStack toasts={toasts} />

            {/* Stars */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(28)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-yellow-300"
                        style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 70}%`, opacity: 0.2 }}
                        animate={{ opacity: [0.1, 0.8, 0.1] }}
                        transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
                    />
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

                {/* Event card */}
                <motion.section className="rounded-2xl border border-blue-500/30 p-6 mb-8 relative overflow-hidden" style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">🤖</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">2011 - Hiện nay</div>
                            <h2 className="text-xl font-bold text-white mb-2">Cách mạng Công nghiệp 4.0 - Kỷ nguyên số</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Khái niệm <strong className="text-yellow-300">Cách mạng Công nghiệp 4.0</strong> (Industry 4.0) được chính thức đề xuất tại <strong className="text-white">Hannover Messe, Đức năm 2011</strong>, đánh dấu giai đoạn chuyển đổi số toàn diện với sự kết hợp của AI, IoT, Big Data, điện toán đám mây và robot thông minh.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Ở Việt Nam, Chính phủ ban hành <strong className="text-yellow-300">Chiến lược Quốc gia về Cách mạng Công nghiệp 4.0</strong> (Quyết định 749/QĐ-TTg năm 2020), xác định công nghiệp hóa - hiện đại hóa gắn với cách mạng 4.0 là nhiệm vụ trọng tâm.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Core ideas */}
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

                {/* ─── MINI GAME ─── */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    <div className="rounded-2xl border border-blue-500/30 overflow-hidden relative" style={{ background: "rgba(13,27,75,0.75)", backdropFilter: "blur(14px)" }}>

                        {/* Floating event badge */}
                        <AnimatePresence>
                            {activeEvent && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 10, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
                                    className="absolute top-16 left-1/2 z-50 bg-amber-500/90 text-white px-5 py-2 rounded-full font-bold shadow-xl border border-amber-300 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <span className="text-xl">{activeEvent.icon}</span>
                                    <span>{activeEvent.label}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header bar */}
                        <div className="p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#1d4ed8,#3b82f6)" }}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-black text-white">⚔️ Robot vs Con người</h2>
                                    <p className="text-blue-200 text-xs mt-0.5">Click nhanh tạo Combo · Cẩn thận sự kiện bất ngờ!</p>
                                </div>
                                <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0">
                                    {/* Timer */}
                                    <div className="flex items-center gap-2">
                                        <div className={`font-black text-2xl px-4 py-1.5 rounded-xl border ${timeLeft <= 3 && gamePhase === "running" ? "bg-red-500/30 border-red-400 text-red-300 animate-pulse" : "bg-blue-900/50 border-blue-400/30 text-white"}`}>
                                            ⏱ {timeLeft}s
                                        </div>
                                    </div>
                                    {/* Buttons */}
                                    <div className="flex items-center gap-2 flex-wrap justify-end">
                                        <button onClick={startGame} disabled={gamePhase === "running"} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-blue-900 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm whitespace-nowrap">
                                            {gamePhase === "finished" ? "Chơi lại" : "Bắt đầu"}
                                        </button>
                                        <button onClick={resetGame} className="bg-blue-800/60 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty selector (idle only) */}
                        {gamePhase === "idle" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pt-5 pb-2">
                                <p className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Chọn độ khó:</p>
                                <div className="flex gap-3 flex-wrap">
                                    {Object.entries(DIFF).map(([key, d]) => (
                                        <button key={key} onClick={() => { setDifficulty(key); setTimeLeft(d.duration); toast(`Chế độ ${d.label} được chọn ${d.emoji}`, "system", d.emoji); }}
                                            className={diffBtnStyle(key)}>
                                            {d.emoji} {d.label}
                                            <span className="block text-[10px] font-normal opacity-70">{d.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Game area */}
                        <div className="p-6 relative min-h-[320px] flex flex-col items-center justify-end overflow-hidden border-b border-blue-800/50">
                            {/* Flying products */}
                            <AnimatePresence>
                                {products.map(p => (
                                    <motion.div key={p.id}
                                        initial={{ y: 80, opacity: 0, scale: 0.5 }}
                                        animate={{ y: -50, opacity: 1, scale: 1.2 }}
                                        exit={{ opacity: 0, scale: 0.6 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute text-3xl z-0 pointer-events-none"
                                        style={{ left: `${p.x}%`, bottom: "28%", filter: p.type === "robot" ? "drop-shadow(0 0 8px rgba(52,211,153,.7))" : "drop-shadow(0 0 8px rgba(253,224,71,.6))" }}
                                    >📦</motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Combo indicator */}
                            {gamePhase === "running" && combo >= 3 && (
                                <motion.div
                                    key={comboMult}
                                    initial={{ scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
                                >
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-black border shadow-lg ${comboMult === 3 ? "bg-purple-500/80 border-purple-300 text-white" : "bg-orange-500/80 border-orange-300 text-white"}`}>
                                        🔥 COMBO ×{comboMult}  ({combo} streak)
                                    </span>
                                </motion.div>
                            )}

                            {/* Working icons */}
                            <div className="w-full max-w-lg grid grid-cols-2 gap-10 mb-4 z-10 px-4">
                                <div className="text-center h-8 flex items-center justify-center">
                                    {gamePhase === "running" && !humanDisabled && <motion.div className="text-2xl" animate={{ rotate: [0, -20, 0, 20, 0] }} transition={{ repeat: Infinity, duration: 1 }}>🔨</motion.div>}
                                    {gamePhase === "running" && humanDisabled && <span className="text-gray-400 text-sm animate-pulse">💤 Bị khóa…</span>}
                                </div>
                                <div className="text-center h-8 flex items-center justify-center">
                                    {gamePhase === "running" && !robotDisabled && <motion.div className="text-2xl" animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 0.4 }}>⚡</motion.div>}
                                    {gamePhase === "running" && robotDisabled && <span className="text-red-400 text-sm animate-pulse">⚠️ Ngừng…</span>}
                                </div>
                            </div>

                            {/* Score cards */}
                            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl z-10 relative">
                                {/* Human */}
                                <motion.div
                                    onClick={handleClick}
                                    whileTap={gamePhase === "running" && !humanDisabled ? { scale: 0.94 } : {}}
                                    className={`rounded-xl border p-4 flex flex-col justify-between select-none transition-all ${gamePhase === "running" && !humanDisabled ? "cursor-pointer hover:border-yellow-400/60 active:bg-yellow-900/30" : "cursor-not-allowed opacity-70"} ${humanDisabled ? "border-gray-600/40 bg-gray-900/40" : "border-yellow-400/30 bg-blue-900/40"}`}
                                >
                                    {/* Inspiration buff glow */}
                                    {humanBuff > 1 && <div className="absolute inset-0 rounded-xl bg-yellow-400/10 animate-pulse pointer-events-none" />}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-2xl">{humanDisabled ? "😴" : "👷"}</div>
                                        <h3 className="text-white font-bold text-sm">Con người</h3>
                                        {humanBuff > 1 && <span className="ml-auto text-[10px] bg-yellow-500/30 text-yellow-300 px-1.5 py-0.5 rounded-full font-bold">×{humanBuff}</span>}
                                    </div>
                                    <div className="text-4xl font-black text-yellow-300 mb-2">{humanScore}</div>

                                    {/* Stamina bar */}
                                    <div className="mb-2">
                                        <div className="flex justify-between text-[9px] text-blue-300/70 uppercase tracking-wider mb-1">
                                            <span>Thể lực</span><span>{Math.round(stamina)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-blue-950 rounded-full overflow-hidden">
                                            <motion.div className={`h-full rounded-full ${stamina < 25 ? "bg-red-400" : stamina < 50 ? "bg-amber-400" : "bg-emerald-400"}`}
                                                animate={{ width: `${stamina}%` }} transition={{ duration: 0.3 }} />
                                        </div>
                                    </div>

                                    {/* Production bar */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-yellow-300/70 uppercase tracking-wider"><span>Sản lượng</span><span>{humanScore} sp</span></div>
                                        <div className="h-2 w-full bg-blue-950 rounded-full overflow-hidden">
                                            <motion.div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300" animate={{ width: `${humanProgress}%` }} transition={{ duration: 0.3 }} />
                                        </div>
                                    </div>

                                    {gamePhase === "idle" && <p className="text-[10px] text-blue-300 mt-2 text-center">👆 Click vào đây khi game bắt đầu!</p>}
                                </motion.div>

                                {/* Robot */}
                                <div className={`rounded-xl border p-4 flex flex-col justify-between relative overflow-hidden transition-all ${robotDisabled ? "border-red-500/30 bg-red-950/20" : robotPpt > DIFF[difficulty].robotPpt ? "border-emerald-400/60 bg-emerald-950/20" : "border-emerald-500/30 bg-blue-900/40"}`}>
                                    {!robotDisabled && robotPpt > DIFF[difficulty].robotPpt && <div className="absolute inset-0 bg-emerald-400/10 animate-pulse pointer-events-none" />}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-2xl">{robotDisabled ? "💀" : "🤖"}</div>
                                        <h3 className="text-white font-bold text-sm">Robot</h3>
                                        {!robotDisabled && robotPpt > DIFF[difficulty].robotPpt && <span className="ml-auto text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">TURBO</span>}
                                        {robotDisabled && <span className="ml-auto text-[10px] bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded-full font-bold">OFFLINE</span>}
                                    </div>
                                    <div className="text-4xl font-black text-emerald-400 mb-3">{robotScore}</div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-emerald-300/70 uppercase tracking-wider"><span>Sản lượng</span><span>{robotScore} sp</span></div>
                                        <div className="h-2 w-full bg-blue-950 rounded-full overflow-hidden">
                                            <motion.div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" animate={{ width: `${robotProgress}%` }} transition={{ duration: 0.3 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Result panel ── */}
                        <AnimatePresence>
                            {gamePhase === "finished" && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-blue-900/80 border-t border-blue-400/20 backdrop-blur-md">
                                    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
                                        {/* Winner */}
                                        <div className="text-center mb-6">
                                            <div className="text-5xl mb-2">{humanScore >= robotScore ? "🏆" : "🤖"}</div>
                                            <h3 className="text-xl font-black text-white mb-1">
                                                {humanScore >= robotScore ? "Con người chiến thắng! 🎉" : "Robot chiến thắng! "}
                                            </h3>
                                            {prodDiff !== null && (
                                                <p className="text-blue-200 text-sm">
                                                    Robot {prodDiff >= 0 ? "vượt trội hơn" : "kém hơn"} con người:{" "}
                                                    <span className={`font-black text-xl ${prodDiff >= 0 ? "text-emerald-400" : "text-yellow-400"}`}>
                                                        {prodDiff >= 0 ? "+" : ""}{prodDiff}%
                                                    </span>
                                                </p>
                                            )}
                                            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-blue-300">
                                                <span>👆 {totalClicks} click</span>
                                                <span>🔥 Max combo: ×{maxCombo >= 6 ? 3 : maxCombo >= 3 ? 2 : 1} ({maxCombo})</span>
                                            </div>
                                        </div>

                                        {/* Bar chart */}
                                        <div className="space-y-3 mb-6 bg-blue-950/50 p-4 rounded-xl border border-blue-800/50">
                                            {[{ label: "🤖 Robot", score: robotScore, cls: "from-emerald-600 to-emerald-400", txtCls: "text-emerald-900" },
                                            { label: "👷 Con người", score: humanScore, cls: "from-yellow-600 to-yellow-400", txtCls: "text-yellow-900" }].map((row, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-28 text-right text-sm font-bold text-white/80">{row.label}</div>
                                                    <div className="flex-1 h-7 bg-blue-900/50 rounded-md relative">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(row.score / finalMax) * 100}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                                                            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${row.cls} rounded-md flex items-center justify-end px-2`}>
                                                            <span className={`text-xs font-black ${row.txtCls}`}>{row.score}</span>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Achievements */}
                                        {earnedAch.length > 0 && (
                                            <div className="mb-6">
                                                <p className="text-center text-xs uppercase tracking-widest text-blue-300 font-bold mb-3">🏅 Thành tích đạt được</p>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {earnedAch.map(a => (
                                                        <motion.div key={a.id} initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300 }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
                                                            style={{ background: a.col + "22", borderColor: a.col + "66", color: a.col }}>
                                                            {a.icon} {a.label}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Lesson */}
                                        <div className="border-l-4 border-yellow-400 pl-4 py-1">
                                            <p className="text-blue-300 text-xs uppercase tracking-wider font-bold mb-1">Bài học Kinh tế Chính trị Mác – Lênin</p>
                                            <p className="text-white/90 text-sm leading-relaxed italic">
                                                "Tự động hóa và AI làm giảm thời gian lao động tất yếu, từ đó tăng giá trị thặng dư. Tuy nhiên, con người với sự sáng tạo và linh hoạt vẫn đóng vai trò không thể thay thế trong nền kinh tế."
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* Comparison table */}
                <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-10">
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-6">✦ So sánh năng lực sản xuất ✦</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {Object.entries(COMPARISONS).map(([key, data]) => (
                            <div key={key} className={`rounded-xl border ${key === "human" ? "border-yellow-500/40 bg-yellow-900/20" : "border-emerald-500/40 bg-emerald-900/20"} overflow-hidden backdrop-blur-sm`}>
                                <div className={`p-4 ${key === "human" ? "bg-yellow-500/20 border-yellow-500/30" : "bg-emerald-500/20 border-emerald-500/30"} flex items-center gap-3 border-b`}>
                                    <div className="text-3xl">{data.emoji}</div>
                                    <h3 className={`font-bold text-lg ${key === "human" ? "text-yellow-300" : "text-emerald-300"}`}>{data.title}</h3>
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

                {/* Video */}
                <motion.section className="mt-16 pt-12 border-t border-slate-800 pb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 p-2 md:p-4 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-700/50 bg-black">
                            <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/Ft-Lr3f8XAY" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}