import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import argon from 'argon2';
import { Role } from "../../generated/prisma/enums";

@Injectable()
export class registerService {
    constructor(private readonly prisma: PrismaService) {
    }

    async register(payload: RegisterDto) {
        const { confirmPassword, ...data } = payload;

        if (payload.password !== confirmPassword) {
            throw new BadRequestException()
        }

        const exists = await this.prisma.user.findUnique({ where: { phone: data.phone } })

    if (exists) {
        throw new ConflictException("phone is already registered ")
        }

        const hashedPassword = await argon.hash(data.password)

        const user = await this.prisma.user.create({
            data : {...data, hashedPassword,role : Role.STUDENT},
            omit : {password :true},

        })

        return { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", data: user };

    }

}