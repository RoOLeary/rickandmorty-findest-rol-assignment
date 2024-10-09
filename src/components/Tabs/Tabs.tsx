import { useState } from 'react';
import Characters from '../Characters';
import Locations from '../Locations';
import Episodes from '../Episodes';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('characters');

  return (
    <div>
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('characters')} className="text-white">Characters</button>
        <button onClick={() => setActiveTab('locations')} className="text-white">Locations</button>
        <button onClick={() => setActiveTab('episodes')}className="text-white">Episodes</button>
      </div>

      <div className="tab-content">
        {activeTab === 'characters' && <Characters />}
        {activeTab === 'locations' && <Locations />}
        {activeTab === 'episodes' && <Episodes />}
      </div>
    </div>
  );
};

export default Tabs;

