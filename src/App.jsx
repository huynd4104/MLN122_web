import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FUNCTIONS = [
    {
        id: "thuoc_do",
        label: "Thước đo giá trị",
        icon: "⚖️",
        border: "border-blue-500",
        bg: "bg-blue-50",
        desc: "Tiền dùng để đo lường và biểu hiện giá trị của hàng hoá",
        borderColor: "#3b82f6",
    },
    {
        id: "luu_thong",
        label: "Phương tiện lưu thông",
        icon: "🔄",
        border: "border-amber-500",
        bg: "bg-amber-50",
        desc: "Tiền làm môi giới trong trao đổi hàng hoá",
        borderColor: "#f59e0b",
    },
    {
        id: "cat_tru",
        label: "Phương tiện cất trữ",
        icon: "🏦",
        border: "border-emerald-500",
        bg: "bg-emerald-50",
        desc: "Tiền rút khỏi lưu thông, cất giữ để dành",
        borderColor: "#10b981",
    },
    {
        id: "thanh_toan",
        label: "Phương tiện thanh toán",
        icon: "💳",
        border: "border-purple-500",
        bg: "bg-purple-50",
        desc: "Tiền dùng để trả nợ, trả tiền mua hàng trả chậm",
        borderColor: "#8b5cf6",
    },
    {
        id: "the_gioi",
        label: "Tiền tệ thế giới",
        icon: "🌍",
        border: "border-sky-500",
        bg: "bg-sky-50",
        desc: "Tiền dùng trong thanh toán và mua bán quốc tế",
        borderColor: "#0ea5e9",
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
      width:${rect.width}px;opacity:0.95;pointer-events:none;z-index:9999;
      transform:scale(1.05);border-radius:8px;
      box-shadow:0 4px 12px rgba(0,0,0,0.2);
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
        status === "correct" ? "rgba(34,197,94,0.1)"
            : status === "wrong" ? "rgba(239,68,68,0.1)"
                : "rgba(243,244,246,1)"; // Gray light for neutral
    const borderCol =
        status === "correct" ? "#22c55e"
            : status === "wrong" ? "#ef4444"
                : "#d1d5db"; // Gray border
    return (
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: status === "correct" ? 1.02 : status === "wrong" ? 0.98 : 1, backgroundColor: bgColor }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="border rounded-lg px-3 py-2 font-medium select-none cursor-grab active:cursor-grabbing shadow-sm"
            style={{ borderColor: borderCol, maxWidth: 210, minWidth: 110, touchAction: "none" }}
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("cardId", String(card.id)); }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <span className="mr-1 text-sm">{card.emoji}</span>
            <span className="text-gray-800 text-sm">{card.text}</span>
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
                setTimeout(() => setCelebrateBucket(null), 500);
                setTimeout(() => {
                    setCards((p) => p.filter((c) => c.id !== cardId));
                    setResults((r) => { const n = { ...r }; delete n[cardId]; return n; });
                }, 400);
            } else {
                setWrongCount((w) => w + 1);
                setShakeBucket(bucketId);
                setTimeout(() => {
                    setShakeBucket(null);
                    setResults((r) => { const n = { ...r }; delete n[cardId]; return n; });
                }, 500);
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
            className="min-h-screen text-gray-800 overflow-x-hidden"
            style={{
                background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)", // Neutral gray gradient
                fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}
        >
            <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">
                {/* ── HEADER ── */}
                <motion.header className="text-center pt-10 pb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1 text-blue-600 text-sm font-medium mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        📅 Tháng 1 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2 text-gray-900">
                        Tháng 1: Kỷ nguyên đồng Euro
                    </motion.h1>
                    <motion.p className="text-gray-600 text-sm sm:text-base mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        Kinh tế chính trị Mác–Lênin · 5 chức năng của tiền tệ
                    </motion.p>
                </motion.header>
                {/* ── EVENT CARD ── */}
                <motion.section className="rounded-lg border border-gray-200 p-6 mb-8 bg-white shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-4xl text-blue-600">💶</div>
                        <div>
                            <div className="text-blue-600 font-medium text-xs uppercase mb-1">1 tháng 1, 1999</div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Đồng Euro ra đời</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Vào ngày <strong className="text-blue-600">1/1/1999</strong>, đồng Euro (€) chính thức được ra mắt như một đồng tiền kế toán tại <strong className="text-gray-900">11 quốc gia thành viên EU</strong>. Đây là sự kiện lịch sử chưa từng có — lần đầu tiên các quốc gia có chủ quyền tự nguyện từ bỏ đồng tiền quốc gia để dùng chung một đồng tiền thống nhất. Đến năm <strong className="text-gray-900">2002</strong>, tiền giấy và xu Euro chính thức lưu thông, thay thế hoàn toàn các đồng Franc, Mark, Lira... Hiện nay, Euro là đồng tiền dự trữ thứ 2 thế giới, được sử dụng tại <strong className="text-blue-600">20 quốc gia</strong> trong khu vực đồng Euro.
                            </p>
                        </div>
                    </div>
                </motion.section>
                {/* ── 5 FUNCTIONS ── */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <h2 className="text-center text-lg font-bold text-gray-900 uppercase tracking-wide mb-5">5 Chức năng của Tiền tệ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FUNCTIONS.map((fn, i) => (
                            <motion.div key={fn.id} className={`rounded-lg border ${fn.border} ${fn.bg} p-4 flex gap-3 items-start shadow-sm`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                                <div className="text-xl flex-shrink-0 text-gray-700">{fn.icon}</div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm mb-1">{fn.label}</div>
                                    <div className="text-gray-600 text-xs leading-relaxed">{fn.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
                {/* ── VIDEO EMBED ── (Mới thêm) */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <h2 className="text-center text-lg font-bold text-gray-900 uppercase tracking-wide mb-5">Video minh họa về đồng Euro</h2>
                    <div className="flex justify-center">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/Vo3-AbcD75s"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="rounded-lg shadow-md w-full max-w-lg"
                        ></iframe>
                    </div>
                </motion.section>
                {/* ── MINI-GAME ── */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    {/* Header bar */}
                    <div className="rounded-t-lg p-4 sm:p-5 bg-blue-50 border border-blue-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Phân loại chức năng tiền tệ</h2>
                                <p className="text-gray-600 text-xs mt-0.5">Kéo thả thẻ · Trên điện thoại: chạm & kéo vào giỏ</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="text-center bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 min-w-14">
                                    <div className="text-blue-600 font-bold text-lg leading-none">{score}</div>
                                    <div className="text-blue-800 text-xs mt-0.5">điểm</div>
                                </div>
                                <div className="text-center bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 min-w-14">
                                    <div className="text-red-600 font-bold text-lg leading-none">{wrongCount}</div>
                                    <div className="text-red-800 text-xs mt-0.5">sai</div>
                                </div>
                                <div className="text-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 min-w-14">
                                    <div className="text-gray-900 font-bold text-lg leading-none">{remaining}</div>
                                    <div className="text-gray-700 text-xs mt-0.5">còn lại</div>
                                </div>
                                <button onClick={reset} className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                                    Chơi lại
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Cards area */}
                    <div className="p-4 border-x border-gray-200 bg-white">
                        <p className="text-gray-600 text-xs text-center mb-3 font-medium">— Thẻ tình huống —</p>
                        <AnimatePresence>
                            {finished ? (
                                <motion.div key="done" className="text-center py-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                    <div className="text-2xl font-bold text-green-600 mb-2">Hoàn thành!</div>
                                    <div className="text-gray-600 text-sm">
                                        Điểm: <strong className="text-blue-600">{score}</strong> / {CARDS_DATA.length * 10}
                                        &nbsp;·&nbsp; Số lần sai: <strong className="text-red-600">{wrongCount}</strong>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-center">
                                    {cards.map((card) => (
                                        <DraggableCard key={card.id} card={card} status={results[card.id]} onDropped={handleDropped} />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Buckets */}
                    <div className="rounded-b-lg p-4 border border-gray-200 border-t-0 bg-white">
                        <p className="text-gray-600 text-xs text-center mb-3 font-medium">— Giỏ phân loại —</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {FUNCTIONS.map((fn) => {
                                const isShake = shakeBucket === fn.id;
                                const isCelebrate = celebrateBucket === fn.id;
                                const isOver = dragOverBucket === fn.id;
                                const count = bucketCounts[fn.id];
                                return (
                                    <motion.div
                                        key={fn.id}
                                        data-bucket-id={fn.id}
                                        className={`rounded-lg border-2 ${fn.border} ${fn.bg} p-3 flex flex-col items-center gap-1 relative shadow-sm`}
                                        style={{
                                            minHeight: 96,
                                            boxShadow: isOver ? `0 0 8px 2px ${fn.borderColor}33` : "none",
                                            borderColor: isOver ? fn.borderColor : undefined,
                                            transition: "box-shadow 0.2s, border-color 0.2s",
                                        }}
                                        animate={
                                            isShake ? { x: [-3, 3, -2, 2, 0] }
                                                : isCelebrate ? { scale: [1, 1.05, 1] }
                                                    : { x: 0, scale: 1 }
                                        }
                                        transition={{ duration: 0.3 }}
                                        onDrop={(e) => handleDrop(e, fn.id)}
                                        onDragOver={(e) => { e.preventDefault(); setDragOverBucket(fn.id); }}
                                        onDragLeave={() => setDragOverBucket(null)}
                                    >
                                        {/* Count badge */}
                                        <AnimatePresence>
                                            {count > 0 && (
                                                <motion.div
                                                    key={`badge-${fn.id}-${count}`}
                                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white z-10"
                                                    style={{ background: fn.borderColor }}
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0.8 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    {count}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="text-xl pointer-events-none text-gray-700">{fn.icon}</div>
                                        <div className="text-gray-900 font-medium text-xs text-center leading-tight pointer-events-none">{fn.label}</div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>
                <motion.footer className="text-center mt-10 text-gray-500 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                    Kinh tế chính trị Mác–Lênin · Tháng 1 · Đồng Euro & 5 chức năng tiền tệ
                </motion.footer>
            </div>
        </div>
    );
}