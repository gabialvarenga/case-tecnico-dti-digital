package com.dti.backend.service;

import com.dti.backend.dto.ClassReportResponse;
import com.dti.backend.dto.StudentRequest;
import com.dti.backend.dto.StudentResponse;

import java.util.List;

public interface IStudentService {
    
    StudentResponse addStudent(StudentRequest request);
    
    List<StudentResponse> getAllStudents();
    
    StudentResponse getStudent(Long id);
    
    StudentResponse updateStudent(Long id, StudentRequest request);
    
    void deleteStudent(Long id);
    
    ClassReportResponse getClassReport();
}
