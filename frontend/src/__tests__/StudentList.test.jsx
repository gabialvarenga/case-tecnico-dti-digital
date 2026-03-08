import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentList from '../components/StudentList';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    getAllStudents: vi.fn(),
    deleteStudent: vi.fn(),
    addStudent: vi.fn(),
    updateStudent: vi.fn(),
  },
}));

const mockStudents = [
  { id: 1, name: 'Ana Lima', grade1: 9, grade2: 8, grade3: 7, grade4: 9, grade5: 8, averageGrade: 8.2, attendance: 90 },
  { id: 2, name: 'Carlos Melo', grade1: 5, grade2: 6, grade3: 4, grade4: 5, grade5: 5, averageGrade: 5.0, attendance: 70 },
  { id: 3, name: 'Beatriz Costa', grade1: 7, grade2: 7, grade3: 8, grade4: 7, grade5: 7, averageGrade: 7.2, attendance: 85 },
];

describe('StudentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('shows loading initially', () => {
    api.getAllStudents.mockReturnValue(new Promise(() => {}));
    render(<StudentList />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('shows empty state when no students', async () => {
    api.getAllStudents.mockResolvedValueOnce([]);
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText(/nenhum aluno cadastrado/i)).toBeInTheDocument();
  });

  it('renders a table with students', async () => {
    api.getAllStudents.mockResolvedValueOnce(mockStudents);
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText('Ana Lima')).toBeInTheDocument();
    expect(screen.getByText('Carlos Melo')).toBeInTheDocument();
    expect(screen.getByText('Beatriz Costa')).toBeInTheDocument();
  });

  it('filters students by search term', async () => {
    api.getAllStudents.mockResolvedValueOnce(mockStudents);
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/buscar por nome/i), 'Ana');

    expect(screen.getByText('Ana Lima')).toBeInTheDocument();
    expect(screen.queryByText('Carlos Melo')).not.toBeInTheDocument();
    expect(screen.queryByText('Beatriz Costa')).not.toBeInTheDocument();
  });

  it('sorts students by highest average', async () => {
    api.getAllStudents.mockResolvedValueOnce(mockStudents);
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    await userEvent.selectOptions(screen.getByRole('combobox'), 'highest');

    const rows = screen.getAllByRole('row').slice(1); // skip header
    expect(within(rows[0]).getByText('Ana Lima')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Beatriz Costa')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Carlos Melo')).toBeInTheDocument();
  });

  it('sorts students by lowest average', async () => {
    api.getAllStudents.mockResolvedValueOnce(mockStudents);
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    await userEvent.selectOptions(screen.getByRole('combobox'), 'lowest');

    const rows = screen.getAllByRole('row').slice(1);
    expect(within(rows[0]).getByText('Carlos Melo')).toBeInTheDocument();
  });

  it('deletes a student after confirmation', async () => {
    api.getAllStudents.mockResolvedValue(mockStudents);
    api.deleteStudent.mockResolvedValueOnce();
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    const deleteButtons = screen.getAllByTitle(/excluir/i);
    await userEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => expect(api.deleteStudent).toHaveBeenCalledWith(mockStudents[0].id));
  });

  it('opens the form when add button is clicked', async () => {
    api.getAllStudents.mockResolvedValue([]);
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /adicionar aluno/i }));
    expect(screen.getByText(/novo aluno/i)).toBeInTheDocument();
  });

  it('opens the edit form when edit button is clicked', async () => {
    api.getAllStudents.mockResolvedValue(mockStudents);
    render(<StudentList />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    const editButtons = screen.getAllByTitle(/editar/i);
    await userEvent.click(editButtons[0]);
    expect(screen.getByText(/editar aluno/i)).toBeInTheDocument();
  });
});
