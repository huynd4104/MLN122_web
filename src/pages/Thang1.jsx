import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const FUNCTIONS = [
    { id: "thuoc_do", label: "Thước đo giá trị", icon: "⚖️", border: "border-blue-400", bg: "bg-blue-900/40", desc: "Tiền dùng để biểu hiện và đo lường giá trị của hàng hóa; giá trị hàng hóa biểu hiện bằng tiền gọi là giá cả.", borderColor: "#60a5fa" },
    { id: "luu_thong", label: "Phương tiện lưu thông", icon: "💱", border: "border-amber-400", bg: "bg-amber-900/40", desc: "Tiền đóng vai trò môi giới trong trao đổi hàng hóa, thực hiện chức năng mua – bán tức thời.", borderColor: "#fbbf24" },
    { id: "cat_tru", label: "Phương tiện cất trữ", icon: "🏦", border: "border-emerald-400", bg: "bg-emerald-900/40", desc: "Tiền tạm thời rút khỏi lưu thông, được giữ lại dưới dạng giá trị để sử dụng trong tương lai.", borderColor: "#34d399" },
    { id: "thanh_toan", label: "Phương tiện thanh toán", icon: "💳", border: "border-purple-400", bg: "bg-purple-900/40", desc: "Tiền dùng để chi trả sau khi giao dịch đã phát sinh: trả nợ, trả tiền mua bán chịu, trả lương, nộp thuế...", borderColor: "#c084fc" },
    { id: "the_gioi", label: "Tiền tệ thế giới", icon: "🌍", border: "border-sky-400", bg: "bg-sky-900/40", desc: "Tiền làm chức năng thước đo giá trị, phương tiện lưu thông và thanh toán trong quan hệ kinh tế quốc tế.", borderColor: "#38bdf8" },
];

const NORMAL_CARDS = [
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
    { id: 11, text: "Định giá một căn nhà: 3 tỷ đồng", answer: "thuoc_do", emoji: "🏠" },
    { id: 12, text: "Chuyển khoản tiền lương cho nhân viên", answer: "thanh_toan", emoji: "💵" },
    { id: 13, text: "Mua cổ phiếu tích lũy tài sản dài hạn", answer: "cat_tru", emoji: "📈" },
    { id: 14, text: "Thanh toán hợp đồng xuất khẩu bằng EUR", answer: "the_gioi", emoji: "🏢" },
    { id: 15, text: "Niêm yết giá xe hơi: 800 triệu đồng", answer: "thuoc_do", emoji: "🚗" },
    { id: 16, text: "Mua cà phê sáng bằng tiền mặt", answer: "luu_thong", emoji: "☕" },
    { id: 17, text: "Trả nợ vay ngân hàng định kỳ hàng tháng", answer: "thanh_toan", emoji: "🏦" },
    { id: 18, text: "Công ty nhận thanh toán USD từ đối tác nước ngoài", answer: "the_gioi", emoji: "🌐" },
];

// Thẻ bẫy trông như hoạt động bình thường nhưng KHÔNG thuộc chức năng nào của tiền tệ
const BOMB_POOL = [
    { id: 201, text: "Đổi 1 con gà lấy 5 kg gạo tại chợ quê", isBomb: true, emoji: "�" },
    { id: 202, text: "Tặng quà sinh nhật cho bạn bè", isBomb: true, emoji: "🎁" },
    { id: 203, text: "Quyên góp từ thiện cho trẻ em vùng cao", isBomb: true, emoji: "🤝" },
    { id: 204, text: "Đổi đồ cũ lấy đồ mới trong hội swap", isBomb: true, emoji: "♻️" },
];

