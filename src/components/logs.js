import React from 'react';

const Logs = ({ myLogs }) => {
    return (
        <div className="logs">
            <h3>Logs</h3>
            {myLogs.map((log, index) => (
                <p key={index} className="log">{log}</p>
            ))}
        </div>
    );
};

export default Logs;
