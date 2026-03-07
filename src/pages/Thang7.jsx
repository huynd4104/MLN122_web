import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";

// ── DATA ─────────────────────────────────────────────────────────────────────

const CURRENCIES = [
    { code: "GBP", name: "Bảng Anh", flag: "🇬🇧", rate: 0.357, country: "United Kingdom" },
    { code: "JPY", name: "Yên Nhật", flag: "🇯🇵", rate: 360, country: "Japan" },
    { code: "FRF", name: "Franc Pháp", flag: "🇫🇷", rate: 4.937, country: "France" },
    { code: "DEM", name: "Deutsche Mark", flag: "🇩🇪", rate: 4.2, country: "West Germany" },
    { code: "CAD", name: "Dollar Canada", flag: "🇨🇦", rate: 1.1, country: "Canada" },
    { code: "AUD", name: "Dollar Úc", flag: "🇦🇺", rate: 1.12, country: "Australia" },
];

const COUNTRIES_44 = [
    { name: "Hoa Kỳ", flag: "🇺🇸", role: "Nguồn dự trữ vàng, neo 35 USD/ounce", color: "#3b82f6" },
    { name: "Anh", flag: "🇬🇧", role: "1 GBP = 2.8 USD cố định", color: "#ef4444" },
    { name: "Pháp", flag: "🇫🇷", role: "1 USD = 4.937 Franc", color: "#8b5cf6" },
    { name: "Đức (Tây)", flag: "🇩🇪", role: "DM neo USD, xuất khẩu bùng nổ", color: "#f59e0b" },
    { name: "Nhật Bản", flag: "🇯🇵", role: "1 USD = 360 Yên (cố định 1949-1971)", color: "#ec4899" },
    { name: "Canada", flag: "🇨🇦", role: "CAD gần như ngang USD", color: "#14b8a6" },
    { name: "Ý", flag: "🇮🇹", role: "Lira neo USD, tái thiết hậu chiến", color: "#22c55e" },
    { name: "Hà Lan", flag: "🇳🇱", role: "Guilder ổn định qua IMF", color: "#f97316" },
    { name: "Bỉ", flag: "🇧🇪", role: "Thành lập Benelux nhờ ổn định tiền tệ", color: "#facc15" },
    { name: "Úc", flag: "🇦🇺", role: "AUD neo GBP rồi USD", color: "#6366f1" },
    { name: "Ấn Độ", flag: "🇮🇳", role: "Rupee neo GBP, chuyển sang IMF", color: "#fb923c" },
    { name: "Brazil", flag: "🇧🇷", role: "Cruzeiro dưới áp lực USD", color: "#4ade80" },
    { name: "Mexico", flag: "🇲🇽", role: "Peso cố định 8.65/USD đến 1954", color: "#a78bfa" },
    { name: "Argentina", flag: "🇦🇷", role: "Tham gia nhưng bất ổn chính trị", color: "#34d399" },
    { name: "Liên Xô", flag: "🇷🇺", role: "Từ chối tham gia — khai mào Chiến tranh lạnh", color: "#f87171" },
    { name: "Trung Quốc", flag: "🇨🇳", role: "Tham dự, rút khỏi 1949 sau nội chiến", color: "#fb7185" },
    { name: "Na Uy", flag: "🇳🇴", role: "Krone neo USD qua ECA", color: "#60a5fa" },
    { name: "Đan Mạch", flag: "🇩🇰", role: "Krone ổn định trong khuôn khổ EPU", color: "#a3e635" },
];

const TIMELINE_EVENTS = [
    {
        year: "1944",
        label: "Kết thúc",
        icon: "📜",
        color: "#fbbf24",
        desc:
            "22/7/1944: 44 quốc gia họp tại Bretton Woods. Ký kết thiết lập USD neo giá trị thay thế vàng (1 ounce = 35 USD).",
        detail:
            "Hội nghị do Harry Dexter White (Mỹ) và John Maynard Keynes (Anh) chủ trì. Mỹ sở hữu 70% dự trữ vàng thế giới lúc bấy giờ, tạo nền tảng cho bá quyền USD.",
    },
    {
        year: "1945",
        label: "IMF & World Bank",
        icon: "🏛️",
        color: "#34d399",
        desc:
            "27/12/1945: IMF (Quỹ Tiền tệ Quốc tế) và IBRD (World Bank) chính thức thành lập. Nhiệm vụ duy trì tỷ giá ổn định, cung cấp thanh khoản khẩn cấp.",
        detail:
            "IMF ban đầu có 29 thành viên. Mỗi nước nộp quota dựa trên GDP. Mỹ nắm 17.4% quyền biểu quyết, phủ quyết mọi quyết định lớn.",
    },
    {
        year: "1960s",
        label: "Khủng hoảng",
        icon: "📉",
        color: "#f97316",
        desc:
            "Mỹ chi tiêu quá mức cho Chiến tranh Việt Nam + Great Society, in thêm USD vượt dự trữ vàng. Các nước bắt đầu đổi USD lấy vàng dự trữ Fort Knox giảm mạnh.",
        detail:
            "Năm 1960 Mỹ còn 17.8 tỷ USD vàng, nhưng nước ngoài nắm 21 tỷ. Robert Triffin cảnh báo 'Triffin Dilemma': Ngân tín dụng toàn cầu bất khả thi và không bền vững.",
    },
    {
        year: "1971",
        label: "Nixon Shock",
        icon: "⚡",
        color: "#ef4444",
        desc:
            "15/8/1971: Tổng thống Nixon tuyên bố ngừng khả năng chuyển đổi USD sang vàng. Hệ thống Bretton Woods sụp đổ. Thế giới chuyển sang tỷ giá thả nổi (Fiat money).",
        detail:
            "Nixon ra quyết định bí mật không thông báo cho các đồng minh. G10 họp tại Smithsonian Institution 12/1971, phá giá USD 8%. Đến 1973, mọi nước chuyển sang tỷ giá thả nổi.",
    },
];

