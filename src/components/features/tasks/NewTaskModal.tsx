"use client"

import React from 'react';
import NewTaskForm from './NewTaskForm';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const handleTaskSubmit = () => {
    onSubmit();
  }

  return (
    <NewTaskForm 
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleTaskSubmit}
    />
  );
};

export default NewTaskModal;
