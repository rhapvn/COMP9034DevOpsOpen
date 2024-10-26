import React, { useState } from "react";
import { Button } from "../CustomButton";
import { updateUserPersonalDetails } from "@/db/apiRoutes";
import { User } from "src/types";
import Modal from "../CustomModal";

const Page = async () => {
  // State to manage modal visibility
  const [openStatus, setOpenStatus] = useState(false);

  // Function to toggle modal visibility
  const handleButtonClick = () => {
    setOpenStatus(true);
  };

  // Function to handle modal close (e.g., when clicking "Cancel" or "Retry")
  const handleModalClose = () => {
    setOpenStatus(false);
  };

  const fetchToGoogle = () => {
    setOpenStatus(false);
    window.location.href = "https://www.google.com";
  };

  const updatedData: Partial<User> = {
    firstName: "jackie",
    lastName: "sfd",
    phone: "34534534",
  };

  const result = await updateUserPersonalDetails(updatedData);
  // {
  //   success: false,
  //   data: {updatedId: 23},
  //   message: "sdfsdfs"
  // }
  return (
    <div className="m-5 flex justify-center">
      {/* Button example */}
      <Button variant="button" size="sm">
        {/* Button type regarding to Figma;
          variant:  cancel, submit, cancel, edit, delete, lock, unlock, 
                    active = active status button,
                    deactivate = deactive status button, 
                    lockSta = lock status button
          
          size: button = normal size for button, 
                modal = large button size for inserting button into the modal
                md = action button for the table
                sm = status button for the table
          */}
        Button component
        {/* message of the button*/}
      </Button>

      {/* Modal example */}
      <div className="ml-5">
        <Button variant="submit" size="button" onClick={handleButtonClick}>
          Modal component
        </Button>
      </div>
      {/* Create a button or anyfucntion to make an action to trigger "isOpen" = true */}

      <Modal
        isOpen={openStatus}
        title={"Error"}
        titleCol={"text-[#F43F5E]"}
        lineCol={"border-[#F43F5E]"}
        description={"There is something went wrong. Please try again."}
        btnCancel={true}
        btnCancelText={"Cancel"}
        btnCancelCol={"cancel"}
        onClose={handleModalClose}
        btnAction={true}
        btnActionText={"Retry"}
        btnActionCol={"button"}
        onAction={fetchToGoogle}
      />

      {/* <Modal attributes;
          isOpen = Accept true or false. true = open modal, else = false
          title = Text message 
          titleCol = Colour of the title: Red colour to show error = "text-[#F43F5E]", Normal colour black = "text-[#111928]"
          lineCol = Line colour seperating tiltle and description: red = "border-[#F43F5E]", blue = "border-[#3758F9]"
          description= Text message 
          btnCancel = Init cancel button = true, else false
          btnCancelCol = colour button regarding to button component
          btnCancelText = text for cancel button, btn left button message
          onClose = create any function to put it in {}
          btnAction = Init Action button = true, else false
          btnActionCol = colour button regarding to button component
          btnActionText= text for action button, for the right button mesage
          onAction = create any function to put it in {}
        /> */}
    </div>
  );
};

export default Page;
