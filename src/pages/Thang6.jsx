import { useState, useEffect, useRef, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";

// Lazy-load the globe to avoid SSR/hydration issues
const Globe = lazy(() => import("react-globe.gl"));

// ── Data ─────────────────────────────────────────────────────────────────────
const USA_COORD = { lat: 38.9072, lng: -77.0369 };

const COUNTRIES = [
    { name: "United Kingdom", aid: 3297, lat: 51.5, lng: -0.12, impact: "GDP vượt mức trước chiến tranh 35%, tăng trưởng kinh tế ổn định." },
    { name: "France", aid: 2296, lat: 48.85, lng: 2.35, impact: "Công nghiệp hóa nhanh chóng, GDP tăng gấp đôi trước chiến tranh." },
    { name: "West Germany", aid: 1448, lat: 51.16, lng: 10.45, impact: "Kỳ tích kinh tế (Wirtschaftswunder), GDP tăng 400% từ 1950-1960." },
    { name: "Italy", aid: 1204, lat: 41.87, lng: 12.57, impact: "Phục hồi công nghiệp, tăng trưởng GDP trung bình 5.8%/năm thập niên 1950." },
    { name: "Netherlands", aid: 1128, lat: 52.37, lng: 4.89, impact: "Xây dựng cơ sở hạ tầng, GDP tăng 3.5%/năm, hội nhập châu Âu." },
    { name: "Belgium & Luxembourg", aid: 777, lat: 50.85, lng: 4.35, impact: "Tăng cường thương mại, GDP vượt mức trước chiến tranh 20%." },
    { name: "Austria", aid: 468, lat: 47.52, lng: 14.55, impact: "Ổn định kinh tế, GDP tăng 5%/năm, giảm phụ thuộc viện trợ." },
    { name: "Denmark", aid: 385, lat: 56.26, lng: 9.50, impact: "Phát triển nông nghiệp, tăng trưởng kinh tế bền vững." },
    { name: "Greece", aid: 376, lat: 39.07, lng: 21.82, impact: "Phục hồi sau nội chiến, GDP tăng 6.2%/năm thập niên 1950." },
    { name: "Norway", aid: 372, lat: 60.47, lng: 8.47, impact: "Xây dựng thủy điện, GDP tăng 3.2%/năm." },
    { name: "Sweden", aid: 347, lat: 60.13, lng: 18.64, impact: "Mô hình phúc lợi xã hội, tăng trưởng ổn định." },
    { name: "Turkey", aid: 137, lat: 38.96, lng: 35.24, impact: "Hiện đại hóa nông nghiệp, GDP tăng 6%/năm." },
    { name: "Ireland", aid: 133, lat: 53.41, lng: -8.24, impact: "Phát triển kinh tế, giảm di cư." },
    { name: "Portugal", aid: 70, lat: 39.40, lng: -8.22, impact: "Cải thiện cơ sở hạ tầng, tăng trưởng chậm nhưng ổn định." },
    { name: "Iceland", aid: 43, lat: 64.99, lng: -18.6, impact: "Phát triển ngư nghiệp, kinh tế ổn định." },
];

const CORE_IDEAS = [
    {
        id: "hoi_nhap",
        label: "Hội nhập kinh tế quốc tế",
        icon: "🌍",
        border: "border-green-400",
        bg: "bg-green-900/40",
        desc:
            "Quá trình trao đổi kinh tế giữa các quốc gia, thúc đẩy phân công lao động quốc tế và chuyên môn hóa sản xuất.",
        borderColor: "#22c55e",
    },
    {
        id: "cuong_quoc",
        label: "Cường quốc kinh tế",
        icon: "🏆",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc:
            "Các nước có trình độ phát triển cao thống trị thị trường thế giới, hưởng lợi lớn từ thương mại quốc tế và bóc lột các nước yếu.",
        borderColor: "#fbbf24",
    },
    {
        id: "phu_thuoc",
        label: "Sự phụ thuộc kinh tế quốc tế",
        icon: "🔗",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc:
            "Các nước chậm phát triển bị lệ thuộc vào cường quốc về công nghệ, thị trường và tài chính, bất lợi trong trao đổi quốc tế.",
        borderColor: "#34d399",
    },
    {
        id: "toan_cau",
        label: "Xu thế toàn cầu hóa kinh tế",
        icon: "🤝",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc:
            "Tăng cường hội nhập kinh tế quốc tế, phân công lao động toàn cầu, nhưng làm sâu sắc thêm bất bình đẳng giữa các nước phát triển và đang phát triển.",
        borderColor: "#c084fc",
    },
    {
        id: "chien_luoc",
        label: "Chiến lược phát triển kinh tế",
        icon: "📈",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc:
            "Viện trợ kinh tế là công cụ của cường quốc để mở rộng ảnh hưởng, tạo thị trường tiêu thụ và phụ thuộc cho các nước nhận viện trợ.",
        borderColor: "#38bdf8",
    },
];


const TIMELINE = [
    { year: "1947", label: "Đề xuất", color: "#fbbf24", desc: "Ngày 5/6/1947, Ngoại trưởng George C. Marshall đề xuất kế hoạch tại Đại học Harvard, cam kết Mỹ sẽ hỗ trợ châu Âu phục hồi." },
    { year: "1948", label: "Bắt đầu", color: "#34d399", desc: "Tháng 4/1948, Quốc hội Mỹ thông qua Foreign Assistance Act. Các khoản viện trợ đầu tiên được giải ngân cho 16 nước Tây Âu." },
    { year: "1950", label: "Phục hồi", color: "#38bdf8", desc: "GDP các nước châu Âu vượt mức trước chiến tranh. Sản xuất công nghiệp tăng 25%. Nền kinh tế Tây Đức tăng trưởng vượt bậc." },
    { year: "1952", label: "Kết thúc", color: "#c084fc", desc: "Kế hoạch chính thức kết thúc sau 4 năm, tổng viện trợ ~13 tỷ USD. Châu Âu Tây đã ổn định, đặt nền tảng cho Cộng đồng Kinh tế châu Âu." },
];

const MAX_AID = COUNTRIES[0].aid;

// ── Animated count-up hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 1200, trigger = true) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        let start = null;
        const from = 0;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(from + (target - from) * ease));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, trigger]);
    return val;
}

