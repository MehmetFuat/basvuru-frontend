import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [language, setLanguage] = useState('');
  const [department, setDepartment] = useState('');
  const [note, setNote] = useState('');
  const [cv, setCv] = useState(null);

  const [result, setResult] = useState('');
  const [applicationCode, setApplicationCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const departmentOptions = [
    '',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobil Uygulama Geliştirici',
    'Makine Öğrenmesi Mühendisi (AI/ML Engineer)',
    'DevOps Mühendisi',
    'Veritabanı Yöneticisi',
    'Embedded Software Engineer',
    'Veri Bilimci',
    'Veri Analisti',
    'QA Engineer',
    'UI/UX Tasarımcısı'
  ];

  const educationOptions = [
    '',
    'Lise',
    'Ön Lisans',
    'Lisans',
    'Yüksek Lisans',
    'Doktora'
  ];

  const languageOptions = [
    '',
    'İngilizce',
    'Almanca',
    'Fransızca',
    'İspanyolca',
    'Diğer'
  ];

  const handleRegister = async () => {
    if (!name || !surname || !email || !phone || !age || !experience || !education || !language || !department || !cv) {
      alert("Lütfen tüm alanları doldurun ve CV yükleyin.");
      return;
    }

    if (phone.length !== 11) {
      alert("Telefon numarası 11 haneli olmalıdır.");
      return;
    }

    if (cv && cv.type !== 'application/pdf') {
      alert('Sadece PDF dosyası yükleyiniz.');
      return;
    }

    const formData = new FormData();
    formData.append("cv", cv);

    const user = { name, surname, email, phone, age, experience, education, language, department, note };
    formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));

    setSubmitting(true);
    setResult('');
    setApplicationCode('');

    try {
      const res = await fetch('http://localhost:9090/users/register', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Kayıt sırasında hata oluştu.');
      }

      const data = await res.text();

      setApplicationCode(data.applicationCode || '');
      setResult(`✅ ${data.message || 'Başvuru alındı'}\nBaşvuru Kodunuz: ${data.applicationCode || '-'}`);

      setName('');
      setSurname('');
      setEmail('');
      setPhone('');
      setAge('');
      setExperience('');
      setEducation('');
      setLanguage('');
      setDepartment('');
      setNote('');
      setCv(null);
    } catch (err) {
      console.error(err);
      setResult(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    if (!applicationCode) return;
    navigator.clipboard.writeText(applicationCode).then(() => {
      setResult(prev => (prev ? prev + '\n📋 Kopyalandı.' : '📋 Kopyalandı.'));
    });
  };

  return (
    <div className="container">
      <h1>İş Başvuru Formu</h1>

      <input type="text" placeholder="Adınız" value={name} onChange={e => setName(e.target.value)} />
      <input type="text" placeholder="Soyadınız" value={surname} onChange={e => setSurname(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="text" placeholder="Telefon" value={phone} 
        onChange={e => {
          const onlyDigits = e.target.value.replace(/\D/g, '');
          if (onlyDigits.length <= 11) setPhone(onlyDigits);
        }}
      />

      <input type="number" placeholder="Yaşınız" value={age} onChange={e => setAge(e.target.value)} />
      <input type="number" placeholder="Deneyim (yıl)" value={experience} onChange={e => setExperience(e.target.value)} />

      <select value={education} onChange={e => setEducation(e.target.value)}>
        {educationOptions.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt === '' ? 'Eğitim Durumunuzu Seçiniz' : opt}
          </option>
        ))}
      </select>

      <select value={language} onChange={e => setLanguage(e.target.value)}>
        {languageOptions.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt === '' ? 'Yabancı Dil Seçiniz' : opt}
          </option>
        ))}
      </select>

      <select
        value={department}
        onChange={e => setDepartment(e.target.value)}
        style={{ width: '100%', padding: '8px', margin: '6px 0', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        {departmentOptions.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt === '' ? 'Pozisyon Seçiniz' : opt}
          </option>
        ))}
      </select>

      <input type="file" accept="application/pdf" 
        onChange={e => setCv(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
        style={{
          width: '100%',
          padding: '8px',
          margin: '6px 0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff'
        }}
      />
      {cv && <small>Yüklenen dosya: {cv.name}</small>}

      <textarea placeholder="Başvuru Notu" value={note} onChange={e => setNote(e.target.value)} />

      <button onClick={handleRegister} disabled={submitting}>
        {submitting ? 'Gönderiliyor...' : 'Başvur'}
      </button>

      {applicationCode && (
        <div style={{ marginTop: 10 }}>
          <strong>Başvuru Kodu:</strong> {applicationCode}{' '}
          <button onClick={copyCode} style={{ marginLeft: 8 }}>Kopyala</button>
        </div>
      )}

      <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>

      <div className="buttonDivs">
        <button className="adminNavigate" onClick={() => navigate('/admin-login')}>
          Admin Giriş
        </button>

        <button onClick={() => navigate('/application-status', { state: { applicationCode } })}>
          Başvuru Durumunu Gör
        </button>
      </div>
    </div>
  );
}

export default Home;
