import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const hashedPassword = async (userValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(userValue, salt);
  return hashPassword;
};

export const comparePassword = async (userPassword, password) => {
  try {
    const isMatch = await bcrypt.compare(userPassword, password);

    return isMatch;
  } catch (error) {
    console.log(error.message);
  }
};

export const createJWT = (id) => {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export function getMonthName(index) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[index];
}
