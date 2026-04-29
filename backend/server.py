from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import logging
import uuid
import bcrypt
import jwt as pyjwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ---------- MongoDB ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---------- App ----------
app = FastAPI(title="Be Dental Paradise API")
api_router = APIRouter(prefix="/api")

# ---------- JWT / Password ----------
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 8  # 8h for admin convenience
REFRESH_TOKEN_DAYS = 7


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS),
        "type": "refresh",
    }
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key="access_token", value=access_token, httponly=True,
        secure=True, samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
    )
    response.set_cookie(
        key="refresh_token", value=refresh_token, httponly=True,
        secure=True, samesite="none", max_age=REFRESH_TOKEN_DAYS * 24 * 3600, path="/",
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------- Models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str


class AppointmentCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=40)
    service: str
    preferred_date: str  # ISO date yyyy-mm-dd
    preferred_time: str  # e.g. "10:00"
    notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    status: Optional[Literal["pending", "confirmed", "completed", "cancelled"]] = None
    notes: Optional[str] = None


class Appointment(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    service: str
    preferred_date: str
    preferred_time: str
    notes: Optional[str] = None
    status: Literal["pending", "confirmed", "completed", "cancelled"] = "pending"
    created_at: str


class PaymentCreate(BaseModel):
    patient_name: str
    patient_email: EmailStr
    service: str
    amount: float = Field(gt=0)
    status: Literal["paid", "pending", "refunded"] = "pending"
    method: Optional[str] = "cash"
    notes: Optional[str] = None


class PaymentUpdate(BaseModel):
    status: Optional[Literal["paid", "pending", "refunded"]] = None
    amount: Optional[float] = None
    notes: Optional[str] = None
    method: Optional[str] = None


class Payment(BaseModel):
    id: str
    patient_name: str
    patient_email: EmailStr
    service: str
    amount: float
    status: str
    method: Optional[str] = None
    notes: Optional[str] = None
    created_at: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    message: str = Field(min_length=1)


class ContactMessage(BaseModel):
    id: str
    name: str
    email: EmailStr
    message: str
    created_at: str


# ---------- Auth Routes ----------
@api_router.post("/auth/login", response_model=UserOut)
async def login(data: LoginIn, response: Response):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access = create_access_token(user["id"], user["email"], user.get("role", "admin"))
    refresh = create_refresh_token(user["id"])
    set_auth_cookies(response, access, refresh)
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user["role"])


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(id=user["id"], email=user["email"], name=user["name"], role=user["role"])


@api_router.post("/auth/refresh")
async def refresh_token_endpoint(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(user["id"], user["email"], user.get("role", "admin"))
        response.set_cookie(
            key="access_token", value=access, httponly=True,
            secure=True, samesite="none", max_age=ACCESS_TOKEN_MINUTES * 60, path="/",
        )
        return {"message": "Refreshed"}
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# ---------- Appointments (public create, admin manage) ----------
@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(data: AppointmentCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": data.name.strip(),
        "email": data.email.lower().strip(),
        "phone": data.phone.strip(),
        "service": data.service,
        "preferred_date": data.preferred_date,
        "preferred_time": data.preferred_time,
        "notes": data.notes,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.appointments.insert_one(doc.copy())
    return Appointment(**doc)


@api_router.get("/appointments", response_model=List[Appointment])
async def list_appointments(_: dict = Depends(require_admin)):
    rows = await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Appointment(**r) for r in rows]


@api_router.patch("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, data: AppointmentUpdate, _: dict = Depends(require_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.appointments.find_one_and_update(
        {"id": appointment_id},
        {"$set": update},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return Appointment(**result)


@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str, _: dict = Depends(require_admin)):
    result = await db.appointments.delete_one({"id": appointment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Deleted"}


# ---------- Payments (admin only; MOCKED - manual tracking) ----------
@api_router.get("/payments", response_model=List[Payment])
async def list_payments(_: dict = Depends(require_admin)):
    rows = await db.payments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Payment(**r) for r in rows]


@api_router.post("/payments", response_model=Payment)
async def create_payment(data: PaymentCreate, _: dict = Depends(require_admin)):
    doc = {
        "id": str(uuid.uuid4()),
        "patient_name": data.patient_name.strip(),
        "patient_email": data.patient_email.lower().strip(),
        "service": data.service,
        "amount": data.amount,
        "status": data.status,
        "method": data.method,
        "notes": data.notes,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.payments.insert_one(doc.copy())
    return Payment(**doc)


@api_router.patch("/payments/{payment_id}", response_model=Payment)
async def update_payment(payment_id: str, data: PaymentUpdate, _: dict = Depends(require_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.payments.find_one_and_update(
        {"id": payment_id},
        {"$set": update},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Payment not found")
    return Payment(**result)


@api_router.delete("/payments/{payment_id}")
async def delete_payment(payment_id: str, _: dict = Depends(require_admin)):
    result = await db.payments.delete_one({"id": payment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Deleted"}


# ---------- Contact ----------
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(data: ContactCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": data.name.strip(),
        "email": data.email.lower().strip(),
        "message": data.message.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contacts.insert_one(doc.copy())
    return ContactMessage(**doc)


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contacts(_: dict = Depends(require_admin)):
    rows = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [ContactMessage(**r) for r in rows]


# ---------- Admin stats ----------
@api_router.get("/admin/stats")
async def admin_stats(_: dict = Depends(require_admin)):
    total_appointments = await db.appointments.count_documents({})
    pending = await db.appointments.count_documents({"status": "pending"})
    confirmed = await db.appointments.count_documents({"status": "confirmed"})
    completed = await db.appointments.count_documents({"status": "completed"})
    total_payments = await db.payments.count_documents({})
    paid_rows = await db.payments.find({"status": "paid"}, {"_id": 0, "amount": 1}).to_list(10000)
    revenue = sum(r.get("amount", 0) for r in paid_rows)
    contacts = await db.contacts.count_documents({})
    return {
        "appointments": {
            "total": total_appointments,
            "pending": pending,
            "confirmed": confirmed,
            "completed": completed,
        },
        "payments": {"total": total_payments, "revenue": revenue},
        "contacts": contacts,
    }


@api_router.get("/")
async def root():
    return {"message": "Be Dental Paradise API", "status": "ok"}


# ---------- Startup ----------
@app.on_event("startup")
async def startup_event():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.appointments.create_index("id", unique=True)
    await db.payments.create_index("id", unique=True)
    await db.contacts.create_index("id", unique=True)

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@bedentalparadise.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Paradise@2026")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Clinic Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
