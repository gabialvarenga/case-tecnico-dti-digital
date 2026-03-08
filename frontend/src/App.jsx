import { useState } from 'react';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import ClassReport from './components/ClassReport';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>📚 Sistema Escolar</h2>
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
