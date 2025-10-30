import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { access } from "fs";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async register(user: RegisterUserDto) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        return this.prisma.user.create({
            data: {
                ...user,
                password: hashedPassword
            }
        });
    }

    async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return user;
    }

    async login(login: LoginDto) {
        const user = await this.validateUser(login.username, login.password);

        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}