const LEVEL_CONFIG = [
    { level: 1, time: 60, label: "Nhập Môn", color: "#22c55e", cardIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], bombCount: 0, desc: "12 tình huống · Không thẻ bẫy · 60 giây" },
    { level: 2, time: 50, label: "Thử Thách", color: "#f59e0b", cardIds: [4, 5, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18], bombCount: 2, desc: "12 tình huống + 2 thẻ bẫy · 50 giây" },
    { level: 3, time: 40, label: "Chuyên Gia", color: "#ef4444", cardIds: [1, 3, 5, 6, 8, 10, 13, 14, 15, 16, 17, 18], bombCount: 4, desc: "12 tình huống + 4 thẻ bẫy · 40 giây" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getMultiplierInfo(streak) {
    if (streak >= 5) return { mult: 2, label: "×2 MEGA!", color: "#ef4444" };
    if (streak >= 3) return { mult: 1.5, label: "×1.5 HOT!", color: "#f59e0b" };
    return { mult: 1, label: "", color: "#22c55e" };
}

function buildLevelCards(cfg) {
    const normals = shuffle(NORMAL_CARDS.filter(c => cfg.cardIds.includes(c.id)));
    const bombs = shuffle(BOMB_POOL).slice(0, cfg.bombCount);
    return shuffle([...normals, ...bombs]);
}

function getStars(score, maxScore) {
    const pct = score / maxScore;
    if (pct >= 0.85) return 3;
    if (pct >= 0.6) return 2;
    return 1;
}

// ─── DRAGGABLE CARD ────────────────────────────────────────────────────────────
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
        touchStart.current = { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
        const clone = el.cloneNode(true);
        clone.style.cssText = `position:fixed;top:${rect.top}px;left:${rect.left}px;width:${rect.width}px;opacity:0.9;pointer-events:none;z-index:9999;transform:scale(1.1) rotate(-2deg);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.7);`;
        document.body.appendChild(clone);
        cloneRef.current = clone;
    }, []);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        const clone = cloneRef.current; const ts = touchStart.current;
        if (!clone || !ts) return;
        const touch = e.touches[0];
        clone.style.left = `${touch.clientX - ts.offsetX}px`;
        clone.style.top = `${touch.clientY - ts.offsetY}px`;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        const touch = e.changedTouches[0];
        removeClone(); touchStart.current = null;
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!target) return;
        const bucket = target.closest("[data-bucket-id]");
        if (bucket) onDropped(card.id, bucket.dataset.bucketId);
    }, [card.id, onDropped, removeClone]);

    useEffect(() => () => removeClone(), [removeClone]);

    // Bomb cards look like normal cards — no special styling until dropped
    const bgColor = status === "correct" ? "rgba(34,197,94,0.25)"
        : status === "wrong" || status === "bomb" ? "rgba(239,68,68,0.25)"
            : "rgba(30,58,138,0.55)";
    const borderCol = status === "correct" ? "#22c55e"
        : status === "wrong" || status === "bomb" ? "#ef4444"
            : "rgba(96,165,250,0.4)";

    return (
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: status === "correct" ? 1.08 : 1, backgroundColor: bgColor }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
            className="border rounded-xl px-3 py-2 select-none cursor-grab active:cursor-grabbing relative"
            style={{ borderColor: borderCol, minWidth: 110, touchAction: "none" }}
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("cardId", String(card.id)); }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.94 }}
        >
            <span className="mr-1 text-sm">{card.emoji}</span>
            <span className="text-xs font-medium text-white">{card.text}</span>
        </motion.div>
    );
}