// ── Flying money ──────────────────────────────────────────────────────────────
function FlyingMoney({ trigger }) {
    const items = ["💵", "💶", "💴", "💰", "🪙", "💵"];
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <AnimatePresence>
                {trigger > 0 && items.map((icon, i) => (
                    <motion.span
                        key={`${trigger}-${i}`}
                        className="absolute text-xl select-none"
                        style={{ left: `${15 + i * 12}%`, bottom: "10%" }}
                        initial={{ y: 0, opacity: 1, scale: 1 }}
                        animate={{ y: -120, opacity: 0, scale: 1.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4 + i * 0.15, delay: i * 0.08, ease: "easeOut" }}
                    >
                        {icon}
                    </motion.span>
                ))}
            </AnimatePresence>
        </div>
    );
}

// ── Bar chart row ─────────────────────────────────────────────────────────────
function BarRow({ country, isSelected, onClick, inView }) {
    const pct = (country.aid / MAX_AID) * 100;
    return (
        <button
            onClick={onClick}
            className={`w-full text-left group transition-all duration-200 ${isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-xs font-semibold w-36 truncate">{country.name}</span>
                <span className="text-yellow-300 text-xs font-black ml-auto">{country.aid.toLocaleString()}M</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        background: isSelected
                            ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
                            : "linear-gradient(90deg,#22c55e,#15803d)",
                        boxShadow: isSelected ? "0 0 10px #fbbf24aa" : undefined,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: inView ? `${pct}%` : 0 }}
                    transition={{ duration: 0.8, delay: 0.05, ease: "easeOut" }}
                />
            </div>
        </button>
    );
}

// ── Globe wrapper (lazy) ──────────────────────────────────────────────────────
function GlobeSection({ selected, onSelect }) {
    const globeRef = useRef();
    const [ready, setReady] = useState(false);
    const autoRotateTimer = useRef(null);

    const [dimensions, setDimensions] = useState({
        width: typeof window !== "undefined" ? Math.min(window.innerWidth - 40, 520) : 480,
        height: typeof window !== "undefined" ? Math.min(window.innerWidth < 640 ? 400 : 500, 500) : 480
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: Math.min(window.innerWidth - 40, 520),
                height: Math.min(window.innerWidth < 640 ? 400 : 500, 500)
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Arcs: USA → each country
    const arcsData = COUNTRIES.map((c) => ({
        startLat: USA_COORD.lat,
        startLng: USA_COORD.lng,
        endLat: c.lat,
        endLng: c.lng,
        color: ["rgba(251,191,36,0.9)", "rgba(34,197,94,0.7)"],
        stroke: Math.max(0.3, c.aid / 1200),
        label: c.name,
    }));

    // Markers
    const pointsData = COUNTRIES.map((c) => ({
        ...c,
        size: Math.max(0.25, c.aid / 3000),
        color: selected?.name === c.name ? "#fbbf24" : "#22c55e",
    }));

    const handleGlobeReady = useCallback(() => {
        setReady(true);
        if (globeRef.current) {
            // Auto-rotate
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;
            // Start centered on Europe
            globeRef.current.pointOfView({ lat: 50, lng: 10, altitude: 1.8 }, 0);
            const controls = globeRef.current.controls();

            const stopRotate = () => {
                controls.autoRotate = false;
                if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
                autoRotateTimer.current = setTimeout(() => {
                    controls.autoRotate = true;
                }, 3000);
            };

            controls.addEventListener("start", stopRotate);
        }
    }, []);

    const handlePointClick = useCallback((point) => {
        if (globeRef.current) {
            globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.4 }, 800);
        }
        onSelect(point);
    }, [onSelect]);

    return (
        <div className="relative w-full h-[420px] sm:h-[500px] flex items-center justify-center">
            {!ready && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-green-300 z-10">
                    <motion.div
                        className="w-12 h-12 border-4 border-green-400/30 border-t-green-400 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-xs font-semibold tracking-widest uppercase opacity-70">Đang tải Globe...</span>
                </div>
            )}
            <Suspense fallback={null}>
                <Globe
                    ref={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    backgroundColor="rgba(0,0,0,0)"
                    atmosphereColor="#22c55e"
                    atmosphereAltitude={0.18}
                    // Arcs
                    arcsData={arcsData}
                    arcColor="color"
                    arcStroke="stroke"
                    arcDashLength={0.4}
                    arcDashGap={0.2}
                    arcDashAnimateTime={2200}
                    arcAltitudeAutoScale={0.35}
                    arcLabel={(d) => `<div style="background:rgba(0,20,10,0.9);border:1px solid #22c55e;padding:4px 8px;border-radius:8px;font-size:12px;color:#86efac">${d.label}</div>`}
                    // Points
                    pointsData={pointsData}
                    pointColor="color"
                    pointRadius="size"
                    pointAltitude={0.01}
                    pointResolution={12}
                    pointLabel={(d) => `<div style="background:rgba(0,20,10,0.9);border:1px solid #fbbf24;padding:6px 10px;border-radius:8px;color:#fde68a;font-size:12px;font-weight:bold">${d.name}<br/><span style="color:#86efac;font-weight:normal">${d.aid.toLocaleString()}M USD</span></div>`}
                    onPointClick={handlePointClick}
                    onGlobeReady={handleGlobeReady}
                />
            </Suspense>
            {/* USA label */}
            <div className="absolute top-4 left-4 bg-blue-900/80 border border-blue-400/40 rounded-xl px-3 py-1.5 text-xs text-blue-200 font-semibold backdrop-blur-sm">
                🇺🇸 Nguồn viện trợ: <span className="text-yellow-300">Hoa Kỳ</span>
            </div>
            <div className="absolute bottom-4 left-4 text-green-400/60 text-xs italic">
                Kéo để xoay · Scroll để zoom · Click để chọn
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MarshallPlanPage() {
    const [selected, setSelected] = useState(null);
    const [moneyTrigger, setMoneyTrigger] = useState(0);
    const [activeTimeline, setActiveTimeline] = useState(null);
    const barRef = useRef(null);
    const detailRef = useRef(null);
    const barInView = useInView(barRef, { once: true, margin: "-80px" });

    const countedAid = useCountUp(selected?.aid ?? 0, 1000, !!selected);

    const handleSelect = useCallback((country) => {
        setSelected(country);
        setMoneyTrigger((t) => t + 1);
        
        // Auto scroll to detail panel on mobile screens
        if (window.innerWidth < 1024 && detailRef.current) {
            setTimeout(() => {
                detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, []);

    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{
                background: "linear-gradient(135deg,#022c22 0%,#052e16 50%,#022c22 100%)",
                fontFamily: "'Segoe UI',system-ui,sans-serif",
            }}
        >
            {/* Ambient particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-green-300"
                        style={{
                            width: Math.random() * 2.5 + 0.5,
                            height: Math.random() * 2.5 + 0.5,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.4 + 0.1,
                        }}
                        animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.5, 1] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">

                {/* ── Return ── */}
                <div className="pt-6 mb-2">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-sm"
                    >
                        ← Về Trang Chủ
                    </Link>
                </div>

                {/* ── Header ── */}
                <motion.header
                    className="text-center pt-8 pb-6"
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1 text-yellow-300 text-sm font-semibold mb-4 tracking-widest uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        📅 Tháng 6 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1
                        className="text-3xl sm:text-5xl font-black leading-tight mb-2"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        <span className="text-white">Tháng 6: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Kế hoạch Marshall
                        </span>
                    </motion.h1>
                </motion.header>

                {/* ── Event summary card ── */}
                <motion.section
                    className="rounded-2xl border border-green-500/30 p-5 mb-8 relative overflow-hidden"
                    style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                >
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">🇺🇸</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">5 tháng 6, 1947</div>
                            <h2 className="text-xl font-bold text-white mb-2">Kế hoạch Marshall – Viện trợ tái thiết châu Âu</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Kế hoạch Marshall (European Recovery Program) được Ngoại trưởng Mỹ <strong className="text-yellow-300">George C. Marshall đề xuất ngày 5/6/1947</strong> tại Đại học Harvard, nhằm tái thiết 16 nước Tây Âu sau Thế chiến II. Từ 1948–1952, Mỹ cung cấp khoảng <strong className="text-yellow-300">13 tỷ USD</strong> (tương đương ~150 tỷ USD hiện nay) viện trợ cho Anh, Pháp, Tây Đức, Ý, Hà Lan, Bỉ, Áo, Đan Mạch, Hy Lạp, Na Uy, Thụy Điển, Thổ Nhĩ Kỳ, Ireland, Bồ Đào Nha, Iceland và Luxembourg.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Kế hoạch giúp châu Âu phục hồi nhanh chóng (GDP tăng trung bình 5-6%/năm), nhưng cũng là công cụ chiến lược của Mỹ trong Chiến tranh Lạnh để ngăn chặn chủ nghĩa xã hội, mở rộng thị trường xuất khẩu và tạo sự phụ thuộc kinh tế quốc tế.
                            </p>

                        </div>
                    </div>
                </motion.section>

                {/* ── TIMELINE ── */}
                <motion.section
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-center text-base font-bold text-yellow-300 uppercase tracking-widest mb-5">
                        ⏱ Diễn biến lịch sử
                    </h2>
                    <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-2">
                        {/* connector line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 -z-0 mx-8" />
                        {TIMELINE.map((t, i) => (
                            <div key={t.year} className="relative flex flex-col items-center flex-1 min-w-[80px] z-10">
                                <button
                                    onMouseEnter={() => setActiveTimeline(i)}
                                    onClick={() => setActiveTimeline(i)}
                                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-xs transition-all duration-300 focus:outline-none"
                                    style={{
                                        borderColor: t.color,
                                        background: activeTimeline === i ? t.color : "rgba(0,20,10,0.8)",
                                        color: activeTimeline === i ? "#000" : t.color,
                                        boxShadow: activeTimeline === i ? `0 0 18px ${t.color}88` : undefined,
                                    }}
                                >
                                    {t.year.slice(2)}
                                </button>
                                <div className="mt-2 text-xs font-bold" style={{ color: t.color }}>{t.year}</div>
                                <div className="text-white/50 text-xs">{t.label}</div>
                            </div>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        {activeTimeline !== null && (
                            <motion.div
                                key={activeTimeline}
                                className="mt-4 rounded-xl p-4 border text-sm leading-relaxed text-blue-100"
                                style={{
                                    borderColor: TIMELINE[activeTimeline].color + "55",
                                    background: `${TIMELINE[activeTimeline].color}11`,
                                    backdropFilter: "blur(8px)",
                                }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <span className="font-bold" style={{ color: TIMELINE[activeTimeline].color }}>
                                    {TIMELINE[activeTimeline].year} – {TIMELINE[activeTimeline].label}:{" "}
                                </span>
                                {TIMELINE[activeTimeline].desc}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ── GLOBE + DETAIL PANEL (2-column on desktop) ── */}
                <motion.section
                    className="mb-10 rounded-2xl overflow-hidden border border-green-700/40"
                    style={{ background: "rgba(2,44,34,0.85)", backdropFilter: "blur(14px)" }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Globe */}
                        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-green-700/30">
                            <div className="p-4 border-b border-green-700/30">
                                <h2 className="text-base font-black text-white">🌍 Bản đồ viện trợ 3D</h2>
                                <p className="text-green-400/70 text-xs mt-0.5">Các đường vòng cung = dòng tiền từ Mỹ sang châu Âu</p>
                            </div>
                            <GlobeSection selected={selected} onSelect={handleSelect} />
                        </div>

                        {/* Detail panel */}
                        <div ref={detailRef} className="w-full lg:w-80 flex flex-col scroll-mt-20">
                            <div className="p-4 border-b border-green-700/30">
                                <h2 className="text-base font-black text-white">📋 Thông tin chi tiết</h2>
                                <p className="text-green-400/70 text-xs mt-0.5">Click vào quốc gia trên globe</p>
                            </div>

                            <div className="flex-1 p-4 relative overflow-hidden min-h-[260px]">
                                <AnimatePresence mode="wait">
                                    {selected ? (
                                        <motion.div
                                            key={selected.name}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -30 }}
                                            transition={{ duration: 0.35 }}
                                            className="relative"
                                        >
                                            <FlyingMoney trigger={moneyTrigger} />
                                            <div className="text-yellow-300 font-black text-xl mb-1">{selected.name}</div>
                                            {/* Aid count-up */}
                                            <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                                                <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">💰 Tổng viện trợ</div>
                                                <div className="text-white font-black text-3xl">
                                                    +{countedAid.toLocaleString()}
                                                    <span className="text-green-400 text-base font-semibold ml-1">M USD</span>
                                                </div>
                                                {/* mini progress bar */}
                                                <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ background: "linear-gradient(90deg,#22c55e,#fbbf24)" }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(selected.aid / MAX_AID) * 100}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <div className="text-white/30 text-xs mt-1">{((selected.aid / MAX_AID) * 100).toFixed(1)}% so với UK (cao nhất)</div>
                                            </div>
                                            {/* Impact */}
                                            <div className="rounded-xl p-3" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}>
                                                <div className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">📊 Tác động kinh tế</div>
                                                <p className="text-blue-100 text-sm leading-relaxed">{selected.impact}</p>
                                            </div>
                                            {/* coords */}
                                            <div className="mt-2 text-white/25 text-xs">
                                                📍 {selected.lat.toFixed(2)}°N, {selected.lng.toFixed(2)}°E
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            className="flex flex-col items-center justify-center h-full text-center gap-3 py-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="text-5xl opacity-80 drop-shadow-md">
                                                🌍
                                            </div>
                                            <p className="text-green-300/60 text-sm">Click vào một điểm trên<br />quả cầu để xem chi tiết</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── BAR CHART ── */}
                <motion.section
                    ref={barRef}
                    className="mb-10 rounded-2xl border border-green-700/40 overflow-hidden"
                    style={{ background: "rgba(2,44,34,0.80)", backdropFilter: "blur(12px)" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="p-4 border-b border-green-700/30">
                        <h2 className="text-base font-black text-white">📊 So sánh viện trợ (triệu USD)</h2>
                        <p className="text-green-400/70 text-xs mt-0.5">Sắp xếp từ cao đến thấp · Click để xem chi tiết</p>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                        {COUNTRIES.map((c) => (
                            <BarRow
                                key={c.name}
                                country={c}
                                isSelected={selected?.name === c.name}
                                onClick={() => handleSelect(c)}
                                inView={barInView}
                            />
                        ))}
                    </div>
                </motion.section>

                {/* ── CORE IDEAS ── */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <h2 className="text-center text-base font-bold text-yellow-300 uppercase tracking-widest mb-5">
                        ✦ Tư tưởng cốt lõi ✦
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {CORE_IDEAS.map((idea, i) => (
                            <motion.div
                                key={idea.id}
                                className={`rounded-xl border ${idea.border} ${idea.bg} p-4 flex gap-3 items-start`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + i * 0.1 }}
                            >
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
                                src="https://www.youtube.com/embed/BULMSp-wcbo"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
