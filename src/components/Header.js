import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.headerContainer}>
      <button style={styles.button} onClick={() => navigate('/userlist')}>
        User List
      </button>
      <button style={styles.button} onClick={() => navigate('/distribution')}>
        Distribution Charts
      </button>
      <button style={styles.button} onClick={() => navigate('/maps')}>
        Maps
      </button>
    </div>
  );
};

const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: '#282c34',
  },
  button: {
    margin: '0 10px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Header;
