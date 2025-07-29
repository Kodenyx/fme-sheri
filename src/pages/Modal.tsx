
import { useState } from "react";
import PaywallModal from "@/components/PaywallModal";
import { Button } from "@/components/ui/button";

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubscribe = () => {
    console.log("Subscribe clicked");
    // You can test the subscription flow here
  };

  const handleReopenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Modal Testing Page</h1>
        <p className="text-gray-600 mb-4">
          This page is for testing the PaywallModal component
        </p>
        
        {!isModalOpen && (
          <Button onClick={handleReopenModal}>
            Reopen Modal
          </Button>
        )}

        <PaywallModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onSubscribe={handleSubscribe}
          usageCount={5}
        />
      </div>
    </div>
  );
};

export default Modal;
