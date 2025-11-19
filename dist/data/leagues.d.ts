export type League = {
    id: number;
    name: string;
    short_name: string;
    country: string;
    country_short: string;
    country_emoji: string;
    conference: string;
    logo_url: string;
    brand_color: string;
    season_year: number;
    season_start_date: string;
    season_end_date: string;
    season_type: string;
    status: string;
};
export declare const leagues: League[];
