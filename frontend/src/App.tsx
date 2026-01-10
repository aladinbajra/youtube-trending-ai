import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer, SampleDataBanner } from './components';
import { Home, Analytics, DataProcess, AITools, About, Charts } from './pages';
import { apiService } from './services/api';

function App() {
  const isUsingSampleData = apiService.isUsingSampleData();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {isUsingSampleData && <SampleDataBanner />}
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/insights" element={<Charts />} />
            <Route path="/data-process" element={<DataProcess />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

