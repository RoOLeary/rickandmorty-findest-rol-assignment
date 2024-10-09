import { useState } from 'react';
import Characters from '../Characters';
import Locations from '../Locations';
import Episodes from '../Episodes';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('characters');

  return (
    <div className='content'>
      <div className="tabContainer">
        <button onClick={() => setActiveTab('characters')} className="text-white">Characters</button>
        <button onClick={() => setActiveTab('locations')} className="text-white">Locations</button>
        <button onClick={() => setActiveTab('episodes')}className="text-white">Episodes</button>
      </div>

        <form>
          <input type="text" name="character" value="" />
          <button type="submit">Search</button>
        </form>




      <div className="tab-content">
        {activeTab === 'characters' && <Characters />}
        {activeTab === 'locations' && <Locations />}
        {activeTab === 'episodes' && <Episodes />}
      </div>
    </div>
  );
};

export default Tabs;

