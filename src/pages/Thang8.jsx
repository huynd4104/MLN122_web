import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
    {
        year: "1944", icon: "✍️", color: "#fbbf24", label: "Bretton Woods",
        desc: "44 quốc gia ký kết hệ thống tiền tệ quốc tế tại New Hampshire. USD neo vào vàng: 1 ounce = $35. Mọi đồng tiền neo vào USD với biên độ ±1%.",
        detail: "Mỹ nắm ~70% dự trữ vàng thế giới, trở thành trung tâm tài chính toàn cầu."
    },
    {
        year: "1965", icon: "🔫", color: "#f97316", label: "Chiến tranh Việt Nam",
        desc: "Mỹ chi hàng trăm tỷ USD cho Chiến tranh Việt Nam và chương trình 'Great Society'. In tiền vượt dự trữ vàng, các nước bắt đầu nghi ngờ sức mạnh USD.",
        detail: "Năm 1960: Nợ nước ngoài Mỹ = $21B, nhưng vàng chỉ còn $17.8B. Triffin Dilemma xuất hiện."
    },
    {
        year: "1971", icon: "💥", color: "#ef4444", label: "Nixon Shock",
        desc: "15/8/1971: Nixon tuyên bố đình chỉ chuyển đổi USD sang vàng. Bretton Woods sụp đổ. Thế giới bước vào kỷ nguyên tiền fiat.",
        detail: "\"I have directed Secretary Connally to suspend temporarily the convertibility of the dollar into gold...\" — Nixon, 15/8/1971"
    },
    {
        year: "1973", icon: "🌊", color: "#38bdf8", label: "Tỷ giá Thả nổi",
        desc: "Các nước G10 chính thức chuyển sang tỷ giá thả nổi. Vàng tự do tăng từ $35 lên $120/oz. USD không còn bị 'trói buộc' bởi vàng.",
        detail: "Giá vàng tăng vọt do không còn bị kìm hãm ở $35. Đến 1980, vàng đạt $850/oz — tăng 24 lần."
    },
];

const WORLD_REACTIONS = [
    {
        flag: "🇫🇷", country: "Pháp", color: "#3b82f6",
        reaction: "Phản ứng mạnh nhất",
        desc: "Pháp dưới thời de Gaulle đã gửi tàu chiến đến Mỹ để đổi USD lấy vàng trước khi Nixon đóng cửa sổ. Charles de Gaulle gọi USD là 'đặc quyền thái quá' của Mỹ.",
        impact: "Xúc tác chính thúc đẩy Nixon hành động"
    },
    {
        flag: "🇺🇸", country: "Mỹ", color: "#ef4444",
        reaction: "Thâm hụt kép",
        desc: "Thâm hụt ngân sách do chi chiến tranh + thâm hụt thương mại vì hàng hóa Mỹ đắt hơn Nhật/Đức. Dự trữ vàng tại Fort Knox giảm từ 20.000 tấn xuống 8.000 tấn.",
        impact: "Buộc phải hành động đơn phương"
    },
    {
        flag: "🇩🇪", country: "Đức (Tây)", color: "#fbbf24",
        reaction: "Áp lực tỷ giá",
        desc: "Đức phải nhận lượng USD khổng lồ để duy trì tỷ giá cố định. Deutsche Mark bị định giá thấp giúp xuất khẩu bùng nổ nhưng gây lạm phát nhập khẩu. Đức quyết định thả nổi DM trước Nixon.",
        impact: "Hội nhập kinh tế châu Âu tăng tốc"
    },
    {
        flag: "🇯🇵", country: "Nhật Bản", color: "#f87185",
        reaction: "Dollar shock",
        desc: "1 USD = 360 Yên suốt 22 năm (1949-1971). Sau Nixon Shock, Yên lên giá mạnh. Hàng xuất khẩu Nhật đột ngột đắt hơn — gây cú sốc cho nền kinh tế xuất khẩu.",
        impact: "Buộc Nhật tái cơ cấu kinh tế lên công nghệ cao"
    },
];

const GOODS = [
    { id: "bread", icon: "🍞", name: "Bánh mì (ổ)", base: 10000, multiplier: 1.0, unit: "VND" },
    { id: "coffee", icon: "☕", name: "Cà phê (ly)", base: 25000, multiplier: 1.2, unit: "VND" },
    { id: "house", icon: "🏠", name: "Nhà (m²)", base: 30000000, multiplier: 2.5, unit: "VND" },
];

