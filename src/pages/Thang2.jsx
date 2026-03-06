import { useState } from "react";
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

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ManifestoPage() {
    const [quote, setQuote] = useState("");
    const [showQuote, setShowQuote] = useState(false);

    const generateQuote = () => {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote);
        setShowQuote(true);
    };

    const reset = () => {
        setQuote("");
        setShowQuote(false);
    };

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

                {/* ── MINI-GAME: Gieo quẻ tư tưởng ── */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>

                    {/* Header bar */}
                    <div className="rounded-t-2xl p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#b91c1c,#ef4444)" }}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-white">Gieo quẻ tư tưởng</h2>
                                <p className="text-blue-300 text-xs mt-0.5">Nhấn nút để nhận trích dẫn ngẫu nhiên từ Tuyên ngôn</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button onClick={generateQuote} className="bg-red-700 hover:bg-red-600 active:bg-red-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                                    Gieo quẻ
                                </button>
                                <button onClick={reset} className="bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                                    Làm mới
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quote area */}
                    <div className="p-4 border-x border-red-800/50 rounded-b-2xl" style={{ background: "rgba(5,15,50,0.85)" }}>
                        <p className="text-blue-400 text-xs text-center mb-3 font-medium">— Trích dẫn truyền cảm hứng —</p>
                        <AnimatePresence>
                            {showQuote && (
                                <motion.div
                                    className="text-center py-4 bg-red-900/40 border border-yellow-400/40 rounded-xl"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="text-yellow-300 font-bold text-sm px-4">"{quote}"</div>
                                    <div className="text-blue-300 text-xs mt-1">— C. Mác & Ph. Ăngghen</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
