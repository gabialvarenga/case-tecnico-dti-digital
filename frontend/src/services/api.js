const BASE_URL = import.meta.env.VITE_API_URL;

const API_URL = `${BASE_URL}/api/students`;

export const api = {
  // Listar todos os alunos
  getAllStudents: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar alunos');
    return response.json();
  },

  // Buscar aluno por ID
  getStudent: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar aluno');
    return response.json();
  },

  // Adicionar novo aluno
  addStudent: async (student) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Erro ao adicionar aluno');
    return response.json();
  },

  // Atualizar aluno
  updateStudent: async (id, student) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error('Erro ao atualizar aluno');
    return response.json();
  },

  // Deletar aluno
  deleteStudent: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar aluno');
  },

  // Obter relatório da turma
  getClassReport: async () => {
    const response = await fetch(`${API_URL}/report`);
    if (!response.ok) throw new Error('Erro ao buscar relatório');
    return response.json();
  },
};
