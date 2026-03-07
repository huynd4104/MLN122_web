import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const MONTHS = [
    { id: 1, title: "Kỷ nguyên đồng Euro", emoji: "💶", tag: "Tiền tệ", year: "2002" },
    { id: 2, title: "Tuyên ngôn Đảng Cộng sản", emoji: "📕", tag: "Chính trị", year: "1848" },
    { id: 3, title: "Khủng hoảng Ngân hàng Mỹ", emoji: "🏦", tag: "Tài chính", year: "2008" },
    { id: 4, title: "Cách mạng Công nghiệp 4.0", emoji: "🤖", tag: "Công nghệ", year: "2016" },
    { id: 5, title: "Ngày Quốc tế Lao động", emoji: "✊", tag: "Xã hội", year: "1886" },
    { id: 6, title: "Kế hoạch Marshall", emoji: "🇺🇸", tag: "Địa chính trị", year: "1948" },
    { id: 7, title: "Hệ thống Bretton Woods", emoji: "🏛️", tag: "Tài chính", year: "1944" },
    { id: 8, title: "Cú sốc Nixon", emoji: "📺", tag: "Chính sách", year: "1971" },
    { id: 9, title: "Sụp đổ Lehman Brothers", emoji: "🏦", tag: "Khủng hoảng", year: "2008" },
    { id: 10, title: "Thứ Năm Đen Tối 1929", emoji: "💥", tag: "Khủng hoảng", year: "1929" },
    { id: 11, title: "Ngày Độc thân Alibaba", emoji: "🛍️", tag: "Thương mại", year: "2009" },
    { id: 12, title: "Việt Nam gia nhập WTO", emoji: "🇻🇳", tag: "Hội nhập", year: "2007" },
];

const TAG_COLORS = {
    "Tiền tệ": { dot: "#60a5fa", bg: "rgba(96,165,250,0.12)", text: "#93c5fd" },
    "Chính trị": { dot: "#f87171", bg: "rgba(248,113,113,0.12)", text: "#fca5a5" },
    "Tài chính": { dot: "#34d399", bg: "rgba(52,211,153,0.12)", text: "#6ee7b7" },
    "Công nghệ": { dot: "#818cf8", bg: "rgba(129,140,248,0.12)", text: "#a5b4fc" },
    "Xã hội": { dot: "#fb923c", bg: "rgba(251,146,60,0.12)", text: "#fdba74" },
    "Địa chính trị": { dot: "#38bdf8", bg: "rgba(56,189,248,0.12)", text: "#7dd3fc" },
    "Chính sách": { dot: "#e879f9", bg: "rgba(232,121,249,0.12)", text: "#f0abfc" },
    "Khủng hoảng": { dot: "#fb7185", bg: "rgba(251,113,133,0.12)", text: "#fda4af" },
    "Thương mại": { dot: "#facc15", bg: "rgba(250,204,21,0.12)", text: "#fde047" },
    "Hội nhập": { dot: "#4ade80", bg: "rgba(74,222,128,0.12)", text: "#86efac" },
};