const QUOTES = [
    {
        text:
            "Nếu bạn nợ ngân hàng 100 pound, đó là vấn đề của bạn. Nếu bạn nợ ngân hàng 1 triệu pound, đó là vấn đề của ngân hàng.",
        author: "John Maynard Keynes",
        icon: "💡",
    },
    {
        text:
            "Ngân sách Dollar là ngân sách của chúng tôi, nhưng là vấn đề của các bạn.",
        author: "John Connally, Bộ trưởng Tài chính Mỹ, 1971",
        icon: "🇺🇸",
    },
    {
        text:
            "Hệ thống Bretton Woods là sự thỏa thuận nhân nhượng, thương mại phân tranh, tiền tệ phải ổn định.",
        author: "George C. Marshall",
        icon: "📜",
    },
];

const RESERVE_DATA = [
    { currency: "USD", pct: 58.9, color: "#3b82f6", flag: "🇺🇸" },
    { currency: "EUR", pct: 20.1, color: "#facc15", flag: "🇪🇺" },
    { currency: "JPY", pct: 5.7, color: "#f97316", flag: "🇯🇵" },
    { currency: "GBP", pct: 4.8, color: "#ef4444", flag: "🇬🇧" },
    { currency: "CNY", pct: 2.9, color: "#f87171", flag: "🇨🇳" },
    { currency: "Other", pct: 7.6, color: "#6b7280", flag: "🌍" },
];

const COMPARE_DATA = [
    {
        label: "Tỷ giá",
        bw: "Cố định (Fixed)",
        modern: "Thả nổi (Float)",
        bwColor: "#22c55e",
        modernColor: "#f97316",
    },
    {
        label: "Cơ sở tín dụng",
        bw: "Bản vị Vàng-USD",
        modern: "Tín phiếu ngân hàng (Fiat)",
        bwColor: "#fbbf24",
        modernColor: "#8b5cf6",
    },
    {
        label: "Ổn định",
        bw: "Cao (neo cứng)",
        modern: "Biến động thị trường",
        bwColor: "#38bdf8",
        modernColor: "#f87171",
    },
    {
        label: "Linh hoạt",
        bw: "Thấp (công thức)",
        modern: "Cao (điều chỉnh tự do)",
        bwColor: "#f87171",
        modernColor: "#22c55e",
    },
    {
        label: "Cơ quan điều hành",
        bw: "IMF + Mỹ",
        modern: "IMF + NHTW mỗi nước",
        bwColor: "#a78bfa",
        modernColor: "#34d399",
    },
];

// ── STAR FIELD (memoized) ──────────────────────────────────────────────────────
const STARS = [...Array(32)].map((_, i) => ({
    w: Math.random() * 3 + 0.8,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.45 + 0.1,
    dur: 2.5 + Math.random() * 3,
    delay: Math.random() * 3,
}));

// ── FLYING CURRENCY PARTICLE ──────────────────────────────────────────────────
function FlyingParticle({ trigger, collapsed }) {
    const items = collapsed
        ? ["💸", "❌", "⚠️", "📉", "💔", "🔥"]
        : ["💵", "🪙", "💰", "💵", "📈", "✨"];
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <AnimatePresence>
                {trigger > 0 && items.map((icon, i) => (
                    <motion.span
                        key={`${trigger}-${i}`}
                        className="absolute text-lg select-none"
                        style={{ left: `${10 + i * 14}%`, bottom: "20%" }}
                        initial={{ y: 0, opacity: 1, scale: 1 }}
                        animate={{ y: -150, opacity: 0, scale: 1.6, rotate: collapsed ? (i % 2 === 0 ? 30 : -30) : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 + i * 0.12, delay: i * 0.07, ease: "easeOut" }}
                    >
                        {icon}
                    </motion.span>
                ))}
            </AnimatePresence>
        </div>
    );
}

