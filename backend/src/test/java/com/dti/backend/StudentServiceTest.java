package com.dti.backend;

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

        StudentRequest request = new StudentRequest(
                "Carlos",8,7,9,6,8,90
        );

        Student student = Student.builder()
                .name("Carlos")
                .grade1(8)
                .grade2(7)
                .grade3(9)
                .grade4(6)
                .grade5(8)
                .attendance(90)
                .build();

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

}