import React from 'react';
const Grievance = () => (
  <div className="main" style={{padding: '40px'}}>
    <h2>Grievance Support</h2>
    <form className="card" style={{maxWidth: '500px', marginTop: '20px'}}>
      <textarea className="form-control" placeholder="Describe your issue..." rows="5"></textarea>
      <button className="submit-btn" type="button" onClick={() => alert('Grievance Submitted')}>Submit Ticket</button>
    </form>
  </div>
);
export default Grievance;