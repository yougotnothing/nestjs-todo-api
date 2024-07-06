import { MailerService } from "@nestjs-modules/mailer";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "entity/user";
import { Repository } from "typeorm";
import { Auth } from "guard/auth";

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async sendVerifyEmailMessage(token: string): Promise<void> {
    // await this.mailerService.sendMail({
    //   to: user.email,
    //   subject: 'Verify your email',
    //   template: 'verify-email',
    //   context: {
    //     name: user.name,
    //     url: `${this.configService.get<string>('API_URL')}/auth/verify-email?token=${token}`
    //   }
    // })
  }

  async verifyEmail(token: string): Promise<void> {
    // const { isValid, name } = await this.auth.validate(token);

    // // if(!isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    // const user = await this.userRepository.findOneBy({ name });

    // // if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);
    // // if(user.isVerified) throw new HttpException("email already verified.", HttpStatus.BAD_REQUEST);

    // // await this.userRepository.update(user.id, { isVerified: true });

    // return {
    //   name: user.name
    // }
  }
}