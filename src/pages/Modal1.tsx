
import { useState } from "react";
import EmailCaptureModal from "@/components/EmailCaptureModal";

const Modal1 = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    // Reopen after a short delay for continuous testing
    setTimeout(() => setIsOpen(true), 500);
  };

  const handleAuthComplete = (user: any) => {
    console.log("User authenticated:", user);
    // You can add more logic here for testing
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">EmailCaptureModal Test Page</h1>
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

      <EmailCaptureModal
        isOpen={isOpen}
        onClose={handleClose}
        onAuthComplete={handleAuthComplete}
        usageCount={3}
      />
    </div>
  );
};

export default Modal1;
