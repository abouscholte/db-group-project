export type MatchEvent = {
    id: number;
    match_id: number;
    player_id: number | null;
    team_id: number;
    event_type: string;
    quarter: number;
    game_time: string;
    points: number;
    assist_player_id: number | null;
    description: string;
    timestamp: string;
};
export declare const match_events: MatchEvent[];
