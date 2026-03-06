import { useState, useRef, useEffect, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";

// Lazy-load globe
const Globe = lazy(() => import("react-globe.gl"));

// ── DATA ─────────────────────────────────────────────────────────────────────
const VN_COORD = { lat: 21.0285, lng: 105.8542 }; // Hà Nội

const PARTNERS = [
    { id: "usa", name: "United States", trade: 123, exportAmt: 109, importAmt: 14, fdi: 15, lat: 38.9072, lng: -77.0369, impact: "Thị trường xuất khẩu tỷ đô, tăng trưởng 20x từ 2006 đến 2023.", risk: "Thị trường xuất khẩu chủ lực nhưng đối mặt với rào cản phòng vệ thương mại, nguy cơ bị áp thuế chống bán phá giá." },
    { id: "cn", name: "China", trade: 147, exportAmt: 58, importAmt: 89, fdi: 25, lat: 39.9042, lng: 116.4074, impact: "Đối tác thương mại lớn nhất, cung cấp nguyên phụ liệu quan trọng.", risk: "Thâm hụt thương mại kỷ lục (trên 60 tỷ USD), rủi ro đứt gãy chuỗi cung ứng khi phụ thuộc lớn vào nguồn nguyên liệu." },
    { id: "eu", name: "European Union", trade: 68, exportAmt: 48, importAmt: 20, fdi: 28, lat: 50.85, lng: 4.35, impact: "Hiệp định thế hệ mới EVFTA, GDP Việt Nam tăng thêm 2.4%.", risk: "Lợi ích từ EVFTA lớn nhưng rất khắt khe về tiêu chuẩn xanh (Carbon Tax), truy xuất nguồn gốc môi trường và lao động." },
    { id: "jp", name: "Japan", trade: 48, exportAmt: 24, importAmt: 24, fdi: 70, lat: 35.6762, lng: 139.6503, impact: "Đối tác chiến lược toàn diện, cung cấp ODA lớn nhất cho hạ tầng.", risk: "Yêu cầu khắt khe về chất lượng nông thủy sản, già hóa dân số làm giảm sức mua tổng thể." },
    { id: "kr", name: "South Korea", trade: 87, exportAmt: 25, importAmt: 62, fdi: 82, lat: 37.5665, lng: 126.9780, impact: "Nguồn FDI hàng đầu, mũi nhọn hiện đại hóa công nghiệp điện tử.", risk: "Samsung đóng góp ~20% tổng kim ngạch xuất khẩu của Việt Nam - rủi ro phụ thuộc lớn vào quyết định của các tập đoàn FDI đa quốc gia." },
    { id: "asean", name: "ASEAN", trade: 55, exportAmt: 25, importAmt: 30, fdi: 35, lat: 13.7563, lng: 100.5018, impact: "Thị trường láng giềng, hưởng lợi lớn từ các hiệp định khu vực AFTA.", risk: "Cạnh tranh trực tiếp khốc liệt với các nước có cơ cấu xuất khẩu và sản phẩm tương đồng." },
];

const TOUR_STOPS = ["usa", "cn", "eu", "jp", "kr"];

// ── COMPONENTS ───────────────────────────────────────────────────────────────

const CountUp = ({ end, duration = 2, suffix = "", prefix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            // ease out quart
            const easeOut = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ── GLOBE SECTION ────────────────────────────────────────────────────────────
function GlobeSection({ selected, onSelect, flowFilter, tariff }) {
    const globeRef = useRef();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (ready && selected && globeRef.current) {
            globeRef.current.pointOfView({ lat: selected.lat, lng: selected.lng, altitude: 1.5 }, 1200);
        }
    }, [selected, ready]);

    const handleGlobeReady = useCallback(() => {
        setReady(true);
        if (globeRef.current) {
            globeRef.current.pointOfView({ lat: VN_COORD.lat, lng: VN_COORD.lng, altitude: 2 }, 0);
        }
    }, []);

    const arcsData = PARTNERS.map((p) => {
        let startLat, startLng, endLat, endLng, color;
        // Direction and color logic
        if (flowFilter === 'export') {
            startLat = VN_COORD.lat; startLng = VN_COORD.lng; endLat = p.lat; endLng = p.lng;
            color = ["rgba(34,197,94,0.1)", "rgba(34,197,94,1)"]; // Xuất khẩu: Green
        } else if (flowFilter === 'import') {
            startLat = p.lat; startLng = p.lng; endLat = VN_COORD.lat; endLng = VN_COORD.lng;
            color = ["rgba(239,68,68,0.1)", "rgba(239,68,68,1)"]; // Nhập khẩu: Red
        } else if (flowFilter === 'fdi') {
            startLat = p.lat; startLng = p.lng; endLat = VN_COORD.lat; endLng = VN_COORD.lng;
            color = ["rgba(251,191,36,0.1)", "rgba(251,191,36,1)"]; // FDI: Yellow
        } else {
            // all
            if (p.exportAmt > p.importAmt) {
                startLat = VN_COORD.lat; startLng = VN_COORD.lng; endLat = p.lat; endLng = p.lng;
                color = ["rgba(34,197,94,0.1)", "rgba(34,197,94,1)"];
            } else {
                startLat = p.lat; startLng = p.lng; endLat = VN_COORD.lat; endLng = VN_COORD.lng;
                color = ["rgba(239,68,68,0.1)", "rgba(239,68,68,1)"];
            }
        }

        const tradeVolume = flowFilter === 'export' ? p.exportAmt : flowFilter === 'import' ? p.importAmt : flowFilter === 'fdi' ? p.fdi : p.trade;
        const tariffEffect = tariff / 40; // 0 to 1

        const activeTradeVol = Math.max(1, tradeVolume * (1 - tariffEffect * 0.8)); // 80% loss at 40% tariff
        const strokeValue = Math.max(0.1, (activeTradeVol / 100) * 1.5);
        const dashLength = Math.max(0.01, 0.5 - tariffEffect * 0.4);
        const dashGap = 0.2 + tariffEffect;
        const animateTime = 1500 + tariffEffect * 5000;

        return { startLat, startLng, endLat, endLng, color, stroke: strokeValue, dashLength, dashGap, animateTime, p };
    });

    const pointsData = PARTNERS.map((p) => {
        const tariffEffect = tariff / 40;
        return {
            ...p,
            size: Math.max(0.1, (p.trade / 150) * (1 - tariffEffect * 0.5)),
            color: selected?.id === p.id ? "#38bdf8" : (flowFilter === 'import' ? "#ef4444" : flowFilter === 'fdi' ? "#fbbf24" : "#22c55e"),
        };
    });

    // Add Vietnam Point
    pointsData.push({
        id: "vn", name: "Việt Nam", lat: VN_COORD.lat, lng: VN_COORD.lng, size: 0.3, color: "#fff"
    });

    return (
        <Suspense fallback={<div className="h-[400px] flex items-center justify-center text-green-300">Khởi tạo dữ liệu không gian...</div>}>
            <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
                <Globe
                    ref={globeRef}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                    backgroundColor="rgba(0,0,0,0)"
                    arcsData={arcsData}
                    arcDashLength="dashLength"
                    arcDashGap="dashGap"
                    arcDashAnimateTime="animateTime"
                    arcStroke="stroke"
                    arcColor="color"
                    pointsData={pointsData}
                    pointAltitude="size"
                    pointColor="color"
                    pointRadius="size"
                    onPointClick={(point) => {
                        if (point.id !== "vn") onSelect(point);
                    }}
                    onGlobeReady={handleGlobeReady}
                    width={800}
                    height={400}
                />
            </div>
        </Suspense>
    );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Thang12Page() {
    const [selected, setSelected] = useState(null);
    const [flowFilter, setFlowFilter] = useState('all');
    const [tariff, setTariff] = useState(0);
    const [touring, setTouring] = useState(false);
    const [tourIndex, setTourIndex] = useState(0);

    // Tour Logic
    useEffect(() => {
        if (!touring) return;
        setSelected(PARTNERS.find(p => p.id === TOUR_STOPS[tourIndex]));

        const timer = setInterval(() => {
            setTourIndex((prev) => {
                const next = (prev + 1) % TOUR_STOPS.length;
                setSelected(PARTNERS.find(p => p.id === TOUR_STOPS[next]));
                return next;
            });
        }, 5000); // 5 seconds per stop

        return () => clearInterval(timer);
    }, [touring, tourIndex]);

    const handleStartTour = () => {
        if (!touring) {
            setTourIndex(0);
            setTouring(true);
        } else {
            setTouring(false);
        }
    };

    // Derived Statistics based on tariff
    const gdpGrowthRate = Math.max(0.5, 6.5 - (tariff / 40) * 5.0).toFixed(1);
    const totalTrade = 732; // base 2023 approx
    const currentTradeVol = Math.max(100, Math.floor(totalTrade * (1 - (tariff / 40) * 0.6)));

    return (
        <div className="min-h-screen text-white/90 selection:bg-emerald-500 selection:text-white" style={{ background: "linear-gradient(to bottom, #022c22, #064e3b)" }}>
            <div className="max-w-5xl mx-auto px-6 py-6 relative z-10">
                {/* ── RETURN BUTTON ── */}
                <div className="pt-6 mb-2">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-medium backdrop-blur-sm">
                        ← Về Trang Chủ
                    </Link>
                </div>

                {/* Header */}
                <motion.header className="text-center mb-12" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <motion.div className="inline-flex items-center gap-2 bg-emerald-400/20 border border-emerald-400/40 rounded-full px-4 py-1.5 text-emerald-300 text-sm font-bold tracking-widest uppercase mb-6">
                        📅 Tháng 12 · Kỷ Nguyên Hội Nhập
                    </motion.div>
                    <motion.h1 className="font-black leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
                        <span className="text-3xl md:text-5xl text-white block mb-2 opacity-90">Việt Nam sau WTO: </span>
                        <span className="text-5xl md:text-7xl block mt-2" style={{ background: "linear-gradient(90deg,#34d399,#a7f3d0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Vươn Ra Biển Lớn</span>
                    </motion.h1>
                    <p className="text-emerald-200 text-lg max-w-2xl mx-auto leading-relaxed">Mô phỏng dòng chảy thương mại quốc tế, rủi ro, và động lực tăng trưởng của Việt Nam từ khi gia nhập Tổ chức Thương mại Thế giới năm 2006.</p>
                </motion.header>

                {/* Before & After WTO Panel */}
                <motion.section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="bg-emerald-950/60 border border-emerald-800/50 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 text-9xl opacity-10">🔙</div>
                        <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4">Năm 2000 (Trước WTO)</h3>
                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-emerald-100">Kim ngạch xuất khẩu</span>
                                <span className="text-2xl font-black text-white">14.4<span className="text-sm font-normal text-emerald-400 ml-1">tỷ USD</span></span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-emerald-100">GDP bình quân</span>
                                <span className="text-2xl font-black text-white">390<span className="text-sm font-normal text-emerald-400 ml-1">USD/người</span></span>
                            </div>
                            <div className="text-sm text-emerald-300/70 italic mt-4">Kinh tế chủ yếu là nông nghiệp, thị trường khép kín.</div>
                        </div>
                    </div>
                    <div className="bg-emerald-900/60 border border-emerald-500/50 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <div className="absolute -bottom-10 -right-10 text-9xl opacity-20">🚀</div>
                        <h3 className="text-emerald-300 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Năm 2023 (Hiện Đại)
                        </h3>
                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-emerald-50">Kim ngạch xuất khẩu</span>
                                <span className="text-4xl font-black text-emerald-300 drop-shadow-md">
                                    <CountUp end={355} duration={3} />
                                    <span className="text-base font-bold text-emerald-400 ml-1">tỷ USD</span>
                                </span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-emerald-50">GDP bình quân</span>
                                <span className="text-4xl font-black text-emerald-300 drop-shadow-md">
                                    <CountUp end={4284} duration={3.5} />
                                    <span className="text-base font-bold text-emerald-400 ml-1">USD/người</span>
                                </span>
                            </div>
                            <div className="text-sm text-emerald-200 mt-4 leading-relaxed bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/50">
                                Chuyển dịch mạnh mẽ sang công nghiệp phụ trợ, lắp ráp điện tử và dệt may toàn cầu. Đứng Top 20 nền kinh tế thương mại thế giới.
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 3D Global Trade Simulation */}
                <motion.section className="mb-10 rounded-2xl border border-emerald-700/50 bg-emerald-950/80 backdrop-blur-xl overflow-hidden shadow-2xl relative"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>

                    {/* Toolbar */}
                    <div className="p-4 border-b border-emerald-800/50 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-black/20">
                        <div>
                            <h2 className="text-xl font-black flex items-center gap-2">
                                🌍 Trục Thương Mại Quốc Tế
                            </h2>
                            <p className="text-emerald-400 text-sm mt-1">Dòng chảy hàng hóa & vốn đầu tư trực tiếp (FDI)</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={handleStartTour} className={`px-4 py-2 rounded-full font-bold text-sm transition-all focus:outline-none flex items-center gap-2 ${touring ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-emerald-800/80 text-white hover:bg-emerald-700'}`}>
                                {touring ? (
                                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="6" y="6" width="12" height="12" rx="1" ry="1"></rect></svg> Dừng Tour</>
                                ) : (
                                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><polygon points="6 4 20 12 6 20 6 4" rx="1" ry="1"></polygon></svg> Bắt đầu Khám Phá</>
                                )}
                            </button>
                            <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block"></div>
                            {['all', 'export', 'import', 'fdi'].map((f) => (
                                <button key={f} onClick={() => setFlowFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${flowFilter === f ?
                                        (f === 'export' ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' :
                                            f === 'import' ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                                                f === 'fdi' ? 'bg-amber-500 border-amber-300 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                                                    'bg-emerald-500 border-emerald-300 text-white') : 'bg-emerald-900/50 border-emerald-800 text-emerald-300 hover:bg-emerald-800/80'}`}>
                                    {f === 'all' ? 'Tất cả' : f === 'export' ? 'Xuất khẩu' : f === 'import' ? 'Nhập khẩu' : 'FDI'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[400px]">
                        {/* Interactive Sidebar */}
                        <div className="col-span-1 border-r border-emerald-800/50 p-5 bg-gradient-to-b from-black/20 to-transparent flex flex-col justify-between order-2 lg:order-1">
                            <div>
                                <h3 className="text-emerald-300 font-bold uppercase text-xs tracking-widest mb-4">Mô phỏng Thuế & Tự Do Hóa (Tariff Simulation)</h3>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-emerald-100">Rào cản thuế quan</span>
                                        <span className="font-bold text-amber-400">{tariff}%</span>
                                    </div>
                                    <input type="range" min="0" max="40" value={tariff} onChange={(e) => setTariff(Number(e.target.value))}
                                        className="w-full accent-amber-500 h-2 bg-emerald-900 rounded-lg appearance-none cursor-pointer" />
                                    <div className="flex justify-between text-[10px] text-emerald-400/50 mt-1 uppercase">
                                        <span>Tự do (0%)</span>
                                        <span>Bảo hộ cực đoan (40%)</span>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 rounded-xl border border-emerald-700/50 bg-emerald-950">
                                    <div className="mb-1">
                                        <div className="text-[10px] text-emerald-400 uppercase tracking-widest">Dự phóng Tổng kim ngạch</div>
                                        <div className="text-2xl font-black text-white">{currentTradeVol} <span className="text-sm font-normal text-emerald-500">tỷ USD</span></div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-emerald-400 uppercase tracking-widest">Động lực GDP Growth</div>
                                        <div className={`text-2xl font-black ${gdpGrowthRate < 3 ? 'text-red-400' : 'text-emerald-300'}`}>+{gdpGrowthRate}%</div>
                                    </div>
                                    <p className="text-xs text-emerald-300/80 italic pt-2 border-t border-emerald-800">
                                        Giáo trình Kinh tế Chính trị: Tự do hóa thương mại là xu thế tất yếu. Thuế quan càng thấp, dòng chảy thương mại càng mạnh, thúc đẩy lợi thế so sánh cạnh tranh.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Globe Canvas */}
                        <div className="col-span-1 lg:col-span-3 relative order-1 lg:order-2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-black/60">
                            {/* Overlay Stats */}
                            <AnimatePresence mode="wait">
                                {selected && (
                                    <motion.div key={selected.id} className="absolute top-4 right-4 z-20 w-72 bg-emerald-950/90 border border-emerald-600/50 rounded-xl p-4 shadow-2xl backdrop-blur-md"
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-black text-xl text-white">{selected.name}</h3>
                                            <button onClick={() => setSelected(null)} className="text-emerald-500 hover:text-white transition-colors bg-emerald-900 rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="bg-green-900/40 rounded p-2 border border-green-800/50">
                                                <div className="text-[10px] text-green-400 uppercase">Xuất khẩu</div>
                                                <div className="font-bold text-green-100">{selected.exportAmt}B</div>
                                            </div>
                                            <div className="bg-red-900/40 rounded p-2 border border-red-800/50">
                                                <div className="text-[10px] text-red-400 uppercase">Nhập khẩu</div>
                                                <div className="font-bold text-red-100">{selected.importAmt}B</div>
                                            </div>
                                        </div>

                                        <div className="mb-3 p-2 bg-amber-900/20 rounded border border-amber-800/30">
                                            <div className="text-[10px] text-amber-400 uppercase fw-bold">Vốn FDI Tích lũy</div>
                                            <div className="font-bold text-amber-100">~{selected.fdi} Tỷ USD</div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-xs font-bold text-emerald-300 mb-1 flex items-center gap-1">🌟 Đóng góp Giá trị</div>
                                                <p className="text-xs text-emerald-100/90 leading-relaxed">{selected.impact}</p>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-red-300 mb-1 flex items-center gap-1">⚠️ Cảnh báo Rủi ro</div>
                                                <p className="text-xs text-red-100/80 leading-relaxed italic border-l-2 border-red-500/50 pl-2">{selected.risk}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <GlobeSection selected={selected} onSelect={setSelected} flowFilter={flowFilter} tariff={tariff} />

                            {/* Legend */}
                            <div className="absolute bottom-4 left-4 z-10 flex gap-4 text-[10px] font-bold uppercase bg-black/50 p-2 rounded-lg backdrop-blur-sm pointer-events-none">
                                <div className="flex items-center gap-2"><span className="w-3 h-1 rounded bg-green-500 shadow-[0_0_5px_#22c55e]"></span> Việt Nam Xuất khẩu</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-1 rounded bg-red-500 shadow-[0_0_5px_#ef4444]"></span> Việt Nam Nhập khẩu</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-1 rounded bg-amber-400 shadow-[0_0_5px_#fbb117]"></span> FDI đổ vào Việt Nam</div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Supply Chain Visualization */}
                <motion.section className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <h2 className="text-center text-lg font-bold text-emerald-400 uppercase tracking-widest mb-6 border-b border-emerald-800/50 pb-2 inline-block">
                        Vị thế trong chuỗi giá trị toàn cầu
                    </h2>

                    <div className="relative">
                        {/* Connecting Line background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-emerald-800 via-emerald-400 to-amber-500 -translate-y-1/2 z-0 hidden md:block opacity-30"></div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full px-2">
                            {/* Step 1 */}
                            <div className="bg-emerald-950 border border-emerald-600 rounded-2xl p-5 text-center w-full md:w-1/3 shadow-xl transform transition-transform hover:-translate-y-2">
                                <div className="text-4xl mb-3">🏭</div>
                                <h4 className="font-bold text-emerald-300 uppercase mb-2">Sản xuất & Lắp ráp</h4>
                                <p className="text-xs text-emerald-100/70">Nhập khẩu nguyên liệu (Từ Trung Quốc, Hàn Quốc). Tận dụng lao động, ưu đãi thuế để gia công và lắp ráp thành phẩm (Điện tử, Dệt may).</p>
                            </div>

                            <div className="text-emerald-500 animate-pulse text-2xl rotate-90 md:rotate-0">➔</div>

                            {/* Step 2 */}
                            <div className="bg-blue-950 border border-blue-600 rounded-2xl p-5 text-center w-full md:w-1/3 shadow-xl transform transition-transform hover:-translate-y-2">
                                <div className="text-4xl mb-3">🚢</div>
                                <h4 className="font-bold text-blue-300 uppercase mb-2">Hub Logistics Toàn Cầu</h4>
                                <p className="text-xs text-blue-100/70">Kết nối hàng hải thông qua hệ thống cảng biển (Cái Mép, Hải Phòng), vận chuyển xuyên Thái Bình Dương và Á-Âu.</p>
                            </div>

                            <div className="text-emerald-500 animate-pulse text-2xl rotate-90 md:rotate-0">➔</div>

                            {/* Step 3 */}
                            <div className="bg-amber-950 border border-amber-600 rounded-2xl p-5 text-center w-full md:w-1/3 shadow-xl transform transition-transform hover:-translate-y-2">
                                <div className="text-4xl mb-3">🛍️</div>
                                <h4 className="font-bold text-amber-300 uppercase mb-2">Thị trường Tiêu thụ</h4>
                                <p className="text-xs text-amber-100/70">Tiếp cận trực tiếp thị trường Mỹ, EU bằng lợi thế hiệp định thương mại (CPTPP, EVFTA), tạo thặng dư tỷ USD.</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Conclusion */}
                <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
                    <div className="mt-8 text-center p-8 bg-gradient-to-r from-emerald-900/60 via-emerald-800/60 to-emerald-900/60 rounded-2xl border-l-4 border-r-4 border-emerald-400 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        <div className="relative z-10">
                            <p className="text-lg text-emerald-200 italic font-medium max-w-3xl mx-auto leading-relaxed">
                                "Hội nhập kinh tế không chỉ dừng lại ở việc thụ hưởng những lợi ích thuế quan hay thu hút dòng tiền FDI ngắn hạn. Mục tiêu tối hậu là tiếp thu công nghệ, nâng tầm quản trị để chủ động <span className="text-amber-400 font-bold">nâng cao năng lực cạnh tranh cốt lõi</span> của nền kinh tế tự chủ."
                            </p>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
