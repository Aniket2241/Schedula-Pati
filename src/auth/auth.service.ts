import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class AuthService {
constructor (private readonly databaseService:DatabaseService){}


async signup(email:string,password:string,role:string){
    
    if(!role){
        throw new BadRequestException('Role is required')
    }
    const allowedRoles=['PATIENT','DOCTOR'];
    if(!allowedRoles.includes(role)){
        throw new BadRequestException('No such role');
    }
    const client =this.databaseService.getClient();

    const query=`
    INSERT INTO users(email,password,role)
    VALUES($1,$2,$3)
    RETURNING id,email,created_at
    `;

    const values=[email,password,role]
    const result=await client.query(query,values);
    return {
        message:'User Signed Up successfully',
        user:result.rows[0],
    };
}
async signin(email:string,password:string){
    const client =this.databaseService.getClient();
    const query=`SELECT id,email,password,role
    FROM users
    WHERE email=$1`;
    const result =await client.query(query,[email]);
    if(result.rows.length===0){
        return {
          message:'User Not found',  
        };
    }
    const user=result.rows[0];
    if(user.password!==password){
        return {
            message:'Invalid Password',
        }
    }
    return{
        message:'Signed-in Successfully',
        user:{
            id:user.id,
            email:user.email,
            role:user.role,
        },
    }
}   
 
}