// ─── MINI GAME ─────────────────────────────────────────────────────────────────
function MiniGame() {
    // ── Phase & Level ──
    const [phase, setPhase] = useState("idle"); // idle | playing | level_end | finished
    const [levelIdx, setLevelIdx] = useState(0);

    // ── Timer ──
    const [timeLeft, setTimeLeft] = useState(60);

    // ── Cards & Results ──
    const [cards, setCards] = useState([]);
    const [results, setResults] = useState({});

    // ── Score ──
    const [score, setScore] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [bombsHit, setBombsHit] = useState(0);

    // ── UI Feedback ──
    const [bucketCounts, setBucketCounts] = useState({});
    const [shakeBucket, setShakeBucket] = useState(null);
    const [celebrateBucket, setCelebrateBucket] = useState(null);
    const [dragOverBucket, setDragOverBucket] = useState(null);
    const [floats, setFloats] = useState([]);
    const [screenFlash, setScreenFlash] = useState(null);
    const [levelEndData, setLevelEndData] = useState(null);

    // ── Leaderboard ──
    const [leaderboard, setLeaderboard] = useState(() => {
        try { return JSON.parse(localStorage.getItem("mln_frenzy_lb") || "[]"); } catch { return []; }
    });

    // ── Refs (avoid stale closures) ──
    const scoreRef = useRef(0);
    const cardsRef = useRef([]);
    const streakRef = useRef(0);
    const grandTotalRef = useRef(0);
    const timeLeftRef = useRef(60);
    const endedRef = useRef(false);
    const timerRef = useRef(null);
    const floatIdRef = useRef(0);

    const levelConfig = LEVEL_CONFIG[levelIdx];

    // ── Helpers ──
    const syncCards = (newCards) => { cardsRef.current = newCards; setCards(newCards); };
    const addScore = (pts) => { scoreRef.current += pts; setScore(scoreRef.current); };

    const addFloat = useCallback((text, color) => {
        const id = floatIdRef.current++;
        const x = 20 + Math.random() * 55;
        const y = 25 + Math.random() * 30;
        setFloats(p => [...p, { id, text, color, x, y }]);
        setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 1400);
    }, []);

    const doFlash = useCallback((color) => {
        setScreenFlash(color);
        setTimeout(() => setScreenFlash(null), 380);
    }, []);

    // ── End Level ──
    const doEndLevel = useCallback(() => {
        if (endedRef.current) return;
        endedRef.current = true;
        clearInterval(timerRef.current);

        const bombsSurvived = cardsRef.current.filter(c => c.isBomb).length;
        const timeBonus = Math.floor(timeLeftRef.current * 2);
        const survivBonus = bombsSurvived * 15;
        const levelFinal = scoreRef.current + timeBonus + survivBonus;
        const newGrand = grandTotalRef.current + levelFinal;

        scoreRef.current = levelFinal;
        grandTotalRef.current = newGrand;
        setScore(levelFinal);
        setGrandTotal(newGrand);
        setLevelEndData({ levelScore: levelFinal, timeBonus, bombsSurvived, survivBonus, timeRemaining: timeLeftRef.current });
        setPhase("level_end");
    }, []);

    // ── Start Level ──
    const startLevel = useCallback((idx) => {
        const cfg = LEVEL_CONFIG[idx];
        const levelCards = buildLevelCards(cfg);
        endedRef.current = false;
        scoreRef.current = 0;
        streakRef.current = 0;
        timeLeftRef.current = cfg.time;
        cardsRef.current = levelCards;

        setLevelIdx(idx);
        setCards(levelCards);
        setResults({});
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setWrongCount(0);
        setBombsHit(0);
        setBucketCounts(Object.fromEntries(FUNCTIONS.map(f => [f.id, 0])));
        setTimeLeft(cfg.time);
        setLevelEndData(null);
        setPhase("playing");
    }, []);

    // ── Next Level / Finish ──
    const nextLevel = useCallback(() => {
        const next = levelIdx + 1;
        if (next >= LEVEL_CONFIG.length) {
            const finalScore = grandTotalRef.current;
            const newLB = [...leaderboard, finalScore].sort((a, b) => b - a).slice(0, 3);
            setLeaderboard(newLB);
            try { localStorage.setItem("mln_frenzy_lb", JSON.stringify(newLB)); } catch { }
            setPhase("finished");
        } else {
            startLevel(next);
        }
    }, [levelIdx, leaderboard, startLevel]);

    // ── Timer Effect ──
    useEffect(() => {
        if (phase !== "playing") { clearInterval(timerRef.current); return; }
        timerRef.current = setInterval(() => {
            const next = Math.max(0, timeLeftRef.current - 1);
            timeLeftRef.current = next;
            setTimeLeft(next);
            if (next <= 0) doEndLevel();
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase, doEndLevel]);

    // ── Handle Drop ──
    const handleDropped = useCallback((cardId, bucketId) => {
        const card = cardsRef.current.find(c => c.id === cardId);
        if (!card || results[cardId]) return;

        if (card.isBomb) {
            setBombsHit(b => b + 1);
            addScore(-20);
            streakRef.current = 0;
            setStreak(0);
            setResults(r => ({ ...r, [cardId]: "bomb" }));
            doFlash("red");
            addFloat("�️ Thẻ bẫy! -20đ", "#ef4444");
            setShakeBucket(bucketId);
            setTimeout(() => setShakeBucket(null), 700);
            setTimeout(() => {
                const newCards = cardsRef.current.filter(c => c.id !== cardId);
                syncCards(newCards);
                setResults(r => { const n = { ...r }; delete n[cardId]; return n; });
            }, 800);
            return;
        }

        const correct = card.answer === bucketId;
        setResults(r => ({ ...r, [cardId]: correct ? "correct" : "wrong" }));

        if (correct) {
            streakRef.current += 1;
            const newStreak = streakRef.current;
            setStreak(newStreak);
            setMaxStreak(ms => Math.max(ms, newStreak));

            const { mult, label } = getMultiplierInfo(newStreak);
            const pts = Math.round(10 * mult);
            addScore(pts);

            const floatText = newStreak >= 5 ? `🔥 +${pts} ${label}` : newStreak >= 3 ? `⚡ +${pts} ${label}` : `+${pts}`;
            addFloat(floatText, "#4ade80");
            doFlash("green");
            setCelebrateBucket(bucketId);
            setTimeout(() => setCelebrateBucket(null), 800);
            setBucketCounts(bc => ({ ...bc, [bucketId]: bc[bucketId] + 1 }));

            setTimeout(() => {
                const newCards = cardsRef.current.filter(c => c.id !== cardId);
                syncCards(newCards);
                setResults(r => { const n = { ...r }; delete n[cardId]; return n; });
                const remainNormal = newCards.filter(c => !c.isBomb);
                if (remainNormal.length === 0) setTimeout(doEndLevel, 400);
            }, 500);
        } else {
            streakRef.current = 0;
            setStreak(0);
            setWrongCount(w => w + 1);
            addScore(-5);
            addFloat("-5", "#f87171");
            setShakeBucket(bucketId);
            setTimeout(() => {
                setShakeBucket(null);
                setResults(r => { const n = { ...r }; delete n[cardId]; return n; });
            }, 700);
        }
    }, [results, addFloat, doFlash, doEndLevel]);

    const handleDragDrop = (e, bucketId) => {
        e.preventDefault();
        setDragOverBucket(null);
        const cardId = parseInt(e.dataTransfer.getData("cardId"), 10);
        if (cardId) handleDropped(cardId, bucketId);
    };

    // ── Timer visuals ──
    const timePct = timeLeft / (levelConfig?.time || 60);
    const timerColor = timePct > 0.5 ? "#22c55e" : timePct > 0.25 ? "#f59e0b" : "#ef4444";
    const multInfo = getMultiplierInfo(streak);
    const maxScore = LEVEL_CONFIG.reduce((s, cfg) => s + cfg.cardIds.length * 20 + cfg.time * 2 + cfg.bombCount * 15, 0);

    // ══════════════════════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════════════════════

    // ── IDLE ──
    if (phase === "idle") return (
        <motion.div className="rounded-2xl overflow-hidden" style={{ background: "rgba(3,7,50,0.95)", border: "1px solid rgba(96,165,250,0.25)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <div className="p-6 text-center" style={{ background: "linear-gradient(90deg,#1e3a8a,#1e40af)" }}>
                <div className="text-4xl mb-2">🎮</div>
                <h2 className="text-2xl font-black text-white mb-1">Timed Sorting Frenzy</h2>
                <p className="text-blue-300 text-sm">Phân loại nhanh · Combo ×2 · Tránh thẻ bẫy</p>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {LEVEL_CONFIG.map((cfg, i) => (
                        <div key={cfg.level} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${cfg.color}44` }}>
                            <div className="text-2xl mb-1">{i === 0 ? "🌱" : i === 1 ? "🔥" : "⚡"}</div>
                            <div className="font-black text-sm mb-0.5" style={{ color: cfg.color }}>Cấp {cfg.level}: {cfg.label}</div>
                            <div className="text-blue-400 text-xs leading-relaxed">{cfg.desc}</div>
                        </div>
                    ))}
                </div>
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 mb-5 text-xs text-yellow-300 text-center leading-relaxed">
                    💡 <strong>Combo:</strong> 3 đúng liên tiếp → ×1.5 điểm · 5 đúng liên tiếp → ×2 điểm<br />
                    �️ <strong>Thẻ bẫy ẩn:</strong> Một số hoạt động không thuộc chức năng tiền tệ nào — thả nhầm sẽ bị phạt!
                </div>
                <div className="text-center">
                    <motion.button onClick={() => startLevel(0)}
                        className="px-10 py-3.5 rounded-2xl font-black text-lg text-white shadow-lg"
                        style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}
                        whileHover={{ scale: 1.06, boxShadow: "0 0 30px #7c3aed88" }}
                        whileTap={{ scale: 0.95 }}>
                        🚀 BẮT ĐẦU
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );

    // ── LEVEL END ──
    if (phase === "level_end") return (
        <motion.div className="rounded-2xl overflow-hidden" style={{ background: "rgba(3,7,50,0.95)", border: `1px solid ${levelConfig.color}44` }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="p-5 text-center" style={{ background: `linear-gradient(135deg,${levelConfig.color}22,${levelConfig.color}11)`, borderBottom: `1px solid ${levelConfig.color}33` }}>
                <div className="text-5xl mb-2">
                    {levelIdx < LEVEL_CONFIG.length - 1 ? "🎯" : "🏆"}
                </div>
                <h2 className="text-2xl font-black text-white">
                    {levelIdx < LEVEL_CONFIG.length - 1 ? `Cấp ${levelConfig.level} hoàn thành!` : "Game Over – Xuất sắc!"}
                </h2>
            </div>
            {levelEndData && (
                <div className="p-5 grid grid-cols-2 gap-3 text-center">
                    {[
                        { label: "Điểm kỹ năng", value: `+${levelEndData.levelScore - levelEndData.timeBonus - levelEndData.survivBonus}`, color: "#60a5fa" },
                        { label: "Thưởng thời gian", value: `+${levelEndData.timeBonus}`, color: "#34d399", sub: `${levelEndData.timeRemaining}s còn lại × 2` },
                        { label: "Né bẫy thành công", value: `+${levelEndData.survivBonus}`, color: "#f59e0b", sub: `${levelEndData.bombsSurvived} thẻ × 15đ` },
                        { label: "Tổng cấp này", value: levelEndData.levelScore, color: "#c084fc", bold: true },
                    ].map((row) => (
                        <div key={row.label} className="rounded-xl p-3" style={{ background: `${row.color}15`, border: `1px solid ${row.color}33` }}>
                            <div className="text-xs text-blue-400 mb-0.5">{row.label}</div>
                            <div className={`font-black text-xl ${row.bold ? "" : ""}`} style={{ color: row.color }}>{row.value}</div>
                            {row.sub && <div className="text-xs text-blue-500 mt-0.5">{row.sub}</div>}
                        </div>
                    ))}
                </div>
            )}
            <div className="px-5 pb-5 flex items-center justify-between">
                <div className="text-blue-300 text-sm">Tổng tích lũy: <span className="text-yellow-300 font-black text-lg">{grandTotal}</span></div>
                <motion.button onClick={nextLevel}
                    className="px-8 py-2.5 rounded-xl font-black text-white text-sm shadow-lg"
                    style={{ background: levelIdx < LEVEL_CONFIG.length - 1 ? "linear-gradient(135deg,#1d4ed8,#7c3aed)" : "linear-gradient(135deg,#b45309,#92400e)" }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {levelIdx < LEVEL_CONFIG.length - 1 ? `→ Cấp ${levelIdx + 2}: ${LEVEL_CONFIG[levelIdx + 1].label}` : "🏆 Xem kết quả"}
                </motion.button>
            </div>
        </motion.div>
    );

    // ── FINISHED ──
    if (phase === "finished") {
        const stars = getStars(grandTotal, maxScore);
        return (
            <motion.div className="rounded-2xl overflow-hidden" style={{ background: "rgba(3,7,50,0.95)", border: "1px solid #fbbf2466" }}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="p-6 text-center" style={{ background: "linear-gradient(135deg,#78350f,#451a03)" }}>
                    <div className="text-6xl mb-3">🏆</div>
                    <h2 className="text-3xl font-black text-yellow-300">Hoàn thành!</h2>
                    <div className="text-5xl mt-3">{Array.from({ length: 3 }, (_, i) => i < stars ? "⭐" : "☆").join("")}</div>
                </div>
                <div className="p-5">
                    <div className="text-center mb-5">
                        <div className="text-blue-400 text-sm mb-1">Tổng điểm</div>
                        <div className="text-yellow-300 font-black text-5xl">{grandTotal}</div>
                        <div className="text-blue-500 text-xs mt-1">/ {maxScore} điểm tối đa · Combo cao nhất: {maxStreak}🔥</div>
                    </div>
                    {leaderboard.length > 0 && (
                        <div className="rounded-xl border border-yellow-400/30 overflow-hidden mb-5">
                            <div className="px-4 py-2 text-center text-yellow-400 font-bold text-sm uppercase tracking-widest" style={{ background: "rgba(251,191,36,0.1)" }}>🏅 Bảng Xếp Hạng</div>
                            {leaderboard.map((s, i) => (
                                <div key={i} className="flex items-center justify-between px-4 py-2.5 border-t border-white/5">
                                    <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
                                    <span className="font-black text-white">{s} điểm</span>
                                    {i === 0 && s === grandTotal && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">Bạn!</span>}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center">
                        <motion.button onClick={() => { grandTotalRef.current = 0; startLevel(0); }}
                            className="px-8 py-2.5 rounded-xl font-black text-white"
                            style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            ↺ Chơi lại
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── PLAYING ──
    const remaining = cards.filter(c => !c.isBomb).length;
    return (
        <div className="relative">
            {/* Screen Flash */}
            <AnimatePresence>
                {screenFlash && (
                    <motion.div className="fixed inset-0 pointer-events-none z-40 rounded-2xl"
                        style={{ background: screenFlash === "green" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.2)" }}
                        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.38 }} />
                )}
            </AnimatePresence>

            {/* Floating Texts */}
            <div className="fixed inset-0 pointer-events-none z-50">
                <AnimatePresence>
                    {floats.map(f => (
                        <motion.div key={f.id}
                            className="absolute font-black text-xl drop-shadow-lg"
                            style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color }}
                            initial={{ opacity: 1, y: 0, scale: 0.8 }}
                            animate={{ opacity: 0, y: -70, scale: 1.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}>
                            {f.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <motion.div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${levelConfig.color}44` }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

                {/* ── Header Bar ── */}
                <div className="px-4 py-3" style={{ background: "linear-gradient(90deg,#1e3a8a,#1e40af)" }}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Level badge */}
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 rounded-lg font-black text-xs" style={{ background: `${levelConfig.color}33`, color: levelConfig.color, border: `1px solid ${levelConfig.color}55` }}>
                                CẤP {levelConfig.level} · {levelConfig.label}
                            </div>
                            <div className="text-white/60 text-xs">{remaining} còn lại</div>
                        </div>
                        {/* Stats */}
                        <div className="flex items-center gap-2">
                            {/* Combo */}
                            {streak >= 3 && (
                                <motion.div className="px-2.5 py-1 rounded-lg font-black text-xs"
                                    style={{ background: `${multInfo.color}33`, color: multInfo.color, border: `1px solid ${multInfo.color}55` }}
                                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.4, repeat: Infinity }}>
                                    🔥 {streak} {multInfo.label}
                                </motion.div>
                            )}
                            <div className="text-center bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-2.5 py-1 min-w-12">
                                <div className="text-yellow-300 font-black text-xl leading-none">{score}</div>
                                <div className="text-yellow-600 text-xs">điểm</div>
                            </div>
                            <div className="text-center bg-red-400/10 border border-red-400/30 rounded-lg px-2.5 py-1 min-w-12">
                                <div className="text-red-300 font-black text-xl leading-none">{wrongCount}</div>
                                <div className="text-red-600 text-xs">sai</div>
                            </div>
                            <motion.button
                                onClick={() => { grandTotalRef.current = 0; scoreRef.current = 0; startLevel(0); }}
                                className="text-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-2.5 py-1 min-w-12 transition-colors"
                                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                                title="Chơi lại từ đầu">
                                <div className="text-white font-black text-xl leading-none">↺</div>
                                <div className="text-white/50 text-xs">lại</div>
                            </motion.button>
                        </div>
                    </div>

                    {/* Timer bar */}
                    <div className="mt-3 flex items-center gap-3">
                        <motion.div
                            className="font-black text-2xl w-10 text-center"
                            style={{ color: timerColor }}
                            animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}>
                            {timeLeft}
                        </motion.div>
                        <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                            <motion.div className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${timerColor}, ${timerColor}aa)`, boxShadow: `0 0 8px ${timerColor}88` }}
                                animate={{ width: `${timePct * 100}%` }}
                                transition={{ duration: 0.5, ease: "linear" }} />
                        </div>
                    </div>
                </div>

                {/* ── Cards Area ── */}
                <div className="p-4" style={{ background: "rgba(5,10,50,0.9)" }}>
                    <p className="text-blue-400 text-xs text-center mb-3 font-medium">— Kéo thả thẻ vào giỏ đúng chức năng —</p>
                    <AnimatePresence>
                        {cards.length === 0 ? (
                            <motion.div key="empty" className="text-center py-6"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="text-4xl mb-2">✅</div>
                                <div className="text-green-400 font-bold text-sm">Đã phân loại xong!</div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {cards.map(card => (
                                    <DraggableCard key={card.id} card={card} status={results[card.id]} onDropped={handleDropped} />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Buckets ── */}
                <div className="p-4 border-t border-blue-900/60" style={{ background: "rgba(3,4,40,0.97)" }}>
                    <p className="text-blue-400 text-xs text-center mb-3 font-medium">— Giỏ phân loại —</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {FUNCTIONS.map(fn => {
                            const isShake = shakeBucket === fn.id;
                            const isCelebrate = celebrateBucket === fn.id;
                            const isOver = dragOverBucket === fn.id;
                            const count = bucketCounts[fn.id] || 0;
                            return (
                                <motion.div key={fn.id}
                                    data-bucket-id={fn.id}
                                    className={`rounded-xl border-2 ${fn.border} ${fn.bg} p-3 flex flex-col items-center gap-1 relative`}
                                    style={{
                                        minHeight: 88,
                                        boxShadow: isOver ? `0 0 22px 4px ${fn.borderColor}77` : "none",
                                        transition: "box-shadow 0.15s",
                                    }}
                                    animate={isShake ? { x: [-5, 5, -4, 4, -2, 2, 0] } : isCelebrate ? { scale: [1, 1.15, 1] } : { x: 0, scale: 1 }}
                                    transition={{ duration: 0.38 }}
                                    onDrop={e => handleDragDrop(e, fn.id)}
                                    onDragOver={e => { e.preventDefault(); setDragOverBucket(fn.id); }}
                                    onDragLeave={() => setDragOverBucket(null)}>
                                    <AnimatePresence>
                                        {count > 0 && (
                                            <motion.div key={`b-${fn.id}-${count}`}
                                                className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black text-white z-10"
                                                style={{ background: fn.borderColor, boxShadow: `0 0 8px ${fn.borderColor}` }}
                                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 15 }}>
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
            </motion.div>
        </div>
    );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function EuroPage() {
    return (
        <div className="min-h-screen text-white overflow-x-hidden"
            style={{ background: "linear-gradient(135deg,#03045e 0%,#0d1b4b 40%,#1a1a2e 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

            {/* Starfield */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(28)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-yellow-300"
                        style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 65}%`, opacity: Math.random() * 0.5 + 0.15 }}
                        animate={{ opacity: [0.15, 0.85, 0.15] }}
                        transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2.5 }} />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">

                {/* Return */}
                <div className="pt-6 mb-2">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-sm">
                        ← Về Trang Chủ
                    </Link>
                </div>

                {/* Header */}
                <motion.header className="text-center pt-10 pb-8" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1 text-yellow-300 text-sm font-semibold mb-4 tracking-widest uppercase"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        📅 Tháng 1 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 1: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Kỷ nguyên đồng Euro
                        </span>
                    </motion.h1>
                </motion.header>

                {/* Event Card */}
                <motion.section className="rounded-2xl border border-blue-500/30 p-6 mb-8 relative overflow-hidden"
                    style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">💶</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">1 tháng 1, 1999</div>
                            <h2 className="text-xl font-bold text-white mb-2">Đồng Euro ra đời - Bước ngoặt kinh tế chính trị châu Âu</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Vào ngày <strong className="text-yellow-300">1/1/1999</strong>, đồng Euro (€) chính thức được ra mắt như một đồng tiền kế toán tại <strong className="text-white">11 quốc gia thành viên EU</strong> ban đầu. Đây là sự kiện lịch sử chưa từng có — lần đầu tiên các quốc gia có chủ quyền tự nguyện từ bỏ đồng tiền quốc gia để dùng chung một đồng tiền thống nhất.
                            </p>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Đến năm <strong className="text-white">2002</strong>, tiền giấy và xu Euro chính thức lưu thông. Hiện nay, Euro là đồng tiền dự trữ thứ 2 thế giới, sử dụng tại <strong className="text-yellow-300">20 quốc gia</strong> Eurozone.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* 5 Functions */}
                <motion.section className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-5">✦ 5 Chức năng của Tiền tệ ✦</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {FUNCTIONS.map((fn, i) => (
                            <motion.div key={fn.id} className={`rounded-xl border ${fn.border} ${fn.bg} p-4 flex gap-3 items-start`}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
                                <div className="text-2xl flex-shrink-0">{fn.icon}</div>
                                <div>
                                    <div className="font-bold text-white text-sm mb-1">{fn.label}</div>
                                    <div className="text-blue-300 text-xs leading-relaxed">{fn.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Video */}
                <motion.section className="mt-20 pt-16 border-t border-slate-800 pb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 p-2 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-700/50 bg-black">
                            <iframe className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/Vo3-AbcD75s"
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen />
                        </div>
                    </div>
                </motion.section>

                {/* Mini Game */}
                <MiniGame />

            </div>
        </div>
    );
}