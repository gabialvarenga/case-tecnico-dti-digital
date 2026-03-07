import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './ClassReport.css';

function ClassReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await api.getClassReport();
      setReport(data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      alert('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando relatório...</div>;
  }

  if (!report || report.students.length === 0) {
    return (
      <div className="report-empty">
        <div className="empty-icon">📊</div>
        <h3>Nenhum dado disponível</h3>
        <p>Adicione alunos para visualizar o relatório da turma</p>
      </div>
    );
  }

  const classAverage = report.students.reduce((sum, s) => sum + s.averageGrade, 0) / report.students.length;

  return (
    <div className="class-report">
      <header className="report-header">
        <h1>📊 Relatório Completo da Turma</h1>
        <p>Análise detalhada de desempenho e frequência</p>
      </header>

      <div className="report-section">
        <h2>📈 Médias por Disciplina</h2>
        <div className="subjects-grid">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="subject-card">
              <div className="subject-number">Disciplina {num}</div>
              <div className="subject-average">
                {report[`subjectAverage${num}`].toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <h2>👥 Estatísticas Gerais</h2>
        <div className="stats-cards">
          <div className="stat-item">
            <div className="stat-label">Total de Alunos</div>
            <div className="stat-value">{report.students.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Média Geral da Turma</div>
            <div className="stat-value">{classAverage.toFixed(2)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Acima da Média</div>
            <div className="stat-value green">{report.studentsAboveClassAverage.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Baixa Frequência (&lt;75%)</div>
            <div className="stat-value orange">{report.studentsBelowAttendanceThreshold.length}</div>
          </div>
        </div>
      </div>

      {report.studentsAboveClassAverage.length > 0 && (
        <div className="report-section">
          <h2>⭐ Alunos Acima da Média</h2>
          <div className="names-list green-list">
            {report.studentsAboveClassAverage.map((name, index) => (
              <div key={index} className="name-badge">
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {report.studentsBelowAttendanceThreshold.length > 0 && (
        <div className="report-section">
          <h2>⚠️ Alunos com Frequência Abaixo de 75%</h2>
          <div className="names-list orange-list">
            {report.studentsBelowAttendanceThreshold.map((name, index) => (
              <div key={index} className="name-badge">
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="report-section">
        <h2>📋 Desempenho Individual</h2>
        <div className="students-performance">
          {report.students
            .sort((a, b) => b.averageGrade - a.averageGrade)
            .map((student) => (
              <div key={student.id} className="performance-card">
                <div className="performance-header">
                  <h3>{student.name}</h3>
                  <span className={`badge ${student.averageGrade >= 7 ? 'success' : student.averageGrade >= 5 ? 'warning' : 'danger'}`}>
                    Média: {student.averageGrade.toFixed(2)}
                  </span>
                </div>
                <div className="performance-grades">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="grade-item">
                      <span className="grade-label">D{num}</span>
                      <span className="grade-value">{student[`grade${num}`].toFixed(1)}</span>
                    </div>
                  ))}
                  <div className="grade-item attendance-item">
                    <span className="grade-label">Freq.</span>
                    <span className={`grade-value ${student.attendance >= 75 ? 'good' : 'bad'}`}>
                      {student.attendance}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ClassReport;
