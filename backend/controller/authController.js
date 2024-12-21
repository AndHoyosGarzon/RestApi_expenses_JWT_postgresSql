import { pool } from "../libs/database.js";
import { hashedPassword, comparePassword, createJWT } from "../libs/index.js";

export const signupUser = async (req, res) => {
  try {
    const { firstname, email, password } = req.body;

    if (!firstname || !email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "Provided required Fields!" });
    }

    const findUser = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)",
      values: [email],
    });

    if (findUser.rows[0].exists) {
      return res
        .status(400)
        .json({ status: "failed", message: "email already exists" });
    }

    const hashPassword = await hashedPassword(password);

    const user = await pool.query({
      text: `
            INSERT INTO tbluser (firstname, email, password) 
            VALUES ($1, $2, $3) RETURNING *
        `,
      values: [firstname, email, hashPassword],
    });

    if (!user.rows.length === 0) {
      return res
        .status(400)
        .json({ status: "failed", message: "Error creating user" });
    }

    user.rows[0].password = undefined;

    return res.status(201).json({
      status: "success",
      message: "User account created succesfully",
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query({
      text: `
            SELECT * FROM tbluser WHERE email = $1
        `,
      values: [email],
    });

    if (!result.rows[0].length < 1) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    const isMatch = await comparePassword(password, result.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Error in password",
      });
    }

    const token = createJWT(result.rows[0].id);

    result.rows[0].password = undefined;

    return res.status(200).json({
      status: "success",
      message: "Login successfully",
      user: result.rows[0],
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

