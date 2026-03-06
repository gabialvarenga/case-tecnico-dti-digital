package com.dti.backend.dto;

import java.util.List;

public record ClassReportResponse(
        List<StudentResponse> students,
        double subjectAverage1,
        double subjectAverage2,
        double subjectAverage3,
        double subjectAverage4,
        double subjectAverage5,
        List<String> studentsAboveClassAverage,
        List<String> studentsBelowAttendanceThreshold
) {
}
