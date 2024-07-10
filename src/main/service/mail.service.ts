import { MailerService } from "@nestjs-modules/mailer";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "entity/user";
import { Repository } from "typeorm";
import { AuthGuard } from "guard/auth";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { JwtTokenKeys } from "types/jwt-token-keys";
import { UUID } from "crypto";

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService
  ) {}

  async sendVerifyEmailMessage(token: string): Promise<void> {
    const { sub } = await this.jwtService.verifyAsync<JwtTokenKeys>(token);

    const user = await this.userRepository.findOneBy({ id: sub });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name: user.name,
        url: `${this.configService.get<string>('API_URL')}/mail/verify-email?token=${token}`
      }
    })
  }

  async verifyEmail(token: string): Promise<{ user: string, message: string }> {
    const { sub } = await this.jwtService.verifyAsync<JwtTokenKeys>(token);

    const user = await this.userRepository.findOneBy({ id: sub });

    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);
    if(user.isVerified) return { user: user.name, message: "your email already verified." };

    await this.userRepository.update(user.id, { isVerified: true });

    return {
      user: user.name,
      message: "your email has been verified."
    }
  }

  async sendRestorePasswordMessage(id: UUID): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Restore your password',
      template: 'restore-password',
      context: {
        name: user.name,
        url: `${this.configService.get<string>('API_URL')}/auth/restore-password?id=${id}`
      }
    });
  }
}