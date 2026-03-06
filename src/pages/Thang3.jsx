import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CORE_IDEAS = [
    {
        id: "canh_tranh",
        label: "Cạnh tranh tự do",
        icon: "🏆",
        border: "border-red-400",
        bg: "bg-red-900/40",
        desc: "Cạnh tranh giữa các doanh nghiệp dẫn đến cải tiến sản xuất nhưng cũng gây hỗn loạn (theo giáo trình: Cạnh tranh thúc đẩy lực lượng sản xuất nhưng dẫn đến khủng hoảng).",
        borderColor: "#f56565",
    },
    {
        id: "doc_quyen",
        label: "Độc quyền",
        icon: "�",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc: "Tập trung sản xuất dẫn đến độc quyền, kiểm soát thị trường (theo giáo trình: Độc quyền thay thế cạnh tranh tự do trong chủ nghĩa tư bản).",
        borderColor: "#fbbf24",
    },
    {
        id: "khung_hoang",
        label: "Khủng hoảng kinh tế",
        icon: "📉",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc: "Khủng hoảng chu kỳ do mâu thuẫn sản xuất - tiêu dùng (theo giáo trình: Khủng hoảng trong chủ nghĩa tư bản do sản xuất dư thừa).",
        borderColor: "#34d399",
    },
    {
        id: "nha_nuoc",
        label: "Vai trò Nhà nước",
        icon: "🏛️",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc: "Nhà nước can thiệp để ổn định thị trường thất bại (theo giáo trình: Nhà nước tư bản điều tiết kinh tế để giảm khủng hoảng).",
        borderColor: "#c084fc",
    },
    {
        id: "thi_truong",
        label: "Thị trường thất bại",
        icon: "⚠️",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc: "Thị trường tự do không giải quyết được độc quyền và khủng hoảng (theo giáo trình: Cần Nhà nước can thiệp khi thị trường thất bại).",
        borderColor: "#38bdf8",
    },
];

const SITUATIONS = [
    {
        id: 1,
        question: "Ngân hàng đang gặp khủng hoảng rút tiền hàng loạt. Bạn làm gì?",
        options: ["Đóng cửa tạm thời", "Mở cửa bình thường"],
        correct: "Đóng cửa tạm thời",
        feedback: "Đúng! Đóng cửa (Bank Holiday) để kiểm tra và ổn định hệ thống, như Roosevelt đã làm.",
    },
    {
        id: 2,
        question: "Lạm phát tăng cao do in tiền quá mức. Bạn chọn?",
        options: ["Mở rộng tín dụng", "Đóng hạn chế cho vay"],
        correct: "Đóng hạn chế cho vay",
        feedback: "Đúng! Hạn chế cho vay để kiểm soát lạm phát và ổn định kinh tế.",
    },
    {
        id: 3,
        question: "Doanh nghiệp độc quyền nâng giá. Nhà nước nên?",
        options: ["Mở tự do thị trường", "Đóng kiểm soát độc quyền"],
        correct: "Đóng kiểm soát độc quyền",
        feedback: "Đúng! Can thiệp để chống độc quyền, bảo vệ người tiêu dùng.",
    },
    {
        id: 4,
        question: "Khủng hoảng sản xuất dư thừa. Giải pháp?",
        options: ["Đóng giảm sản xuất", "Mở tăng sản xuất"],
        correct: "Đóng giảm sản xuất",
        feedback: "Sai! Trong khủng hoảng, cần can thiệp để cân bằng cung cầu, không tăng sản xuất.",
    },
    {
        id: 5,
        question: "Thất nghiệp tăng cao. Chính sách?",
        options: ["Mở cắt giảm chi tiêu", "Đóng tăng đầu tư công"],
        correct: "Đóng tăng đầu tư công",
        feedback: "Đúng! Tăng đầu tư công để tạo việc làm, như New Deal.",
    },
];

// ── Main Page ────────────────────────────────────────────────────────────────
export default function BankCrisisPage() {
    const [currentSituation, setCurrentSituation] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);

    const handleChoice = (choice) => {
        const situation = SITUATIONS[currentSituation];
        const correct = choice === situation.correct;
        setFeedback(situation.feedback);
        setShowFeedback(true);
        if (correct) setScore(score + 20);
        setTimeout(() => {
            setShowFeedback(false);
            setCurrentSituation((prev) => (prev + 1) % SITUATIONS.length);
        }, 3000);
    };

    const reset = () => {
        setCurrentSituation(0);
        setScore(0);
        setFeedback("");
        setShowFeedback(false);
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
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <div className="flex justify-center">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/xsH1WSEqqF0"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="rounded-lg shadow-md w-full max-w-lg"
                        ></iframe>
                    </div>
                </motion.section>

                {/* ── MINI-GAME: Thử tài Thống đốc ── */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>

                    {/* Header bar */}
                    <div className="rounded-t-2xl p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#6b7280,#ef4444)" }}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-white">Thử tài Thống đốc</h2>
                                <p className="text-blue-300 text-xs mt-0.5">Chọn "Đóng" hoặc "Mở" để giải quyết tình huống kinh tế</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="text-center bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-3 py-1.5 min-w-14">
                                    <div className="text-yellow-300 font-black text-xl leading-none">{score}</div>
                                    <div className="text-yellow-600 text-xs mt-0.5">điểm</div>
                                </div>
                                <button onClick={reset} className="bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                                    Chơi lại
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Game area */}
                    <div className="p-4 border-x border-red-800/50 rounded-b-2xl" style={{ background: "rgba(5,15,50,0.85)" }}>
                        <p className="text-blue-400 text-xs text-center mb-3 font-medium">— Tình huống kinh tế —</p>
                        <div className="text-center py-4 bg-gray-900/40 border border-yellow-400/40 rounded-xl mb-4">
                            <div className="text-white font-bold text-sm px-4">{SITUATIONS[currentSituation].question}</div>
                        </div>
                        <div className="flex justify-center gap-4">
                            {SITUATIONS[currentSituation].options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleChoice(option)}
                                    className="bg-red-700 hover:bg-red-600 active:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <AnimatePresence>
                            {showFeedback && (
                                <motion.div
                                    className="text-center mt-4 text-blue-300 text-sm"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {feedback}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
