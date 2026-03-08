import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe('Login', () => {
  const onLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form by default', () => {
    render(<Login onLogin={onLogin} />);
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('shows error when fields are empty on submit', async () => {
    render(<Login onLogin={onLogin} />);
    // Submit the form directly to bypass HTML5 native `required` validation in jsdom
    fireEvent.submit(screen.getByRole('button', { name: /entrar/i }).closest('form'));
    expect(await screen.findByText(/preencha todos os campos/i)).toBeInTheDocument();
  });

  it('shows error when username is too short', async () => {
    render(<Login onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'ab' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'pass1' } });
    fireEvent.submit(screen.getByLabelText(/usuário/i).closest('form'));
    expect(await screen.findByText(/mínimo 3 caracteres/i)).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    render(<Login onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'abc' } });
    fireEvent.submit(screen.getByLabelText(/usuário/i).closest('form'));
    expect(await screen.findByText(/mínimo 4 caracteres/i)).toBeInTheDocument();
  });

  it('calls api.login and onLogin on successful submit', async () => {
    const userData = { username: 'user1' };
    api.login.mockResolvedValueOnce(userData);

    render(<Login onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'pass1' } });
    fireEvent.submit(screen.getByLabelText(/usuário/i).closest('form'));

    await waitFor(() => expect(api.login).toHaveBeenCalledWith('user1', 'pass1'));
    await waitFor(() => expect(onLogin).toHaveBeenCalledWith(userData));
  });

  it('shows API error message on login failure', async () => {
    api.login.mockRejectedValueOnce(new Error('Credenciais inválidas'));

    render(<Login onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'pass1' } });
    fireEvent.submit(screen.getByLabelText(/usuário/i).closest('form'));

    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('switches to register mode and calls api.register', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    api.register.mockResolvedValueOnce({});

    render(<Login onLogin={onLogin} />);
    fireEvent.click(screen.getByRole('button', { name: /cadastre-se/i }));

    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'pass1' } });
    fireEvent.submit(screen.getByLabelText(/usuário/i).closest('form'));

    await waitFor(() => expect(api.register).toHaveBeenCalledWith('newuser', 'pass1'));
  });
});
