import bcrypt from "bcrypt";

const maskPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
  } catch (error) {
    console.error(error);
  }
};

maskPassword("password");
