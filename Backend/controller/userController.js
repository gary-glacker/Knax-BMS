const db = require('../config/db');

// Register New User
const  CreateNewUser = async(req,res)=>{
  try{
    const {name, email, role, address, password} = req.body;

   const query = "INSERT INTO `users`(`name`, `email`, `role`, `address`, `password`) VALUES (?,?,?,?,? )";
   
   const UserExits = `SELECT * FROM user WHERE email=${email}`;
   if (UserExits){
    console.log(" user email are exist");
    res.status(500).json({message:"User email Are existing !"});
    
   }

   db.query(query, [name,email,role,address,password],(err,result)=>{
    if(err){
      console.error(err);
     return  res.status(500).json({massage:"data not inserted"});
    }

    return result.status(200).json({message:"user created", data:result});
   })

  }catch(error){
    console.log(error);
    
    res.status(500).json({message:"internal server error"
                          
    })
  }


}

// Login user on the system
 const UserLogin = async( req,res)=>{
  try {
    const {email, password}= req.body;
    if(! email || !password){
      return res.status(500).json({message:"please enter your email and password"});
    }

    
  } catch (error) {
    
  }

 }

 // Update user by Id
const UserUpdate = async(req,res)=>{

  const {name, email, role, address, password} = req.body;

  if ( !name || !email || !role || !address || !password){
    return res.status(500).json({message:"Form Invailid !"});
  }

  const queryUpdate ="UPDATE `users` SET `name`= ?,`email`=? ,`role`= ? ,`address`= ?,`password`= ? ";

}
module.exports ={CreateNewUser};