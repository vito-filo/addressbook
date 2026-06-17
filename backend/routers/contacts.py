# routers/contacts.py — CRUD endpoints for the /contacts resource.
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Contact
from schemas import ContactCreate, ContactResponse, ContactUpdate

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.get("/", response_model=list[ContactResponse])
async def list_contacts(db: AsyncSession = Depends(get_db)) -> list[Contact]:
    """Return all contacts ordered by last name, then first name."""
    result = await db.execute(
        select(Contact).order_by(Contact.last_name, Contact.first_name)
    )
    return list(result.scalars().all())


@router.post("/", response_model=ContactResponse, status_code=201)
async def create_contact(
    payload: ContactCreate, db: AsyncSession = Depends(get_db)
) -> Contact:
    """Create a new contact and return the persisted record."""
    contact = Contact(**payload.model_dump())
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return contact


@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int, payload: ContactUpdate, db: AsyncSession = Depends(get_db)
) -> Contact:
    """Replace all fields of an existing contact. Returns 404 if not found."""
    contact = await db.get(Contact, contact_id)
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")

    for field, value in payload.model_dump().items():
        setattr(contact, field, value)

    await db.commit()
    await db.refresh(contact)
    return contact


@router.delete("/{contact_id}", status_code=204)
async def delete_contact(
    contact_id: int, db: AsyncSession = Depends(get_db)
) -> None:
    """Delete a contact. Returns 404 if not found."""
    contact = await db.get(Contact, contact_id)
    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")

    await db.delete(contact)
    await db.commit()
