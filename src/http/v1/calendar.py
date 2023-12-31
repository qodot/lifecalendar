import datetime
import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from src.appl.cal.create_calendar import CreateCalendar
from src.appl.cal.create_period import CreatePeriod
from src.appl.cal.get_calendar import GetCalendar, GetCalendarResp
from src.appl.cal.get_calendar_list import GetCalendarList, GetCalendarListResp
from src.appl.cal.update_calendar import UpdateCalendar
from src.appl.container import container
from src.http.auth import get_user_id

api_router_calendar = APIRouter(prefix="/calendar")


@api_router_calendar.get("", response_model=GetCalendarListResp)
async def get_list(user_id: uuid.UUID = Depends(get_user_id)):
    return container.resolve(GetCalendarList).run(user_id)


class CreateCalendarReq(BaseModel):
    name: str
    birthday: datetime.date
    lifespan: int


@api_router_calendar.post("/create")
async def create(req: CreateCalendarReq, user_id: uuid.UUID = Depends(get_user_id)):
    container.resolve(CreateCalendar).run(user_id, req.name, req.birthday, req.lifespan)


@api_router_calendar.get("/{calendar_id}", response_model=GetCalendarResp)
async def get(calendar_id: uuid.UUID, user_id: uuid.UUID = Depends(get_user_id)):
    return container.resolve(GetCalendar).run(user_id, calendar_id)


class UpdateCalendarReq(BaseModel):
    name: str
    birthday: datetime.date
    lifespan: int


@api_router_calendar.post("/{calendar_id}/update")
async def update(
    calendar_id: uuid.UUID,
    req: UpdateCalendarReq,
    user_id: uuid.UUID = Depends(get_user_id),
):
    container.resolve(UpdateCalendar).run(
        user_id, calendar_id, req.name, req.birthday, req.lifespan
    )


class CreatePeriodReq(BaseModel):
    name: str
    start_year: int
    start_week: int
    end_year: int
    end_week: int
    color: str


@api_router_calendar.get("/{calendar_id}/period/create")
async def create_period(
    calendar_id: uuid.UUID,
    req: CreatePeriodReq,
    user_id: uuid.UUID = Depends(get_user_id),
):
    container.resolve(CreatePeriod).run(
        calendar_id,
        req.name,
        req.start_year,
        req.start_week,
        req.end_year,
        req.end_week,
        req.color,
    )
