package com.dti.backend;

import com.dti.backend.dto.ClassReportResponse;
import com.dti.backend.dto.StudentRequest;
import com.dti.backend.dto.StudentResponse;
import com.dti.backend.entity.Student;
import com.dti.backend.mapper.StudentMapper;
import com.dti.backend.repository.StudentRepository;
import com.dti.backend.service.GradeCalculatorService;
import com.dti.backend.service.StudentService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentMapper studentMapper;

    @Mock
    private GradeCalculatorService gradeCalculatorService;

    @InjectMocks
    private StudentService studentService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldAddStudent() {

        //Payload da API - Quando o professor faz a requisção de cadastro de um aluno, 
        // ele envia um JSON com os dados do aluno. 
        // Esse JSON é mapeado para um objeto StudentRequest.
        StudentRequest request = new StudentRequest(
                "Carlos",8,7,9,6,8,90
        );

        //Representa o estudante antes de salvar no bd.
        Student student = Student.builder()
                .name("Carlos")
                .grade1(8)
                .grade2(7)
                .grade3(9)
                .grade4(6)
                .grade5(8)
                .attendance(90)
                .build();

        //Representa o estudante depois de salvar no bd, com o ID gerado pelo banco.
        //Simula o comportamento da JPA 
        Student savedStudent = Student.builder()
                .id(1L)
                .name("Carlos")
                .grade1(8)
                .grade2(7)
                .grade3(9)
                .grade4(6)
                .grade5(8)
                .attendance(90)
                .build();

        //Resultado esperado pela API, o que ela deve retornar para o professor após cadastrar o aluno.
        StudentResponse expectedResponse = new StudentResponse(
                1L, "Carlos", 8, 7, 9, 6, 8, 90, 7.6
        );

        when(studentMapper.toEntity(request)).thenReturn(student);
        when(studentRepository.save(student)).thenReturn(savedStudent);
        when(gradeCalculatorService.calculateAverageGrade(savedStudent)).thenReturn(7.6);
        when(studentMapper.toResponse(savedStudent, 7.6)).thenReturn(expectedResponse);

        StudentResponse response = studentService.addStudent(request);

        assertEquals("Carlos", response.name());
        assertEquals(1L, response.id());
        assertEquals(7.6, response.averageGrade());
        
        //Verify garante que os métodos foram chamados.
        verify(studentMapper).toEntity(request);
        verify(studentRepository).save(student);
        verify(gradeCalculatorService).calculateAverageGrade(savedStudent);
        verify(studentMapper).toResponse(savedStudent, 7.6);
    }

    @Test
    void shouldReturnStudentById() {

        Student student = Student.builder()
                .id(1L)
                .name("Carlos")
                .grade1(8)
                .grade2(8)
                .grade3(8)
                .grade4(8)
                .grade5(8)
                .attendance(90)
                .build();

        StudentResponse expectedResponse = new StudentResponse(
                1L, "Carlos", 8, 8, 8, 8, 8, 90, 8.0
        );

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(gradeCalculatorService.calculateAverageGrade(student)).thenReturn(8.0);
        when(studentMapper.toResponse(student, 8.0)).thenReturn(expectedResponse);

        StudentResponse response = studentService.getStudent(1L);

        assertEquals("Carlos", response.name());
        assertEquals(8.0, response.averageGrade());
        
        verify(studentRepository).findById(1L);
        verify(gradeCalculatorService).calculateAverageGrade(student);
        verify(studentMapper).toResponse(student, 8.0);
    }

    @Test
    void shouldDeleteStudent() {

        when(studentRepository.existsById(1L)).thenReturn(true);

        studentService.deleteStudent(1L);

        verify(studentRepository).deleteById(1L);
    }

    @Test
    void shouldGenerateClassReport() {

        Student joao = Student.builder()
                .id(1L)
                .name("João")
                .grade1(5)
                .grade2(6)
                .grade3(4)
                .grade4(7)
                .grade5(8)
                .attendance(80)
                .build();

        Student maria = Student.builder()
                .id(2L)
                .name("Maria")
                .grade1(7)
                .grade2(8)
                .grade3(6)
                .grade4(9)
                .grade5(10)
                .attendance(70)
                .build();

        List<Student> students = List.of(joao, maria);

        StudentResponse joaoResponse = new StudentResponse(1L, "João", 5, 6, 4, 7, 8, 80, 6.0);
        StudentResponse mariaResponse = new StudentResponse(2L, "Maria", 7, 8, 6, 9, 10, 70, 8.0);

        when(studentRepository.findAll()).thenReturn(students);

        when(gradeCalculatorService.calculateSubjectAverage(students, 1)).thenReturn(6.0);
        when(gradeCalculatorService.calculateSubjectAverage(students, 2)).thenReturn(7.0);
        when(gradeCalculatorService.calculateSubjectAverage(students, 3)).thenReturn(5.0);
        when(gradeCalculatorService.calculateSubjectAverage(students, 4)).thenReturn(8.0);
        when(gradeCalculatorService.calculateSubjectAverage(students, 5)).thenReturn(9.0);

        when(gradeCalculatorService.calculateClassAverage(students)).thenReturn(7.0);

        when(gradeCalculatorService.getStudentsAboveAverage(students, 7.0)).thenReturn(List.of("Maria"));
        when(gradeCalculatorService.getStudentsBelowAttendanceThreshold(students)).thenReturn(List.of("Maria"));

        when(gradeCalculatorService.calculateAverageGrade(joao)).thenReturn(6.0);
        when(gradeCalculatorService.calculateAverageGrade(maria)).thenReturn(8.0);
        
        when(studentMapper.toResponse(joao, 6.0)).thenReturn(joaoResponse);
        when(studentMapper.toResponse(maria, 8.0)).thenReturn(mariaResponse);

        ClassReportResponse report = studentService.getClassReport();

        assertEquals(2, report.students().size());
        assertEquals(6.0, report.subjectAverage1());
        assertEquals(7.0, report.subjectAverage2());
        assertEquals(5.0, report.subjectAverage3());
        assertEquals(8.0, report.subjectAverage4());
        assertEquals(9.0, report.subjectAverage5());
        assertEquals(List.of("Maria"), report.studentsAboveClassAverage());
        assertEquals(List.of("Maria"), report.studentsBelowAttendanceThreshold());
    }

}