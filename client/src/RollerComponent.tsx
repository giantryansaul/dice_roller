import React, { useEffect, useRef, useState } from 'react';

const REST_HOST=process.env.REST_HOST || 'http://localhost:3002';

interface RollResponse {
  id: string;
  fullRollString: string;
  request: string;
  result: string;
}

const RollerComponent: React.FC = () => {
  const [rolls, setRolls] = useState<RollResponse[]>([]);
  const [requestString, setRequestString] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const rollContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    const response = await fetch(`${REST_HOST}/roll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ diceRollString: requestString }),
    });
    const {roll} = await response.json();
    setRolls(rolls => [...rolls, roll]);
    setRequestString('');
    inputRef.current?.focus();
  };

  // Scroll to the bottom of the list of rolls
  useEffect(() => {
    if (rollContainerRef.current) {
      rollContainerRef.current.scrollTop = rollContainerRef.current.scrollHeight;
    }
  }, [rolls]);

  return (
    <div className="roller-container">
      <div className="rolls-container" ref={rollContainerRef} >
        {rolls.map(roll => (
          <div key={roll.id}>
            <strong>{roll.request}: </strong>
            {roll.result} {roll.fullRollString}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={requestString}
          onChange={e => setRequestString(e.target.value)}
          ref={inputRef}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default RollerComponent;
