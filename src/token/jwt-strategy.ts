import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@root/src/config/config.service";
import { UserRepositoryService } from "@repository/user-repository/user-repository.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ControllerException } from "@root/src/error/controller/controller-exception";
import { ControllerErrorCode } from "@root/src/error/controller/controller-error-code";

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

    if(!userJsonString) throw new ControllerException(ControllerErrorCode.NO_SUCH_USER);

    return {sub : payload.sub};
  }
}
