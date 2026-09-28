import { Body, ConflictException, HttpCode, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as argon2 from "argon2"
import { JwtService } from "@nestjs/jwt"

type TRegisterBody = {
    username: string
    email: string
    password: string
}

type TLoginBody = {
    username: string
    password: string
}

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService){}
    async register({username, email, password}: TRegisterBody){
        const passwordHash = await argon2.hash(password)
        try {
            const user = await this.prisma.users.create({
            data: {
                username: username,
                email: email,
                passwordHash: passwordHash
            }
        })

        return user
        } catch (error: any) {
            if(error.code === "P2002" ){
                throw new ConflictException(
                    'Username atau email sudah digunakan'
                )
            }

            throw error
        }
       
    }

   
    async login({username, password}: TLoginBody){
        try {
            const user = await this.prisma.users.findUnique({
                where: {username: username }
            })

            if(!user){
                throw new UnauthorizedException('username atau password salah');
            }

            const isPasswordvalid = await argon2.verify(user.passwordHash ,  password);
            if(!isPasswordvalid){
                throw new UnauthorizedException(
                    'username atau password salah'
                )
            }

            const payload = {sub: user.id, username: user.username}

            // console.log(await this.jwtService.signAsync(payload));

            return{
                status: "success",
                message: "Login Success",
                data: {
                    userId:user.id,
                    username: user.username,
                    email: user.email,
                    access_token: await this.jwtService.signAsync(payload)
                }
            }

        } catch (error) {
            throw error
        }
    }
}
