import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    update(id, userData: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: userData
        });
    }
}