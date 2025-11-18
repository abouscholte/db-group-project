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
  season_start_date: string; // ISO date
  season_end_date: string;   // ISO date
  season_type: string;
  status: string;
};

export const leagues: League[] = [
  {
    id: 1,
    name: "National Basketball Association",
    short_name: "NBA",
    country: "USA/Canada",
    country_short: "USA/Canada",
    country_emoji: "🇺🇸🇨🇦",
    conference: "North America",
    logo_url: "/nba.svg",
    brand_color: "#C9082A",
    season_year: 2025,
    season_start_date: "2025-04-22",
    season_end_date: "2025-05-28",
    season_type: "Regular Season",
    status: "Finished"
  },
  {
    id: 2,
    name: "EuroLeague",
    short_name: "EL",
    country: "Pan-Europe",
    country_short: "Europe",
    country_emoji: "🇪🇺",
    conference: "Europe",
    logo_url: "/euroleague.svg",
    brand_color: "#003296",
    season_year: 2025,
    season_start_date: "2025-08-20",
    season_end_date: "2025-09-25",
    season_type: "Regular Season",
    status: "Finished"
  },
  {
    id: 3,
    name: "Chinese Basketball Association",
    short_name: "CBA",
    country: "China",
    country_short: "China",
    country_emoji: "🇨🇳",
    conference: "Asia",
    logo_url: "/cba.svg",
    brand_color: "#C60C30",
    season_year: 2025,
    season_start_date: "2025-12-18",
    season_end_date: "2026-01-23",
    season_type: "Regular Season",
    status: "Finished"
  },
  {
    id: 4,
    name: "NBL (Australia)",
    short_name: "NBL",
    country: "Australia",
    country_short: "AUS",
    country_emoji: "🇦🇺",
    conference: "Oceania",
    logo_url: "/nbl-aus.svg",
    brand_color: "#F26522",
    season_year: 2025,
    season_start_date: "2026-04-17",
    season_end_date: "2026-05-23",
    season_type: "Regular Season",
    status: "Finished"
  },
  {
    id: 5,
    name: "Liga ACB",
    short_name: "ACB",
    country: "Spain",
    country_short: "Spain",
    country_emoji: "🇪🇸",
    conference: "Europe",
    logo_url: "/acb.svg",
    brand_color: "#FFC72C",
    season_year: 2026,
    season_start_date: "2026-08-15",
    season_end_date: "2026-09-23",
    season_type: "Regular Season",
    status: "Finished"
  }
];
