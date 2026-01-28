import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoader } from './Loader';

export function RasyList() {
  const [rasy, setRasy] = useState([]);
  const [filter, setFilter] = useState("all");
  const { setLoading } = useLoader();

  const fetchData = async () => {
    setLoading(true);
    let url = "http://127.0.0.1:8000/rasy";
    if (filter !== "all") 
      url += `?proby_pracy=${filter}`;
    
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      setRasy(data);
    } 
    catch {
      toast.error("Wystąpił błąd");
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten rekord?")) return;

    setLoading(true);
    try {
      const resp = await fetch(`http://127.0.0.1:8000/rasy/${id}`, { method: "DELETE" });
      if (resp.ok) {
        toast.success("Poprawnie zapisano zmiany");
        fetchData();
      } 
      else {
        toast.error("Wystąpił błąd");
      }
    } 
    catch {
      toast.error("Wystąpił błąd");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/form"><button>Dodaj</button></Link>
        <select onChange={(e) => setFilter(e.target.value)} style={{marginLeft: '10px'}}>
          <option value="all">Wszystkie rasy</option>
          <option value="true">Podlegające próbom pracy</option>
          <option value="false">Niepodlegające próbom pracy</option>
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {rasy.map((rasa) => (
          <div key={rasa.id} style={{ backgroundColor: "lightgray", border: "3px solid black", padding: "1rem", width: "250px"}}>
            <h2>{rasa.nazwa}</h2>
            <p><strong>Charakter:</strong> {rasa.charakter}</p>
            <p><strong>Numer wzorca FCI:</strong> {rasa.nr_fci !== null ? rasa.nr_fci : "Rasa nie uznana przez FCI"}</p>
            <p><strong>Próby pracy:</strong> {rasa.proby_pracy ? "Podlega" : "Nie podlega"}</p>
            
            <Link to={`/form/${rasa.id}`} state={rasa}>
               <button>Edytuj</button>
            </Link>
            <button onClick={() => handleDelete(rasa.id)}>Usuń</button>
          </div>
        ))}
      </div>
    </div>
  );
}