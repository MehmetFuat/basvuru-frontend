import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';


function ApplicationStatus() {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const ev = useNavigate();

  const navHome = ()=>
  {
    ev('/')
  }
  const handleCheck = () => {
    fetch(`http://localhost:9090/users/check-status?code=${code}`)
      .then(res => {
        if (!res.ok) throw new Error("Başvuru bulunamadı");
        return res.json();
      })
      .then(data => {
        setData(data);
        setError('');
      })
      .catch(() => {
        setData(null);
        setError("Başvuru bulunamadı.");
      });
  };

  return (
    <div className="container">
      <h1>Başvuru Durumu Sorgula</h1>

      <input
        type="text"
        placeholder="Başvuru Kodunu Giriniz"
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
      />
      <button onClick={handleCheck}>Sorgula</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>Durum: {data.status}</h2>
          <p><strong>Ad Soyad:</strong> {data.name} {data.surname}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Telefon:</strong> {data.phone}</p>
          <p><strong>Pozisyon:</strong> {data.department}</p>
          <p><strong>Not:</strong> {data.note}</p>
          <p><strong>Tarih:</strong> {data.applyDate}</p>
          <p><a href={`http://localhost:9090/uploads/${data.cvFileName}`} target="_blank" rel="noreferrer">CV'yi Görüntüle</a></p>
        </div>
      )}
      <button onClick={navHome}>Form</button>
    </div>
  );
}

export default ApplicationStatus;
