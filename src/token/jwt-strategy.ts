import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@config/config.service";
import { UserRepositoryService } from "@repository/user-repository/user-repository.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserError } from "@error/user/user-error";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userRepository : UserRepositoryService    
) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration : false,
      secretOrKey: config.getSecretKey(),
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const userJsonString = await this.userRepository.loadUserById(userId);

    if(!userJsonString) throw UserError.UserNotFound({ userId });

    return {sub : payload.sub};
  }
}