const QUOTES = [
    { text: "Lạm phát là thuế mà không cần thông qua Quốc hội.", author: "Milton Friedman", icon: "💭" },
    { text: "Không có cách nào tinh tế hơn để phá hủy nền tảng xã hội ngoài việc phá hoại đồng tiền.", author: "John Maynard Keynes", icon: "📖" },
    { text: "Đồng Dollar là đồng tiền của chúng tôi, nhưng là vấn đề của các bạn.", author: "John Connally, Bộ trưởng Tài chính Mỹ, 1971", icon: "💵" },
    { text: "Vàng Là tiền. Mọi thứ khác chỉ là tín dụng.", author: "J.P. Morgan, 1912", icon: "🥇" },
];

const COMPARE_ROWS = [
    { label: "Tỷ giá", before: "Cố định (±1%)", after: "Thả nổi tự do", beforeColor: "#22c55e", afterColor: "#f97316" },
    { label: "Cơ sở tiền tệ", before: "Bản vị Vàng–USD", after: "Tiền Fiat (pháp định)", beforeColor: "#fbbf24", afterColor: "#8b5cf6" },
    { label: "Ổn định giá", before: "Cao — neo cứng", after: "Biến động thị trường", beforeColor: "#38bdf8", afterColor: "#f87185" },
    { label: "Linh hoạt chính sách", before: "Thấp — cứng nhắc", after: "Cao — điều chỉnh tự do", beforeColor: "#f87185", afterColor: "#22c55e" },
    { label: "Rủi ro lạm phát", before: "Thấp (bị vàng giới hạn)", after: "Cao (phụ thuộc NHTW)", beforeColor: "#22c55e", afterColor: "#ef4444" },
];

const STARS = [...Array(30)].map(() => ({
    w: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 70,
    opacity: Math.random() * 0.45 + 0.12,
    dur: 2.5 + Math.random() * 3,
    delay: Math.random() * 2.5,
}));

// ─── HELPER ──────────────────────────────────────────────────────────────────
function calcPrice(base, multiplier, level) {
    return Math.round(base * Math.pow(1 + (level / 100) * multiplier, 1 + multiplier * 0.5));
}

