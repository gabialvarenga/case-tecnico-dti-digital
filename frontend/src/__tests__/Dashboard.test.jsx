import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../components/Dashboard';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    getClassReport: vi.fn(),
  },
}));

const mockReport = {
  students: [
    { averageGrade: 8.0 },
    { averageGrade: 6.0 },
    { averageGrade: 4.0 },
  ],
  studentsAboveClassAverage: [{ averageGrade: 8.0 }],
  studentsBelowAttendanceThreshold: [{ averageGrade: 4.0 }],
};

describe('Dashboard', () => {
  const onNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading initially', () => {
    api.getClassReport.mockReturnValue(new Promise(() => {}));
    render(<Dashboard onNavigate={onNavigate} />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('displays stats after loading', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<Dashboard onNavigate={onNavigate} />);

    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    expect(screen.getByText('3')).toBeInTheDocument(); // total students
    expect(screen.getByText('6.00')).toBeInTheDocument(); // average grade
    // both aboveAverage and belowAttendance are 1, so multiple elements match
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });

  it('shows zero stats if no students', async () => {
    api.getClassReport.mockResolvedValueOnce({
      students: [],
      studentsAboveClassAverage: [],
      studentsBelowAttendanceThreshold: [],
    });
    render(<Dashboard onNavigate={onNavigate} />);

    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());
    expect(screen.getByText('0.00')).toBeInTheDocument();
  });

  it('navigates to students view when clicking action card', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<Dashboard onNavigate={onNavigate} />);

    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    await userEvent.click(screen.getByText(/gerenciar alunos/i));
    expect(onNavigate).toHaveBeenCalledWith('students');
  });

  it('navigates to report view when clicking relatório card', async () => {
    api.getClassReport.mockResolvedValueOnce(mockReport);
    render(<Dashboard onNavigate={onNavigate} />);

    await waitFor(() => expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument());

    await userEvent.click(screen.getByText(/relatório completo/i));
    expect(onNavigate).toHaveBeenCalledWith('report');
  });
});
