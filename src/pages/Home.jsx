import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MONTHS = [
    { id: 1, title: "Kỷ nguyên đồng Euro", emoji: "💶", color: "from-blue-600 to-blue-900" },
    { id: 2, title: "Tuyên ngôn Đảng Cộng sản", emoji: "📕", color: "from-red-600 to-red-900" },
    { id: 3, title: "Khủng hoảng Ngân hàng Mỹ", emoji: "🏦", color: "from-gray-700 to-red-900" },
    { id: 4, title: "Cách mạng Công nghiệp 4.0", emoji: "🤖", color: "from-blue-600 to-indigo-900" },
    { id: 5, title: "Ngày Quốc tế Lao động", emoji: "✊", color: "from-red-700 to-red-950" },
    { id: 6, title: "Kế hoạch Marshall", emoji: "🇺🇸", color: "from-green-700 to-green-950" },
    { id: 7, title: "Hệ thống Bretton Woods", emoji: "🏛️", color: "from-slate-600 to-blue-900" },
    { id: 8, title: "Cú sốc Nixon", emoji: "📺", color: "from-amber-700 to-amber-950" },
    { id: 9, title: "Sụp đổ Lehman Brothers", emoji: "🏦", color: "from-red-700 to-red-950" },
    { id: 10, title: "Thứ Năm Đen Tối 1929", emoji: "📉", color: "from-red-800 to-red-950" },
    { id: 11, title: "Sắp ra mắt...", emoji: "⏳", color: "from-gray-600 to-gray-800" },
    { id: 12, title: "Sắp ra mắt...", emoji: "⏳", color: "from-gray-600 to-gray-800" },
];

export default function Home() {
    return (
        <div className="min-h-screen p-6 sm:p-8 text-white overflow-x-hidden flex flex-col pt-8 sm:pt-16" style={{ background: "linear-gradient(135deg,#020617 0%,#0f172a 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            <div className="max-w-6xl mx-auto flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {MONTHS.map((month, index) => (
                        <motion.div
                            key={month.id}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className="h-full"
                        >
                            <Link to={`/thang${month.id}`} className="block h-full cursor-pointer focus:outline-none">
                                <div className={`h-full rounded-3xl p-6 bg-gradient-to-br ${month.color} border border-white/10 shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-yellow-500/10`}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                                    {/* Small accent glow top-left */}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-white/20 transition-colors duration-300"></div>

                                    <div className="relative z-10 flex flex-col items-center text-center gap-4 h-full justify-center">
                                        <div className="text-6xl drop-shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                            {month.emoji}
                                        </div>
                                        <div>
                                            <div className="font-black text-yellow-300 tracking-widest text-sm mb-1 uppercase opacity-90">Tháng {month.id}</div>
                                            <div className="font-bold text-lg leading-snug drop-shadow-md">{month.title}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.footer
                className="text-center mt-20 pb-8 text-slate-500 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                Hệ thống 12 tháng học tập Tương tác · {new Date().getFullYear()}
            </motion.footer>
        </div>
    );
}
