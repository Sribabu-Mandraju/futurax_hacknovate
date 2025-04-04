import React from "react";
import AddEventForm from "../../components/create_event/AddEventForm";
import Navbar from "../../components/main/Navbar";

const CreateEvent = () => {
  return (
    <>
      <div className="w-full">
        <Navbar />
        <AddEventForm />
      </div>
    </>
  );
};

export default CreateEvent;
