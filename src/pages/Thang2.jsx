import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const CORE_IDEAS = [
    {
        id: "doi_tuong",
        label: "Đối tượng nghiên cứu",
        icon: "🔍",
        border: "border-red-400",
        bg: "bg-red-900/40",
        desc: "Các quan hệ xã hội của sản xuất và trao đổi trong phương thức sản xuất (theo giáo trình: Quan hệ sản xuất và trao đổi gắn với lực lượng sản xuất và kiến trúc thượng tầng).",
        borderColor: "#f56565",
    },
    {
        id: "phuong_phap",
        label: "Phương pháp nghiên cứu",
        icon: "🛠️",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc: "Phép biện chứng duy vật và trừu tượng hóa khoa học (theo giáo trình: Kết hợp logic với lịch sử, thống kê, phân tích).",
        borderColor: "#fbbf24",
    },
    {
        id: "chuc_nang",
        label: "Chức năng",
        icon: "⚙️",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc: "Nhận thức, thực tiễn, tư tưởng và phương pháp luận (theo giáo trình: Cung cấp cơ sở khoa học cho phát triển xã hội).",
        borderColor: "#34d399",
    },
    {
        id: "hinh_thanh",
        label: "Sự hình thành",
        icon: "📜",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc: "Kế thừa kinh tế chính trị cổ điển, phát triển thành khoa học cách mạng (theo giáo trình: Từ Montchretien đến A.Smith, rồi Mác - Lênin).",
        borderColor: "#c084fc",
    },
    {
        id: "quy_luat",
        label: "Quy luật kinh tế",
        icon: "📈",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc: "Mối liên hệ bản chất, khách quan của các hiện tượng kinh tế (theo giáo trình: Điều chỉnh hành vi con người qua lợi ích).",
        borderColor: "#38bdf8",
    },
];

const QUOTES = [
    "Một bóng ma đang ám ảnh châu Âu – bóng ma của chủ nghĩa cộng sản.",
    "Lịch sử của tất cả các xã hội tồn tại từ trước đến nay đều là lịch sử đấu tranh giai cấp.",
    "Người tự do và nô lệ, quý tộc và bình dân, lãnh chúa và nông nô, thợ cả và thợ học việc – nói tóm lại, kẻ áp bức và người bị áp bức luôn luôn đối kháng nhau.",
    "Xã hội tư sản hiện đại đã mọc lên từ đống tàn tích của xã hội phong kiến.",
    "Giai cấp tư sản đã đóng một vai trò hết sức cách mạng trong lịch sử.",
    "Giai cấp tư sản không thể tồn tại nếu không luôn luôn cách mạng hóa công cụ sản xuất.",
    "Giai cấp tư sản đã tạo ra những lực lượng sản xuất to lớn hơn tất cả các thế hệ trước cộng lại.",
    "Đại công nghiệp đã tạo ra thị trường thế giới.",
    "Thị trường thế giới đã thúc đẩy sự phát triển to lớn của thương nghiệp, hàng hải và giao thông.",
    "Những tư tưởng thống trị của mỗi thời đại luôn luôn chỉ là tư tưởng của giai cấp thống trị.",
    "Chính quyền nhà nước hiện đại chỉ là một ủy ban quản lý những công việc chung của toàn bộ giai cấp tư sản.",
    "Xã hội tư sản hiện đại giống như một phù thủy không còn điều khiển nổi những sức mạnh mà chính hắn đã gọi lên.",
    "Công nhân hiện đại chỉ sống chừng nào họ còn tìm được việc làm.",
    "Lao động của người công nhân đã mất hết tính độc lập và sức hấp dẫn.",
    "Người công nhân trở thành một bộ phận phụ thuộc của cỗ máy.",
    "Giai cấp tư sản đã sản xuất ra những người đào mồ chôn chính mình.",
    "Sự sụp đổ của giai cấp tư sản và thắng lợi của giai cấp vô sản đều là tất yếu như nhau.",
    "Những người cộng sản không có lợi ích nào tách khỏi lợi ích của toàn thể giai cấp vô sản.",
    "Những người cộng sản chỉ khác các đảng công nhân khác ở chỗ họ luôn luôn đại biểu cho lợi ích chung của toàn bộ phong trào.",
    "Mục tiêu trực tiếp của những người cộng sản là: tổ chức giai cấp vô sản thành giai cấp.",
    "Bước đầu tiên trong cách mạng công nhân là nâng giai cấp vô sản lên thành giai cấp thống trị.",
    "Giai cấp vô sản sẽ dùng quyền lực chính trị của mình để từng bước tước đoạt toàn bộ tư bản của giai cấp tư sản.",
    "Cách mạng cộng sản là sự đoạn tuyệt triệt để nhất với quan hệ sở hữu truyền thống.",
    "Các người kinh hoàng vì chúng tôi muốn xóa bỏ sở hữu tư nhân.",
    "Nhưng trong xã hội của các người, sở hữu tư nhân đã bị xóa bỏ đối với chín phần mười dân cư.",
    "Các người buộc tội chúng tôi muốn xóa bỏ gia đình.",
    "Công nhân không có Tổ quốc.",
    "Những người cộng sản không hạ thấp mình bằng cách che giấu quan điểm và mục đích của mình.",
    "Họ công khai tuyên bố rằng mục đích của họ chỉ có thể đạt được bằng việc lật đổ toàn bộ trật tự xã hội hiện hành bằng bạo lực.",
    "Giai cấp vô sản không có gì để mất ngoài xiềng xích của mình.",
    "Họ có cả một thế giới để giành lấy.",
    "Hỡi những người vô sản toàn thế giới, hãy đoàn kết lại!",
    "Sự phát triển của đại công nghiệp làm lung lay chính nền tảng mà trên đó giai cấp tư sản sản xuất và chiếm hữu sản phẩm.",
    "Điều mà giai cấp tư sản sản xuất ra trước hết chính là những kẻ đào mồ chôn nó.",
    "Trong xã hội tư sản, lao động sống chỉ là phương tiện để làm tăng lao động tích lũy.",
    "Trong xã hội cộng sản, lao động tích lũy chỉ là phương tiện để mở rộng, làm phong phú và nâng cao đời sống của người lao động.",
    "Sự phát triển tự do của mỗi người là điều kiện cho sự phát triển tự do của tất cả mọi người.",
    "Các giai cấp trung gian ngày càng bị đẩy xuống hàng ngũ giai cấp vô sản.",
    "Giai cấp vô sản là sản phẩm riêng của đại công nghiệp.",
    "Phong trào vô sản là phong trào độc lập của đại đa số vì lợi ích của đại đa số."
];

