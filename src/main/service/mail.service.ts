import { MailerService } from "@nestjs-modules/mailer";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "entity/user";
import { Repository } from "typeorm";
import { UUID } from "crypto";

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendVerifyEmailMessage(id: UUID): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });

    if(user.isVerified) return { message: "your email already verified." };

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name: user.name,
        url: `${this.configService.get<string>('API_URL')}/mail/verify-email?token=${user.sessionID}`
      }
    });

    return {
      message: "Verify email message sent. \n Please check your email."
    }
  }

  async verifyEmail(sid: string): Promise<{ user: string, message: string }> {
    const user = await this.userRepository.findOneBy({ sessionID: sid });

    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);
    if(user.isVerified) return { user: user.name, message: "your email already verified." };

    user.isVerified = true;

    await this.userRepository.save(user);

    return {
      user: user.name,
      message: "your email has been verified."
    }
  }

  async sendRestorePasswordEmailMessage(id: UUID): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });

    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Restore your password',
      template: 'restore-password',
      context: {
        name: user.name,
        url: `${this.configService.get<string>('API_URL')}/auth/restore-password-message?id=${user.id}`,
      }
    });

    return {
      message: "Restore password message sent. \n Please check your email."
    }
  }
}