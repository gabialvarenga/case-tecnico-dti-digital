import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import ClassReport from './components/ClassReport';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>📚 Sistema Escolar</h2>
          <span className="user-name">Olá, {user.username}!</span>
        </div>
        <div className="navbar-menu">
          <button
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            🏠 Dashboard
          </button>
          <button
            className={currentView === 'students' ? 'active' : ''}
            onClick={() => setCurrentView('students')}
          >
            👨‍🎓 Alunos
          </button>
          <button
            className={currentView === 'report' ? 'active' : ''}
            onClick={() => setCurrentView('report')}
          >
            📊 Relatório
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
        {currentView === 'students' && <StudentList />}
        {currentView === 'report' && <ClassReport />}
      </main>
    </div>
  );
}

export default App;
