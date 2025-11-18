export type InjuryReport = {
  id: number;
  player_id: number;
  injury_type: string;
  severity: string;
  injury_date: string; // ISO date
  expected_recovery_date: string; // ISO date
  status: string;
  notes: string;
};

export const injury_reports: InjuryReport[] = [
  {"id":4001,"player_id":1006,"injury_type":"Foot Sprain","severity":"Moderate","injury_date":"2025-11-05","expected_recovery_date":"2025-12-15","status":"Out","notes":"Sustained in practice."},
  {"id":4002,"player_id":1018,"injury_type":"Calf Strain","severity":"Minor","injury_date":"2025-11-13","expected_recovery_date":"2025-11-20","status":"Day-to-day","notes":"Pulled up lame during practice."},
  {"id":4003,"player_id":1035,"injury_type":"Hand Contusion","severity":"Minor","injury_date":"2025-11-11","expected_recovery_date":"2025-11-14","status":"Questionable","notes":"Hit on hand during Match 2002."},
  {"id":4004,"player_id":1051,"injury_type":"Back Soreness","severity":"Moderate","injury_date":"2025-11-13","expected_recovery_date":"2025-11-25","status":"Out","notes":"Back flared up after Match 2004."},
  {"id":4005,"player_id":2010,"injury_type":"Hamstring Strain","severity":"Minor","injury_date":"2025-11-08","expected_recovery_date":"2025-11-18","status":"Day-to-day","notes":"Felt tightness."},
  {"id":4006,"player_id":2026,"injury_type":"Knee Soreness","severity":"Minor","injury_date":"2025-11-16","expected_recovery_date":"2025-11-19","status":"Questionable","notes":"Routine maintenance."},
  {"id":4007,"player_id":2037,"injury_type":"Ankle Sprain","severity":"Moderate","injury_date":"2025-11-15","expected_recovery_date":"2025-12-05","status":"Out","notes":"Landed awkwardly in Match 2010."},
  {"id":4008,"player_id":2051,"injury_type":"Knee Surgery","severity":"Major","injury_date":"2025-09-10","expected_recovery_date":"2026-03-01","status":"Out for Season","notes":"Pre-season injury."},
  {"id":4009,"player_id":1007,"injury_type":"Knee Effusion","severity":"Moderate","injury_date":"2025-11-01","expected_recovery_date":"2025-11-30","status":"Out","notes":"Swelling in left knee."},
  {"id":4010,"player_id":1040,"injury_type":"Ankle Sprain","severity":"Minor","injury_date":"2025-11-17","expected_recovery_date":"2025-11-22","status":"Day-to-day","notes":"Twisted ankle in practice."},
  {"id":4011,"player_id":2003,"injury_type":"Thigh Bruise","severity":"Minor","injury_date":"2025-11-15","expected_recovery_date":"2025-11-17","status":"Probable","notes":"Took a hard knee in Match 2009."},
  {"id":4012,"player_id":2048,"injury_type":"Shoulder Strain","severity":"Moderate","injury_date":"2025-11-18","expected_recovery_date":"2025-12-10","status":"Out","notes":"Sustained in Match 2012."}
];
