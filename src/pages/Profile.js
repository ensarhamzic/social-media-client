import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Posts from "../components/Posts";

const Profile = ({ forAuthUser }) => {
  let userId = useSelector((state) => state.auth.user.id);
  let { id: userIdParam } = useParams();
  if (!forAuthUser) userId = userIdParam;

  return (
    <div>
      <Posts userId={userId} />
    </div>
  );
};

export default Profile;
