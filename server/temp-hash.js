import bcrypt from "bcryptjs";
console.log("admin:", bcrypt.hashSync("admin123", 10));
console.log("user :", bcrypt.hashSync("user123", 10));
