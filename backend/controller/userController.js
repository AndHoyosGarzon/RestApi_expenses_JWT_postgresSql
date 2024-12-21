import { pool } from "../libs/database.js";
import { comparePassword, hashedPassword } from "../libs/index.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const findUser = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    if (findUser.rows[0].length === 0) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    findUser.rows[0].password = undefined;

    return res.status(200).json({
      status: "success",
      message: "Send data user",
      user: findUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const findUser = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = findUser.rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(401)
        .json({ status: "failed", message: "New password does not match" });
    }

    const isMatch = await comparePassword(currentPassword, user?.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid current password " });
    }

    const hashPassword = await hashedPassword(newPassword);

    const updateDataUser = await pool.query({
      text: `
        UPDATE tbluser 
        SET password = $1, updateat = CURRENT_TIMESTAMP
        WHERE id = $2 
        RETURNING *
      `,
      values: [hashPassword, userId],
    });

    const userUpdating = updateDataUser.rows[0];

    userUpdating.password = undefined;

    return res.status(200).json({
      status: "success",
      message: "Password change successfully",
      userUpdating,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { firstname, lastname, country, currency, contact } = req.body;

    const findUser = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = findUser.rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    const updatedDataUser = await pool.query({
      text: `
        UPDATE tbluser
        SET firstname = $1, lastname = $2, country = $3, currency = $4, contact = $5, updateat = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *
      `,
      values: [firstname, lastname, country, currency, contact, userId],
    });

    const userUpdating = updatedDataUser.rows[0];

    if (!userUpdating) {
      return res
        .status(400)
        .json({ status: "failed", message: "Error updating user" });
    }

    userUpdating.password = undefined;

    return res.status(201).json({
      status: "success",
      message: "Updating user successfully",
      user: userUpdating,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};
