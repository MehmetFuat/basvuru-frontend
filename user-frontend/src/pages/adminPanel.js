import '../App.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [pendingList, setPendingList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [rejectedList, setRejectedList] = useState([]);
  const [result, setResult] = useState('');

  useEffect(() => {
    fetchBackoffice();
  }, []);

  const fetchBackoffice = () => {
    fetch("http://localhost:9090/backoffice")
      .then((res) => res.json())
      .then((data) => {
        setPendingList(data.filter(item => item.status === 'NEW'));
        setApprovedList(data.filter(item => item.status === 'APPROVED'));
        setRejectedList(data.filter(item => item.status === 'REJECTED'));
      });
  };

const sendAdminKararToCamunda = async (karar, processInstanceId) => {
  try {
    const response = await fetch("http://localhost:9090/camunda/send-admin-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        processInstanceId: processInstanceId,
        karar: karar
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    console.log(`✅ Camunda'ya '${karar}' kararı iletildi.`);
  } catch (err) {
    console.error("❌ Camunda mesaj hatası:", err);
  }
};


  const handleApprove = async (taskId, processInstanceId) => {
    await sendAdminKararToCamunda("APPROVED", processInstanceId);

    fetch(`http://localhost:9090/backoffice/approve/${taskId}`, {
      method: 'POST'
    })
      .then(res => res.text())
      .then(data => {
        setResult(data);
        fetchBackoffice();
      })
      .catch(err => console.error(err));
  };

  const handleReject = async (taskId, processInstanceId) => {
    await sendAdminKararToCamunda("REJECTED", processInstanceId);

    fetch(`http://localhost:9090/backoffice/reject/${taskId}`, {
      method: 'POST'
    })
      .then(res => res.text())
      .then(data => {
        setResult(data);
        fetchBackoffice();
      })
      .catch(err => console.error(err));
  };

  const renderCardList = (list, color) => (
    <div className="card-container">
      {list.map((task, index) => (
        <div key={index} className={`card ${color}`}>
          <p><strong>Ad:</strong> {task.name}</p>
          <p><strong>Email:</strong> {task.email}</p>
          <p><strong>Durum:</strong> {task.status}</p>
          <p><strong>Oluşturulma:</strong> {task.createdDate}</p>
          <p><strong>Bitiş:</strong> {task.dueDate}</p>
          <p><strong>ProcessId:</strong> {task.processInstanceId}</p>
          {task.cvFileName && (
            <p>
              <a
                href={`http://localhost:9090/uploads/${task.cvFileName}`}
                target="_blank"
                rel="noreferrer"
              >
                CV Görüntüle
              </a>
            </p>
          )}
          {task.status === 'NEW' && (
            <div className="button-group">
              <button onClick={() => handleApprove(task.taskId, task.processInstanceId)}>Onayla</button>
              <button onClick={() => handleReject(task.taskId, task.processInstanceId)}>Reddet</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="admin-panel">
      <h1>Admin Paneli</h1>
      <div style={{ textAlign: 'right' }}>
        <button onClick={() => {
          localStorage.removeItem("isAdmin");
          window.location.href = "/admin-login";
        }}>
          Çıkış Yap
        </button>
      </div>

      <pre>{result}</pre>

      <h2>Bekleyen Başvurular</h2>
      {renderCardList(pendingList, 'yellow')}

      <h2>Onaylanan Başvurular</h2>
      {renderCardList(approvedList, 'green')}

      <h2>Reddedilen Başvurular</h2>
      {renderCardList(rejectedList, 'red')}
    </div>
  );
}

export default AdminPanel;