// ── CARD DRAW COMPONENT ────────────────────────────────────────────────────────
function GieoQue() {
    const [drawing, setDrawing] = useState(false);
    const [result, setResult] = useState(null);

    const draw = () => {
        if (drawing) return;
        setDrawing(true);
        setResult(null);

        // Simulate drawing delay
        setTimeout(() => {
            const selectedIndex = Math.floor(Math.random() * CORE_IDEAS.length);
            const selected = CORE_IDEAS[selectedIndex];

            let filteredQuotes = QUOTES;
            if (selected.id === "hinh_thanh") {
                filteredQuotes = QUOTES.filter(q => q.includes("lịch sử") || q.includes("xã hội") || q.includes("giai cấp"));
            } else if (selected.id === "doi_tuong") {
                filteredQuotes = QUOTES.filter(q => q.includes("sản xuất") || q.includes("công nhân"));
            }
            if (filteredQuotes.length === 0) filteredQuotes = QUOTES;
            const relatedQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

            setResult({ ...selected, quote: relatedQuote });
            setDrawing(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 sm:p-8 min-h-[380px]">
            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key="draw-btn"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.button
                            onClick={draw}
                            disabled={drawing}
                            className={`relative group w-44 h-60 rounded-xl border-2 border-yellow-500/40 bg-gradient-to-b from-red-800 to-red-950 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all overflow-hidden ${drawing ? 'cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] cursor-pointer hover:border-yellow-400'}`}
                            animate={drawing ? {
                                x: [-3, 3, -3, 3, -1, 1, 0],
                                y: [-1, 1, -1, 1, 0],
                                rotate: [-2, 2, -2, 2, 0]
                            } : {
                                y: [-5, 5, -5]
                            }}
                            transition={drawing ? {
                                duration: 0.4,
                                repeat: Infinity,
                                repeatType: "mirror"
                            } : {
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                🧧
                            </div>
                            <div className="text-yellow-400 font-bold text-lg uppercase tracking-widest text-center px-4 relative z-10">
                                {drawing ? "Đang rút..." : "Xin Quẻ"}
                            </div>
                            <div className="text-red-300 border border-red-500/30 bg-red-900/50 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider mt-3 relative z-10">
                                Click để rút
                            </div>
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="relative w-full max-w-xl bg-gradient-to-br from-[#450a0a] via-[#7f1d1d] to-[#450a0a] border border-yellow-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-left"
                    >
                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/50 rounded-tl-2xl m-2 opacity-50 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/50 rounded-tr-2xl m-2 opacity-50 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/50 rounded-bl-2xl m-2 opacity-50 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/50 rounded-br-2xl m-2 opacity-50 pointer-events-none"></div>

                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-24 h-24 shrink-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-full flex items-center justify-center text-5xl border-2 border-yellow-500/30 shadow-[0_0_20px_rgba(250,204,21,0.15)]"
                            >
                                {result.icon}
                            </motion.div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 uppercase tracking-widest mb-1">
                                    {result.label}
                                </h3>
                                <div className="h-px w-full max-w-[200px] bg-gradient-to-r from-yellow-500/50 to-transparent mb-3 mx-auto sm:mx-0"></div>
                                <p className="text-red-100/90 text-sm sm:text-base leading-relaxed mb-4">
                                    {result.desc}
                                </p>
                            </div>
                        </div>

                        <div className="relative bg-black/30 rounded-xl p-5 w-full mt-4 border border-red-900/80">
                            <div className="absolute -top-3 left-6 bg-red-950 px-3 border border-red-800 text-yellow-500 text-[10px] font-bold tracking-widest uppercase rounded-full">
                                Lời dạy kinh điển
                            </div>
                            <div className="text-4xl text-yellow-600/20 absolute -top-1 left-2 font-serif leading-none hidden sm:block">"</div>
                            <p className="text-yellow-100 italic font-serif text-base sm:text-lg leading-relaxed relative z-10 sm:px-6 inline-block">
                                "{result.quote}"
                            </p>
                            <div className="text-4xl text-yellow-600/20 absolute -bottom-4 right-2 font-serif rotate-180 leading-none hidden sm:block">"</div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <motion.button
                                onClick={() => setResult(null)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 border border-yellow-500/30 rounded-full text-yellow-200 text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg"
                            >
                                <span className="text-lg leading-none">↺</span> Rút quẻ khác
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Thang2Page() {
    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{
                background: "linear-gradient(135deg,#450a0a 0%,#7f1d1d 40%,#451a03 100%)", // Red-gold gradient for communist theme
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
                        📅 Tháng 2 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 2: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Tuyên ngôn Đảng Cộng sản
                        </span>
                    </motion.h1>
                </motion.header>
                {/* ── EVENT CARD ── (Chi tiết về sự kiện) */}
                <motion.section className="rounded-2xl border border-red-500/30 p-6 mb-8 relative overflow-hidden" style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">📕</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">Tháng 2, 1848</div>
                            <h2 className="text-xl font-bold text-white mb-2">Tuyên ngôn Đảng Cộng sản ra đời - Lời tuyên bố cách mạng</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Vào tháng 2 năm 1848, <strong className="text-yellow-300">Tuyên ngôn của Đảng Cộng sản</strong> (Manifest der Kommunistischen Partei) được C. Mác và Ph. Ăngghen hoàn thành và công bố tại London, Anh. Đây là văn kiện chương trình đầu tiên của phong trào cộng sản quốc tế, được viết dưới dạng lời kêu gọi cách mạng, phân tích sâu sắc xã hội tư bản và kêu gọi giai cấp vô sản đoàn kết lật đổ giai cấp tư sản.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Sự kiện diễn ra trong bối cảnh <strong className="text-white">cách mạng 1848 lan rộng châu Âu</strong>, với các cuộc nổi dậy chống phong kiến và tư bản ở Pháp, Đức, Ý... Tuyên ngôn không chỉ là bản tuyên bố lý thuyết mà còn là vũ khí tư tưởng cho giai cấp công nhân, khẳng định sứ mệnh lịch sử của chủ nghĩa xã hội khoa học. Đến nay, Tuyên ngôn đã được dịch ra hơn 200 ngôn ngữ và ảnh hưởng sâu sắc đến cách mạng thế giới, bao gồm Việt Nam (qua tư tưởng Hồ Chí Minh).
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
                            src="https://www.youtube.com/embed/GruG7drQByY"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="rounded-lg shadow-md w-full max-w-lg"
                        ></iframe>
                    </div>
                </motion.section>
                {/* ── MINI-GAME: Gieo quẻ tư tưởng nâng cấp ── */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    {/* Header bar */}
                    <div className="rounded-t-2xl p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#b91c1c,#ef4444)" }}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-white">Gieo quẻ tư tưởng</h2>
                                <p className="text-red-100/90 text-sm mt-0.5">Rút thẻ để nhận ý tưởng cốt lõi và trích dẫn kinh điển</p>
                            </div>
                        </div>
                    </div>
                    {/* Quote area */}
                    <div className="border border-t-0 border-red-800/50 rounded-b-2xl overflow-hidden relative" style={{ background: "rgba(20, 5, 5, 0.6)", backdropFilter: "blur(12px)" }}>
                        <GieoQue />
                    </div>
                </motion.section>
            </div>
        </div>
    );
}