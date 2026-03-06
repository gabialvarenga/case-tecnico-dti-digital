package com.dti.backend.service;

import com.dti.backend.dto.ClassReportResponse;
import com.dti.backend.dto.StudentRequest;
import com.dti.backend.dto.StudentResponse;
import com.dti.backend.entity.Student;
import com.dti.backend.exception.StudentNotFoundException;
import com.dti.backend.mapper.StudentMapper;
import com.dti.backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService implements IStudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final GradeCalculatorService gradeCalculatorService;

    @Override
    public StudentResponse addStudent(StudentRequest request) {
        Student student = studentMapper.toEntity(request);
        Student savedStudent = studentRepository.save(student);
        double avgGrade = gradeCalculatorService.calculateAverageGrade(savedStudent);
        return studentMapper.toResponse(savedStudent, avgGrade);
    }

    @Override
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(student -> {
                    double avgGrade = gradeCalculatorService.calculateAverageGrade(student);
                    return studentMapper.toResponse(student, avgGrade);
                })
                .toList();
    }

    @Override
    public StudentResponse getStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        double avgGrade = gradeCalculatorService.calculateAverageGrade(student);
        return studentMapper.toResponse(student, avgGrade);
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        
        studentMapper.updateEntity(student, request);
        Student updatedStudent = studentRepository.save(student);
        double avgGrade = gradeCalculatorService.calculateAverageGrade(updatedStudent);
        return studentMapper.toResponse(updatedStudent, avgGrade);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public ClassReportResponse getClassReport() {
        List<Student> students = studentRepository.findAll();

        if (students.isEmpty()) {
            return new ClassReportResponse(List.of(), 0, 0, 0, 0, 0, List.of(), List.of());
        }

        // Calculate subject averages
        double subjectAvg1 = gradeCalculatorService.calculateSubjectAverage(students, 1);
        double subjectAvg2 = gradeCalculatorService.calculateSubjectAverage(students, 2);
        double subjectAvg3 = gradeCalculatorService.calculateSubjectAverage(students, 3);
        double subjectAvg4 = gradeCalculatorService.calculateSubjectAverage(students, 4);
        double subjectAvg5 = gradeCalculatorService.calculateSubjectAverage(students, 5);

        // Calculate class average
        double classAverage = gradeCalculatorService.calculateClassAverage(students);

        // Get students statistics
        List<String> studentsAboveClassAverage = gradeCalculatorService.getStudentsAboveAverage(students, classAverage);
        List<String> studentsBelowAttendanceThreshold = gradeCalculatorService.getStudentsBelowAttendanceThreshold(students);

        // Map students to response DTOs
        List<StudentResponse> studentResponses = students.stream()
                .map(student -> {
                    double avgGrade = gradeCalculatorService.calculateAverageGrade(student);
                    return studentMapper.toResponse(student, avgGrade);
                })
                .toList();

        return new ClassReportResponse(
                studentResponses,
                subjectAvg1,
                subjectAvg2,
                subjectAvg3,
                subjectAvg4,
                subjectAvg5,
                studentsAboveClassAverage,
                studentsBelowAttendanceThreshold
        );
    }
}
