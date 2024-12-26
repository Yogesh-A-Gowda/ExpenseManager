import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const hashPassword = async(userValue) => {
    const salt = await bcrypt.genSalt(10)
    
    const hashedPassword = await bcrypt.hash(userValue,salt);
    return hashedPassword;
}

export const comparePassword = async(userPassword,password) => {
    try{
        const isMatch = await bcrypt.compare(userPassword,password);
        return isMatch;
    }
    catch(err){
        console.log(err)
    }

}

export const createJWT = (id) => {
    return JWT.sign(
        { userID : id},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    );
}

export function getMonthName(index) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[index];
  }