import { useState } from 'react';
import Characters from '../Characters';
import Locations from '../Locations';
import Episodes from '../Episodes';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('characters');

  return (
    <div className='content'>
      <div className="tabContainer">
        <button onClick={() => setActiveTab('characters')} className={`text-white ${activeTab === 'characters' && 'active'}`}>Characters</button>
        <button onClick={() => setActiveTab('locations')} className={`text-white ${activeTab === 'locations' && 'active'}`}>Locations</button>
        <button onClick={() => setActiveTab('episodes')} className={`text-white ${activeTab === 'episodes' && 'active'}`}>Episodes</button>
      </div>


      <div className={`tab-content ${activeTab}`}>
        {activeTab === 'characters' && <Characters />}
        {activeTab === 'locations' && <Locations />}
        {activeTab === 'episodes' && <Episodes />}
      </div>

    </div>
  );
};

export default Tabs;