function MonthCard({ month, index }) {
    const [hovered, setHovered] = useState(false);
    const tagStyle = TAG_COLORS[month.tag] || { dot: "#94a3b8", bg: "rgba(148,163,184,0.12)", text: "#cbd5e1" };
    const pad = String(month.id).padStart(2, "0");

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 + 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="h-full"
        >
            <Link to={`/thang${month.id}`} className="block h-full focus:outline-none">
                <motion.div
                    animate={{ y: hovered ? -6 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        height: "100%",
                        borderRadius: "20px",
                        background: hovered
                            ? "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
                            : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                        border: hovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
                        boxShadow: hovered
                            ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)"
                            : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        transition: "background 0.35s ease, border 0.35s ease, box-shadow 0.35s ease",
                        position: "relative",
                        overflow: "hidden",
                        padding: "28px 24px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0",
                        cursor: "pointer",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    {/* Subtle noise grain overlay */}
                    <div style={{
                        position: "absolute", inset: 0, borderRadius: "20px",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
                        pointerEvents: "none", opacity: 0.4,
                    }} />

                    {/* Glow accent on hover */}
                    <motion.div
                        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            position: "absolute", top: "-40px", right: "-40px",
                            width: "140px", height: "140px",
                            background: `radial-gradient(circle, ${tagStyle.dot}30 0%, transparent 70%)`,
                            borderRadius: "50%", pointerEvents: "none",
                        }}
                    />

                    {/* Top row: month number + tag */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                        <span style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.25)",
                            textTransform: "uppercase",
                        }}>
                            {pad}
                        </span>
                        <span style={{
                            fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: tagStyle.text,
                            background: tagStyle.bg,
                            padding: "3px 10px",
                            borderRadius: "100px",
                            border: `1px solid ${tagStyle.dot}30`,
                        }}>
                            {month.tag}
                        </span>
                    </div>

                    {/* Emoji */}
                    <motion.div
                        animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 5 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            fontSize: "44px", lineHeight: 1,
                            marginBottom: "18px",
                            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
                            position: "relative", zIndex: 1,
                            display: "inline-block",
                        }}
                    >
                        {month.emoji}
                    </motion.div>

                    {/* Divider */}
                    <div style={{
                        width: hovered ? "48px" : "24px",
                        height: "1.5px",
                        background: `linear-gradient(90deg, ${tagStyle.dot}, transparent)`,
                        marginBottom: "14px",
                        transition: "width 0.35s ease",
                        position: "relative", zIndex: 1,
                    }} />

                    {/* Title */}
                    <div style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: "rgba(255,255,255,0.9)",
                        position: "relative", zIndex: 1,
                        flexGrow: 1,
                        letterSpacing: "-0.01em",
                    }}>
                        {month.title}
                    </div>

                    {/* Bottom: year + arrow */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginTop: "16px", position: "relative", zIndex: 1,
                    }}>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.2)",
                            letterSpacing: "0.1em",
                        }}>
                            {month.year}
                        </span>
                        <motion.span
                            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.3 }}
                            transition={{ duration: 0.25 }}
                            style={{ color: tagStyle.text, fontSize: "16px", lineHeight: 1 }}
                        >
                            →
                        </motion.span>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

export default function Home() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #020510 0%, #060d1f 40%, #020812 100%)",
            fontFamily: "'Inter', system-ui, sans-serif",
            color: "white",
            overflowX: "hidden",
            position: "relative",
        }}>
            {/* Background grid pattern */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
                backgroundSize: "60px 60px",
            }} />

            {/* Ambient orbs */}
            <div style={{
                position: "fixed", top: "-200px", left: "-200px", width: "600px", height: "600px",
                background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
                borderRadius: "50%", pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{
                position: "fixed", bottom: "-200px", right: "-100px", width: "500px", height: "500px",
                background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
                borderRadius: "50%", pointerEvents: "none", zIndex: 0,
            }} />

            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px 80px", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ marginBottom: "64px" }}
                >
                    {/* Eyebrow */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px",
                    }}>
                        <div style={{ width: "32px", height: "1px", background: "rgba(255,255,255,0.2)" }} />
                        <span style={{
                            fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em",
                            textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
                        }}>
                            Lịch sử Kinh tế Thế giới
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(36px, 5vw, 64px)",
                        fontWeight: 700,
                        lineHeight: 1.08,
                        letterSpacing: "-0.03em",
                        color: "white",
                        marginBottom: "20px",
                        maxWidth: "700px",
                    }}>
                        12 Tháng
                        <br />
                        <span style={{
                            background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.15))",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            Học tập Tương tác
                        </span>
                    </h1>

                    <p style={{
                        fontSize: "15px", color: "rgba(255,255,255,0.35)",
                        maxWidth: "480px", lineHeight: 1.7, fontWeight: 400,
                    }}>
                        Khám phá các sự kiện kinh tế quan trọng đã định hình thế giới hiện đại qua 12 chủ đề học tập chuyên sâu.
                    </p>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                        display: "flex", gap: "0",
                        marginBottom: "48px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.02)",
                        maxWidth: "520px",
                    }}
                >
                    {[
                        { num: "12", label: "Chủ đề" },
                        { num: "6", label: "Danh mục" },
                        { num: "200+", label: "Năm lịch sử" },
                    ].map((s, i) => (
                        <div key={i} style={{
                            flex: 1, padding: "18px 20px",
                            borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        }}>
                            <div style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: "22px", fontWeight: 700, color: "white", lineHeight: 1,
                            }}>{s.num}</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px", letterSpacing: "0.05em" }}>{s.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "16px",
                }}>
                    {MONTHS.map((month, index) => (
                        <MonthCard key={month.id} month={month} index={index} />
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    style={{
                        marginTop: "80px",
                        paddingTop: "32px",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                    }}
                >
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
                        © {new Date().getFullYear()} · Hệ thống học tập tương tác
                    </span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em" }}>
                        12 chủ đề · Lịch sử Kinh tế Thế giới
                    </span>
                </motion.div>
            </div>
        </div>
    );
}