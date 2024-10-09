import React, { useState, useEffect } from 'react';
import Characters from '../Characters';
import Locations from '../Locations';
import Episodes from '../Episodes';
import Spinner from '../Spinner';

// Check if the ViewTransition API is supported
const useViewTransition = () => {
  return typeof document.startViewTransition === 'function';
};

const Tabs = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('characters');
  const supportsViewTransition = useViewTransition();

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

  // Function to handle tab switching with ViewTransitions
  const switchTab = (newTab: string) => {
    if (supportsViewTransition) {
      document.startViewTransition(() => {
        setActiveTab(newTab);
      });
    } else {
      setActiveTab(newTab); // Fallback for browsers that don't support ViewTransition API
    }
  };

  return (
    <div className='content'>
      <div className="tabContainer">
        <button
          onClick={() => switchTab('characters')}
          className={`text-white ${activeTab === 'characters' && 'active'}`}>
          Characters
        </button>
        <button
          onClick={() => switchTab('locations')}
          className={`text-white ${activeTab === 'locations' && 'active'}`}>
          Locations
        </button>
        <button
          onClick={() => switchTab('episodes')}
          className={`text-white ${activeTab === 'episodes' && 'active'}`}>
          Episodes
        </button>
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
