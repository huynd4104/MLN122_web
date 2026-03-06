import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FUNCTIONS = [
    {
        id: "thuoc_do",
        label: "Thước đo giá trị",
        icon: "⚖️",
        border: "border-blue-400",
        bg: "bg-blue-900/40",
        desc: "Tiền dùng để đo lường và biểu hiện giá trị của hàng hoá",
        borderColor: "#60a5fa",
    },
    {
        id: "luu_thong",
        label: "Phương tiện lưu thông",
        icon: "🔄",
        border: "border-amber-400",
        bg: "bg-amber-900/40",
        desc: "Tiền làm môi giới trong trao đổi hàng hoá",
        borderColor: "#fbbf24",
    },
    {
        id: "cat_tru",
        label: "Phương tiện cất trữ",
        icon: "🏦",
        border: "border-emerald-400",
        bg: "bg-emerald-900/40",
        desc: "Tiền rút khỏi lưu thông, cất giữ để dành",
        borderColor: "#34d399",
    },
    {
        id: "thanh_toan",
        label: "Phương tiện thanh toán",
        icon: "💳",
        border: "border-purple-400",
        bg: "bg-purple-900/40",
        desc: "Tiền dùng để trả nợ, trả tiền mua hàng trả chậm",
        borderColor: "#c084fc",
    },
    {
        id: "the_gioi",
        label: "Tiền tệ thế giới",
        icon: "🌍",
        border: "border-sky-400",
        bg: "bg-sky-900/40",
        desc: "Tiền dùng trong thanh toán và mua bán quốc tế",
        borderColor: "#38bdf8",
    },
];

const CARDS_DATA = [
    { id: 1, text: "Dùng tiền mua ổ bánh mì ở cửa hàng", answer: "luu_thong", emoji: "🍞" },
    { id: 2, text: "Gửi tiết kiệm 50 triệu vào ngân hàng", answer: "cat_tru", emoji: "💰" },
    { id: 3, text: "Thanh toán hoá đơn điện cuối tháng", answer: "thanh_toan", emoji: "⚡" },
    { id: 4, text: "Niêm yết giá iPhone 15: 22.990.000đ", answer: "thuoc_do", emoji: "📱" },
    { id: 5, text: "Việt Nam xuất khẩu gạo, nhận USD về", answer: "the_gioi", emoji: "🚢" },
    { id: 6, text: "Trả góp mua xe máy trong 12 tháng", answer: "thanh_toan", emoji: "🏍️" },
    { id: 7, text: "Mua vàng miếng để dành cho con cái", answer: "cat_tru", emoji: "🥇" },
    { id: 8, text: "Bảng giá phở: Phở tái 50.000đ", answer: "thuoc_do", emoji: "🍜" },
    { id: 9, text: "Đổi EUR lấy USD khi đi du lịch châu Âu", answer: "the_gioi", emoji: "✈️" },
    { id: 10, text: "Dùng tiền mặt trả tiền taxi sau chuyến đi", answer: "luu_thong", emoji: "🚕" },
];

