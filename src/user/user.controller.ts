import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UserController {
    constructor(
        private readonly service: UserService
    ) {}

    @Get("me")
    @ApiOperation({ summary: "Get the current user's details" })
    async getMe(
        @Request() req
    ) {
        const userId = req.user.sub;
        return this.service.findById(userId);
    }

    @Put("me")
    @ApiOperation({ summary: "Update the current user's details" })
    @ApiBody({ type: UpdateUserDto, description: "Updated user details" })
    async updateMe(
        @Body() updateData: UpdateUserDto,
        @Request() req
    ) {
        const userId = req.user.sub;
        return this.service.update(userId, updateData);
    }
}