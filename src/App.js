import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import Upload from './components/Upload';
import ProveMRC from './components/ProveMRC';  // New ProveMRC component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Upload />} />
                <Route path="/prove-mrc" element={<ProveMRC />} />
            </Routes>
        </Router>
    );
}

export default App;