// ── 3-TIER FLOW SIMULATION ────────────────────────────────────────────────────
function ThreeTierFlow() {
    const [goldOunces, setGoldOunces] = useState(100);
    const [flowTrigger, setFlowTrigger] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [simStep, setSimStep] = useState(0);
    const [displayedUsd, setDisplayedUsd] = useState(0);
    const [displayedWorldUsd, setDisplayedWorldUsd] = useState(0);

    const usdNow = displayedUsd * 15; // estimated modern equivalent

    const handleFlow = () => {
        if (animating) return;
        setAnimating(true);
        setSimStep(1); // Gold phase

        setTimeout(() => {
            setSimStep(2); // USD phase
            setDisplayedUsd(goldOunces * 35);
            setFlowTrigger(t => t + 1); // Trigger USD particles
        }, 1200);

        setTimeout(() => {
            setSimStep(3); // World phase
            setDisplayedWorldUsd(goldOunces * 35);
        }, 2400);

        setTimeout(() => {
            setSimStep(4); // Done
        }, 3600);

        setTimeout(() => {
            setSimStep(0);
            setAnimating(false);
        }, 5000);
    };

    return (
        <div className="rounded-2xl border border-yellow-500/30 overflow-hidden mb-10"
            style={{ background: "rgba(13,20,50,0.85)", backdropFilter: "blur(14px)" }}>
            <div className="p-4 border-b border-yellow-500/20"
                style={{ background: "linear-gradient(90deg,#78350f,#b45309)" }}>
                <h2 className="text-base font-black text-white">🔄 Mô phỏng Hệ thống 3 Tầng</h2>
                <p className="text-amber-200 text-xs mt-0.5">Vàng → USD → Đồng tiền thế giới (Tỷ giá cố định 1944)</p>
            </div>
            <div className="p-5">
                {/* Slider */}
                <div className="mb-5">
                    <label className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2 block">
                        🥇 Nhập lượng vàng dự trữ: <span className="text-yellow-200 text-sm">{goldOunces} ounce</span>
                    </label>
                    <input
                        type="range" min="10" max="1000" step="10"
                        value={goldOunces}
                        onChange={e => {
                            setGoldOunces(Number(e.target.value));
                            setDisplayedUsd(0);
                            setDisplayedWorldUsd(0);
                        }}
                        disabled={animating}
                        className={`w-full accent-yellow-400 ${animating ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    />
                    <div className="flex justify-between text-white/30 text-xs mt-1">
                        <span>10 oz</span><span>1,000 oz</span>
                    </div>
                </div>

                {/* 3-tier flow diagram */}
                <div className="relative flex flex-col sm:flex-row items-center justify-between gap-2 mb-5">
                    {/* Tier 1: Gold */}
                    <motion.div
                        className="flex-1 rounded-xl border p-3 text-center relative overflow-hidden transition-all duration-300"
                        style={{
                            background: simStep === 1 ? "rgba(202,138,4,0.4)" : "rgba(120,80,0,0.35)",
                            borderColor: simStep === 1 ? "rgba(253,224,71,0.8)" : "rgba(250,204,21,0.5)",
                            boxShadow: simStep === 1 ? "0 0 20px rgba(250,204,21,0.4)" : "none"
                        }}
                        animate={simStep === 1 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                        transition={{ repeat: simStep === 1 ? Infinity : 0, duration: 1 }}
                    >
                        <div className="text-3xl mb-1">🥇</div>
                        <div className="text-yellow-300 font-black text-xs uppercase tracking-widest">Vàng</div>
                        <div className="text-white font-bold text-lg">{goldOunces.toLocaleString()}</div>
                        <div className="text-yellow-400/70 text-xs">ounce</div>
                        <div className="text-yellow-200/50 text-xs mt-1">= 35 USD/oz (1944)</div>
                    </motion.div>

                    {/* Arrow 1 */}
                    <div className="flex flex-col items-center sm:flex-row gap-1 px-1">
                        <motion.div
                            className="text-yellow-300 font-black text-lg hidden sm:block delay-100"
                            animate={simStep > 0 && simStep < 3 ? { x: [0, 8, 0], opacity: [0.5, 1, 0.5] } : { x: 0, opacity: 0.5 }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >→</motion.div>
                        <div className="text-yellow-300 font-black text-lg block sm:hidden">↓</div>
                        <div className="text-yellow-400/60 text-xs font-semibold whitespace-nowrap">× 35 USD</div>
                    </div>

                    {/* Tier 2: USD */}
                    <motion.div
                        className="flex-1 rounded-xl border p-3 text-center relative overflow-hidden transition-all duration-300"
                        style={{
                            background: simStep === 2 ? "rgba(37,99,235,0.4)" : "rgba(30,50,120,0.45)",
                            borderColor: simStep === 2 ? "rgba(96,165,250,0.8)" : "rgba(96,165,250,0.5)",
                            boxShadow: simStep === 2 ? "0 0 20px rgba(59,130,246,0.5)" : "none"
                        }}
                        animate={simStep === 2 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                        transition={{ repeat: simStep === 2 ? Infinity : 0, duration: 1 }}
                    >
                        <FlyingParticle trigger={flowTrigger} collapsed={false} />
                        <div className="text-3xl mb-1">💵</div>
                        <div className="text-blue-300 font-black text-xs uppercase tracking-widest">USD</div>
                        <div className="text-white font-bold text-lg">{displayedUsd > 0 ? displayedUsd.toLocaleString() : "---"}</div>
                        <div className="text-blue-400/70 text-xs">USD (1944)</div>
                        <div className="text-blue-200/50 text-xs mt-1">≈ ${displayedUsd > 0 ? usdNow.toLocaleString() : "---"} ngày nay</div>
                    </motion.div>

                    {/* Arrow 2 */}
                    <div className="flex flex-col items-center sm:flex-row gap-1 px-1">
                        <motion.div
                            className="text-blue-300 font-black text-lg hidden sm:block"
                            animate={simStep > 1 && simStep < 4 ? { x: [0, 8, 0], opacity: [0.5, 1, 0.5] } : { x: 0, opacity: 0.5 }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >→</motion.div>
                        <div className="text-blue-300 font-black text-lg block sm:hidden">↓</div>
                        <div className="text-blue-400/60 text-xs font-semibold whitespace-nowrap">Tỷ giá cố định</div>
                    </div>

                    {/* Tier 3: World Currencies */}
                    <motion.div
                        className="flex-1 rounded-xl border p-3 text-center transition-all duration-300"
                        style={{
                            background: simStep === 3 ? "rgba(5,150,105,0.4)" : "rgba(0,60,40,0.45)",
                            borderColor: simStep === 3 ? "rgba(52,211,153,0.8)" : "rgba(52,211,153,0.5)",
                            boxShadow: simStep === 3 ? "0 0 20px rgba(16,185,129,0.5)" : "none"
                        }}
                        animate={simStep === 3 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                        transition={{ repeat: simStep === 3 ? Infinity : 0, duration: 1 }}
                    >
                        <div className="flex justify-center gap-1 text-xl mb-1">🇬🇧🇯🇵🇫🇷</div>
                        <div className="text-emerald-300 font-black text-xs uppercase tracking-widest">Tiền thế giới</div>
                        <div className="grid grid-cols-2 gap-x-1 gap-y-1.5 mt-2">
                            {CURRENCIES.slice(0, 4).map(c => (
                                <div key={c.code} className="text-[10px] sm:text-xs text-white/80 text-left flex items-center justify-between">
                                    <span className="flex-shrink-0" title={c.name}>{c.flag}</span>
                                    <span className="font-bold text-white tracking-widest ml-1">{displayedWorldUsd > 0 ? (displayedWorldUsd / c.rate).toFixed(0) : "---"}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <button
                    onClick={handleFlow}
                    disabled={animating}
                    className="w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all duration-300"
                    style={{
                        background: simStep === 1 ? "#ca8a04" :
                            simStep === 2 ? "#2563eb" :
                                simStep === 3 ? "#059669" :
                                    simStep === 4 ? "#16a34a" :
                                        "linear-gradient(90deg,#b45309,#d97706)",
                        color: "white",
                        cursor: animating ? "not-allowed" : "pointer"
                    }}
                >
                    {simStep === 1 ? "🥇 Đang lượng hóa Vàng dự trữ..." :
                        simStep === 2 ? "💵 Đang in USD tương ứng..." :
                            simStep === 3 ? "🌍 Đang neo tỷ giá toàn cầu..." :
                                simStep === 4 ? "✨ Hoàn tất chu trình dòng chảy tiền tệ" :
                                    "▶ Bắt đầu mô phỏng quy trình"}
                </button>
            </div>
        </div>
    );
}

// ── NIXON SHOCK SIMULATION ────────────────────────────────────────────────────
function NixonShock() {
    const [usdSupply, setUsdSupply] = useState(35);
    const [collapsed, setCollapsed] = useState(false);
    const [shaking, setShaking] = useState(false);
    const [particleTrigger, setParticleTrigger] = useState(0);

    const goldBacking = 35; // USD per ounce gold — fixed
    const coverageRatio = Math.min(100, Math.round((goldBacking / usdSupply) * 100));
    const isUnstable = usdSupply > 70;
    const isCritical = usdSupply > 90;
    const isCollapsed = usdSupply >= 100;

    useEffect(() => {
        if (isCollapsed && !collapsed) {
            setShaking(true);
            setParticleTrigger(t => t + 1);
            setTimeout(() => {
                setCollapsed(true);
                setShaking(false);
            }, 800);
        }
        if (!isCollapsed && collapsed) {
            setCollapsed(false);
        }
    }, [isCollapsed]);

    const statusColor = isCritical ? "#ef4444" : isUnstable ? "#f97316" : "#22c55e";
    const statusLabel = isCollapsed
        ? "💥 HỆ THỐNG SỤP ĐỔ — NIXON SHOCK 1971"
        : isCritical ? "🚨 KHỦNG HOẢNG NGHIÊM TRỌNG"
            : isUnstable ? "⚠️ HỆ THỐNG MẤT ỔN ĐỊNH"
                : "✓ HỆ THỐNG ỔN ĐỊNH";

    return (
        <motion.div
            className="rounded-2xl border overflow-hidden mb-10 relative"
            style={{
                borderColor: isCollapsed ? "#ef444480" : isUnstable ? "#f9741680" : "#22c55e50",
                background: isCollapsed
                    ? "linear-gradient(135deg,rgba(80,0,0,0.9),rgba(30,0,0,0.95))"
                    : "rgba(5,15,40,0.90)",
                backdropFilter: "blur(14px)",
                transition: "all 0.5s"
            }}
            animate={shaking ? {
                x: [-6, 6, -5, 5, -3, 3, 0],
                y: [-2, 2, -2, 2, 0],
            } : {}}
            transition={shaking ? { duration: 0.7, ease: "easeOut" } : {}}
        >
            {/* Header */}
            <div className="p-4 border-b"
                style={{
                    borderColor: isCollapsed ? "#ef444430" : "#1e40af40",
                    background: isCollapsed
                        ? "linear-gradient(90deg,#7f1d1d,#991b1b)"
                        : "linear-gradient(90deg,#1e3a8a,#1d4ed8)"
                }}>
                <h2 className="text-base font-black text-white">💥 Mô phỏng "Cú sốc Nixon" (Nixon Shock)</h2>
                <p className="text-blue-200 text-xs mt-0.5">Kéo slider để tăng lượng USD in thêm — quan sát hệ thống sụp đổ</p>
            </div>

            <div className="p-5 relative">
                <FlyingParticle trigger={particleTrigger} collapsed={isCollapsed} />

                {/* Status Badge */}
                <motion.div
                    className="text-center font-black text-sm py-2 px-4 rounded-xl mb-5"
                    style={{ background: `${statusColor}22`, border: `1px solid ${statusColor}55`, color: statusColor }}
                    animate={isCritical ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                >
                    {statusLabel}
                </motion.div>

                {/* Visual: Gold vs USD */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="rounded-xl p-3 text-center border border-yellow-400/30"
                        style={{ background: "rgba(120,80,0,0.25)" }}>
                        <div className="text-2xl mb-1">🥇</div>
                        <div className="text-yellow-300 text-xs font-bold uppercase">Dự trữ Vàng</div>
                        <div className="text-white font-black text-xl">{goldBacking}</div>
                        <div className="text-yellow-400/60 text-xs">USD/oz (cố định)</div>
                        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: "100%" }} />
                        </div>
                    </div>
                    <motion.div
                        className="rounded-xl p-3 text-center border"
                        style={{
                            background: `${statusColor}18`,
                            borderColor: `${statusColor}44`
                        }}
                    >
                        <div className="text-2xl mb-1">{isCollapsed ? "📉" : "💵"}</div>
                        <div className="text-xs font-bold uppercase" style={{ color: statusColor }}>USD Lưu thông</div>
                        <div className="text-white font-black text-xl">{usdSupply}</div>
                        <div className="text-xs opacity-60" style={{ color: statusColor }}>USD/oz (thực tế)</div>
                        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg,${statusColor}99,${statusColor})` }}
                                animate={{ width: `${(usdSupply / 100) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Coverage Ratio Meter */}
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-white/60 font-semibold">Tỷ lệ bảo chứng vàng</span>
                        <span className="text-sm font-black" style={{ color: statusColor }}>{coverageRatio}%</span>
                    </div>
                    <div className="h-4 rounded-full bg-white/5 overflow-hidden relative">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg,#22c55e,${statusColor})` }}
                            animate={{ width: `${coverageRatio}%` }}
                            transition={{ duration: 0.4 }}
                        />
                        {/* Threshold line */}
                        <div className="absolute top-0 h-full border-r-2 border-white/50 border-dashed"
                            style={{ left: "50%" }} />
                        <div className="absolute -top-5 text-white/40 text-xs" style={{ left: "48%" }}>50% nguy hiểm</div>
                    </div>
                </div>

                {/* Slider */}
                <label className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2 block">
                    🖨️ In thêm USD: <span className="text-white text-sm">{usdSupply} USD/oz</span>
                    {usdSupply >= 100 && <span className="text-red-400 ml-2">— Vượt ngưỡng bảo chứng!</span>}
                </label>
                <input
                    type="range" min="35" max="100" step="1"
                    value={usdSupply}
                    onChange={e => setUsdSupply(Number(e.target.value))}
                    className="w-full cursor-pointer mb-2"
                    style={{ accentColor: statusColor }}
                />
                <div className="flex justify-between text-xs text-white/30">
                    <span>35 (Ổn định 1944)</span>
                    <span className="text-orange-400">70 (Bất ổn)</span>
                    <span className="text-red-400">100 (Nixon Shock!)</span>
                </div>

                {/* Collapse Panel */}
                <AnimatePresence>
                    {isCollapsed && (
                        <motion.div
                            className="mt-5 rounded-xl border border-red-500/50 p-4"
                            style={{ background: "rgba(127,29,29,0.4)" }}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-red-400 font-black text-sm mb-2">📺 15/8/1971 — Nixon tuyên bố:</div>
                            <p className="text-red-200 text-xs leading-relaxed italic">
                                "I have directed Secretary Connally to suspend temporarily the convertibility of the dollar into gold or other reserve assets..."
                            </p>
                            <div className="mt-3 pt-3 border-t border-red-500/30 text-xs text-white/60">
                                ✦ Bretton Woods chính thức kết thúc · Thế giới chuyển sang <strong className="text-white">Fiat Money</strong> · USD vẫn thống trị toàn cầu
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ── COUNTRIES GRID ────────────────────────────────────────────────────────────
function CountriesSection() {
    const [hovered, setHovered] = useState(null);
    return (
        <motion.section
            className="mb-10 rounded-2xl border border-blue-700/30 overflow-hidden"
            style={{ background: "rgba(10,15,50,0.85)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
            <div className="p-4 border-b border-blue-700/30"
                style={{ background: "linear-gradient(90deg,#1e3a8a99,#1d4ed899)" }}>
                <h2 className="text-base font-black text-white">🌐 44 Quốc gia Tham gia (1944)</h2>
                <p className="text-blue-300 text-xs mt-0.5">Hover/click để xem cách neo tỷ giá vào USD</p>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {COUNTRIES_44.map((c, i) => (
                        <motion.button
                            key={c.name}
                            className="relative rounded-xl p-2.5 text-center border transition-all duration-200 focus:outline-none"
                            style={{
                                borderColor: hovered === i ? c.color : "rgba(255,255,255,0.08)",
                                background: hovered === i ? `${c.color}22` : "rgba(255,255,255,0.03)",
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => setHovered(hovered === i ? null : i)}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <div className="text-2xl mb-0.5">{c.flag}</div>
                            <div className="text-white text-xs font-bold leading-tight">{c.name}</div>
                            <AnimatePresence>
                                {hovered === i && (
                                    <motion.div
                                        className="absolute left-0 right-0 bottom-full mb-1 z-20 rounded-xl p-2 shadow-xl text-left"
                                        style={{
                                            background: `linear-gradient(135deg,${c.color}33,rgba(10,15,50,0.97))`,
                                            border: `1px solid ${c.color}66`,
                                            minWidth: "160px"
                                        }}
                                        initial={{ opacity: 0, y: 6, scale: 0.93 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.93 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="text-xs font-bold mb-0.5" style={{ color: c.color }}>{c.flag} {c.name}</div>
                                        <div className="text-white/70 text-xs leading-relaxed">{c.role}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                    {/* Remaining count */}
                    <div className="rounded-xl p-2.5 text-center border border-white/10 flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div>
                            <div className="text-2xl mb-0.5">🌏</div>
                            <div className="text-white/40 text-xs">+26 nước khác</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

// ── TIMELINE ──────────────────────────────────────────────────────────────────
function Timeline() {
    const [active, setActive] = useState(0);
    return (
        <motion.section
            className="mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        >
            <h2 className="text-center text-base font-bold text-yellow-300 uppercase tracking-widest mb-5">
                ⏱ Trục thời gian lịch sử
            </h2>
            {/* Timeline dots */}
            <div className="relative flex items-start justify-between gap-1 overflow-x-auto pb-2 mb-4">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 mx-8" />
                {TIMELINE_EVENTS.map((t, i) => (
                    <div key={t.year} className="relative flex flex-col items-center flex-1 min-w-[72px] z-10">
                        <button
                            onMouseEnter={() => setActive(i)}
                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-black transition-all duration-300 focus:outline-none"
                            style={{
                                borderColor: t.color,
                                background: active === i ? t.color : "rgba(5,10,30,0.9)",
                                color: active === i ? "#000" : t.color,
                                boxShadow: active === i ? `0 0 18px ${t.color}99` : undefined,
                            }}
                        >
                            {t.icon}
                        </button>
                        <div className="mt-2 text-xs font-bold" style={{ color: t.color }}>{t.year}</div>
                        <div className="text-white/40 text-xs text-center px-1">{t.label}</div>
                    </div>
                ))}
            </div>
            <AnimatePresence mode="wait">
                {active !== null && (
                    <motion.div
                        key={active}
                        className="rounded-xl p-4 border"
                        style={{
                            borderColor: TIMELINE_EVENTS[active].color + "50",
                            background: `${TIMELINE_EVENTS[active].color}10`,
                            backdropFilter: "blur(8px)"
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="flex gap-3">
                            <div className="text-3xl">{TIMELINE_EVENTS[active].icon}</div>
                            <div>
                                <span className="font-black text-sm" style={{ color: TIMELINE_EVENTS[active].color }}>
                                    {TIMELINE_EVENTS[active].year} — {TIMELINE_EVENTS[active].label}:{" "}
                                </span>
                                <p className="text-blue-100 text-sm leading-relaxed mt-1">{TIMELINE_EVENTS[active].desc}</p>
                                <p className="text-white/50 text-xs leading-relaxed mt-2 italic">{TIMELINE_EVENTS[active].detail}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

// ── RESERVE BAR CHART ─────────────────────────────────────────────────────────
function ReserveChart() {
    return (
        <motion.section
            className="mb-10 rounded-2xl border border-blue-700/30 overflow-hidden"
            style={{ background: "rgba(5,12,40,0.88)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        >
            <div className="p-4 border-b border-blue-700/30"
                style={{ background: "linear-gradient(90deg,#1e3a8a80,#1d4ed860)" }}>
                <h2 className="text-base font-black text-white">📊 Thống trị USD trong Dự trữ Ngoại hối Toàn cầu (2024)</h2>
                <p className="text-blue-300 text-xs mt-0.5">Di sản từ Bretton Woods — USD vẫn chiếm ~60% dự trữ thế giới</p>
            </div>
            <div className="p-4 flex flex-col gap-3">
                {RESERVE_DATA.map((item, i) => (
                    <motion.div key={item.currency}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.08 }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{item.flag}</span>
                            <span className="text-white text-xs font-bold w-12">{item.currency}</span>
                            <span className="text-white/40 text-xs ml-auto">{item.pct}%</span>
                        </div>
                        <div className="h-3.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: item.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.pct}%` }}
                                transition={{ duration: 0.9, delay: 0.75 + i * 0.08, ease: "easeOut" }}
                            />
                        </div>
                    </motion.div>
                ))}
                <p className="text-white/30 text-xs mt-1 text-right italic">Nguồn: IMF COFER Q3/2024 (ước tính)</p>
            </div>
        </motion.section>
    );
}

// ── COMPARISON CARD ───────────────────────────────────────────────────────────
function CompareCard() {
    return (
        <motion.section
            className="mb-10 rounded-2xl border border-purple-700/30 overflow-hidden"
            style={{ background: "rgba(10,5,35,0.88)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        >
            <div className="p-4 border-b border-purple-700/30"
                style={{ background: "linear-gradient(90deg,#4a1d9680,#6d28d960)" }}>
                <h2 className="text-base font-black text-white">⚖️ So sánh: Bretton Woods vs Hệ thống Hiện đại</h2>
            </div>
            <div className="p-4 overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr>
                            <th className="text-left text-white/40 font-semibold py-2 pr-3 w-28">Tiêu chí</th>
                            <th className="text-center text-yellow-300 font-black pb-2 px-2">🏛️ Bretton Woods<br /><span className="font-normal text-white/40">(1944–1971)</span></th>
                            <th className="text-center text-purple-300 font-black pb-2 px-2">🌐 Hệ thống hiện nay<br /><span className="font-normal text-white/40">(1973–nay)</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPARE_DATA.map((row, i) => (
                            <motion.tr
                                key={row.label}
                                className="border-t border-white/5"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.75 + i * 0.08 }}
                            >
                                <td className="py-2.5 pr-3 text-white/50 font-semibold">{row.label}</td>
                                <td className="py-2.5 px-2 text-center">
                                    <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold"
                                        style={{ background: `${row.bwColor}20`, color: row.bwColor, border: `1px solid ${row.bwColor}40` }}>
                                        {row.bw}
                                    </span>
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                    <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold"
                                        style={{ background: `${row.modernColor}20`, color: row.modernColor, border: `1px solid ${row.modernColor}40` }}>
                                        {row.modern}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.section>
    );
}

// ── QUOTES ────────────────────────────────────────────────────────────────────
function QuotesSection() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = left swipe (next), -1 = right swipe (prev)

    const goTo = (index, dir) => {
        setDirection(dir);
        setCurrent((index + QUOTES.length) % QUOTES.length);
    };

    const handleDragEnd = (_, info) => {
        const threshold = 50; // px minimum swipe distance
        if (info.offset.x < -threshold) {
            goTo(current + 1, 1);   // swipe left → next
        } else if (info.offset.x > threshold) {
            goTo(current - 1, -1);  // swipe right → prev
        }
    };

    const variants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
    };

    return (
        <motion.section
            className="mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        >
            <h2 className="text-center text-base font-bold text-yellow-300 uppercase tracking-widest mb-4">
                💬 Trích dẫn nổi tiếng
            </h2>

            <div className="relative rounded-2xl border border-yellow-500/25 overflow-hidden"
                style={{ background: "rgba(30,20,5,0.85)", backdropFilter: "blur(12px)" }}>

                {/* Drag hint */}
                <div className="absolute top-3 right-4 text-yellow-400/30 text-xs font-medium select-none pointer-events-none">
                    ← kéo →
                </div>

                {/* Large decorative quote mark */}
                <div className="absolute top-4 left-5 text-6xl text-yellow-400/15 font-serif leading-none select-none pointer-events-none">"</div>

                {/* Prev / Next arrows */}
                <button
                    onClick={() => goTo(current - 1, -1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-400/20 text-yellow-300/60 hover:text-yellow-300 transition-all focus:outline-none"
                >‹</button>
                <button
                    onClick={() => goTo(current + 1, 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-400/20 text-yellow-300/60 hover:text-yellow-300 transition-all focus:outline-none"
                >›</button>

                {/* Draggable content */}
                <div className="overflow-hidden px-10 pt-8 pb-6">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.32, ease: "easeInOut" }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.18}
                            onDragEnd={handleDragEnd}
                            className="relative z-10 cursor-grab active:cursor-grabbing select-none"
                        >
                            <div className="text-3xl mb-3 text-center">{QUOTES[current].icon}</div>
                            <p className="text-yellow-100 text-sm sm:text-base leading-relaxed text-center italic mb-3">
                                "{QUOTES[current].text}"
                            </p>
                            <div className="text-yellow-400/70 text-xs text-center font-semibold uppercase tracking-widest">
                                — {QUOTES[current].author}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Nav dots */}
                <div className="flex justify-center gap-2 pb-4">
                    {QUOTES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i, i > current ? 1 : -1)}
                            className="rounded-full transition-all duration-300 focus:outline-none"
                            style={{
                                width: current === i ? "20px" : "8px",
                                height: "8px",
                                background: current === i ? "#fbbf24" : "rgba(255,255,255,0.2)",
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
}

// ── CORE IDEAS ────────────────────────────────────────────────────────────────
const CORE_IDEAS = [
    {
        id: "tiente",
        label: "Tiền tệ quốc tế",
        icon: "💱",
        border: "border-blue-400",
        bg: "bg-blue-900/40",
        desc:
            "Vai trò tiền tệ trong trao đổi quốc tế: phương tiện thanh toán, dự trữ và tích lũy.",
        borderColor: "#3b82f6",
    },
    {
        id: "banvivang",
        label: "Bản vị vàng",
        icon: "🥇",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc:
            "Hệ thống tiền tệ dựa trên vàng đảm bảo giá trị ổn định qua dự trữ vàng quốc gia.",
        borderColor: "#fbbf24",
    },
    {
        id: "imfworldbank",
        label: "IMF và World Bank",
        icon: "🏛️",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc:
            "Tổ chức ổn định tài chính toàn cầu, hỗ trợ hội nhập và phát triển kinh tế quốc tế.",
        borderColor: "#34d399",
    },
    {
        id: "hoinhapkinhte",
        label: "Hội nhập kinh tế",
        icon: "🔗",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc:
            "Liên kết kinh tế quốc tế thúc đẩy thương mại, ổn định tiền tệ và phân công lao động quốc tế.",
        borderColor: "#a78bfa",
    },
    {
        id: "tygiahoidoi",
        label: "Tỷ giá hối đoái",
        icon: "📈",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc:
            "Chuyển đổi giá trị tiền tệ quốc tế, ảnh hưởng đến giá trị hàng hóa và cán cân thương mại.",
        borderColor: "#38bdf8",
    },
];


// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function BrettonWoodsPage() {
    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{
                background: "linear-gradient(135deg,#0a0f2e 0%,#111827 40%,#0a0f2e 100%)",
                fontFamily: "'Segoe UI',system-ui,sans-serif",
            }}
        >
            {/* Starfield */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {STARS.map((s, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-yellow-200"
                        style={{ width: s.w, height: s.w, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
                        animate={{ opacity: [s.opacity, s.opacity * 3, s.opacity] }}
                        transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 pb-20">

                {/* ── Return ── */}
                <div className="pt-6 mb-2">
                    <Link to="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-sm">
                        ← Về Trang Chủ
                    </Link>
                </div>

                {/* ── HEADER ── */}
                <motion.header className="text-center pt-6 pb-8"
                    initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div
                        className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1 text-yellow-300 text-sm font-semibold mb-4 tracking-widest uppercase"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        📅 Tháng 7 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2"
                        style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 7: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Hệ thống Bretton Woods
                        </span>
                    </motion.h1>
                </motion.header>

                {/* ── EVENT CARD ── */}
                <motion.section className="rounded-2xl border border-blue-500/30 p-6 mb-8 relative overflow-hidden"
                    style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl"
                        style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-6xl">🏛️</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">Tháng 7, 1944 · New Hampshire, Mỹ</div>
                            <h2 className="text-xl font-bold text-white mb-2">Hệ thống Bretton Woods — Nền tảng tài chính toàn cầu</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Hội nghị <strong className="text-yellow-300">Bretton Woods</strong> diễn ra từ <strong className="text-white">1-22/7/1944</strong> tại New Hampshire, Mỹ với 44 quốc gia tham gia. Thiết lập hệ thống tiền tệ quốc tế dựa trên bản vị vàng – USD: <strong className="text-yellow-300">1 ounce vàng = 35 USD</strong> cố định. Tất cả tiền tệ khác neo vào USD với biên độ dao động ±1%.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Kết quả: Thành lập <strong className="text-emerald-300">IMF</strong> (Quỹ Tiền tệ Quốc tế) ổn định tỷ giá và <strong className="text-emerald-300">World Bank</strong> (Ngân hàng Thế giới) tài trợ phát triển. Hệ thống thống trị đến 1971 (Nixon Shock) rồi chuyển sang tỷ giá thả nổi. Đây là đỉnh cao của bản vị vàng – USD, phản ánh vị thế cường quốc kinh tế của Mỹ sau Thế chiến II.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* ── 3-TIER SIMULATION ── */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                    <ThreeTierFlow />
                </motion.div>

                {/* ── NIXON SHOCK ── */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <NixonShock />
                </motion.div>

                {/* ── TIMELINE ── */}
                <Timeline />

                {/* ── 44 COUNTRIES ── */}
                <CountriesSection />

                {/* ── RESERVE CHART ── */}
                <ReserveChart />

                {/* ── COMPARISON ── */}
                <CompareCard />

                {/* ── CORE IDEAS ── */}
                <motion.section className="mb-10"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-5">
                        ✦ Tư tưởng cốt lõi ✦
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {CORE_IDEAS.map((idea, i) => (
                            <motion.div key={idea.id}
                                className={`rounded-xl border ${idea.border} ${idea.bg} p-4 flex gap-3 items-start`}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + i * 0.09 }}
                                whileHover={{ scale: 1.02 }}>
                                <div className="text-2xl flex-shrink-0">{idea.icon}</div>
                                <div>
                                    <div className="font-bold text-white text-sm mb-1">{idea.label}</div>
                                    <div className="text-blue-300 text-xs leading-relaxed">{idea.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* ── QUOTES ── */}
                <QuotesSection />

                {/* ── VIDEO EMBED ── */}
                <motion.section className="mt-20 pt-16 border-t border-slate-800 pb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 p-2 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-700/50 bg-black">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/6U0GpAxx5BU"
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
