
import { useState } from "react";
import PaywallModal from "@/components/PaywallModal";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Reopen after a short delay for continuous testing
    setTimeout(() => setIsOpen(true), 500);
  };

  const handleSubscribe = () => {
    console.log("Subscribe button clicked!");
    // You can add more logic here for testing
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">PaywallModal Test Page</h1>
        <p className="text-gray-600 mb-4">
          The modal should appear automatically. If it doesn't, refresh the page.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Modal
        </button>
      </div>

      <PaywallModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubscribe={handleSubscribe}
        usageCount={5}
      />
    </div>
  );
};

export default Modal;
