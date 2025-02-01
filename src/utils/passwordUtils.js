import bcrypt from 'bcrypt';

export const createHash = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
};

export const isValidPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};