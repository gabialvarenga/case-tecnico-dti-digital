import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './StudentForm.css';

function StudentForm({ student, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    grade1: '',
    grade2: '',
    grade3: '',
    grade4: '',
    grade5: '',
    attendance: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        grade1: student.grade1,
        grade2: student.grade2,
        grade3: student.grade3,
        grade4: student.grade4,
        grade5: student.grade5,
        attendance: student.attendance,
      });
    }
  }, [student]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    ['grade1', 'grade2', 'grade3', 'grade4', 'grade5'].forEach((grade) => {
      const value = parseFloat(formData[grade]);
      if (isNaN(value) || value < 0 || value > 10) {
        newErrors[grade] = 'Nota deve estar entre 0 e 10';
      }
    });

    const attendance = parseFloat(formData.attendance);
    if (isNaN(attendance) || attendance < 0 || attendance > 100) {
      newErrors.attendance = 'Frequência deve estar entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      const studentData = {
        name: formData.name,
        grade1: parseFloat(formData.grade1),
        grade2: parseFloat(formData.grade2),
        grade3: parseFloat(formData.grade3),
        grade4: parseFloat(formData.grade4),
        grade5: parseFloat(formData.grade5),
        attendance: parseFloat(formData.attendance),
      };

      if (student) {
        await api.updateStudent(student.id, studentData);
      } else {
        await api.addStudent(studentData);
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      alert('Erro ao salvar aluno. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpa erro do campo ao digitar
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <header className="form-header">
          <h1>{student ? '✏️ Editar Aluno' : '➕ Novo Aluno'}</h1>
          <button className="btn-close" onClick={onClose}>✕</button>
        </header>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Nome do Aluno *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="grades-grid">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="form-group">
                <label htmlFor={`grade${num}`}>Nota {num} *</label>
                <input
                  id={`grade${num}`}
                  name={`grade${num}`}
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData[`grade${num}`]}
                  onChange={handleChange}
                  placeholder="0.0"
                  className={errors[`grade${num}`] ? 'error' : ''}
                />
                {errors[`grade${num}`] && (
                  <span className="error-message">{errors[`grade${num}`]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="attendance">Frequência (%) *</label>
            <input
              id="attendance"
              name="attendance"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.attendance}
              onChange={handleChange}
              placeholder="Ex: 85"
              className={errors.attendance ? 'error' : ''}
            />
            {errors.attendance && (
              <span className="error-message">{errors.attendance}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Salvando...' : student ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
