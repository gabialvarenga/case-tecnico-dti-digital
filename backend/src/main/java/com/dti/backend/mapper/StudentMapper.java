package com.dti.backend.mapper;

import com.dti.backend.dto.StudentRequest;
import com.dti.backend.dto.StudentResponse;
import com.dti.backend.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    
    public Student toEntity(StudentRequest request) {
        return Student.builder()
                .name(request.name())
                .grade1(request.grade1())
                .grade2(request.grade2())
                .grade3(request.grade3())
                .grade4(request.grade4())
                .grade5(request.grade5())
                .attendance(request.attendance())
                .build();
    }

    public StudentResponse toResponse(Student student, double averageGrade) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getGrade1(),
                student.getGrade2(),
                student.getGrade3(),
                student.getGrade4(),
                student.getGrade5(),
                student.getAttendance(),
                averageGrade
        );
    }

    public void updateEntity(Student student, StudentRequest request) {
        student.setName(request.name());
        student.setGrade1(request.grade1());
        student.setGrade2(request.grade2());
        student.setGrade3(request.grade3());
        student.setGrade4(request.grade4());
        student.setGrade5(request.grade5());
        student.setAttendance(request.attendance());
    }
}
