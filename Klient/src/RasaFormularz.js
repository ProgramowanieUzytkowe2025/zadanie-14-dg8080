import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { useLoader } from './Loader';

export function RasaFormularz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { setLoading } = useLoader();
  
  const editData = location.state || {};

  const [form, setForm] = useState({
    nazwa: editData.nazwa || "",
    charakter: editData.charakter || "",
    nr_fci: editData.nr_fci || null,
    proby_pracy: editData.proby_pracy || false
  });

  useEffect(() => {
    if (id && !location.state) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/rasy/${id}`)
        .then(res => res.json())
        .then(data => setForm(data))
        .catch(() => toast.error("Wystąpił błąd"))
        .finally(() => setLoading(false));
    }
  }, [id, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = id ? "PUT" : "POST";
    const url = id ? `http://127.0.0.1:8000/rasy/${id}` : "http://127.0.0.1:8000/rasy";

    try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Poprawnie zapisano zmiany");
      navigate("/");
    } else {
      toast.error("Wystąpił błąd");
      console.error("Błąd z API:", result);
    }
  } catch (err) {
    toast.error("Wystąpił błąd");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div>
      <h1>{id ? "Edytuj rasę" : "Dodaj nową rasę"}</h1>
      <form onSubmit={handleSubmit}>
        <label>Nazwa</label><br/><input type="text" value={form.nazwa} onChange={e => setForm({...form, nazwa: e.target.value})} required /><br/><br/>
        <label>Charakter</label><br/><input type="text" value={form.charakter} onChange={e => setForm({...form, charakter: e.target.value})} /><br/><br/>
        <label>Numer FCI</label><br/><input type="number" value={form.nr_fci} onChange={e => setForm({...form, nr_fci: parseInt(e.target.value)})} /><br/><br/>
        <label>
          Próby pracy:
          <input type="checkbox" checked={form.proby_pracy} onChange={e => setForm({...form, proby_pracy: e.target.checked})} />
        </label><br/><br/>
        <button type="submit">Zapisz</button>
        <button type="button" onClick={() => navigate("/")}>Anuluj</button>
      </form>
    </div>
  );
}