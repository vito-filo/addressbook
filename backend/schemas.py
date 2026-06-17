# schemas.py — Pydantic v2 schemas for request validation and response serialisation.
from pydantic import BaseModel, ConfigDict


class ContactBase(BaseModel):
    first_name: str
    last_name: str
    address: str
    phone: str
    age: int


class ContactCreate(ContactBase):
    """Schema for POST /contacts — all fields required."""

    pass


class ContactUpdate(ContactBase):
    """Schema for PUT /contacts/{id} — all fields required (full replacement)."""

    pass


class ContactResponse(ContactBase):
    """Schema returned by all read endpoints, including the generated id."""

    model_config = ConfigDict(from_attributes=True)

    id: int
