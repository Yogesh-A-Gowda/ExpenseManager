import { useState } from "react";
import PropTypes from 'prop-types'
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({ account, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await onDelete(account.id); // Wait for deletion to finish before proceeding
      setIsDeleting(false);
      onClose(); // Close modal after successful deletion
    } catch (error) {
      setIsDeleting(false); // Ensure the "Delete" button is re-enabled
      toast.error(error?.message || 'Failed to delete account. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" 
      onClick={onClose} 
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-96" 
        onClick={(e) => e.stopPropagation()} 
      >
        <h3 className="text-lg font-medium mb-4 text-red-600">
          Are you sure you want to delete this account?
        </h3>
        <p className="mb-4 text-sm text-red-500">
          Warning: This action will permanently delete this account and all related transactions.
        </p>
        <div className="flex justify-end">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded mr-2" 
            onClick={handleDelete} 
            disabled={isDeleting} 
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded" 
            onClick={onClose} 
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  account: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteConfirmationModal;
