# 📚 Sistema de Gestão Escolar

**Desafio Técnico DTI Digital** — Sistema completo para gerenciamento de alunos, notas e frequência, com interface moderna, validação robusta e relatório automático da turma.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.3-green)
![React](https://img.shields.io/badge/React-19-blue)
![H2](https://img.shields.io/badge/H2-In--Memory-lightgrey)
![Status](https://img.shields.io/badge/Status-Concluído-success)

---

## 🌐 Acesso à Aplicação

### Demonstração Online

✨ **[ACESSE O FRONTEND](https://case-dti-frontend.onrender.com)**
🔌 **[API BACKEND](https://case-dti-backend.onrender.com)**

> *A aplicação está hospedada no Render (plano gratuito). O primeiro acesso pode demorar alguns segundos enquanto o servidor "acorda", mas funciona normalmente logo em seguida.*

### Acesso Local

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:8080`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Console H2:** `http://localhost:8080/h2-console`

---

## 📋 Sumário

- [O Problema](#-o-problema)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias-utilizadas)
- [Arquitetura e Organização](#-arquitetura-e-organização)
- [Como Executar](#-como-executar)
- [Endpoints da API](#-endpoints-da-api)
- [Testes](#-testes)
- [Premissas Assumidas](#-premissas-assumidas)
- [Decisões de Projeto](#-decisões-de-projeto)

---

## 🎯 O Problema

Carlos é um professor que precisa organizar as notas e a frequência de seus alunos. Cada aluno tem uma nota para cada uma das **cinco disciplinas** que Carlos ensina e um registro de **frequência percentual**.

O sistema deve:

- Permitir inserir notas de 0 a 10 em cada disciplina e frequência de 0 a 100%
- Calcular automaticamente a **média de cada aluno**
- Calcular a **média da turma por disciplina**
- Listar alunos com **média acima da média da turma**
- Listar alunos com **frequência abaixo de 75%** (atenção especial)
- Exibir lista vazia quando não houver alunos nas condições acima

### Propriedades do Aluno

| Propriedade | Tipo | Obrigatório | Descrição | Validações |
|---|---|---|---|---|
| id | Long | Automático | Identificador único gerado pelo banco | @GeneratedValue |
| name | String | **Sim** | Nome do aluno | @NotBlank |
| grade1–5 | double | **Sim** | Nota em cada disciplina | 0.0 a 10.0 |
| attendance | double | **Sim** | Frequência percentual do aluno | 0.0 a 100.0 |
| averageGrade | double | Calculado | Média aritmética das 5 notas | Calculado pelo backend |

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🔐 Autenticação | Cadastro e login de professor com validação de campos |
| 📝 CRUD de Alunos | Cadastrar, editar, visualizar e excluir alunos |
| 📊 Relatório da Turma | Médias por disciplina, alunos acima da média e abaixo de 75% de frequência |
| 🏠 Dashboard | Visão geral com totais e indicadores rápidos |
| 🔍 Busca por Nome | Filtro em tempo real pelo nome do aluno |
| ↕️ Ordenação por Média | Ordenar alunos da maior para a menor média (e vice-versa) |
| 🎨 Interface Responsiva | Layout adaptável para desktop e mobile com cards |

---

## 🛠 Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Motivo |
|---|---|---|
| Java | 21 | LTS mais recente, suporte a Records |
| Spring Boot | — | Framework web produtivo e amplamente adotado |
| Spring Data JPA | — | Abstração de persistência com Hibernate |
| H2 Database | — | Banco em memória, zero configuração para execução |
| Lombok | — | Elimina boilerplate (getters/setters/builders) |
| Bean Validation | — | Validação declarativa de entradas |
| SpringDoc OpenAPI | 2.8.4 | Swagger UI automático em `/swagger-ui.html` |
| JUnit 5 + Mockito | — | Testes unitários da camada de serviço |

### Frontend

| Tecnologia | Versão | Motivo |
|---|---|---|
| React | 19 | Biblioteca declarativa, componentes reutilizáveis |
| Vite | 7 | Build tool ultrarrápida para desenvolvimento |
| CSS puro | — | Estilização sem dependências extras |
| Fetch API (nativo) | — | Comunicação HTTP sem libs externas |

---

## 🏗 Arquitetura e Organização

### Backend — MVC + SOLID

O backend segue o padrão **MVC adaptado para REST** com aplicação consistente dos **princípios SOLID**:

```
backend/src/main/java/com/dti/backend/
├── controller/              # Camada de apresentação — recebe e responde requisições HTTP
│   ├── AuthController.java
│   └── StudentController.java
├── service/                 # Camada de negócio — regras e orquestração
│   ├── IStudentService.java          (interface — DIP)
│   ├── StudentService.java           (implementação)
│   ├── GradeCalculatorService.java   (SRP — cálculos isolados)
│   └── UserService.java
├── repository/              # Camada de persistência — acesso ao banco via JPA
│   ├── StudentRepository.java
│   └── UserRepository.java
├── entity/                  # Modelos de domínio mapeados no banco
│   ├── Student.java
│   └── User.java
├── dto/                     # Objetos de transferência de dados (entrada/saída da API)
│   ├── StudentRequest.java
│   ├── StudentResponse.java
│   ├── ClassReportResponse.java
│   ├── UserRequest.java
│   └── UserResponse.java
├── mapper/                  # Conversão entre entidades e DTOs (SRP)
│   └── StudentMapper.java
├── exception/               # Tratamento centralizado de erros (SRP)
│   ├── StudentNotFoundException.java
│   └── GlobalExceptionHandler.java
└── config/
    └── CorsConfig.java
```

#### SOLID aplicado

| Princípio | Onde |
|---|---|
| **S** — Single Responsibility | `GradeCalculatorService` só calcula; `StudentMapper` só converte; `GlobalExceptionHandler` só trata erros |
| **O** — Open/Closed | `IStudentService` permite novas implementações sem modificar `StudentController` |
| **L** — Liskov Substitution | `StudentService` é substituível por qualquer implementação de `IStudentService` |
| **I** — Interface Segregation | `IStudentService` expõe apenas os métodos necessários, sem métodos desnecessários |
| **D** — Dependency Inversion | `StudentController` depende da **interface** `IStudentService`, não da implementação concreta |

#### Fluxo de uma requisição

```
Frontend (React)
     │ HTTP JSON
     ▼
AuthController / StudentController    ← Bean Validation na entrada
     │
     ▼
IStudentService (Interface — DIP)
     │
     ▼
StudentService
     ├──► StudentMapper              (entidade ↔ DTO)
     ├──► GradeCalculatorService     (médias e filtros)
     └──► StudentRepository          (JPA → H2)
```

### Frontend — Componentização React

```
frontend/src/
├── components/
│   ├── Login.jsx / Login.css           # Autenticação (login + cadastro)
│   ├── Dashboard.jsx / Dashboard.css   # Painel inicial com indicadores
│   ├── StudentList.jsx / StudentList.css  # Listagem com busca e ordenação
│   ├── StudentForm.jsx / StudentForm.css  # Formulário de cadastro/edição
│   └── ClassReport.jsx / ClassReport.css  # Relatório completo da turma
├── services/
│   └── api.js           # Camada de comunicação com o backend (fetch nativo)
├── App.jsx              # Roteamento entre telas
└── main.jsx
```

Cada componente tem responsabilidade única. A comunicação com a API é centralizada em `api.js` usando `fetch` nativo — sem libs externas — conforme o espírito do case.

---

## 🚀 Como Executar

### Pré-requisitos

- **Java 21+**
- **Maven** (ou use o wrapper `./mvnw` incluso no projeto)
- **Node.js 18+** e npm

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Aguarde a mensagem `Started BackendApplication`. O servidor sobe em `http://localhost:8080`.

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Console H2:** `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:studentdb`
  - User: `sa` | Password: *(vazio)*

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

#### Variável de ambiente

Crie `frontend/.env` para configurar a URL do backend:

```env
VITE_API_URL=http://localhost:8080
```

### 3. Executar testes

```bash
cd backend
./mvnw test
```

---

## 📡 Endpoints da API

### Autenticação

| Método | Rota | Descrição | Status |
|---|---|---|---|
| `POST` | `/api/auth/register` | Cadastrar professor | 201 / 400 |
| `POST` | `/api/auth/login` | Fazer login | 200 / 401 |

### Alunos

| Método | Rota | Descrição | Status |
|---|---|---|---|
| `GET` | `/api/students` | Listar todos os alunos | 200 |
| `GET` | `/api/students/{id}` | Buscar aluno por ID | 200 / 404 |
| `POST` | `/api/students` | Cadastrar novo aluno | 201 / 400 |
| `PUT` | `/api/students/{id}` | Atualizar aluno | 200 / 404 |
| `DELETE` | `/api/students/{id}` | Excluir aluno | 204 / 404 |
| `GET` | `/api/students/report` | Relatório com médias e alertas | 200 |

### Exemplos de uso (curl)

#### Cadastrar aluno

```bash
curl -X POST https://case-dti-backend.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "grade1": 7,
    "grade2": 8,
    "grade3": 6,
    "grade4": 9,
    "grade5": 10,
    "attendance": 80
  }'
```

#### Listar todos os alunos

```bash
curl https://case-dti-backend.onrender.com/api/students
```

#### Obter relatório da turma

```bash
curl https://case-dti-backend.onrender.com/api/students/report
```

#### Atualizar aluno

```bash
curl -X PUT https://case-dti-backend.onrender.com/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "grade1": 8,
    "grade2": 8,
    "grade3": 7,
    "grade4": 9,
    "grade5": 10,
    "attendance": 85
  }'
```

#### Excluir aluno

```bash
curl -X DELETE https://case-dti-backend.onrender.com/api/students/1
```

### Exemplo de resposta — Relatório da Turma

```json
{
  "students": [
    { "id": 1, "name": "João", "grade1": 7.0, "grade2": 8.0, "grade3": 6.0, "grade4": 9.0, "grade5": 10.0, "attendance": 80.0, "averageGrade": 8.0 },
    { "id": 2, "name": "Maria", "grade1": 5.0, "grade2": 6.0, "grade3": 4.0, "grade4": 7.0, "grade5": 8.0, "attendance": 70.0, "averageGrade": 6.0 }
  ],
  "subjectAverage1": 6.0,
  "subjectAverage2": 7.0,
  "subjectAverage3": 5.0,
  "subjectAverage4": 8.0,
  "subjectAverage5": 9.0,
  "studentsAboveClassAverage": ["João"],
  "studentsBelowAttendanceThreshold": ["Maria"]
}
```

> As listas `studentsAboveClassAverage` e `studentsBelowAttendanceThreshold` retornam `[]` quando não há alunos nas condições — equivale à "linha vazia" do enunciado.

---

## 🎮 Como Usar a Aplicação

### 1. Acesso

- Acesse `http://localhost:5173` (local) ou a [demonstração online](https://case-dti-frontend.onrender.com)
- Crie uma conta clicando em **"Não tem conta? Cadastre-se"**
- Faça login com seu usuário e senha

### 2. Cadastrar Aluno

1. Clique em **➕ Adicionar Aluno**
2. Preencha nome, notas (0 a 10) e frequência (0 a 100%)
3. Clique em **Cadastrar**

### 3. Buscar e Filtrar

- **Busca por nome:** Digite no campo de busca — filtra em tempo real
- **Ordenar por média:** Use o seletor "Ordenar: Maior média / Menor média"

### 4. Relatório da Turma

- Acesse a aba **📊 Relatório**
- Veja médias por disciplina, ranking individual e alertas de frequência

### Valores de teste para listas vazias

Para validar o cenário onde ambas as listas ficam vazias, cadastre alunos com médias **iguais** e frequência **≥ 75%**:

```json
{ "name": "Ana",   "grade1": 8, "grade2": 8, "grade3": 8, "grade4": 8, "grade5": 8, "attendance": 75 }
{ "name": "Bruno", "grade1": 8, "grade2": 8, "grade3": 8, "grade4": 8, "grade5": 8, "attendance": 80 }
```

*(Médias individuais = média da turma → filtro `>` não retorna ninguém; frequências ≥ 75 → lista de baixa frequência vazia)*

---

## 🧪 Testes

Testes unitários com **JUnit 5 + Mockito** cobrindo a camada de serviço:

| Classe de Teste | Cenários cobertos |
|---|---|
| `StudentServiceTest` | Adicionar, buscar por ID, listar todos, atualizar, excluir e gerar relatório |
| `UserServiceTest` | Registrar usuário e login com senha incorreta |

```bash
cd backend
./mvnw test
```

---

## 📌 Premissas Assumidas

1. **Frequência aceita decimal** — o campo suporta `double` de 0 a 100, como `75.5`.
2. **"Acima da média"** usa comparação estritamente maior (`>`): média **igual** à da turma **não** entra na lista.
3. **"Abaixo de 75%"** usa comparação estritamente menor (`<`): frequência exatamente 75% **não** gera alerta.
4. **Banco em memória (H2)** — foi utilizado para simplificar a execução do projeto. Os dados são reiniciados quando o backend é reiniciado.
5. **Autenticação simples** — sem JWT; o backend valida as credenciais e retorna os dados do usuário; o frontend controla o estado de sessão via React state. Adequado para o escopo do case.
6. **Sem segmentação por professor** — qualquer usuário autenticado vê e gerencia todos os alunos.
7. **Cinco disciplinas fixas** — o enunciado define exatamente cinco disciplinas; quantidade dinâmica não foi implementada.

---

## 🧩 Decisões de Projeto

### Por que Spring Boot (Java) no backend?
Escolhi Spring Boot por ser um framework consolidado para construção de APIs REST, com bom suporte a validação, persistência e testes. Utilizando Java 21 foi possível usar records como DTOs, o que reduz bastante código boilerplate.

### Por que H2 (banco em memória)?
O H2 foi utilizado para simplificar a execução do projeto. Dessa forma, o avaliador consegue rodar o sistema sem precisar configurar um banco externo. Para futuras mudanças, a troca para PostgreSQL pode ser feita apenas ajustando a configuração do `application.properties`.

### Por que separar `GradeCalculatorService`?
Toda a lógica de cálculo (média do aluno, média por disciplina, média da turma e filtros) foi isolada em um serviço próprio. Isso evita acoplamento com a camada de persistência e segue o princípio de **Single Responsibility (SRP)**, deixando a lógica mais fácil de testar e manter.

### Por que usar `IStudentService` (interface)?
O controller depende da interface **IStudentService** em vez da implementação concreta. Essa abordagem segue o `Dependency Inversion Principle (DIP)` e facilita testes e futuras mudanças de implementação sem impactar o controller.

### Por que CSS puro no frontend?
Optei por utilizar CSS puro para manter o projeto simples e sem dependências adicionais. Como o foco do teste está na lógica da aplicação, isso ajuda a manter o código mais leve e direto.

### Por que Vite + React 19?
O frontend foi desenvolvido com React utilizando Vite, que oferece inicialização rápida e hot-reload eficiente durante o desenvolvimento.

### Documentação automática
A documentação da API é gerada automaticamente utilizando SpringDoc / OpenAPI, permitindo explorar e testar os endpoints diretamente pelo navegador via Swagger UI.

---

## 🔗 Links

| Recurso | URL |
|---|---|
| 🌐 Frontend (produção) | https://case-dti-frontend.onrender.com |
| 🔌 Backend API (produção) | https://case-dti-backend.onrender.com |
| 📖 Swagger UI (produção) | https://case-dti-backend.onrender.com/swagger-ui.html |

---

**Desenvolvido por Gabriela Alvarenga**  
*Desafio Técnico 2026 — DTI Digital*