function fmt(n) {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + " tỷ";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + " triệu";
    return n.toLocaleString("vi-VN");
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function MoneyParticles({ level }) {
    const count = Math.max(0, 5 - Math.floor(level / 100));
    return (
        <div className="flex gap-1 justify-center my-2 h-6">
            {[...Array(5)].map((_, i) => (
                <motion.span
                    key={i}
                    className="text-lg select-none"
                    animate={{ opacity: i < count ? 1 : 0, scale: i < count ? 1 : 0.3, y: i < count ? 0 : -10 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                    💵
                </motion.span>
            ))}
        </div>
    );
}

function GoldWindow() {
    const [shocked, setShocked] = useState(false);
    const [played, setPlayed] = useState(false);

    const trigger = () => {
        if (!shocked) { setShocked(true); setPlayed(true); }
        else { setShocked(false); }
    };

    return (
        <motion.section
            className="mb-8 rounded-2xl border border-yellow-500/30 overflow-hidden"
            style={{ background: "rgba(13,20,50,0.85)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        >
            <div className="p-4 border-b border-yellow-500/20" style={{ background: "linear-gradient(90deg,#78350f,#b45309)" }}>
                <h2 className="text-base font-black text-white">🪟 Cửa sổ Vàng (Gold Window)</h2>
                <p className="text-amber-200 text-xs mt-0.5">Mối liên kết $35 ↔ 1 oz Vàng — nhấn nút để kích hoạt Nixon Shock</p>
            </div>
            <div className="p-5">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5 relative">
                    {/* USD Box */}
                    <motion.div
                        className="rounded-2xl border border-blue-400/50 p-5 text-center w-36"
                        style={{ background: "rgba(30,50,120,0.5)" }}
                        animate={shocked ? { x: [-4, 4, -3, 3, 0], opacity: 0.4 } : { x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-4xl mb-1">💵</div>
                        <div className="text-blue-300 font-black text-lg">$35</div>
                        <div className="text-blue-400/60 text-xs">USD</div>
                    </motion.div>

                    {/* Arrow / X */}
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            className="text-2xl font-black"
                            style={{ color: shocked ? "#ef4444" : "#fbbf24" }}
                            animate={shocked ? { rotate: [0, 10, -10, 0], scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            {shocked ? "✕" : "⇌"}
                        </motion.div>
                        <AnimatePresence>
                            {shocked && (
                                <motion.div
                                    className="absolute -bottom-8 whitespace-nowrap text-red-400 font-black text-xs border border-red-400/50 rounded-lg px-2 py-0.5"
                                    style={{ background: "rgba(127,29,29,0.6)" }}
                                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                >
                                    Convertibility Suspended
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Gold Box */}
                    <motion.div
                        className="rounded-2xl border border-yellow-400/50 p-5 text-center w-36"
                        style={{ background: "rgba(120,80,0,0.4)" }}
                        animate={shocked ? { x: [-4, 4, -3, 3, 0], opacity: 0.4 } : { x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                    >
                        <div className="text-4xl mb-1">🥇</div>
                        <div className="text-yellow-300 font-black text-lg">1 oz</div>
                        <div className="text-yellow-400/60 text-xs">Vàng</div>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {shocked && (
                        <motion.div
                            className="mb-4 rounded-xl border border-red-500/40 p-3 text-center"
                            style={{ background: "rgba(127,29,29,0.35)" }}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                            <div className="text-red-300 font-black text-sm">📈 Vàng tự do tăng vọt!</div>
                            <div className="text-red-200/70 text-xs mt-1">$35 → $120 (1973) → $850 (1980) → $2,800 (2024)</div>
                            <div className="text-white/40 text-xs mt-1">Không còn bị kìm hãm bởi chính sách Mỹ</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-center">
                    <motion.button
                        onClick={trigger}
                        className="px-6 py-2.5 rounded-xl font-black text-sm transition-all"
                        style={{
                            background: shocked
                                ? "linear-gradient(90deg,#1e40af,#1d4ed8)"
                                : "linear-gradient(90deg,#991b1b,#dc2626)",
                            color: "white"
                        }}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    >
                        {shocked ? "🔄 Khôi phục Bretton Woods" : "⚡ Kích hoạt Nixon Shock (15/8/1971)"}
                    </motion.button>
                </div>
            </div>
        </motion.section>
    );
}

function WorldMap() {
    const [selected, setSelected] = useState(null);
    return (
        <motion.section
            className="mb-8 rounded-2xl border border-blue-700/30 overflow-hidden"
            style={{ background: "rgba(10,15,50,0.85)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        >
            <div className="p-4 border-b border-blue-700/30" style={{ background: "linear-gradient(90deg,#1e3a8a90,#1d4ed870)" }}>
                <h2 className="text-base font-black text-white">🌍 Phản ứng Toàn cầu sau Nixon Shock</h2>
                <p className="text-blue-300 text-xs mt-0.5">Click vào quốc gia để xem phản ứng</p>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                {WORLD_REACTIONS.map((r, i) => (
                    <motion.button
                        key={r.country}
                        className="rounded-xl p-3 text-center border transition-all focus:outline-none"
                        style={{
                            borderColor: selected === i ? r.color : "rgba(255,255,255,0.08)",
                            background: selected === i ? `${r.color}20` : "rgba(255,255,255,0.03)",
                        }}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setSelected(selected === i ? null : i)}
                        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.07 }}
                    >
                        <div className="text-3xl mb-1">{r.flag}</div>
                        <div className="text-white text-xs font-bold">{r.country}</div>
                        <div className="text-xs mt-0.5 font-semibold" style={{ color: r.color }}>{r.reaction}</div>
                    </motion.button>
                ))}
            </div>
            <AnimatePresence>
                {selected !== null && (
                    <motion.div
                        key={selected}
                        className="mx-4 mb-4 rounded-xl border p-4"
                        style={{
                            borderColor: WORLD_REACTIONS[selected].color + "50",
                            background: `${WORLD_REACTIONS[selected].color}12`,
                        }}
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="flex gap-3 items-start">
                            <div className="text-3xl">{WORLD_REACTIONS[selected].flag}</div>
                            <div>
                                <div className="font-black text-sm mb-1" style={{ color: WORLD_REACTIONS[selected].color }}>
                                    {WORLD_REACTIONS[selected].country} — {WORLD_REACTIONS[selected].reaction}
                                </div>
                                <p className="text-blue-100 text-xs leading-relaxed mb-2">{WORLD_REACTIONS[selected].desc}</p>
                                <div className="text-xs font-semibold" style={{ color: WORLD_REACTIONS[selected].color }}>
                                    ⟹ {WORLD_REACTIONS[selected].impact}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

function InflationSim() {
    const [level, setLevel] = useState(0);
    const isHyper = level >= 500;

    const severity = level >= 500 ? "hyper" : level >= 300 ? "critical" : level >= 150 ? "high" : level >= 50 ? "medium" : "low";
    const colors = { low: "#22c55e", medium: "#f59e0b", high: "#f97316", critical: "#ef4444", hyper: "#dc2626" };
    const labels = { low: "✅ Ổn định", medium: "⚠️ Lạm phát vừa", high: "🚨 Lạm phát cao", critical: "💥 Siêu lạm phát!", hyper: "☠️ Hyperinflation Detected!" };
    const col = colors[severity];

    return (
        <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        >
            <div className="rounded-t-2xl p-4 sm:p-5" style={{ background: "linear-gradient(90deg,#92400e,#d97706)" }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-white">🧪 Giỏ Hàng vs Lạm phát</h2>
                        <p className="text-amber-200 text-xs mt-0.5">Kéo để tăng tiền in — xem sức mua bốc hơi</p>
                    </div>
                    <button
                        onClick={() => setLevel(0)}
                        className="bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                    >
                        🔄 Làm mới
                    </button>
                </div>
            </div>

            <motion.div
                className="p-5 border-x border-b border-amber-800/50 rounded-b-2xl"
                style={{ background: "rgba(5,15,50,0.88)" }}
                animate={isHyper ? { x: [-5, 5, -4, 4, -3, 3, 0] } : {}}
                transition={isHyper ? { duration: 0.5, repeat: Infinity } : {}}
            >
                {/* Status */}
                <motion.div
                    className="text-center font-black text-sm py-2 px-4 rounded-xl mb-4"
                    style={{ background: `${col}22`, border: `1px solid ${col}55`, color: col }}
                    animate={severity === "critical" || isHyper ? { scale: [1, 1.04, 1] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity }}
                >
                    {labels[severity]}
                </motion.div>

                {/* Money purchasing power visual */}
                <div className="mb-4">
                    <div className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1 text-center">Sức mua của $100</div>
                    <MoneyParticles level={level} />
                    <div className="text-center text-xs text-white/50">
                        {level === 0 ? "Đầy đủ sức mua" : `Mất ${Math.min(100, Math.round(level / 5))}% sức mua`}
                    </div>
                </div>

                {/* Goods grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    {GOODS.map((g) => {
                        const price = calcPrice(g.base, g.multiplier, level);
                        const ratio = price / g.base;
                        return (
                            <div key={g.id} className="rounded-xl p-3 text-center border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
                                <div className="text-3xl mb-1">{g.icon}</div>
                                <div className="text-white/60 text-xs mb-1">{g.name}</div>
                                <motion.div
                                    className="font-black text-sm"
                                    style={{ color: ratio > 5 ? "#ef4444" : ratio > 2 ? "#f97316" : "#22c55e" }}
                                    key={price}
                                    initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}
                                >
                                    {fmt(price)}
                                </motion.div>
                                <div className="text-white/30 text-xs">{g.unit}</div>
                                {level > 0 && (
                                    <div className="text-xs mt-1 font-semibold" style={{ color: col }}>
                                        ×{ratio.toFixed(1)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Slider */}
                <p className="text-blue-400 text-xs text-center mb-2 font-medium">— Mức in tiền: {level}% —</p>
                <input
                    type="range" min="0" max="500" value={level}
                    onChange={e => setLevel(Number(e.target.value))}
                    className="w-full mb-4"
                    style={{ accentColor: col }}
                />
                <div className="flex justify-between text-xs text-white/30 mb-4">
                    <span>0%</span>
                    <span className="text-amber-400">150%</span>
                    <span className="text-orange-400">300%</span>
                    <span className="text-red-400">500% 💀</span>
                </div>

                {/* Hyperinflation easter egg */}
                <AnimatePresence>
                    {isHyper && (
                        <motion.div
                            className="rounded-xl border border-red-500/60 p-4"
                            style={{ background: "rgba(127,29,29,0.5)" }}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        >
                            <div className="text-red-400 font-black text-base mb-2">☠️ HYPERINFLATION DETECTED!</div>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <div className="rounded-lg p-2.5" style={{ background: "rgba(0,0,0,0.3)" }}>
                                    <div className="text-yellow-400 font-bold text-xs mb-1">🇩🇪 Đức thời Weimar (1923)</div>
                                    <p className="text-white/70 text-xs leading-relaxed">Giá cả tăng 10× mỗi 4 ngày. Người dân dùng tiền đốt lò sưởi vì rẻ hơn củi. 1 USD = 4.2 nghìn tỷ Mark.</p>
                                </div>
                                <div className="rounded-lg p-2.5" style={{ background: "rgba(0,0,0,0.3)" }}>
                                    <div className="text-green-400 font-bold text-xs mb-1">🇿🇼 Zimbabwe (2008)</div>
                                    <p className="text-white/70 text-xs leading-relaxed">Lạm phát đạt 89.7 tỷ tỷ % mỗi tháng. In tờ 100 nghìn tỷ dollar nhưng không đủ mua 3 quả trứng.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {!isHyper && level >= 300 && (
                        <motion.div
                            className="rounded-xl border border-orange-500/50 p-3"
                            style={{ background: "rgba(120,40,0,0.35)" }}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                            <p className="text-orange-200 text-xs leading-relaxed">
                                💡 Đây là kịch bản điển hình của Venezuela (2016-2019): lạm phát trên 1,000,000% khiến dân chúng bỏ tiền bolivar, chuyển sang USD và vật đổi vật.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.section>
    );
}

function CompareTable() {
    return (
        <motion.section
            className="mb-8 rounded-2xl border border-purple-700/30 overflow-hidden"
            style={{ background: "rgba(10,5,35,0.88)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        >
            <div className="p-4 border-b border-purple-700/30" style={{ background: "linear-gradient(90deg,#4a1d9680,#6d28d960)" }}>
                <h2 className="text-base font-black text-white">⚖️ Trước & Sau Nixon Shock</h2>
            </div>
            <div className="p-4 overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr>
                            <th className="text-left text-white/40 font-semibold py-2 pr-3 w-32">Tiêu chí</th>
                            <th className="text-center text-yellow-300 font-black pb-2 px-2">🏛️ Trước 1971<br /><span className="font-normal text-white/40">Bản vị Vàng</span></th>
                            <th className="text-center text-purple-300 font-black pb-2 px-2">🌐 Sau 1971<br /><span className="font-normal text-white/40">Tiền Fiat</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPARE_ROWS.map((row, i) => (
                            <motion.tr key={row.label} className="border-t border-white/5"
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.75 + i * 0.07 }}
                            >
                                <td className="py-2.5 pr-3 text-white/50 font-semibold">{row.label}</td>
                                <td className="py-2.5 px-2 text-center">
                                    <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold"
                                        style={{ background: `${row.beforeColor}20`, color: row.beforeColor, border: `1px solid ${row.beforeColor}40` }}>
                                        {row.before}
                                    </span>
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                    <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold"
                                        style={{ background: `${row.afterColor}20`, color: row.afterColor, border: `1px solid ${row.afterColor}40` }}>
                                        {row.after}
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

function QuotesSection() {
    const [current, setCurrent] = useState(0);
    const [dir, setDir] = useState(1);
    const go = useCallback((idx, d) => { setDir(d); setCurrent((idx + QUOTES.length) % QUOTES.length); }, []);
    const variants = {
        enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0 },
        exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
    };
    return (
        <motion.section className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
            <h2 className="text-center text-base font-bold text-yellow-300 uppercase tracking-widest mb-4">💬 Trích dẫn Kinh điển</h2>
            <div className="relative rounded-2xl border border-yellow-500/25 overflow-hidden" style={{ background: "rgba(30,20,5,0.85)", backdropFilter: "blur(12px)" }}>
                <div className="absolute top-4 left-5 text-6xl text-yellow-400/12 font-serif leading-none select-none">"</div>
                <button onClick={() => go(current - 1, -1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-400/20 text-yellow-300/60 hover:text-yellow-300 transition-all focus:outline-none">‹</button>
                <button onClick={() => go(current + 1, 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-400/20 text-yellow-300/60 hover:text-yellow-300 transition-all focus:outline-none">›</button>
                <div className="overflow-hidden px-10 pt-8 pb-4">
                    <AnimatePresence mode="wait" custom={dir}>
                        <motion.div key={current} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18}
                            onDragEnd={(_, info) => { if (info.offset.x < -50) go(current + 1, 1); else if (info.offset.x > 50) go(current - 1, -1); }}
                            className="relative z-10 cursor-grab active:cursor-grabbing select-none"
                        >
                            <div className="text-3xl mb-3 text-center">{QUOTES[current].icon}</div>
                            <p className="text-yellow-100 text-sm leading-relaxed text-center italic mb-3">"{QUOTES[current].text}"</p>
                            <div className="text-yellow-400/70 text-xs text-center font-semibold uppercase tracking-widest">— {QUOTES[current].author}</div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="flex justify-center gap-2 pb-4">
                    {QUOTES.map((_, i) => (
                        <button key={i} onClick={() => go(i, i > current ? 1 : -1)}
                            className="rounded-full transition-all duration-300 focus:outline-none"
                            style={{ width: current === i ? "20px" : "8px", height: "8px", background: current === i ? "#fbbf24" : "rgba(255,255,255,0.2)" }}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
}

// ─── CORE IDEAS ───────────────────────────────────────────────────────────────
const CORE_IDEAS = [
    { id: "hinh_thai", label: "Các hình thái tiền tệ", icon: "💵", border: "border-amber-400", bg: "bg-amber-900/40", desc: "Từ tiền kim loại đến tiền giấy, tín dụng (theo giáo trình: Tiền tệ phát triển từ giá trị thực đến biểu tượng)." },
    { id: "lam_phat", label: "Lạm phát", icon: "📈", border: "border-red-400", bg: "bg-red-900/40", desc: "Tăng giá do in tiền quá mức (theo giáo trình: Giảm giá trị tiền tệ, ảnh hưởng đến lưu thông)." },
    { id: "niem_tin", label: "Niềm tin vào tiền tệ", icon: "🤝", border: "border-emerald-400", bg: "bg-emerald-900/40", desc: "Giá trị tiền giấy dựa trên niềm tin xã hội (theo giáo trình: Không cần vàng bảo đảm nếu có sự ổn định kinh tế)." },
    { id: "ban_vi_vang", label: "Bản vị vàng", icon: "🥇", border: "border-purple-400", bg: "bg-purple-900/40", desc: "Hệ thống cũ neo tiền tệ vào vàng (theo giáo trình: Bị thay thế do linh hoạt kinh tế)." },
    { id: "tien_giay", label: "Tiền giấy fiat", icon: "🏦", border: "border-sky-400", bg: "bg-sky-900/40", desc: "Giá trị từ chính sách nhà nước (theo giáo trình: Dựa vào cung cầu và niềm tin, dễ gây lạm phát)." },
];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function NixonShockPage() {
    const [activeTimeline, setActiveTimeline] = useState(null);

    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{ background: "linear-gradient(135deg,#292524 0%,#713f12 40%,#292524 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif" }}
        >
            {/* Starfield */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {STARS.map((s, i) => (
                    <motion.div key={i} className="absolute rounded-full bg-yellow-300"
                        style={{ width: s.w, height: s.w, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
                        animate={{ opacity: [s.opacity, s.opacity * 3, s.opacity] }}
                        transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">

                {/* Return */}
                <div className="pt-6 mb-2">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-sm">
                        ← Về Trang Chủ
                    </Link>
                </div>

                {/* HEADER */}
                <motion.header className="text-center pt-6 pb-8" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1 text-yellow-300 text-sm font-semibold mb-4 tracking-widest uppercase"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        📅 Tháng 8 · Sự kiện lịch sử
                    </motion.div>
                    <motion.h1 className="text-3xl sm:text-5xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-white">Tháng 8: </span>
                        <span style={{ background: "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Cú sốc Nixon
                        </span>
                    </motion.h1>
                </motion.header>

                {/* ── TIMELINE ── */}
                <motion.section className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <h2 className="text-center text-base font-bold text-yellow-300 uppercase tracking-widest mb-5">⏱ Trục Thời Gian Lịch Sử</h2>
                    <div className="relative flex items-start justify-between gap-1 overflow-x-auto pb-2 mb-4">
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 mx-8" />
                        {TIMELINE_EVENTS.map((t, i) => (
                            <div key={t.year} className="relative flex flex-col items-center flex-1 min-w-[80px] z-10">
                                <button
                                    onClick={() => setActiveTimeline(activeTimeline === i ? null : i)}
                                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-black transition-all duration-300 focus:outline-none"
                                    style={{
                                        borderColor: t.color,
                                        background: activeTimeline === i ? t.color : "rgba(5,10,30,0.9)",
                                        color: activeTimeline === i ? "#000" : t.color,
                                        boxShadow: activeTimeline === i ? `0 0 18px ${t.color}99` : undefined,
                                    }}
                                >{t.icon}</button>
                                <div className="mt-2 text-xs font-bold" style={{ color: t.color }}>{t.year}</div>
                                <div className="text-white/40 text-xs text-center px-1">{t.label}</div>
                            </div>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        {activeTimeline !== null && (
                            <motion.div key={activeTimeline} className="rounded-xl p-4 border"
                                style={{ borderColor: TIMELINE_EVENTS[activeTimeline].color + "50", background: `${TIMELINE_EVENTS[activeTimeline].color}10`, backdropFilter: "blur(8px)" }}
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                            >
                                <div className="flex gap-3">
                                    <div className="text-3xl">{TIMELINE_EVENTS[activeTimeline].icon}</div>
                                    <div>
                                        <span className="font-black text-sm" style={{ color: TIMELINE_EVENTS[activeTimeline].color }}>
                                            {TIMELINE_EVENTS[activeTimeline].year} — {TIMELINE_EVENTS[activeTimeline].label}
                                        </span>
                                        <p className="text-blue-100 text-sm leading-relaxed mt-1">{TIMELINE_EVENTS[activeTimeline].desc}</p>
                                        <p className="text-white/40 text-xs leading-relaxed mt-2 italic">{TIMELINE_EVENTS[activeTimeline].detail}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* ── EVENT CARD ── */}
                <motion.section className="rounded-2xl border border-amber-500/30 p-6 mb-8 relative overflow-hidden"
                    style={{ background: "rgba(13,27,75,0.7)", backdropFilter: "blur(12px)" }}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
                >
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "linear-gradient(180deg,#FFD700,#FFA500)" }} />
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="text-5xl">📺</div>
                        <div>
                            <div className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">15 tháng 8, 1971</div>
                            <h2 className="text-xl font-bold text-white mb-2">Cú sốc Nixon — Kết thúc bản vị vàng</h2>
                            <p className="text-blue-200 text-sm leading-relaxed mb-2">
                                Ngày 15/8/1971, Tổng thống Mỹ Richard Nixon <strong className="text-yellow-300">tuyên bố trên truyền hình</strong> chấm dứt chuyển đổi USD sang vàng, tạm dừng bản vị vàng của hệ thống Bretton Woods.
                            </p>
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {[
                                    { label: "Ngày xảy ra", value: "15/8/1971", icon: "📅" },
                                    { label: "USD mất vàng", value: "$35 → 0", icon: "🥇" },
                                    { label: "Hệ thống mới", value: "Fiat Money", icon: "🏦" },
                                ].map(f => (
                                    <div key={f.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                        <div className="text-xl mb-1">{f.icon}</div>
                                        <div className="text-white font-bold text-xs">{f.value}</div>
                                        <div className="text-white/40 text-xs mt-0.5">{f.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── GOLD WINDOW ── */}
                <GoldWindow />

                {/* ── WORLD MAP ── */}
                <WorldMap />

                {/* ── INFLATION SIM ── */}
                <InflationSim />

                {/* ── COMPARE TABLE ── */}
                <CompareTable />

                {/* ── CORE IDEAS ── */}
                <motion.section className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
                    <h2 className="text-center text-lg font-bold text-yellow-300 uppercase tracking-widest mb-5">
                        ✦ Tư tưởng cốt lõi ✦
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {CORE_IDEAS.map((idea, i) => (
                            <motion.div key={idea.id} className={`rounded-xl border ${idea.border} ${idea.bg} p-4 flex gap-3 items-start`}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }} whileHover={{ scale: 1.02 }}
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

                {/* ── QUOTES ── */}
                <QuotesSection />

                {/* ── VIDEO ── */}
                <motion.section className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                    <div className="flex justify-center">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/XH_2Vu5OhhA"
                            title="Nixon Shock 1971" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen className="rounded-xl shadow-lg w-full max-w-lg"
                        />
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
