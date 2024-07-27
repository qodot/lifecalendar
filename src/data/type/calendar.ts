type Calendar = {
  id: string;
  name: string;
  birthday: string;
  lifespan: number;

  // thisYearPercentage: number;
  // thisYearPastWeekCount: number;
  // thisYearFutureWeekCount: number;
  // deathday: string;
  // age: number;
  // totalPercentage: number;
  // pastWeekCount: number;
  // futureWeekCount: number;

  // years: Year[];
  // periods: Period[];
};

type Matrix = {
  years: Year[];
};

type Year = {
  yearnum: number;
  weeks: Week[];
};

type Week = {
  yearnum: number;
  weeknum: number;
  totalWeekNum: number;
  timeType: TimeType;
};

type TimeType =
  | "BEFORE_BORN"
  | "PAST"
  | "NOW"
  | "FUTURE"
  | "OLD"
  | "AFTER_DEATH";

// type Period = {
//   id: string;
//   calendarId: string;
//   name: string;
//   startYear: number;
//   startWeek: number;
//   endYear: number;
//   endWeek: number;
//   color: string;
// };
