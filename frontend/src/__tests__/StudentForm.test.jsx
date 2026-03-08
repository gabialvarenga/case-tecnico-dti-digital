import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentForm from '../components/StudentForm';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    addStudent: vi.fn(),
    updateStudent: vi.fn(),
  },
}));

const validFormData = {
  name: 'João Silva',
  grade1: '8',
  grade2: '7',
  grade3: '9',
  grade4: '6',
  grade5: '8',
  attendance: '90',
};

function fillForm(data = validFormData) {
  fireEvent.change(screen.getByLabelText(/nome do aluno/i), { target: { value: data.name } });
  for (let i = 1; i <= 5; i++) {
    fireEvent.change(
      screen.getByLabelText(new RegExp(`disciplina ${i}`, 'i')),
      { target: { value: data[`grade${i}`] } }
    );
  }
  fireEvent.change(screen.getByLabelText(/frequência/i), { target: { value: data.attendance } });
}

describe('StudentForm', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty form for a new student', () => {
    render(<StudentForm student={null} onClose={onClose} />);
    expect(screen.getByText(/novo aluno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do aluno/i)).toHaveValue('');
  });

  it('pre-fills form when editing an existing student', () => {
    const student = {
      id: 1,
      name: 'Maria',
      grade1: 8,
      grade2: 7,
      grade3: 9,
      grade4: 6,
      grade5: 8,
      attendance: 90,
    };
    render(<StudentForm student={student} onClose={onClose} />);
    expect(screen.getByText(/editar aluno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do aluno/i)).toHaveValue('Maria');
  });

  it('shows error when name is empty on submit', async () => {
    render(<StudentForm student={null} onClose={onClose} />);
    // Submit directly to bypass HTML5 number/min/max validation in jsdom
    fireEvent.submit(screen.getByRole('button', { name: /cadastrar/i }).closest('form'));
    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument();
  });

  it('shows error when a grade is out of range', async () => {
    render(<StudentForm student={null} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/nome do aluno/i), { target: { value: 'Aluno Teste' } });
    fireEvent.change(screen.getByLabelText(/disciplina 1/i), { target: { value: '15' } }); // invalid
    fireEvent.submit(screen.getByLabelText(/nome do aluno/i).closest('form'));
    expect(await screen.findAllByText(/nota deve estar entre 0 e 10/i)).not.toHaveLength(0);
  });

  it('shows error when attendance is out of range', async () => {
    render(<StudentForm student={null} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/nome do aluno/i), { target: { value: 'Aluno Teste' } });
    for (let i = 1; i <= 5; i++) {
      fireEvent.change(
        screen.getByLabelText(new RegExp(`disciplina ${i}`, 'i')),
        { target: { value: '8' } }
      );
    }
    fireEvent.change(screen.getByLabelText(/frequência/i), { target: { value: '150' } }); // invalid
    fireEvent.submit(screen.getByLabelText(/nome do aluno/i).closest('form'));
    expect(await screen.findByText(/frequência deve estar entre 0 e 100/i)).toBeInTheDocument();
  });

  it('calls api.addStudent and onClose when creating a new student', async () => {
    api.addStudent.mockResolvedValueOnce({ id: 1 });
    render(<StudentForm student={null} onClose={onClose} />);
    fillForm();
    fireEvent.submit(screen.getByLabelText(/nome do aluno/i).closest('form'));

    await waitFor(() => expect(api.addStudent).toHaveBeenCalledWith({
      name: validFormData.name,
      grade1: 8,
      grade2: 7,
      grade3: 9,
      grade4: 6,
      grade5: 8,
      attendance: 90,
    }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('calls api.updateStudent and onClose when editing a student', async () => {
    const student = { id: 42, name: 'Maria', grade1: 7, grade2: 7, grade3: 7, grade4: 7, grade5: 7, attendance: 80 };
    api.updateStudent.mockResolvedValueOnce({ ...student, name: 'João Silva' });
    render(<StudentForm student={student} onClose={onClose} />);
    fillForm();
    fireEvent.submit(screen.getByLabelText(/nome do aluno/i).closest('form'));

    await waitFor(() => expect(api.updateStudent).toHaveBeenCalledWith(42, expect.objectContaining({ name: validFormData.name })));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<StudentForm student={null} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
