import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import styles from './StreamLayout.module.css';
import { fetchRooms } from '../../../redux/slices/timetable/timetablesSlice';
import io from 'socket.io-client';

const StreamLayout = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.timetable.rooms) || [];
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State to track search input
  const [showArrows, setShowArrows] = useState(false); // State to track arrow visibility
  const roomContainerRef = useRef(null); // Reference to the room container for sliding
  const [stream, setStream] = useState(null); // State to hold the base64 stream

  useEffect(() => {
    dispatch(fetchRooms(''));
  }, [dispatch]);

  // Check if the room container is scrollable (content overflows)
  useEffect(() => {
    const container = roomContainerRef.current;
    if (container && container.scrollWidth > container.clientWidth) {
      setShowArrows(true); // Show arrows if the content overflows
    } else {
      setShowArrows(false); // Hide arrows if the content fits within the container
    }
  }, [rooms]);

  const token = localStorage.getItem('token');

  // Handle WebSocket connection to receive the video stream
  useEffect(() => {
    if (selectedRoom) {
      const socket = io('185.203.238.200:8000', {
        transports: ['websocket'], // Use only WebSocket transport
        auth: {
          token: `${token}`,
        },
      });

      socket.on('connect', () => {
        console.log('Connected to the server');
      });

      socket.on('error', (e) => {
        console.log(e);
      });

      socket.on('stream', (data) => {
        setStream(data.data);
      });

      // Get the first camera's IP address from the selected room
      const cameraIp =
        selectedRoom.cameras.length > 0 ? selectedRoom.cameras[0].ip : null;

      if (cameraIp) {
        socket.emit('stream', { message: 'play', ip: cameraIp });
      } else {
        console.log('No camera IP found for this room.');
      }

      socket.on('disconnect', () => {
        console.log('Disconnected from the server');
      });

      return () => {
        socket.disconnect(); // Cleanup on component unmount or room change
      };
    }
  }, [selectedRoom, token]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room); // Set the selected room when clicked
  };

  const handleScroll = (direction) => {
    const container = roomContainerRef.current;
    const scrollAmount = 200; // Adjust the scroll amount for each click
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filter rooms based on search term

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <input
          type='text'
          placeholder='Xonani qidirish...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          className={styles.searchInput}
        />
      </div>
      <br />

      <div className={styles.carouselWrapper}>
        {showArrows && (
          <button
            className={styles.arrowLeft}
            onClick={() => handleScroll('left')}
          >
            &#8249;
          </button>
        )}

        <div className={styles.roomContainer} ref={roomContainerRef}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`${styles.roomCard} ${
                  selectedRoom?.id === room.id ? styles.activeRoomCard : ''
                }`}
                onClick={() => handleRoomClick(room)}
              >
                <div className={styles.roomName}>{room.name}</div>
              </div>
            ))
          ) : (
            <div>Hech qanday xona topilmadi</div>
          )}
        </div>

        {showArrows && (
          <button
            className={styles.arrowRight}
            onClick={() => handleScroll('right')}
          >
            &#8250;
          </button>
        )}
      </div>

      {selectedRoom && (
        <div className={styles.playerContainer}>
          {stream ? (
            <img
              src={stream} // The base64 encoded frame received from the server
              alt='Live Stream'
              width='1080px'
              height='700px'
            />
          ) : (
            <p>Waiting for stream...</p>
          )}
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default StreamLayout;
