import React, { useState } from 'react';
import Modal from './Modal';  // Assuming you have a Modal component
import styles from './index.module.css';

interface CharacterCardProps {
  character: {
    id: number;
    name: string;
    image: string;
    species: string;
    status: string;
    location: { name: string };
    gender: string;
    origin: { name: string };
  },
  chartoggle:any;
}

const CharacterCard = ({ character, chartoggle }:CharacterCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

//   const openModal = () => setIsModalOpen(true);

  const openModal = (id: any) => {
    document.startViewTransition(() => {
      setIsModalOpen(true);
    });
  };
  const closeModal = () => {
    document.startViewTransition(() => {
      setIsModalOpen(false);
    });
  };

  return (
    <div onClick={() => openModal(character.id)} className={'characterListItem'}>
        <img src={character.image} alt={character.name} width={100} data-view-transition={`character-image-${character.id}`}  />
        <div className={'characterListItemDetail'}>

            <h3 className={'characterListItemTitle'}>{character.name}</h3>
            <p><strong>Species:</strong> {character.species}</p>
            <p><strong>Status:</strong> {character?.status}</p>
            <p><strong>Origin:</strong> {character.origin.name}</p>
            <p><strong>Location: </strong>{character?.location.name}</p>
        </div>

        {/* Modal component, shown based on state */}
        <Modal show={isModalOpen} onClose={closeModal}>
            <img src={character.image} alt={character.name} data-view-transition={`character-image-${character.id}`} />
            <h3 className={'characterListItemTitle'}>{character.name}</h3>
            <p><strong>Species:</strong> {character.species}</p>
            <p><strong>Status:</strong> {character?.status}</p>
            <p><strong>Origin:</strong> {character.origin.name}</p>
            <p><strong>Location: </strong>{character?.location.name}</p>
        </Modal>
    </div>
  );
};

export default CharacterCard;
