from __future__ import annotations

import datetime
import uuid
from functools import cached_property
from typing import Literal, TypeAlias

from .period import Period

TimeType: TypeAlias = Literal["before_born", "past", "now", "future", "after_death"]


class Calendar:
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    birthday: datetime.date
    lifespan: int

    periods: list[Period]

    def __init__(
        self,
        *,
        id: uuid.UUID,
        user_id: uuid.UUID,
        name: str,
        birthday: datetime.date,
        lifespan: int,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.name = name
        self.birthday = birthday
        self.lifespan = lifespan

        self.periods = []

    @classmethod
    def create(
        cls, user_id: uuid.UUID, name: str, birthday: datetime.date, lifespan: int
    ) -> Calendar:
        instance = cls(
            id=uuid.uuid4(),
            user_id=user_id,
            name=name,
            birthday=birthday,
            lifespan=lifespan,
        )
        return instance

    def update_basic_info(
        self, name: str, birthday: datetime.date, lifespan: int
    ) -> None:
        self.name = name
        self.birthday = birthday
        self.lifespan = lifespan

    @cached_property
    def _today(self) -> datetime.date:
        return datetime.date.today()

    @cached_property
    def this_year_percentage(self) -> float:
        past_day_count = (self._today - datetime.date(self._today.year, 1, 1)).days
        return round(past_day_count / 365 * 100, 2)

    @cached_property
    def this_year_past_week_count(self) -> int:
        return self._today.isocalendar().week

    @cached_property
    def this_year_future_week_count(self) -> int:
        return 52 - self._today.isocalendar().week

    @cached_property
    def deathday(self) -> datetime.date:
        return datetime.date(
            self.birthday.year + self.lifespan, self.birthday.month, self.birthday.day
        )

    @cached_property
    def age(self) -> int:
        age = self._today.year - self.birthday.year
        if (
            self._today.month < self.birthday.month
            and self._today.day < self.birthday.day
        ):
            age -= 1
        return age

    @cached_property
    def total_percentage(self) -> float:
        total_day_count = (self.deathday - self.birthday).days
        past_day_count = (self._today - self.birthday).days
        return round(past_day_count / total_day_count * 100, 2)

    @cached_property
    def past_week_count(self) -> int:
        first_year = 52 - self.birthday.isocalendar().week + 1
        this_year = self._today.isocalendar().week
        middle_years = 52 * (self._today.year - self.birthday.year - 2)
        return first_year + middle_years + this_year

    @cached_property
    def future_week_count(self) -> int:
        this_year = 52 - self._today.isocalendar().week
        last_year = self.deathday.isocalendar().week
        middle_years = 52 * (self.birthday.year + self.lifespan - self._today.year - 2)
        return this_year + middle_years + last_year

    @cached_property
    def years(self) -> list[Year]:
        return [
            Year(
                yearnum=yearnum,
                today=self._today,
                birthday=self.birthday,
                lifespan=self.lifespan,
            )
            for yearnum in range(
                self.birthday.year, self.birthday.year + self.lifespan + 1
            )
        ]

    def create_period(
        self,
        name: str,
        start_year: int,
        start_week: int,
        end_year: int,
        end_week: int,
        color: str,
    ) -> None:
        period = Period.create(name, start_year, start_week, end_year, end_week, color)
        self.periods.append(period)


class Year:
    yearnum: int
    weeks: list[Week]

    def __init__(
        self,
        *,
        yearnum: int,
        today: datetime.date,
        birthday: datetime.date,
        lifespan: int,
    ) -> None:
        self.yearnum = yearnum
        self.weeks = [
            Week(
                yearnum=yearnum,
                weeknum=weeknum,
                today=today,
                birthday=birthday,
                lifespan=lifespan,
            )
            for weeknum in range(1, 53)
        ]


class Week:
    yearnum: int
    weeknum: int
    today: datetime.date
    birthday: datetime.date
    lifespan: int

    def __init__(
        self,
        *,
        yearnum: int,
        weeknum: int,
        today: datetime.date,
        birthday: datetime.date,
        lifespan: int,
    ) -> None:
        if not 1 <= weeknum <= 52:
            raise ValueError(f"invalid weeknum: {weeknum}")

        self.yearnum = yearnum
        self.weeknum = weeknum
        self.today = today
        self.birthday = birthday
        self.lifespan = lifespan

    @cached_property
    def time_type(self) -> TimeType:
        past_year = self.yearnum < self.today.year
        this_year = self.yearnum == self.today.year
        future_year = self.yearnum > self.today.year

        before_born_year = self.yearnum < self.birthday.year
        born_year = self.yearnum == self.birthday.year
        death_year = self.yearnum == self.birthday.year + self.lifespan
        after_death_year = self.yearnum > self.birthday.year + self.lifespan

        before_today_week_number = self.weeknum < self.today.isocalendar().week
        today_week_number = self.weeknum == self.today.isocalendar().week
        after_today_week_number = self.weeknum > self.today.isocalendar().week

        before_birthday_week_number = self.weeknum < self.birthday.isocalendar().week
        _birthday_week_number = self.weeknum == self.birthday.isocalendar().week
        after_birthday_week_number = self.weeknum > self.birthday.isocalendar().week

        before_born = before_born_year or (born_year and before_birthday_week_number)
        after_death = after_death_year or (death_year and after_birthday_week_number)
        past = past_year or (this_year and before_today_week_number)
        now = this_year and today_week_number
        future = future_year or (this_year and after_today_week_number)

        match (before_born, after_death, past, now, future):
            case (True, False, True, False, False):
                return "before_born"
            case (False, True, False, False, True):
                return "after_death"
            case (False, False, True, False, False):
                return "past"
            case (False, False, False, True, False):
                return "now"
            case (False, False, False, False, True):
                return "future"
            case _:
                raise ValueError(
                    f"invalid time type: {before_born} {after_death} {past} {now} {future}"
                )
