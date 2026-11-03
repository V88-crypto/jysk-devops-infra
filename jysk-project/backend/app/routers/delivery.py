from decimal import Decimal

from fastapi import APIRouter, Query

from app.schemas.delivery import DeliveryMethodListOut
from app.services.delivery import delivery_methods

router = APIRouter(tags=["delivery"])


@router.get("/delivery-methods", response_model=DeliveryMethodListOut)
def list_delivery_methods(subtotal: Decimal | None = Query(default=None, ge=0)):
    items = delivery_methods(subtotal)
    return DeliveryMethodListOut(items=items, total=len(items), page=1, page_size=len(items))
