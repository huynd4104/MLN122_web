import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CORE_IDEAS = [
    {
        id: "gia_tri_thang_du",
        label: "Giá trị thặng dư",
        icon: "💰",
        border: "border-red-400",
        bg: "bg-red-900/40",
        desc:
            "Phần giá trị mới do lao động không công của công nhân tạo ra, dôi ra ngoài giá trị sức lao động",
        borderColor: "#f56565",
    },
    {
        id: "thoi_gian_tat_yeu",
        label: "Thời gian lao động tất yếu",
        icon: "⏰",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc:
            "Thời gian lao động cần thiết để tái sản xuất giá trị sức lao động (v), bù đắp chi phí sinh hoạt của công nhân và gia đình họ.",
        borderColor: "#fbbf24",
    },
    {
        id: "thoi_gian_thang_du",
        label: "Thời gian lao động thặng dư",
        icon: "🔥",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc:
            "Thời gian lao động không công của công nhân tạo ra giá trị thặng dư (m) hoàn toàn thuộc về nhà tư bản.",
        borderColor: "#34d399",
    },
    {
        id: "ty_suat_thang_du",
        label: "Tỷ suất giá trị thặng dư",
        icon: "📊",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc:
            "Mức độ bóc lột lao động của nhà tư bản (m' = m/v × 100%).",
        borderColor: "#c084fc",
    },
    {
        id: "phuong_phap_sx",
        label: "Phương pháp sản xuất thặng dư",
        icon: "🛠️",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc:
            "Tuyệt đối (kéo dài ngày lao động) và tương đối (rút ngắn thời gian tất yếu bằng tăng năng suất lao động).",
        borderColor: "#38bdf8",
    },
];


const MARX_QUOTES = [
    "\"Tư bản là lao động chết, giống như ma cà rồng, chỉ sống bằng cách hút lao động sống, và càng sống nhiều hơn, nó càng hút nhiều hơn.\" — Karl Marx",
    "\"Công nhân không chỉ tái sản xuất ra giá trị sức lao động của mình, mà còn tạo ra một giá trị vượt quá đó.\" — Karl Marx, Tư Bản Luận",
    "\"Ngày làm việc không phải là một đại lượng cố định mà là biến thiên.\" — Karl Marx",
    "\"Lịch sử của tất cả các xã hội tồn tại cho đến nay là lịch sử của đấu tranh giai cấp.\" — Marx & Engels",
    "\"Nhà tư bản mua sức lao động theo giá trị của nó, nhưng trong quá trình tiêu thụ, lao động tạo ra nhiều hơn giá trị của chính nó.\" — Karl Marx",
];

// Mức lương tối thiểu giả định để tính thời gian tất yếu (VND/tháng)
const MIN_WAGE = 4_680_000;

function calcData(salary, hoursPerDay, daysPerMonth) {
    const totalHours = hoursPerDay * daysPerMonth;
    // Tỷ lệ lương tối thiểu so với lương thực tế
    const ratio = Math.min(MIN_WAGE / Math.max(salary, 1), 1);
    // Thời gian tất yếu = tỷ lệ * tổng giờ làm (khi lương thấp → cần nhiều giờ hơn để đủ sống)
    const necessaryHours = Math.max(ratio * hoursPerDay, 0.5);
    const surplusHours = Math.max(hoursPerDay - necessaryHours, 0);
    // Tỷ suất thặng dư m' = (giờ thặng dư / giờ tất yếu) * 100
    const mPrime = necessaryHours > 0 ? (surplusHours / necessaryHours) * 100 : 0;
    // Giá trị thặng dư hàng tháng
    const hourlyValue = salary / Math.max(totalHours, 1);
    const surplusValue = hourlyValue * surplusHours * daysPerMonth;
    const necessaryPct = (necessaryHours / hoursPerDay) * 100;
    const surplusPct = (surplusHours / hoursPerDay) * 100;
    return { necessaryHours, surplusHours, mPrime, surplusValue, necessaryPct, surplusPct };
}

