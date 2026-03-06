package com.dti.backend;

import com.dti.backend.dto.StudentRequest;
import com.dti.backend.dto.StudentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

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

        when(studentRepository.save(any(Student.class)))
                .thenReturn(savedStudent);

        StudentResponse response = studentService.addStudent(request);

        assertEquals("Carlos", response.name());
        assertEquals(1L, response.id());
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

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        StudentResponse response = studentService.getStudent(1L);

        assertEquals("Carlos", response.name());
    }

    @Test
    void shouldDeleteStudent() {

        when(studentRepository.existsById(1L)).thenReturn(true);

        studentService.deleteStudent(1L);

        verify(studentRepository).deleteById(1L);
    }

}