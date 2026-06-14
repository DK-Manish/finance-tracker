from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.transaction import TransactionType

class TransactionCreate(BaseModel):
    amount: float
    type: TransactionType
    category: str
    description: Optional[str] = None
    date: Optional[datetime] = None

class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: TransactionType
    category: str
    description: Optional[str] = None
    date: datetime
    user_id: int

    class Config:
        from_attributes = True