// src/components/AccountCard.jsx
import { useState } from "react";
import KebabMenu from "./KebabMenu";
import PropTypes from "prop-types";

const AccountCard = ({ account, openExpenseModal, openSelfTransferModal, closeMenu }) => {
    AccountCard.propTypes = {
      account: PropTypes.object.isRequired,
      openSelfTransferModal: PropTypes.func.isRequired,
      openExpenseModal: PropTypes.func.isRequired,
      closeMenu: PropTypes.func.isRequired,
    };
  const [showKebabMenu, setShowKebabMenu] = useState(false);

  const toggleKebabMenu = () => setShowKebabMenu(!showKebabMenu);

  return (
    <div className="account-card">
      <h3>{account.account_name}</h3>
      <p>Balance: ${account.balance}</p>
      <button onClick={() => openExpenseModal(account)}>Add Expense</button>
      <button onClick={() => openSelfTransferModal(account)}>Self Transfer</button>

      <div className="kebab-menu-container">
        <button onClick={toggleKebabMenu}>...</button>
        {showKebabMenu && (
          <KebabMenu
            closeMenu={closeMenu}
            onSelfTransfer={() => openSelfTransferModal(account)}
            onExpense={() => openExpenseModal(account)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountCard;
