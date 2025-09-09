import React from 'react';
import '../styles/admin_css/UserCard.css';

const UserCard = ({ userItem, currentUserId, onDelete }) => {
  return (
    <div className="users-panel__card" id={userItem.id}>
      <img
        src={`http://localhost:5000/${userItem.image || 'uploads/default.jpg'}`}
        alt={`Imagen de ${userItem.name}`}
        className="users-panel__image"
        crossOrigin="anonymous"
      />
      <div className="users-panel__info">
        <p><strong>Nombre:</strong> {userItem.name}</p>
        <p><strong>Email:</strong> {userItem.email}</p>
        <p><strong>Teléfono:</strong> {userItem.phone}</p>
      </div>
      {userItem.id !== currentUserId && (
        <button className="users-panel__delete-btn" onClick={() => onDelete(userItem.id)}>
          Eliminar usuario
        </button>
      )}
    </div>
  );
};

export default UserCard;