// Animated counter hook
function useAnimatedValue(target, duration = 800) {
    const [display, setDisplay] = useState(target);
    const prev = useRef(target);
    useEffect(() => {
        const start = prev.current;
        const diff = target - start;
        const startTime = performance.now();
        let raf;
        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplay(start + diff * ease);
            if (progress < 1) raf = requestAnimationFrame(step);
            else prev.current = target;
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return display;
}

// Flying coins component
function FlyingCoins({ trigger }) {
    const coins = Array.from({ length: 6 }, (_, i) => i);
    return (
        <div className="relative h-16 overflow-hidden pointer-events-none select-none" aria-hidden>
            <AnimatePresence>
                {trigger && coins.map((i) => (
                    <motion.span
                        key={`${trigger}-${i}`}
                        className="absolute text-xl"
                        style={{ left: `${8 + i * 4}%`, top: "50%" }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: "70vw", y: [-10, -30, -10, 0], opacity: [1, 1, 0.7, 0], scale: [1, 1.3, 1] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 + i * 0.15, delay: i * 0.1, ease: "easeInOut" }}
                    >
                        💰
                    </motion.span>
                ))}
            </AnimatePresence>
            {/* Worker & Capitalist labels */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-2xl">👷</span>
                <span className="text-yellow-300 text-xs font-bold mt-0.5">Công nhân</span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-2xl">🤵</span>
                <span className="text-red-400 text-xs font-bold mt-0.5">Nhà tư bản</span>
            </div>
        </div>
    );
}

// Exploitation ring
function ExploitationRing({ mPrime }) {
    const animated = useAnimatedValue(mPrime);
    const capped = Math.min(animated, 999);
    const radius = 36;
    const circ = 2 * Math.PI * radius;
    const pct = Math.min(capped / 500, 1); // cap visual at 500%
    const color = capped < 100 ? "#34d399" : capped < 300 ? "#fbbf24" : "#ef4444";
    return (
        <div className="flex flex-col items-center gap-1">
            <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <motion.circle
                    cx="45" cy="45" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    animate={{ strokeDashoffset: circ * (1 - pct) }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "45px 45px", filter: `drop-shadow(0 0 6px ${color})` }}
                />
                <text x="45" y="50" textAnchor="middle" fill={color} fontSize="13" fontWeight="bold">
                    {Math.round(animated)}%
                </text>
            </svg>
            <span className="text-xs text-purple-300 font-semibold tracking-wide">Tỷ suất m'</span>
        </div>
    );
}

// Slider with label
function LabeledSlider({ label, value, min, max, step, onChange, format, color = "#fbbf24" }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
                <span className="text-blue-200 text-xs font-semibold">{label}</span>
                <span className="text-sm font-black" style={{ color }}>{format(value)}</span>
            </div>
            <div className="relative">
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
                        accentColor: color,
                    }}
                />
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function LaborDayPage() {
    const [salary, setSalary] = useState(10_000_000);
    const [hoursPerDay, setHoursPerDay] = useState(8);
    const [daysPerMonth, setDaysPerMonth] = useState(22);
    const [coinTrigger, setCoinTrigger] = useState(0);
    const [quoteIdx] = useState(() => Math.floor(Math.random() * MARX_QUOTES.length));

    const data = calcData(salary, hoursPerDay, daysPerMonth);
    const { necessaryHours, surplusHours, mPrime, surplusValue, necessaryPct, surplusPct } = data;

    const animatedSurplus = useAnimatedValue(surplusValue);

    // Trigger coin fly whenever surplus changes meaningfully
    useEffect(() => {
        if (surplusHours > 0) setCoinTrigger((t) => t + 1);
    }, [Math.round(surplusHours * 10)]);

    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{
                background: "linear-gradient(135deg,#03045e 0%,#0d1b4b 40%,#1a1a2e 100%)",
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
                        📅 Tháng 5 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 5: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Ngày Quốc tế Lao động
                        </span>
                    </motion.h1>
                </motion.header>

                {/* ── EVENT CARD ── */}
                <motion.section className="rounded-2xl border border-red-500/30 p-6 mb-8 relative overflow-hidden" style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">✊</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">1 tháng 5, 1886</div>
                            <h2 className="text-xl font-bold text-white mb-2">Ngày Quốc tế Lao động - Cuộc đấu tranh của giai cấp công nhân</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Ngày Quốc tế Lao động (1/5) bắt nguồn từ <strong className="text-yellow-300">cuộc biểu tình tại Chicago, Mỹ năm 1886</strong>, khi hàng nghìn công nhân đình công đòi ngày làm 8 giờ. Phong trào lan rộng, dẫn đến bạo lực (Sự kiện Haymarket), nhưng đã thúc đẩy quyền lao động toàn cầu.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Được Quốc tế II công nhận năm 1889, ngày 1/5 trở thành biểu tượng đấu tranh giai cấp công nhân chống bóc lột. Ở Việt Nam, đây là ngày lễ lớn, kỷ niệm tinh thần đoàn kết lao động và xây dựng xã hội công bằng.
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
                                src="https://www.youtube.com/embed/DkYqONro9UI"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </motion.section>

                {/* ══════════════════════════════════════════════════════════
                    ── INTERACTIVE SURPLUS VALUE CALCULATOR ──
                ══════════════════════════════════════════════════════════ */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>

                    {/* Header */}
                    <div className="rounded-t-2xl p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#7c1a1a,#b91c1c)" }}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-white">⚙️ Máy tính giá trị thặng dư</h2>
                                <p className="text-red-200 text-xs mt-0.5">Kéo thanh trượt — kết quả cập nhật real-time</p>
                            </div>
                            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-3 py-1.5 text-center">
                                <div className="text-yellow-300 text-xs font-semibold">⚠️ Mô phỏng giáo dục</div>
                                <div className="text-yellow-500 text-xs">Giả định, không chính xác tuyệt đối</div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="rounded-b-2xl border border-red-900/40 border-t-0" style={{ background: "rgba(5,12,45,0.92)", backdropFilter: "blur(10px)" }}>

                        {/* Sliders */}
                        <div className="p-5 border-b border-white/5 grid grid-cols-1 gap-5">
                            <LabeledSlider
                                label="💵 Lương tháng"
                                value={salary}
                                min={1_000_000}
                                max={50_000_000}
                                step={500_000}
                                onChange={setSalary}
                                format={(v) => `${(v / 1_000_000).toFixed(1)}tr VND`}
                                color="#fbbf24"
                            />
                            <LabeledSlider
                                label="⏱ Giờ làm / ngày"
                                value={hoursPerDay}
                                min={4}
                                max={14}
                                step={0.5}
                                onChange={setHoursPerDay}
                                format={(v) => `${v}h`}
                                color="#38bdf8"
                            />
                            <LabeledSlider
                                label="📅 Ngày làm / tháng"
                                value={daysPerMonth}
                                min={10}
                                max={30}
                                step={1}
                                onChange={setDaysPerMonth}
                                format={(v) => `${v} ngày`}
                                color="#a78bfa"
                            />
                        </div>

                        {/* ── VISUAL TIMELINE: Ngày lao động ── */}
                        <div className="px-5 pt-5 pb-3">
                            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">📊 Phân bổ ngày lao động ({hoursPerDay}h)</p>
                            <div className="flex rounded-full overflow-hidden h-8 mb-2 shadow-lg" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                                <motion.div
                                    className="flex items-center justify-center text-xs font-black text-black"
                                    style={{ background: "linear-gradient(90deg,#fbbf24,#f59e0b)", minWidth: 0 }}
                                    animate={{ width: `${necessaryPct}%` }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {necessaryPct > 15 && `${necessaryHours.toFixed(1)}h ⏰`}
                                </motion.div>
                                <motion.div
                                    className="flex items-center justify-center text-xs font-black text-white"
                                    style={{ background: "linear-gradient(90deg,#dc2626,#991b1b)", minWidth: 0 }}
                                    animate={{ width: `${surplusPct}%` }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {surplusPct > 15 && `${surplusHours.toFixed(1)}h 🔥`}
                                </motion.div>
                            </div>
                            <div className="flex gap-4 text-xs">
                                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-amber-400"></span><span className="text-amber-300 font-semibold">Tất yếu (v)</span></span>
                                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-red-600"></span><span className="text-red-400 font-semibold">Thặng dư (m)</span></span>
                            </div>
                        </div>

                        {/* ── FLYING COINS ── */}
                        <div className="px-5 py-2 border-y border-white/5 relative">
                            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">💸 Dòng chảy giá trị thặng dư</p>
                            <FlyingCoins trigger={coinTrigger} />
                        </div>

                        {/* ── METRICS ROW ── */}
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">

                            {/* Exploitation Ring */}
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
                                <ExploitationRing mPrime={mPrime} />
                                <p className="text-purple-300 text-xs text-center mt-2 leading-relaxed">
                                    m' = m/v × 100% <br />
                                    <span className="text-white/50 text-xs">Tỷ suất bóc lột</span>
                                </p>
                            </div>

                            {/* Hours breakdown */}
                            <div className="flex flex-col gap-3 justify-center p-4 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10" style={{ background: "linear-gradient(160deg, rgba(20,25,45,0.7) 0%, rgba(30,20,30,0.8) 100%)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                                {/* Animated glow backgrounds */}
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500 pointer-events-none"></div>
                                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500 pointer-events-none"></div>

                                {/* Tất yếu */}
                                <div className="relative z-10 flex flex-col p-3 rounded-xl bg-white/5 border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs shadow-inner shadow-amber-500/40">⏰</div>
                                        <div className="text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Giờ tất yếu / ngày</div>
                                    </div>
                                    <div className="flex items-baseline pl-1">
                                        <div className="text-white font-black text-3xl tracking-tight drop-shadow-md">
                                            {necessaryHours.toFixed(2)}
                                        </div>
                                        <span className="text-base font-semibold text-amber-400 ml-1.5 opacity-80">h</span>
                                    </div>
                                    <div className="text-white/40 text-[11px] font-medium mt-1 pl-1">Làm cho bản thân</div>
                                </div>

                                {/* Thặng dư */}
                                <div className="relative z-10 flex flex-col p-3 rounded-xl bg-white/5 border border-red-500/10 hover:border-red-500/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs shadow-inner shadow-red-500/40">🔥</div>
                                        <div className="text-red-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Giờ thặng dư / ngày</div>
                                    </div>
                                    <div className="flex items-baseline pl-1">
                                        <div className="text-white font-black text-3xl tracking-tight drop-shadow-md">
                                            {surplusHours.toFixed(2)}
                                        </div>
                                        <span className="text-base font-semibold text-red-400 ml-1.5 opacity-80">h</span>
                                    </div>
                                    <div className="text-white/40 text-[11px] font-medium mt-1 pl-1">Làm không công cho chủ</div>
                                </div>
                            </div>

                            {/* Surplus value */}
                            <div className="flex flex-col justify-center items-center p-3 rounded-2xl text-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                                <div className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">💰 Giá trị thặng dư / tháng</div>
                                <motion.div
                                    className="text-yellow-300 font-black text-xl leading-tight"
                                    key={Math.round(surplusValue / 10000)}
                                    initial={{ scale: 1.2, opacity: 0.7 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {Math.round(animatedSurplus).toLocaleString("vi-VN")}
                                </motion.div>
                                <div className="text-yellow-600 text-xs font-semibold mt-0.5">VND</div>
                                <div className="text-white/30 text-xs mt-2">≈ {(animatedSurplus / 1_000_000).toFixed(1)}tr / tháng</div>
                            </div>
                        </div>

                        {/* ── STORY MODE ── */}
                        <div className="mx-5 mb-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg,rgba(30,58,138,0.5),rgba(88,28,135,0.4))", border: "1px solid rgba(99,102,241,0.3)" }}>
                            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">📖 Câu chuyện của bạn</p>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Trong <strong className="text-yellow-300">{hoursPerDay}h</strong> làm việc mỗi ngày, bạn dành{" "}
                                <strong className="text-amber-300">{necessaryHours.toFixed(1)}h</strong> để tạo ra giá trị cho chính mình
                                và <strong className="text-red-400">{surplusHours.toFixed(1)}h</strong> để lao động không công cho nhà tư bản.
                                Mỗi tháng, khoảng{" "}
                                <strong className="text-yellow-300">{Math.round(surplusValue).toLocaleString("vi-VN")} VND</strong> giá trị
                                bạn tạo ra được chuyển vào túi chủ mà không có trong phiếu lương của bạn.
                            </p>
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">💬 Marx nói:</p>
                                <p className="text-purple-200 text-xs italic leading-relaxed">{MARX_QUOTES[quoteIdx]}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-white/30 text-xs">
                                    ⚠️ <strong>Lưu ý:</strong> Công thức sử dụng mức lương tối thiểu {MIN_WAGE.toLocaleString("vi-VN")} VND/tháng làm cơ sở.
                                    Khi lương thực tế thấp hơn, thời gian tất yếu tăng lên. Đây là quy ước giả định phục vụ mục đích giáo dục, không phản ánh hoàn toàn lý thuyết kinh tế chính trị.
                                </p>
                            </div>
                        </div>
                    </div>

                </motion.section>

            </div>
        </div>
    );
}

