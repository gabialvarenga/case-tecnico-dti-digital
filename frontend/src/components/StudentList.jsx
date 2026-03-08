import { useState, useEffect } from 'react';
import { api } from '../services/api';
import StudentForm from './StudentForm';
import './StudentList.css';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('none');

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
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
          <div className="list-controls">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />

            <select value={sortOption} onChange={handleSortChange} className="sort-select">
              <option value="none">Ordenar: Nenhum</option>
              <option value="highest">Ordenar: Maior média</option>
              <option value="lowest">Ordenar: Menor média</option>
            </select>
          </div>
          <table className="students-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Disciplina 1</th>
                <th>Disciplina 2</th>
                <th>Disciplina 3</th>
                <th>Disciplina 4</th>
                <th>Disciplina 5</th>
                <th>Média</th>
                <th>Frequência</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .sort((a, b) => {
                  if (sortOption === 'highest') return b.averageGrade - a.averageGrade;
                  if (sortOption === 'lowest') return a.averageGrade - b.averageGrade;
                  return 0;
                })
                .map((student) => (
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
