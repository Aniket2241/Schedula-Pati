import { Controller,Post,Body } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
 
    constructor(private readonly authService:AuthService){}
    @Post('signup')
    async signup(@Body() body:any){
        const {email,password,role}=body;
        return this.authService.signup(email,password,role);
    }
    @Post('signin')
    async signin(@Body() body:any){
        const {email,password}=body;
        return this.authService.signin(email,password);
    }
    @Post('signout')
    signout() {
     return {
    message: 'Signout successful (but jwt authentication or session auth will be required later',
  };
}



}
