import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DoctorsService {
constructor(private readonly databaseService:DatabaseService){}
async CreateDoctor(
userId:number,
name:string,
specialization:string,
experience:number,
){
    if(!userId||!name ||!specialization||!experience){
        throw new BadRequestException('Missing required fields');
    }
    const client=this.databaseService.getClient();
    const userCheck = await client.query(
      'SELECT role FROM users WHERE id = $1',
      [userId],
    );
     if (userCheck.rows.length === 0) {
      throw new BadRequestException('User not found');
    }

    if (userCheck.rows[0].role !== 'DOCTOR') {
      throw new BadRequestException('User is not a doctor');
    }
    const query=`INSERT INTO doctors(user_id,name,specialization,experience)
    VALUES($1, $2, $3, $4)
    RETURNING id,name,specialization,experience,is_available
    `;
    const values=[userId,name,specialization,experience];
    const result= await client.query(query,values);
    return{
        message:"Profile Created successfully",
        doctor:result.rows[0],
    }
}
async getAllDoctors(){
    const client=this.databaseService.getClient();
    const result = await client.query(
        `SELECT id,name,specialization,experience
        FROM doctors
        WHERE is_available=true`
    );
    return result.rows;
}
async getDoctorById(id: number) {
  const client = this.databaseService.getClient();

  const result = await client.query(
    `
    SELECT id, name, specialization, experience, is_available
    FROM doctors
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
}

async SearchDoctorByName(name:string){
    const client=this.databaseService.getClient();
    const result=await client.query(
        `SELECT id,name,specialization,experience
        FROM doctors WHERE is_available=true
        AND LOWER(name) LIKE LOWER($1)`,[`%${name}%`],

    );
    return result.rows;
}
async searchDoctorBySpecialty(specialty: string) {
  if (!specialty) {
    throw new BadRequestException('Specialty is required');
  }

  const client = this.databaseService.getClient();

  const result = await client.query(
    `
    SELECT id, name, specialization, experience
    FROM doctors
    WHERE LOWER(specialization) LIKE LOWER($1)
    `,
    [`%${specialty}%`],
  );

  return result.rows;
}

}
