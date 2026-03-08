import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ClassReport from '../components/ClassReport';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    getClassReport: vi.fn(),
  },
}));

const mockReport = {
  students: [
    { id: 1, name: 'Ana Lima', grade1: 9, grade2: 8, grade3: 7, grade4: 9, grade5: 8, averageGrade: 8.2, attendance: 90 },
    { id: 2, name: 'Carlos Melo', grade1: 5, grade2: 6, grade3: 4, grade4: 5, grade5: 5, averageGrade: 5.0, attendance: 65 },
  ],
  subjectAverage1: 7.0,
  subjectAverage2: 7.0,
  subjectAverage3: 5.5,
  subjectAverage4: 7.0,
  subjectAverage5: 6.5,
  studentsAboveClassAverage: ['Ana Lima'],
  studentsBelowAttendanceThreshold: ['Carlos Melo'],
};

describe('ClassReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('shows loading initially', () => {
    api.getClassReport.mockReturnValue(new Promise(() => {}));
    render(<ClassReport />);
    expect(screen.getByText(/carregando relatório/i)).toBeInTheDocument();
  });

  it('shows empty state when there are no students', async () => {
    api.getClassReport.mockResolvedValueOnce({ students: [] });
    render(<ClassReport />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText(/nenhum dado disponível/i)).toBeInTheDocument();
  });

  it('renders class average correctly', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<ClassReport />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    // classAverage = (8.2 + 5.0) / 2 = 6.60
    expect(screen.getByText('6.60')).toBeInTheDocument();
  });

  it('renders total students count', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<ClassReport />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('lists students above average', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<ClassReport />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText(/alunos acima da média/i)).toBeInTheDocument();
    expect(screen.getAllByText('Ana Lima').length).toBeGreaterThan(0);
  });

  it('lists students with low attendance', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<ClassReport />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText(/frequência abaixo de 75%/i)).toBeInTheDocument();
    expect(screen.getAllByText('Carlos Melo').length).toBeGreaterThan(0);
  });

  it('renders subject averages', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<ClassReport />);
    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText(/médias por disciplina/i)).toBeInTheDocument();
    // multiple subjects share the same average; verify the unique one
    expect(screen.getByText('5.50')).toBeInTheDocument();
  });

  it('shows alert when API fails', async () => {
    api.getClassReport.mockRejectedValueOnce(new Error('Server error'));
    render(<ClassReport />);
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Erro ao carregar relatório'));
  });
});
