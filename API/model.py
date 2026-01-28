from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Rasa(Base):
    __tablename__ = 'Rasy'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nazwa = Column(String(50), nullable=False, unique=True)
    nr_fci = Column(Integer)
    charakter = Column(Text, nullable=False)
    proby_pracy = Column(Boolean, nullable=False)

    def __repr__(self):
        return f"<Rasa nr {self.id} = {self.nazwa}>"