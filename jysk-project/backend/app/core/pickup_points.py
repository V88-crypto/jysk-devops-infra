PICKUP_POINTS = [
    {
        "code": "store-1",
        "name": "JYSK Київ Дарниця",
        "city": "Київ",
        "address": "вул. Садова, 12",
        "working_hours": "Пн–Нд 10:00–21:00",
    },
    {
        "code": "store-2",
        "name": "JYSK Львів Сихів",
        "city": "Львів",
        "address": "вул. Зелена, 45",
        "working_hours": "Пн–Нд 10:00–21:00",
    },
    {
        "code": "store-3",
        "name": "JYSK Одеса Черемушки",
        "city": "Одеса",
        "address": "вул. Морська, 7",
        "working_hours": "Пн–Нд 10:00–20:00",
    },
    {
        "code": "store-4",
        "name": "JYSK Харків Салтівка",
        "city": "Харків",
        "address": "просп. Миру, 30",
        "working_hours": "Пн–Сб 10:00–20:00, Нд 10:00–19:00",
    },
]

PICKUP_POINTS_BY_CODE = {point["code"]: point for point in PICKUP_POINTS}


def find_pickup_point(code: str | None) -> dict | None:
    if code is None:
        return None
    return PICKUP_POINTS_BY_CODE.get(code)
