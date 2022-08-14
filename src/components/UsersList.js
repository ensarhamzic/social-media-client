import React from "react";
import User from "./User";

const UsersList = ({ users }) => {
  return (
    <>
      {users.map((u) => (
        <User key={u.id} user={u} />
      ))}
    </>
  );
};

export default UsersList;
