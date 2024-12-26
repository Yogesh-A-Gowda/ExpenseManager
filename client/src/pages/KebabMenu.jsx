// src/components/KebabMenu.jsx
import PropTypes from "prop-types";

const KebabMenu = ({ closeMenu, onSelfTransfer, onExpense }) => {
  return (
    <div className="kebab-menu">
      <button onClick={onSelfTransfer} className="hover:bg-blue-600 text-white">
        Self Transfer
      </button>
      <button onClick={onExpense} className="hover:bg-blue-600 text-white">
        Add Expense
      </button>
      <button onClick={closeMenu} className="hover:bg-red-600 text-white">
        Close Menu
      </button>
    </div>
  );
};

KebabMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  onSelfTransfer: PropTypes.func.isRequired,
  onExpense: PropTypes.func.isRequired,
};

export default KebabMenu;