// ── Touch + Desktop Draggable Card ──────────────────────────────────────────
function DraggableCard({ card, status, onDropped }) {
    const ref = useRef(null);
    const touchStart = useRef(null);
    const cloneRef = useRef(null);

    const removeClone = useCallback(() => {
        if (cloneRef.current) { cloneRef.current.remove(); cloneRef.current = null; }
    }, []);

    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        touchStart.current = {
            x: touch.clientX,
            y: touch.clientY,
            offsetX: touch.clientX - rect.left,
            offsetY: touch.clientY - rect.top,
            rectW: rect.width,
        };
        const clone = el.cloneNode(true);
        clone.style.cssText = `
      position:fixed;top:${rect.top}px;left:${rect.left}px;
      width:${rect.width}px;opacity:0.88;pointer-events:none;z-index:9999;
      transform:scale(1.1) rotate(-2deg);border-radius:12px;
      box-shadow:0 10px 36px rgba(0,0,0,0.55);
    `;
        document.body.appendChild(clone);
        cloneRef.current = clone;
    }, []);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        const clone = cloneRef.current;
        const ts = touchStart.current;
        if (!clone || !ts) return;
        const touch = e.touches[0];
        clone.style.left = `${touch.clientX - ts.offsetX}px`;
        clone.style.top = `${touch.clientY - ts.offsetY}px`;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        const touch = e.changedTouches[0];
        removeClone();
        touchStart.current = null;
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!target) return;
        const bucket = target.closest("[data-bucket-id]");
        if (bucket) onDropped(card.id, bucket.dataset.bucketId);
    }, [card.id, onDropped, removeClone]);

    useEffect(() => () => removeClone(), [removeClone]);

    const bgColor =
        status === "correct" ? "rgba(34,197,94,0.25)"
            : status === "wrong" ? "rgba(239,68,68,0.25)"
                : "rgba(30,58,138,0.55)";
    const borderCol =
        status === "correct" ? "#22c55e"
            : status === "wrong" ? "#ef4444"
                : "rgba(96,165,250,0.4)";

    return (
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: status === "correct" ? 1.08 : status === "wrong" ? 0.95 : 1, backgroundColor: bgColor }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.25 } }}
            className="border rounded-xl px-3 py-2 font-medium select-none cursor-grab active:cursor-grabbing"
            style={{ borderColor: borderCol, maxWidth: 210, minWidth: 110, touchAction: "none" }}
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("cardId", String(card.id)); }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="mr-1">{card.emoji}</span>
            <span className="text-white text-xs">{card.text}</span>
        </motion.div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function EuroPage() {
    const [cards, setCards] = useState(CARDS_DATA);
    const [results, setResults] = useState({});
    const [score, setScore] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [bucketCounts, setBucketCounts] = useState(
        Object.fromEntries(FUNCTIONS.map((f) => [f.id, 0]))
    );
    const [shakeBucket, setShakeBucket] = useState(null);
    const [celebrateBucket, setCelebrateBucket] = useState(null);
    const [dragOverBucket, setDragOverBucket] = useState(null);

    const handleDropped = useCallback((cardId, bucketId) => {
        setCards((prev) => {
            const card = prev.find((c) => c.id === cardId);
            if (!card) return prev;
            const correct = card.answer === bucketId;
            setResults((r) => ({ ...r, [cardId]: correct ? "correct" : "wrong" }));

            if (correct) {
                setScore((s) => s + 10);
                setBucketCounts((bc) => ({ ...bc, [bucketId]: bc[bucketId] + 1 }));
                setCelebrateBucket(bucketId);
                setTimeout(() => setCelebrateBucket(null), 800);
                setTimeout(() => {
                    setCards((p) => p.filter((c) => c.id !== cardId));
                    setResults((r) => { const n = { ...r }; delete n[cardId]; return n; });
                }, 550);
            } else {
                setWrongCount((w) => w + 1);
                setShakeBucket(bucketId);
                setTimeout(() => {
                    setShakeBucket(null);
                    setResults((r) => { const n = { ...r }; delete n[cardId]; return n; });
                }, 700);
            }
            return prev;
        });
    }, []);

    const handleDrop = (e, bucketId) => {
        e.preventDefault();
        setDragOverBucket(null);
        const cardId = parseInt(e.dataTransfer.getData("cardId"), 10);
        if (!cardId) return;
        handleDropped(cardId, bucketId);
    };

    const reset = () => {
        setCards(CARDS_DATA);
        setResults({});
        setScore(0);
        setWrongCount(0);
        setBucketCounts(Object.fromEntries(FUNCTIONS.map((f) => [f.id, 0])));
        setShakeBucket(null);
        setCelebrateBucket(null);
        setDragOverBucket(null);
    };

    const remaining = cards.length;
    const finished = remaining === 0;

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

                {/* ── HEADER ── */}
                <motion.header className="text-center pt-10 pb-8" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1 text-yellow-300 text-sm font-semibold mb-4 tracking-widest uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        📅 Tháng 1 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 1: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Kỷ nguyên đồng Euro
                        </span>
                    </motion.h1>
                </motion.header>

                {/* ── EVENT CARD ── */}
                <motion.section className="rounded-2xl border border-blue-500/30 p-6 mb-8 relative overflow-hidden" style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">💶</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">1 tháng 1, 1999</div>
                            <h2 className="text-xl font-bold text-white mb-2">Đồng Euro ra đời</h2>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Vào ngày <strong className="text-yellow-300">1/1/1999</strong>, đồng Euro (€) chính thức được ra mắt như một đồng tiền kế toán tại <strong className="text-white">11 quốc gia thành viên EU</strong>. Đây là sự kiện lịch sử chưa từng có — lần đầu tiên các quốc gia có chủ quyền tự nguyện từ bỏ đồng tiền quốc gia để dùng chung một đồng tiền thống nhất. Đến năm <strong className="text-white">2002</strong>, tiền giấy và xu Euro chính thức lưu thông, thay thế hoàn toàn các đồng Franc, Mark, Lira... Hiện nay, Euro là đồng tiền dự trữ thứ 2 thế giới, được sử dụng tại <strong className="text-yellow-300">20 quốc gia</strong> trong khu vực đồng Euro.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* ── 5 FUNCTIONS ── */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-5">✦ 5 Chức năng của Tiền tệ ✦</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {FUNCTIONS.map((fn, i) => (
                            <motion.div key={fn.id} className={`rounded-xl border ${fn.border} ${fn.bg} p-4 flex gap-3 items-start`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
                                <div className="text-2xl flex-shrink-0">{fn.icon}</div>
                                <div>
                                    <div className="font-bold text-white text-sm mb-1">{fn.label}</div>
                                    <div className="text-blue-300 text-xs leading-relaxed">{fn.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* ── MINI-GAME ── */}
                <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>

                    {/* Header bar */}
                    <div className="rounded-t-2xl p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#1e3a8a,#1e40af)" }}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-white">Phân loại chức năng tiền tệ</h2>
                                <p className="text-blue-300 text-xs mt-0.5">Kéo thả thẻ · Trên điện thoại: chạm & kéo vào giỏ</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="text-center bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-3 py-1.5 min-w-14">
                                    <div className="text-yellow-300 font-black text-xl leading-none">{score}</div>
                                    <div className="text-yellow-600 text-xs mt-0.5">điểm</div>
                                </div>
                                <div className="text-center bg-red-400/10 border border-red-400/30 rounded-xl px-3 py-1.5 min-w-14">
                                    <div className="text-red-300 font-black text-xl leading-none">{wrongCount}</div>
                                    <div className="text-red-600 text-xs mt-0.5">sai</div>
                                </div>
                                <div className="text-center bg-blue-400/10 border border-blue-400/30 rounded-xl px-3 py-1.5 min-w-14">
                                    <div className="text-white font-black text-xl leading-none">{remaining}</div>
                                    <div className="text-blue-500 text-xs mt-0.5">còn lại</div>
                                </div>
                                <button onClick={reset} className="bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                                    Chơi lại
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cards area */}
                    <div className="p-4 border-x border-blue-800/50" style={{ background: "rgba(5,15,50,0.85)" }}>
                        <p className="text-blue-400 text-xs text-center mb-3 font-medium">— Thẻ tình huống —</p>
                        <AnimatePresence>
                            {finished ? (
                                <motion.div key="done" className="text-center py-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                    <div className="text-6xl mb-3">🎉</div>
                                    <div className="text-yellow-300 font-black text-2xl mb-2">Hoàn thành xuất sắc!</div>
                                    <div className="text-blue-300 text-sm">
                                        Điểm: <strong className="text-yellow-300">{score}</strong> / {CARDS_DATA.length * 10}
                                        &nbsp;·&nbsp; Số lần sai: <strong className="text-red-400">{wrongCount}</strong>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center">
                                    {cards.map((card) => (
                                        <DraggableCard key={card.id} card={card} status={results[card.id]} onDropped={handleDropped} />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Buckets */}
                    <div className="rounded-b-2xl p-4 border border-blue-800/50 border-t-0" style={{ background: "rgba(3,4,50,0.95)" }}>
                        <p className="text-blue-400 text-xs text-center mb-3 font-medium">— Giỏ phân loại —</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {FUNCTIONS.map((fn) => {
                                const isShake = shakeBucket === fn.id;
                                const isCelebrate = celebrateBucket === fn.id;
                                const isOver = dragOverBucket === fn.id;
                                const count = bucketCounts[fn.id];
                                return (
                                    <motion.div
                                        key={fn.id}
                                        data-bucket-id={fn.id}
                                        className={`rounded-xl border-2 ${fn.border} ${fn.bg} p-3 flex flex-col items-center gap-1 relative`}
                                        style={{
                                            minHeight: 96,
                                            boxShadow: isOver ? `0 0 20px 5px ${fn.borderColor}66` : "none",
                                            borderColor: isOver ? fn.borderColor : undefined,
                                            transition: "box-shadow 0.15s, border-color 0.15s",
                                        }}
                                        animate={
                                            isShake ? { x: [-6, 6, -5, 5, -3, 3, 0] }
                                                : isCelebrate ? { scale: [1, 1.14, 1] }
                                                    : { x: 0, scale: 1 }
                                        }
                                        transition={{ duration: 0.4 }}
                                        onDrop={(e) => handleDrop(e, fn.id)}
                                        onDragOver={(e) => { e.preventDefault(); setDragOverBucket(fn.id); }}
                                        onDragLeave={() => setDragOverBucket(null)}
                                    >
                                        {/* Count badge */}
                                        <AnimatePresence>
                                            {count > 0 && (
                                                <motion.div
                                                    key={`badge-${fn.id}-${count}`}
                                                    className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white z-10"
                                                    style={{ background: fn.borderColor, boxShadow: `0 0 10px ${fn.borderColor}` }}
                                                    initial={{ scale: 0, rotate: -20 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                                >
                                                    {count}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="text-2xl pointer-events-none">{fn.icon}</div>
                                        <div className="text-white font-bold text-xs text-center leading-tight pointer-events-none">{fn.label}</div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}