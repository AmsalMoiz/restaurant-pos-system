import React, { useState } from 'react';

function Dashboard() {
    const [clockedIn, setClockedIn] = useState(false);
    const [onBreak, setOnBreak] = useState(false);

    const handleClockIn = () => {
        setClockedIn(true);
        setOnBreak(false);
    };

    const handleClockOut = () => {
        setClockedIn(false);
        setOnBreak(false);
    };

    const handleBreak = () => {
        if (clockedIn) {
            setOnBreak(!onBreak);
        }
    };

    return (
        <div id="dashboard">
            <h1>Employee Dashboard</h1>
            <p>Status: {clockedIn ? (onBreak ? 'On Break' : 'Clocked In') : 'Clocked Out'}</p>
            
            <button onClick={handleClockIn} disabled={clockedIn}>Clock In</button>
            <button onClick={handleClockOut} disabled={!clockedIn}>Clock Out</button>
            <button onClick={handleBreak} disabled={!clockedIn}>{onBreak ? 'End Break' : 'Take Break'}</button>
        </div>
    );
}

export default Dashboard;