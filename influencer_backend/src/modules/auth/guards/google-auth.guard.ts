import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const stateFromClient = request.query.state;
    return {
      scope: ['email', 'profile'],
      prompt: 'select_account',
      state: stateFromClient,
    };
  }
}
