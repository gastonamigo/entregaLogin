import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync()) //kahsgd1278ahjsd
};

export const isValidPassword=(user,loginPassword)=>{
   return bcrypt.compareSync(loginPassword,user.password);
}

export default __dirname;

