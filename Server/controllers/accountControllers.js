import { pool } from "../libs/database.js";

export const getAccounts = async (req, res) => {
  try {
    const userId = req.body.user.userId;

    const accounts = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1`,
      values: [userId],
    });
    const totalbalance = await pool.query({
      text: `SELECT SUM(account_balance) FROM tblaccount WHERE user_id = $1`,
      values: [userId],
    });
//    console.log(totalbalance.rows[0].sum)
    res.status(200).json({
      status: "success",
      data: accounts.rows,
      total_account_balance : totalbalance.rows[0].sum
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const userId = req.body.user.userId;

    const { name, amount, account_number } = req.body;

    const accountExistQuery = {
      text: `SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2`,
      values: [name, userId],
    };

    const accountExistResult = await pool.query(accountExistQuery);

    const accountExist = accountExistResult.rows[0];

    if (accountExist) {
      return res
        .status(409)
        .json({ status: "failed", message: "Account already created." });
    }

    const createAccountResult = await pool.query({
      text: `INSERT INTO tblaccount(user_id, account_name, account_number, account_balance) VALUES($1, $2, $3, $4) RETURNING *`,
      values: [userId, name, account_number, amount],
    });
    const account = createAccountResult.rows[0];
    console.log(account.id)
    const userAccounts = Array.isArray(name) ? name : [name];

    const updateUserAccountQuery = {
      text: `UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [userAccounts, userId],
    };
    await pool.query(updateUserAccountQuery);

    // Add initial deposit transaction
    const description = account.account_name + " (Initial Deposit)";

    const initialDepositQuery = {
      text: `INSERT INTO tbltransaction(user_id, account_id,description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6,$7) RETURNING *`,
      values: [
        userId,
        account.id,
        description,
        "income",
        "Completed",
        amount,
        account.account_name,
      ],
    };
    await pool.query(initialDepositQuery);
      
    res.status(201).json({
      status: "success",
      message: account.account_name + " Account created successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const addMoneyToAccount = async (req, res) => {
  try {
    const userId = req.body.user.userId;
    const { id } = req.params;
    const { amount } = req.body;

    const newAmount = Number(amount);

    const result = await pool.query({
      text: `SELECT * from tblaccount where id = $1`,
      values: [id],
    });

    const account_name = result.rows[0].account_name;

    const description = result.rows[0].account_name + " (Deposit)";

    const transQuery = {
      text: `INSERT INTO tbltransaction(user_id, account_id,description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      values: [
        userId,
        id,
        description,
        "income",
        "Completed",
        newAmount,
        account_name,
      ],
    };
    await pool.query(transQuery);
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount,id],
    })
    await
    res.status(200).json({
      status: "success",
      message: "Operation completed successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

//logically not possible. if deleted, then the amount received from other account can be reverted back, but the transactions made dont add up, self transfer expenses etc
export const deleteAccount = async (req, res) => {
  try{
    const userId = req.body.user.userId
    const account_id = req.params.id;
    console.log(account_id)
    //const {account_id,target_account} = req.body; use this incase you wanna transfer money and then delete
  
    const accountDataSource = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [account_id],
    });
    const account_name = accountDataSource.rows[0].account_name
    console.log(accountDataSource.rows[0].account_name); // Log the result to check if the account is fetched correctly
await pool.query("BEGIN");

console.log("Transaction started");

// Deleting transactions
const userdelete = await pool.query({
  text : `UPDATE tbluser SET accounts = array_remove(accounts,$1) WHERE id = $2 RETURNING *`,
  values : [account_name,userId]
})

console.log('Account removed from user Table', userdelete)
const deletetrans = await pool.query({
  text: `DELETE FROM tbltransaction WHERE user_id = $1 AND account_id = $2 RETURNING *`,
  values: [userId, account_id],
});
console.log(deletetrans)

await pool.query({
  text : `UPDATE tbluser SET accounts = array_remove(accounts,$1) WHERE id = $2`,
  values : [account_name,userId]
})
// Deleting the account
const deleteacc = await pool.query({
  text: `DELETE FROM tblaccount WHERE id = $1 RETURNING *`,
  values: [account_id],
});
console.log('TransactionDeleted',deleteacc)

console.log("Account and transactions deleted");

await pool.query("COMMIT");
console.log("Transaction committed");

return res.status(200).json({
  status : "success",
  message : "Deleted Successfully"
})
}
  catch(error){
    res.status(500).json({
      status : "failed",
      message : error?.message || "Account not deleted"
    })
  }
}
 // await pool.query({
    //   text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
    //   values: [accountDataSource.rows[0].account_balance,target_account],
    // })
    // await pool.query({
    //   text: `INSERT INTO tbltransaction(user_id, account_id,description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    //   values: [
    //     userId,
    //     target_account,
    //     "Transfer from account getting deleted",
    //     "SelfTInc",
    //     "Completed",
    //     accountDataSource.rows[0].account_balance,
    //     "Transfer from account getting deleted",
    //   ],
    // })
  