import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2'; 
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,  
);

const DistributionCharts = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://araonsoft.com:9081/api/Test/GetSampleUserList')
      .then(response => {
        if (Array.isArray(response.data.results)) {
          setUsers(response.data.results);
        } else {
          console.error('Dữ liệu không phải là mảng:', response.data.results);
        }
      })
      .catch(error => console.error(error));
  }, []);

  const genderDistribution = users.reduce((acc, user) => {
    const gender = user.gender;
    acc[gender] = acc[gender] ? acc[gender] + 1 : 1;
    return acc;
  }, {});

  const ageDistribution = users.reduce((acc, user) => {
    const age = user.dob.age;
    const ageGroup = Math.floor(age / 10) * 10; 
    acc[ageGroup] = acc[ageGroup] ? acc[ageGroup] + 1 : 1;
    return acc;
  }, {});

  const regionDistribution = users.reduce((acc, user) => {
    const region = user.location.city;
    acc[region] = acc[region] ? acc[region] + 1 : 1;
    return acc;
  }, {});

  const genderData = {
    labels: Object.keys(genderDistribution),
    datasets: [{
      data: Object.values(genderDistribution),
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverOffset: 4,
    }],
  };

  const ageData = {
    labels: Object.keys(ageDistribution).map(ageGroup => `${ageGroup}s`), // Chuyển nhóm độ tuổi thành chuỗi (ví dụ: 20s, 30s)
    datasets: [{
      label: 'Age Distribution',
      data: Object.values(ageDistribution),
      backgroundColor: '#FFCD56',
    }],
  };

  const regionData = {
    labels: Object.keys(regionDistribution),
    datasets: [{
      data: Object.values(regionDistribution),
      backgroundColor: ['#4BC0C0', '#FF9F40', '#FF6F61', '#36A2EB', '#FFCD56'], // Màu sắc cho khu vực
      hoverOffset: 4,
    }],
  };

  return (
    <div>
      <h1>Distrubition Charts</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h2>Gender Distribution</h2>
          <Pie data={genderData} />
        </div>

        <div>
          <h2>Age Distribution</h2>
          <Bar data={ageData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        <div>
          <h2>Regional Distribution</h2>
          <Doughnut data={regionData} />
        </div>
      </div>
    </div>
  );
};

export default DistributionCharts;
