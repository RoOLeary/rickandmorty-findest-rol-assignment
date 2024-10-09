import React, { useState, useEffect } from 'react';
import Characters from '../Characters';
import Locations from '../Locations';
import Episodes from '../Episodes';
import Spinner from '../Spinner';

const Tabs = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [activeTab, setActiveTab] = useState('characters');

  useEffect(() => {
    const resolveAfterXSeconds = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setIsLoading(false); 
          resolve();
        }, 1500);
      });
    };

    resolveAfterXSeconds();
  }, []); 

  return (
    <div className='content'>
      <div className="tabContainer">
        <button onClick={() => setActiveTab('characters')} className={`text-white ${activeTab === 'characters' && 'active'}`}>Characters</button>
        <button onClick={() => setActiveTab('locations')} className={`text-white ${activeTab === 'locations' && 'active'}`}>Locations</button>
        <button onClick={() => setActiveTab('episodes')} className={`text-white ${activeTab === 'episodes' && 'active'}`}>Episodes</button>
      </div>

      {isLoading ? (
        <div className="tab-content-loading">
          <Spinner size="lg" variant="primary" />
        </div>
      ) : (
        <div className={`tab-content ${activeTab}`}>
          {activeTab === 'characters' && <Characters />}
          {activeTab === 'locations' && <Locations />}
          {activeTab === 'episodes' && <Episodes />}
        </div>
      )}
    </div>
  );
};

export default Tabs;
