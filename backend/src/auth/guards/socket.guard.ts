import { CanActivate, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WsGuard implements CanActivate {

    constructor(private configService: ConfigService) {
    }

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
		console.log(context);
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(bearerToken, this.configService.get('JWT_ACCESS_TOKEN_SECRET')) as any;
			console.log(decoded);
            return decoded;
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}