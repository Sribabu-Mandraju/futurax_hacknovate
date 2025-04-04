import React from "react";
import { useSelector } from "react-redux";
import { fetchBets } from "../../store/slices/betsSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const Bets = () => {
  const dispatch = useDispatch();
  const { loading, error, bets } = useSelector((state) => state.bets); 

  useEffect(() => {
    dispatch(fetchBets()); // Dispatching fetchEvents on component mount
  }, [dispatch]);

  console.log(bets);


  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;
  return <div></div>;
};

export default Bets;
