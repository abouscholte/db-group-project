export type InjuryReport = {
    id: number;
    player_id: number;
    injury_type: string;
    severity: string;
    injury_date: string;
    expected_recovery_date: string;
    status: string;
    notes: string;
};
export declare const injury_reports: InjuryReport[];
