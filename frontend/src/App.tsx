import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { SampleDataBanner } from './components/SampleDataBanner';
import { lazy, Suspense } from 'react';
import { Home } from './pages/Home';
import { apiService } from './services/api';

const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));
const DataProcess = lazy(() => import('./pages/DataProcess').then(module => ({ default: module.DataProcess })));
const AITools = lazy(() => import('./pages/AITools').then(module => ({ default: module.AITools })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Charts = lazy(() => import('./pages/Charts').then(module => ({ default: module.Charts })));

function App() {
  const isUsingSampleData = apiService.isUsingSampleData();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {isUsingSampleData && <SampleDataBanner />}
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<p role="status" className="p-12 text-center">Loading page…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-tools" element={isUsingSampleData ? <div className="p-12 text-center"><h1 className="text-3xl mb-4">AI tools</h1><p>Connect recorded data and configure the backend to request AI analysis.</p></div> : <AITools />} />
            <Route path="/insights" element={<Charts />} />
            <Route path="/data-process" element={<DataProcess />} />
            <Route path="/about" element={<About />} />
          </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

