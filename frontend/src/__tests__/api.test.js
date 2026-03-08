import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/api';

describe('api service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockFetch = (ok, body) => {
    global.fetch = vi.fn().mockResolvedValue({
      ok,
      json: vi.fn().mockResolvedValue(body),
    });
  };

  // ---- auth ----------------------------------------------------------------

  describe('login', () => {
    it('returns parsed JSON on success', async () => {
      mockFetch(true, { username: 'user1' });
      const result = await api.login('user1', 'pass1');
      expect(result).toEqual({ username: 'user1' });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('throws on HTTP error', async () => {
      mockFetch(false, { message: 'Credenciais inválidas' });
      await expect(api.login('user1', 'wrong')).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('register', () => {
    it('returns parsed JSON on success', async () => {
      mockFetch(true, { username: 'newuser' });
      const result = await api.register('newuser', 'pass1');
      expect(result).toEqual({ username: 'newuser' });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('throws on HTTP error', async () => {
      mockFetch(false, { message: 'Usuário já existe' });
      await expect(api.register('user1', 'pass1')).rejects.toThrow('Usuário já existe');
    });
  });

  // ---- students ------------------------------------------------------------

  describe('getAllStudents', () => {
    it('returns student list on success', async () => {
      const students = [{ id: 1, name: 'Ana' }];
      mockFetch(true, students);
      const result = await api.getAllStudents();
      expect(result).toEqual(students);
    });

    it('throws on HTTP error', async () => {
      mockFetch(false, {});
      await expect(api.getAllStudents()).rejects.toThrow('Erro ao buscar alunos');
    });
  });

  describe('getStudent', () => {
    it('returns student on success', async () => {
      mockFetch(true, { id: 1, name: 'Ana' });
      const result = await api.getStudent(1);
      expect(result).toEqual({ id: 1, name: 'Ana' });
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/students/1'));
    });

    it('throws on HTTP error', async () => {
      mockFetch(false, {});
      await expect(api.getStudent(1)).rejects.toThrow('Erro ao buscar aluno');
    });
  });

  describe('addStudent', () => {
    it('sends POST and returns created student', async () => {
      const student = { name: 'Carlos', grade1: 8 };
      mockFetch(true, { id: 2, ...student });
      const result = await api.addStudent(student);
      expect(result).toEqual({ id: 2, ...student });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/students'),
        expect.objectContaining({ method: 'POST', body: JSON.stringify(student) })
      );
    });

    it('throws on HTTP error', async () => {
      mockFetch(false, {});
      await expect(api.addStudent({})).rejects.toThrow('Erro ao adicionar aluno');
    });
  });

  describe('updateStudent', () => {
    it('sends PUT and returns updated student', async () => {
      const student = { name: 'Carlos', grade1: 9 };
      mockFetch(true, { id: 1, ...student });
      const result = await api.updateStudent(1, student);
      expect(result).toEqual({ id: 1, ...student });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/students/1'),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('throws on HTTP error', async () => {
      mockFetch(false, {});
      await expect(api.updateStudent(1, {})).rejects.toThrow('Erro ao atualizar aluno');
    });
  });

  describe('deleteStudent', () => {
    it('sends DELETE request', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });
      await api.deleteStudent(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/students/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on HTTP error', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false });
      await expect(api.deleteStudent(1)).rejects.toThrow('Erro ao deletar aluno');
    });
  });

  describe('getClassReport', () => {
    it('returns report on success', async () => {
      const report = { students: [], studentsAboveClassAverage: [] };
      mockFetch(true, report);
      const result = await api.getClassReport();
      expect(result).toEqual(report);
    });

    it('throws on HTTP error', async () => {
      mockFetch(false, {});
      await expect(api.getClassReport()).rejects.toThrow('Erro ao buscar relatório');
    });
  });
});
