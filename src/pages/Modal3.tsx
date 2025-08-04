
import { useState } from "react";
import PaywallModal from "@/components/PaywallModal";

const Modal3 = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Reopen after a short delay for continuous testing
    setTimeout(() => setIsOpen(true), 500);
  };

  const handleSubscribe = () => {
    console.log("Regular program subscribe button clicked!");
    // You can add more logic here for testing
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Regular Program PaywallModal Test</h1>
        <p className="text-gray-600 mb-4">
          Testing the paywall when Founder's Program is full (30+ seats taken)
        </p>
        <p className="text-sm text-gray-500 mb-4">
          This simulates the modal users see when they hit the paywall after founder's seats are full.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Regular Program Modal
        </button>
      </div>

      <PaywallModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubscribe={handleSubscribe}
        usageCount={5}
        currentPrice="$19.97"
        isFoundersProgram={false}
        seatsRemaining={0}
      />
    </div>
  );
};

export default Modal3;
