import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Thang1 from "./pages/Thang1";
import Thang2 from "./pages/Thang2";
import Thang3 from "./pages/Thang3";
import Thang4 from "./pages/Thang4";
import Thang5 from "./pages/Thang5";
import Thang6 from "./pages/Thang6";
import Thang7 from "./pages/Thang7";
import Thang8 from "./pages/Thang8";
import Thang9 from "./pages/Thang9";
import Thang10 from "./pages/Thang10";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/thang1" element={<Thang1 />} />
                <Route path="/thang2" element={<Thang2 />} />
                <Route path="/thang3" element={<Thang3 />} />
                <Route path="/thang4" element={<Thang4 />} />
                <Route path="/thang5" element={<Thang5 />} />
                <Route path="/thang6" element={<Thang6 />} />
                <Route path="/thang7" element={<Thang7 />} />
                <Route path="/thang8" element={<Thang8 />} />
                <Route path="/thang9" element={<Thang9 />} />
                <Route path="/thang10" element={<Thang10 />} />
                {/* Placeholder for other months */}
                {[11, 12].map(m => (
                    <Route key={m} path={`/thang${m}`} element={
                        <div className="min-h-screen flex items-center justify-center text-white text-2xl font-bold" style={{ background: "linear-gradient(135deg,#020617 0%,#0f172a 100%)" }}>
                            Tháng {m} chưa có nội dung.
                        </div>
                    } />
                ))}
            </Routes>
        </Router>
    );
}

export default App;