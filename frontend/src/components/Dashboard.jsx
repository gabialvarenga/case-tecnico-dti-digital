import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Dashboard.css';

function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGrade: 0,
    aboveAverage: 0,
    belowAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const report = await api.getClassReport();
      const students = report.students || [];
      
      const totalStudents = students.length;
      const averageGrade = totalStudents > 0
        ? students.reduce((sum, s) => sum + s.averageGrade, 0) / totalStudents
        : 0;
      
      setStats({
        totalStudents,
        averageGrade: averageGrade.toFixed(2),
        aboveAverage: report.studentsAboveClassAverage?.length || 0,
        belowAttendance: report.studentsBelowAttendanceThreshold?.length || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Visão geral do desempenho da turma</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total de Alunos</p>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.averageGrade}</h3>
            <p>Média Geral</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.aboveAverage}</h3>
            <p>Acima da Média</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.belowAttendance}</h3>
            <p>Baixa Frequência</p>
          </div>
        </div>
      </div>

      <div className="action-cards">
        <div className="action-card" onClick={() => onNavigate('students')}>
          <div className="action-icon">📝</div>
          <h3>Gerenciar Alunos</h3>
          <p>Adicionar, editar ou remover alunos</p>
        </div>

        <div className="action-card" onClick={() => onNavigate('report')}>
          <div className="action-icon">📊</div>
          <h3>Relatório Completo</h3>
          <p>Visualizar análise detalhada da turma</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
