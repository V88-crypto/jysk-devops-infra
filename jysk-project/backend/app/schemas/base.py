from decimal import ROUND_HALF_UP, Decimal
from typing import Annotated

from pydantic import PlainSerializer


def money_to_number(value: Decimal) -> float:
    return float(Decimal(value).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


Money = Annotated[
    Decimal,
    PlainSerializer(money_to_number, return_type=float, when_used="json"),
]
