import { pool } from "../libs/database.js";
import { comparePassword, hashPassword } from "../libs/index.js";

export const getUser = async (req, res) => {
    try {
        
        const userId = req.body.user.userId;
        console.log(req.body.user.userId)
        if (!userId) {
            return res.status(400).json({
                status: "failed",
                message: "User ID is missing",
            });
        }

        const userExist = await pool.query({ //this stores results in array, even if there is only one json inside the array[usually contains first json with schema and rest json with metadata of each field in that table]
                                             //thats why rows[0] is used to index into the array and get the only json fo easier parsing           
            text: `SELECT * FROM tbluser WHERE id = $1`,
            values: [userId],
        });

        //console.log('Query Result:', userExist.rows[0]);

        const user = userExist.rows[0];
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "failed to fetch user details",
            });
        }

        user.password = undefined;
        console.log(user)
        return res.status(200).json({
            status: "success",
            user,
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            status : "failed",
            message: "Internal Server Error",
        });
    }
};



export const changePassword = async (req,res) =>{
    try{
        const userId =  req.body.user.userId

        const{currentPassword,newPassword,confirmPassword} = req.body

        const userExist = await pool.query
        ({
            text : `SELECT * FROM tbluser WHERE id = $1`,
            values :[userId]
         })
         const user = userExist.rows[0]
        //console.log('userExist :',userExist,'/n',"userExist.rows[0] :", user)
         if(!user)
         {
            return res.status(404).json
            ({  status : "failed",
                message : "failed to fetch user details"
            })
         }
         console.log(newPassword,confirmPassword)
         if(!(newPassword === confirmPassword))
         {
            return res.status(401).json
            ({  status : "failed",
                message : "Passwords don't match"
            })
         }
         const isMatch = await comparePassword(currentPassword,user?.password);
         if(!isMatch)
         {
            return res.status(401).json
            ({  status : "failed",
                message : "Invalid Current Password"
            })
         }
         const hashedPassword = await hashPassword(newPassword)
         
         await pool.query(
            {
                text : `UPDATE tbluser SET password = $1 WHERE id = $2`,
                values :[hashedPassword,userId]
            }
         )
         user.password = undefined;
         res.status(200).json({
            status : "success",
            message : "Password updated successfully"
         })
    }
    catch(err){
        console.log(err)
        res.status(500).json({status : " failed",message : "Internal Server Error"})
    }

}
export const updateUser = async(req,res) =>{
    try{
        const userId = req.body.user.userId;
        const {firstName, lastName, country,currency,contact} = req.body;
        console.log(firstName)
        const userExist = await pool.query
        ({
            text :`SELECT * FROM tbluser WHERE id = $1`,
            values :[userId]
         })
         const user = userExist.rows[0]
        //console.log('userExist :',userExist,'/n',"userExist.rows[0] :", user)
         if(!user)
         {
            return res.status(404).json
            ({  status : "failed",
                message : "failed to fetch user details"
            })
         }
         const updateUser = await pool.query(
            {
                text : `UPDATE tbluser SET firstName = $1,lastName = $2,country = $3,currency = $4,contact = $5, updatedAt = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
                values : [firstName,lastName,country,currency,contact,userId]
            }
         )
         updateUser.rows[0].password = undefined;
         res.status(200).json({
            status : "success",
            user : updateUser.rows[0]
         })
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({status : "failed",message : "Internal Server Error from updateUser()"})
    }

}