import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserById } from "../../redux/actions";

function MagicLinkLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      console.error("Token bulunamadı");
      return;
    }

    localStorage.setItem("token", JSON.stringify(token));

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded?.id;

    if (userId) {
      dispatch(fetchUserById(userId)).then((res) => {
        localStorage.setItem("authUser", JSON.stringify(res));
        navigate("/"); 
      });
    }
  }, [location.search, dispatch, navigate]);

  return React.createElement("div", null, "Giriş yapılıyor, lütfen bekleyin...");
}

export default MagicLinkLogin;
