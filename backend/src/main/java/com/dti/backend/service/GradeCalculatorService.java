package com.dti.backend.service;

import com.dti.backend.entity.Student;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeCalculatorService {

    private static final int NUMBER_OF_GRADES = 5;
    private static final double MINIMUM_ATTENDANCE = 75.0;

    public double calculateAverageGrade(Student student) {
        return (student.getGrade1() + 
                student.getGrade2() + 
                student.getGrade3() + 
                student.getGrade4() + 
                student.getGrade5()) / NUMBER_OF_GRADES;
    }

    public double calculateSubjectAverage(List<Student> students, int subjectNumber) {
        if (students.isEmpty()) {
            return 0.0;
        }

        return switch (subjectNumber) {
            case 1 -> students.stream().mapToDouble(Student::getGrade1).average().orElse(0);
            case 2 -> students.stream().mapToDouble(Student::getGrade2).average().orElse(0);
            case 3 -> students.stream().mapToDouble(Student::getGrade3).average().orElse(0);
            case 4 -> students.stream().mapToDouble(Student::getGrade4).average().orElse(0);
            case 5 -> students.stream().mapToDouble(Student::getGrade5).average().orElse(0);
            default -> 0.0;
        };
    }

    public double calculateClassAverage(List<Student> students) {
        if (students.isEmpty()) {
            return 0.0;
        }

        return students.stream()
                .mapToDouble(this::calculateAverageGrade)
                .average()
                .orElse(0);
    }

    public List<String> getStudentsAboveAverage(List<Student> students, double classAverage) {
        return students.stream()
                .filter(s -> calculateAverageGrade(s) > classAverage)
                .map(Student::getName)
                .toList();
    }

    public List<String> getStudentsBelowAttendanceThreshold(List<Student> students) {
        return students.stream()
                .filter(s -> s.getAttendance() < MINIMUM_ATTENDANCE)
                .map(Student::getName)
                .toList();
    }
}
