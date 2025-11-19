export type Match = {
    id: number;
    league_id: number;
    home_team_id: number;
    away_team_id: number;
    datetime: string;
    venue: string;
    home_score: number | null;
    away_score: number | null;
    overtime: boolean;
    attendance: number;
    status: string;
    game_type: string;
};
export declare const matches: Match[];
