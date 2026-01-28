from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
import model
from fastapi.middleware.cors import CORSMiddleware

engine = create_engine(
    "mssql+pyodbc://(localdb)\\MSSQLLocalDB/Psy?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
)

model.Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

app = FastAPI()

origins = [
    "http://localhost:8001",  
    "http://127.0.0.1:8001"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler():
    from fastapi.responses import JSONResponse
    return JSONResponse(
        content="OK",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

class RasaBaseModel(BaseModel):
    nazwa: str
    nr_fci: int | None = None
    charakter: str
    proby_pracy: bool

class RasaResponseModel(RasaBaseModel):
    id: int
    model_config = ConfigDict(from_attributes=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/rasy", response_model=RasaResponseModel, status_code=201)
def create_rasa(rasa: RasaBaseModel, db: Session = Depends(get_db)):
    db_rasa = model.Rasa(**rasa.model_dump())
    db.add(db_rasa)
    db.commit()
    db.refresh(db_rasa)
    return db_rasa

@app.get("/rasy", response_model=list[RasaResponseModel])
def read_all(proby_pracy: bool = None, db: Session = Depends(get_db)):
    query = db.query(model.Rasa)
    if proby_pracy is not None:
        query = query.filter(model.Rasa.proby_pracy == proby_pracy)
    return query.all()

@app.get("/rasy/{rasa_id}", response_model=RasaResponseModel)
def read_by_id(rasa_id: int, db: Session = Depends(get_db)):
    rasa = db.query(model.Rasa).filter(model.Rasa.id == rasa_id).first()
    if not rasa:
        raise HTTPException(status_code=404, detail="Rasa nie znaleziona")
    return rasa

@app.put("/rasy/{rasa_id}", response_model=RasaResponseModel)
def update_rasa(rasa_id: int, updated: RasaBaseModel, db: Session = Depends(get_db)):
    rasa = db.query(model.Rasa).filter(model.Rasa.id == rasa_id).first()
    if not rasa:
        raise HTTPException(status_code=404, detail="Rasa nie znaleziona")
    
    if len(updated.charakter) < 3:
        raise HTTPException(status_code=400, detail="Za krótki opis.")

    for key, value in updated.model_dump().items():
        setattr(rasa, key, value)

    db.commit()
    db.refresh(rasa)
    return rasa

@app.delete("/rasy/{rasa_id}", status_code=204)
def delete_rasa(rasa_id: int, db: Session = Depends(get_db)):
    rasa = db.query(model.Rasa).filter(model.Rasa.id == rasa_id).first()
    if not rasa:
        raise HTTPException(status_code=404, detail="Rasa nie znaleziona")
    if not rasa.proby_pracy:
        raise HTTPException(status_code=400, detail="Nie można usunąć rasy, która nie podlega próbom pracy.")

    db.delete(rasa)
    db.commit()
    return