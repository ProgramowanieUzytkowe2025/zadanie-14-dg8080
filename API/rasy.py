from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import model

engine = create_engine(
    "mssql+pyodbc://@(localdb)\\MSSQLLocalDB/Psy?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
)

model.Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

rasy_do_dodania = []
rasy_do_dodania.append(model.Rasa(
        nazwa = "Yorkshire Terrier",
        nr_fci = 86,
        charakter = "Yorkshire Terrier to miniaturowy terier do towarzystwa, żywy i inteligentny. Pełen animuszu, o zrównoważonym usposobieniu.",
        proby_pracy = False
    )
)
rasy_do_dodania.append(model.Rasa(
        nazwa = "Owczarek Niemiecki",
        nr_fci = 166,
        charakter = "Owczarek niemiecki jest psem żywiołowym, energicznym, inteligentnym, posłusznym i lojalnym. Szybko i chętnie się uczy, współpracuje.",
        proby_pracy = True
    )
)
rasy_do_dodania.append(model.Rasa(
        nazwa = "Labrador Retriever",
        nr_fci = 122,
        charakter = "Labrador retriever to rasa psów żywiołowych, skorych do zabawy, także z innymi psami.",
        proby_pracy = True
    )
)


for rasa in rasy_do_dodania:
    session.add(rasa)
    session.commit()