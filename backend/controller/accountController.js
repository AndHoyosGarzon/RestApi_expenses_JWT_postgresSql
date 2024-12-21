import { pool } from "../libs/database.js";

export const getAccounts = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const accounts = await pool.query({
      text: `
        SELECT * FROM tblaccount 
        WHERE user_id = $1
        `,
      values: [userId],
    });

    return res.status(200).json({ status: "success", data: accounts.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { name, number, balance } = req.body;

    const accountExistQuery = {
      text: `SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2`,
      values: [name, userId],
    };

    const accountExistResult = await pool.query(accountExistQuery);

    const accountExist = accountExistResult.rows[0];

    if (accountExist) {
      return res
        .status(409)
        .json({ status: "failed", message: "account already created" });
    }

    const createAccountResult = await pool.query({
      text: `
        INSERT INTO tblaccount (user_id, account_name, account_number, account_balance)
        VALUES ($1, $2, $3, $4) RETURNING * 
        `,
      values: [userId, name, number, balance],
    });

    const account = createAccountResult.rows[0];

    //updating the user table after creating an account
    const userAccounts = Array.isArray(name) ? name : [name];

    await pool.query({
      text: `
            UPDATE tbluser 
            SET accounts = array_cat(accounts, $1), updateat = CURRENT_TIMESTAMP
            WHERE id = $2 
            RETURNING *
        `,
      values: [userAccounts, userId],
    });

    //ADD INITIAL DEPOSIT TRANSACTION
    const description = account.account_name + " (Initial Deposit)";

    const initialDepositQuery = {
      text: `
            INSERT INTO tbltransaction(user_id, description, type, status, amount, source)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *
        `,
      values: [
        userId,
        description,
        "income",
        "complete",
        balance,
        account.account_name,
      ],
    };

    await pool.query(initialDepositQuery);

    return res.status(201).json({
      status: "success",
      message: account.account_name + " Account create successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const addMoneyToAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const { amount } = req.body;

    const newAmount = Number(amount);

    const result = await pool.query({
      text: `
        UPDATE tblaccount 
        SET account_balance = (account_balance + $1), updateat = CURRENT_TIMESTAMP 
        WHERE id = $2 RETURNING *
        `,
      values: [newAmount, id],
    });

    const accountInformation = result.rows[0];

    const description = accountInformation.account_name + " (Deposit)";

    //add transaction in database
    const transQuery = {
      text: `
            INSERT INTO tbltransaction(user_id, description, type, status, amount, source)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *
        `,
      values: [
        userId,
        description,
        "income",
        "complete",
        amount,
        accountInformation.account_name,
      ],
    };

    await pool.query(transQuery);

    return res.status(200).json({
      status: "success",
      message: "Operation complete successfully",
      data: accountInformation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};
