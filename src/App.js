import './App.css';
import LoginScreen from './pages/LoginScreen';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/' element={
            <div>
              <LoginScreen />
            </div>} />
          <Route path='/Main' element={
            <div>
              <MainPage />
            </div>} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;
