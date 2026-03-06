package com.dti.backend;

import com.dti.backend.dto.ClassReportResponse;
import com.dti.backend.dto.StudentRequest;
import com.dti.backend.dto.StudentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentResponse addStudent(StudentRequest request) {
        Student student = Student.builder()
                .name(request.name())
                .grade1(request.grade1())
                .grade2(request.grade2())
                .grade3(request.grade3())
                .grade4(request.grade4())
                .grade5(request.grade5())
                .attendance(request.attendance())
                .build();
        return toResponse(studentRepository.save(student));
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public StudentResponse getStudent(Long id) {
        return studentRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        student.setName(request.name());
        student.setGrade1(request.grade1());
        student.setGrade2(request.grade2());
        student.setGrade3(request.grade3());
        student.setGrade4(request.grade4());
        student.setGrade5(request.grade5());
        student.setAttendance(request.attendance());
        return toResponse(studentRepository.save(student));
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado");
        }
        studentRepository.deleteById(id);
    }

    public ClassReportResponse getClassReport() {
        List<Student> students = studentRepository.findAll();

        if (students.isEmpty()) {
            return new ClassReportResponse(List.of(), 0, 0, 0, 0, 0, List.of(), List.of());
        }

        double subjectAvg1 = students.stream().mapToDouble(Student::getGrade1).average().orElse(0);
        double subjectAvg2 = students.stream().mapToDouble(Student::getGrade2).average().orElse(0);
        double subjectAvg3 = students.stream().mapToDouble(Student::getGrade3).average().orElse(0);
        double subjectAvg4 = students.stream().mapToDouble(Student::getGrade4).average().orElse(0);
        double subjectAvg5 = students.stream().mapToDouble(Student::getGrade5).average().orElse(0);

        double classAverage = students.stream()
                .mapToDouble(Student::getAverageGrade)
                .average()
                .orElse(0);

        List<String> studentsAboveClassAverage = students.stream()
                .filter(s -> s.getAverageGrade() > classAverage)
                .map(Student::getName)
                .toList();

        List<String> studentsBelowAttendanceThreshold = students.stream()
                .filter(s -> s.getAttendance() < 75)
                .map(Student::getName)
                .toList();

        List<StudentResponse> studentResponses = students.stream()
                .map(this::toResponse)
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

    private StudentResponse toResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getGrade1(),
                student.getGrade2(),
                student.getGrade3(),
                student.getGrade4(),
                student.getGrade5(),
                student.getAttendance(),
                student.getAverageGrade()
        );
    }
}
