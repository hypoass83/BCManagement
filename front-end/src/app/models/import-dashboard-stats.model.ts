export interface ImportDashboardStats {
  session: number;
  exams: ExamDashboardCard[];
}

export interface ExamDashboardCard {
  examCode: string;
  examLabel: string;

  totalCentres: number;
  successCentres: number;
  errorCentres: number;
  successRate: number;

  totalCandidates: number;
  successCandidates: number;
  errorCandidates: number;
}
