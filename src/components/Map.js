import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const MapComponent = () => {
  const [users, setUsers] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    axios.get('http://araonsoft.com:9081/api/Test/GetSampleUserList')
      .then(response => {
        const userData = response.data.results; 

        if (Array.isArray(userData)) {
          setUsers(userData); 
        } else {
          console.error("Dữ liệu không phải là mảng", userData);
        }
      })
      .catch(error => {
        console.error("Có lỗi khi lấy dữ liệu người dùng:", error);
      });
  }, []); 

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([0, 0], 2); 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      markersLayer.current = L.markerClusterGroup();
      mapInstance.current.addLayer(markersLayer.current);

      mapInstance.current.on('zoomend', () => {
        const zoomLevel = mapInstance.current.getZoom();
        if (zoomLevel <= 5) { 
          alert(`Tổng số người dùng: ${users.length}`);
        }
      });
    }
  }, [users]); 

  useEffect(() => {
    if (mapInstance.current && users.length > 0) {
      markersLayer.current.clearLayers();
      users.forEach(user => {
        const { latitude, longitude } = user.location.coordinates;
        if (
          latitude !== undefined && 
          longitude !== undefined && 
          !isNaN(latitude) && 
          !isNaN(longitude) && 
          latitude >= -90 && 
          latitude <= 90 && 
          longitude >= -180 && 
          longitude <= 180
        ) {
          const popupContent = `
            <h3>${user.name.first} ${user.name.last}</h3>
            <p>Age: ${user.dob.age}</p>
            <p>Location: ${user.location.city}</p>
          `;

          const marker = L.marker([latitude, longitude])
            .bindPopup(popupContent);

          marker.on('mouseover', () => {
            marker.openPopup();
          });

          marker.on('mouseout', () => {
            marker.closePopup();
          });

          markersLayer.current.addLayer(marker); 
        } else {
          console.warn(`Tọa độ không hợp lệ cho người dùng: ${user.name.first} ${user.name.last}`);
        }
      });
    }
  }, [users]);

  return <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>;
};

export default MapComponent;
