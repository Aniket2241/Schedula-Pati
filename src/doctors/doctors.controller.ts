import { Controller, Query,Get,Post ,Body, Param} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
@Controller('doctors')
export class DoctorsController {
constructor(private readonly doctorsService:DoctorsService){}
@Post('create-profile')
createDoctorProfile(@Body() body:any){
const {userId,name,specialization,experience}=body;
return this.doctorsService.CreateDoctor(
    userId,
    name,
    specialization,
    experience,
);

}
@Get()
getAllDoctors(){
    return this.doctorsService.getAllDoctors();
}
@Get('search/specialty')
searchDoctorBySpecialty(@Query('specialty') specialty: string) {
  return this.doctorsService.searchDoctorBySpecialty(specialty);
}
@Get(':id')
getDoctorById(@Param('id')id:string){
    return this.doctorsService.getDoctorById(Number(id))
}
@Get('search/name')
searchDoctorByName(@Query('name')name:string){
    return this.doctorsService.SearchDoctorByName(name);
}

}
