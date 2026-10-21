from fastapi import APIRouter

from app.core.pickup_points import PICKUP_POINTS
from app.schemas.order import PickupPointListOut

router = APIRouter(tags=["pickup-points"])


@router.get("/pickup-points", response_model=PickupPointListOut)
def list_pickup_points():
    return PickupPointListOut(
        items=PICKUP_POINTS,
        total=len(PICKUP_POINTS),
        page=1,
        page_size=len(PICKUP_POINTS),
    )
