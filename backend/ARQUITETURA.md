# Arquitetura do Projeto - MVC e SOLID

## 📋 Índice
- [Arquitetura MVC](#arquitetura-mvc)
- [Princípios SOLID](#princípios-solid)
- [Estrutura de Camadas](#estrutura-de-camadas)
- [Diagrama de Classes](#diagrama-de-classes)

---

## 🏗️ Arquitetura MVC

O projeto segue o padrão **MVC (Model-View-Controller)** adaptado para APIs REST:

### **Model (Modelo)**
- **Localização**: `entity/`, `dto/`
- **Responsabilidade**: Representar os dados da aplicação
- **Componentes**:
  - `Student` (Entity): Modelo de domínio persistido no banco de dados
  - `StudentRequest`, `StudentResponse`, `ClassReportResponse` (DTOs): Objetos de transferência de dados

### **View (Visão)**
- **Localização**: Frontend React (pasta `frontend/`)
- **Responsabilidade**: Interface do usuário
- **Comunicação**: REST API via JSON

### **Controller (Controlador)**
- **Localização**: `controller/`
- **Responsabilidade**: Gerenciar requisições HTTP e coordenar respostas
- **Componente**:
  - `StudentController`: Endpoints REST para operações com estudantes

---

## ⚙️ Princípios SOLID

### 1. **S - Single Responsibility Principle (SRP)**
> Cada classe deve ter uma única responsabilidade

✅ **Aplicado em**:
- `StudentController`: Apenas gerencia requisições HTTP
- `StudentService`: Apenas orquestra operações de negócio
- `StudentMapper`: Apenas converte entre DTOs e entidades
- `GradeCalculatorService`: Apenas realiza cálculos de notas
- `StudentRepository`: Apenas acessa dados
- `GlobalExceptionHandler`: Apenas trata exceções
- `Student` (Entity): Apenas representa dados (sem lógica de negócio)

### 2. **O - Open/Closed Principle (OCP)**
> Aberto para extensão, fechado para modificação

✅ **Aplicado em**:
- `IStudentService`: Interface permite diferentes implementações sem modificar código existente
- `GradeCalculatorService`: Métodos podem ser estendidos com novos tipos de cálculos
- `GlobalExceptionHandler`: Novos handlers podem ser adicionados sem modificar existentes

### 3. **L - Liskov Substitution Principle (LSP)**
> Objetos de uma superclasse devem ser substituíveis por objetos de suas subclasses

✅ **Aplicado em**:
- `StudentService` implementa `IStudentService` e pode ser substituído por qualquer implementação da interface
- Todas as implementações Spring Data JPA de `StudentRepository` são intercambiáveis

### 4. **I - Interface Segregation Principle (ISP)**
> Clientes não devem depender de interfaces que não usam

✅ **Aplicado em**:
- `IStudentService`: Interface coesa com apenas os métodos necessários
- Sem interfaces "gordas" - cada interface tem um propósito específico

### 5. **D - Dependency Inversion Principle (DIP)**
> Dependa de abstrações, não de implementações concretas

✅ **Aplicado em**:
- `StudentController` depende de `IStudentService` (interface), não de `StudentService` (implementação)
- Injeção de dependências via construtor com `@RequiredArgsConstructor`
- Spring gerencia todas as dependências

---

## 📁 Estrutura de Camadas

```
backend/
└── src/main/java/com/dti/backend/
    ├── controller/          # Camada de Apresentação (Controller)
    │   └── StudentController.java
    │
    ├── service/             # Camada de Negócio (Service)
    │   ├── IStudentService.java          [Interface - DIP]
    │   ├── StudentService.java           [Implementação]
    │   └── GradeCalculatorService.java   [SRP - Cálculos]
    │
    ├── repository/          # Camada de Persistência (Repository)
    │   └── StudentRepository.java
    │
    ├── entity/              # Modelo de Domínio (Model)
    │   └── Student.java
    │
    ├── dto/                 # Data Transfer Objects (Model)
    │   ├── StudentRequest.java
    │   ├── StudentResponse.java
    │   └── ClassReportResponse.java
    │
    ├── mapper/              # Conversão de Dados (SRP)
    │   └── StudentMapper.java
    │
    └── exception/           # Tratamento de Exceções (SRP)
        ├── StudentNotFoundException.java
        └── GlobalExceptionHandler.java
```

---

## 🔄 Fluxo de Requisição

```
Cliente (Frontend)
    ↓
    ↓ HTTP Request
    ↓
StudentController (Controller)
    ↓
    ↓ Chama método
    ↓
IStudentService (Interface - DIP)
    ↓
    ↓ Implementação
    ↓
StudentService (Service)
    ├──→ StudentMapper (Converte DTOs)
    ├──→ GradeCalculatorService (Calcula notas)
    └──→ StudentRepository (Acessa dados)
            ↓
            ↓ JPA/Hibernate
            ↓
        Banco de Dados (H2/PostgreSQL/MySQL)
```

---

## 📊 Diagrama de Classes (Simplificado)

```
┌─────────────────────┐
│  StudentController  │ (Controller - MVC)
│  - IStudentService  │ ← Depende da INTERFACE (DIP)
└──────────┬──────────┘
           │
           ↓ implements
┌─────────────────────┐
│  IStudentService    │ (Interface - DIP, ISP)
│  + addStudent()     │
│  + getStudent()     │
│  + updateStudent()  │
│  + deleteStudent()  │
│  + getClassReport() │
└──────────┬──────────┘
           │
           ↓ implements
┌─────────────────────────────────┐
│      StudentService             │ (Service - SRP)
│  - StudentRepository            │
│  - StudentMapper                │
│  - GradeCalculatorService       │
└─────────────────────────────────┘
           │
           ├──→ ┌──────────────────────┐
           │    │   StudentMapper      │ (SRP)
           │    │  + toEntity()        │
           │    │  + toResponse()      │
           │    │  + updateEntity()    │
           │    └──────────────────────┘
           │
           ├──→ ┌───────────────────────────────┐
           │    │  GradeCalculatorService       │ (SRP, OCP)
           │    │  + calculateAverageGrade()    │
           │    │  + calculateSubjectAverage()  │
           │    │  + calculateClassAverage()    │
           │    └───────────────────────────────┘
           │
           └──→ ┌──────────────────────┐
                │  StudentRepository   │ (Repository - MVC)
                │  extends JpaRepo     │
                └──────────────────────┘
                           │
                           ↓ persists
                ┌──────────────────────┐
                │      Student         │ (Model - MVC)
                │  - id, name          │
                │  - grades 1-5        │
                │  - attendance        │
                └──────────────────────┘
```

---

## ✅ Benefícios da Arquitetura Adotada

### **Manutenibilidade**
- Código organizado e fácil de localizar
- Responsabilidades bem definidas
- Reduz acoplamento entre componentes

### **Testabilidade**
- Fácil criar testes unitários com mocks
- Dependências injetadas via interfaces
- Lógica de negócio separada da infraestrutura

### **Escalabilidade**
- Fácil adicionar novos serviços
- Possibilidade de trocar implementações (ex: mudar de H2 para PostgreSQL)
- Código aberto para extensão

### **Reusabilidade**
- Componentes independentes podem ser reutilizados
- Mapeadores, calculadores e validadores isolados
- DTOs reutilizáveis em diferentes contextos

### **Flexibilidade**
- Fácil trocar implementações (DIP)
- Possível adicionar novos endpoints sem modificar serviços
- Tratamento centralizado de exceções

---

## 🔍 Exemplo Prático de SOLID

### **Antes (Sem SOLID)**
```java
@Service
public class StudentService {
    // ❌ Múltiplas responsabilidades
    // ❌ Lógica de conversão misturada
    // ❌ Cálculos dentro do service
    // ❌ Sem interface (acoplamento forte)
}
```

### **Depois (Com SOLID)**
```java
// ✅ DIP: Depende de interface
public interface IStudentService { }

// ✅ SRP: Apenas orquestra operações
@Service
public class StudentService implements IStudentService {
    private final StudentMapper mapper;           // SRP
    private final GradeCalculatorService calc;    // SRP
    private final StudentRepository repo;         // SRP
}

// ✅ SRP: Apenas converte dados
@Component
public class StudentMapper { }

// ✅ SRP: Apenas realiza cálculos
@Service
public class GradeCalculatorService { }
```

---

## 📚 Referências

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [MVC Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- [Spring Boot Best Practices](https://spring.io/guides)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
