import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "entity/user.entity";

@Injectable()
export class Auth extends AuthGuard('basic') {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    super();
  }

  async validate(token: string): Promise<{ isValid: boolean, name?: string }> {
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) {
      return { isValid: false };
    }else return { isValid: true, name: encryptedToken[0] };
  }
}