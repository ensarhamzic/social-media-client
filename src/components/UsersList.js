import React from "react";
import User from "./User";

const UsersList = ({ users, onProfileClick }) => {
  const profileClickHandler = () => {
    onProfileClick();
  };
  return (
    <>
      {users.map((u) => (
        <User key={u.id} user={u} onProfileClick={profileClickHandler} />
      ))}
    </>
  );
};

export default UsersList;
