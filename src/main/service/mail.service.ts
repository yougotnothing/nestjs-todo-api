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
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly auth: Auth
  ) {}

  async sendVerifyEmail(token: string): Promise<void> {
    const { isValid, name } = await this.auth.validate(token);

    if(!isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    const user = await this.userRepository.findOneBy({ name });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name: user.name,
        url: `${this.configService.get<string>('API_URL')}/auth/verify-email?token=${token}`
      }
    })
  }
}