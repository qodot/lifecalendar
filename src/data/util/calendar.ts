export function getMatrix(cal: Calendar): Matrix {
  const startYear = new Date(cal.birthday).getFullYear();
  const endYear = startYear + cal.lifespan;

  const birthDate = new Date(cal.birthday);
  const birthWeek = Math.ceil(
    (birthDate.getTime() - new Date(startYear, 0, 1).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );

  const deathDate = new Date(birthDate);
  deathDate.setFullYear(startYear + cal.lifespan);
  const deathWeek = Math.ceil(
    (deathDate.getTime() - new Date(deathDate.getFullYear(), 0, 1).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );

  const years: Year[] = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => {
      const year = startYear + i;
      const weeks: Week[] = Array.from({ length: 52 }, (_, j) => {
        const totalWeekNum = i * 52 + j + 1;
        const week = {
          yearnum: year,
          weeknum: j + 1,
          totalWeekNum: totalWeekNum,
          timeType: getTimeType(
            year,
            j + 1,
            startYear,
            endYear,
            birthWeek,
            deathWeek,
            totalWeekNum
          ),
        };
        return week;
      });
      return { yearnum: year, weeks };
    }
  );

  return { years };
}

function getTimeType(
  year: number,
  week: number,
  startYear: number,
  endYear: number,
  birthWeek: number,
  deathWeek: number,
  totalWeekNum: number
): TimeType {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentWeek = Math.ceil(
    (currentDate.getTime() - new Date(currentYear, 0, 1).getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );

  if (year === startYear && week < birthWeek) {
    return "BEFORE_BORN";
  } else if (year < currentYear) {
    return "PAST";
  } else if (year === endYear && week > deathWeek) {
    return "AFTER_DEATH";
  } else if (totalWeekNum > 0.9 * (endYear - startYear + 1) * 52) {
    return "OLD";
  } else if (year > currentYear) {
    return "FUTURE";
  } else {
    if (week < currentWeek) {
      return "PAST";
    } else if (week > currentWeek) {
      return "FUTURE";
    } else {
      return "NOW";
    }
  }
}
