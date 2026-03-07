import { useState, useEffect } from 'react';
import { api } from '../services/api';
import StudentForm from './StudentForm';
import './StudentList.css';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await api.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      alert('Erro ao carregar alunos. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await api.deleteStudent(id);
        await loadStudents();
      } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        alert('Erro ao deletar aluno');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
    loadStudents();
  };

  const getGradeColor = (grade) => {
    if (grade >= 7) return 'grade-good';
    if (grade >= 5) return 'grade-medium';
    return 'grade-bad';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 75) return 'attendance-good';
    return 'attendance-bad';
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (showForm) {
    return <StudentForm student={editingStudent} onClose={handleFormClose} />;
  }

  return (
    <div className="student-list">
      <header className="list-header">
        <div>
          <h1>👨‍🎓 Gerenciamento de Alunos</h1>
          <p>{students.length} aluno(s) cadastrado(s)</p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          ➕ Adicionar Aluno
        </button>
      </header>

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>Nenhum aluno cadastrado</h3>
          <p>Clique no botão acima para adicionar o primeiro aluno</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Nota 4</th>
                <th>Nota 5</th>
                <th>Média</th>
                <th>Frequência</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="student-name">{student.name}</td>
                  <td>{student.grade1.toFixed(1)}</td>
                  <td>{student.grade2.toFixed(1)}</td>
                  <td>{student.grade3.toFixed(1)}</td>
                  <td>{student.grade4.toFixed(1)}</td>
                  <td>{student.grade5.toFixed(1)}</td>
                  <td>
                    <span className={`badge ${getGradeColor(student.averageGrade)}`}>
                      {student.averageGrade.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(student)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(student.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;
