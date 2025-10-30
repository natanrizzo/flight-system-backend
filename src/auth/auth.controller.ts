import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly service: AuthService
    ) {}

    @ApiOperation({ summary: "Register a new user" })
    @ApiBody({ type: RegisterUserDto })
    @Public()
    @Post("register")
    async register(
        @Body() user: RegisterUserDto
    ) {
        return await this.service.register(user);
    }

    @ApiOperation({ summary: "Authenticate a user and return a token" })
    @ApiBody({ type: LoginDto })
    @Public()
    @Post("login")
    async login(
        @Body() login: LoginDto
    ) {
        return await this.service.login(login);
    }
}