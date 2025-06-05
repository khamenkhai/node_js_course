import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashedPassword = async (password) => {
    if (!password) throw new Error("Password is required");

    const salt = await bcrypt.genSalt(saltRounds); // 🔁 Must await
    const hash = await bcrypt.hash(password, salt); // 🔁 Must await
    return hash;
};


export const comparePassword = async (plain, hash) => {
    return bcrypt.compareSync(plain, hash);
}