export type Team = {
  id: number;
  name: string;
  short_name: string;
  city: string;
  state: string;
  conference: string;
  division: string;
  logo_url: string;
  arena_name: string;
};

export const teams: Team[] = [
  { "id": 1, "name": "Atlanta Hawks", "short_name": "Atl", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/atl.svg", "arena_name": "Arena 1" },
  { "id": 2, "name": "Boston Celtics", "short_name": "Bos", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/bos.svg", "arena_name": "Arena 2" },
  { "id": 3, "name": "Brooklyn Nets", "short_name": "Bro", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/bro.svg", "arena_name": "Arena 3" },
  { "id": 4, "name": "Charlotte Hornets", "short_name": "Cha", 
    "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/cha.svg", "arena_name": "Arena 4" },
  { "id": 5, "name": "Chicago Bulls", "short_name": "Chi", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/chi.svg", "arena_name": "Arena 5" },
  { "id": 6, "name": "Cleveland Cavaliers", "short_name": "Cle", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/cle.svg", "arena_name": "Arena 6" },
  { "id": 7, "name": "Dallas Mavericks", "short_name": "Dal", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/dal.svg", "arena_name": "Arena 7" },
  { "id": 8, "name": "Denver Nuggets", "short_name": "Den", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/den.svg", "arena_name": "Arena 8" },
  { "id": 9, "name": "Detroit Pistons", "short_name": "Det", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/det.svg", "arena_name": "Arena 9" },
  { "id": 10, "name": "Golden State Warriors", "short_name": "Gol", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/gol.svg", "arena_name": "Arena 10" },
  { "id": 11, "name": "France", "short_name": "Fra", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/fra.svg", "arena_name": "Arena 11" },
  { "id": 12, "name": "Latvia", "short_name": "Lat", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/lat.svg", "arena_name": "Arena 12" },
  { "id": 13, "name": "Serbia", "short_name": "Ser", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/ser.svg", "arena_name": "Arena 13" },
  { "id": 14, "name": "Lithuania", "short_name": "Lit", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/lit.svg", "arena_name": "Arena 14" },
  { "id": 15, "name": "Spain", "short_name": "Spa", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/spa.svg", "arena_name": "Arena 15" },
  { "id": 16, "name": "Germany", "short_name": "Ger", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/ger.svg", "arena_name": "Arena 16" },
  { "id": 17, "name": "Italy", "short_name": "Ita", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/ita.svg", "arena_name": "Arena 17" },
  { "id": 18, "name": "Greece", "short_name": "Gre", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/gre.svg", "arena_name": "Arena 18" },
  { "id": 19, "name": "Turkey", "short_name": "Tur", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/tur.svg", "arena_name": "Arena 19" },
  { "id": 20, "name": "Finland", "short_name": "Fin", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/fin.svg", "arena_name": "Arena 20" },
  { "id": 21, "name": "Guangdong Southern Tigers", "short_name": "Gua", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/gua.png", "arena_name": "Arena 21" },
  { "id": 22, "name": "Beijing Ducks", "short_name": "Bei", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/bei.png", "arena_name": "Arena 22" },
  { "id": 23, "name": "Xinjiang Flying Tigers", "short_name": "Xin", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/xin.png", "arena_name": "Arena 23" },
  { "id": 24, "name": "Zhejiang Lions", "short_name": "Zhe", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/zhe.png", "arena_name": "Arena 24" },
  { "id": 25, "name": "Liaoning Flying Leopards", "short_name": "Lia", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/lia.png", "arena_name": "Arena 25" },
  { "id": 26, "name": "Shanghai Sharks", "short_name": "Sha", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/sha.png", "arena_name": "Arena 26" },
  { "id": 27, "name": "Shenzhen Leopards", "short_name": "She", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/she.svg", "arena_name": "Arena 27" },
  { "id": 28, "name": "Fujian Sturgeons", "short_name": "Fuj", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/fuj.png", "arena_name": "Arena 28" },
  { "id": 29, "name": "Shandong Heroes", "short_name": "Sha", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/shan.png", "arena_name": "Arena 29" },
  { "id": 30, "name": "Qingdao Eagles", "short_name": "Qin", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/qin.svg", "arena_name": "Arena 30" },
  { "id": 31, "name": "Sydney Kings", "short_name": "Syd", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/syd.svg", "arena_name": "Arena 31" },
  { "id": 32, "name": "Melbourne United", "short_name": "Mel", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/mel.png", "arena_name": "Arena 32" },
  { "id": 33, "name": "Perth Wildcats", "short_name": "Per", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/per.png", "arena_name": "Arena 33" },
  { "id": 34, "name": "Brisbane Bullets", "short_name": "Bri", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/bri.svg", "arena_name": "Arena 34" },
  { "id": 35, "name": "Adelaide 36ers", "short_name": "Ade", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/ade.svg", "arena_name": "Arena 35" },
  { "id": 36, "name": "Cairns Taipans", "short_name": "Cai", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/cai.svg", "arena_name": "Arena 36" },
  { "id": 37, "name": "Tasmania JackJumpers", "short_name": "Tas", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/tas.svg", "arena_name": "Arena 37" },
  { "id": 38, "name": "South East Melbourne Phoenix", "short_name": "Sou", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/sou.png", "arena_name": "Arena 38" },
  { "id": 39, "name": "Illawarra Hawks", "short_name": "Ill", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/ill.png", "arena_name": "Arena 39" },
  { "id": 40, "name": "New Zealand Breakers", "short_name": "New", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/nz.png", "arena_name": "Arena 40" },
  { "id": 41, "name": "Real Madrid", "short_name": "Rea", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/rmb.svg", "arena_name": "Arena 41" },
  { "id": 42, "name": "Barça", "short_name": "Bar", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/fcb.svg", "arena_name": "Arena 42" },
  { "id": 43, "name": "Valencia Basket", "short_name": "Val", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/val.png", "arena_name": "Arena 43" },
  { "id": 44, "name": "Baskonia", "short_name": "Bas", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/bask.png", "arena_name": "Arena 44" },
  { "id": 45, "name": "Unicaja Málaga", "short_name": "Uni", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/uni.png", "arena_name": "Arena 45" },
  { "id": 46, "name": "CB Canarias", "short_name": "CB ", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/cbc.png", "arena_name": "Arena 46" },
  { "id": 47, "name": "CB Gran Canaria", "short_name": "CB ", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/cbg.svg", "arena_name": "Arena 47" },
  { "id": 48, "name": "Joventut Badalona", "short_name": "Jov", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/jov.png", "arena_name": "Arena 48" },
  { "id": 49, "name": "UCAM Murcia", "short_name": "UCA", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/ucam.svg", "arena_name": "Arena 49" },
  { "id": 50, "name": "Surne Bilbao Basket", "short_name": "Sur", "city": "", "state": "", "conference": "", "division": "", "logo_url": "/teams/sur.svg", "arena_name": "Arena 50" }
];
