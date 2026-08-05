import {
  Controller,
  Post,
  Body,
  Query,
  BadRequestException,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Public } from './decorators/public.decorator';
import { GoogleAuthRequest, OAuthState, AuthenticatedRequest } from 'express';
import type { Response } from 'express-serve-static-core';
import { GoogleUser } from '../../types/express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Query('role') role: 'brand' | 'creator',
  ) {
    if (!role || (role !== 'brand' && role !== 'creator')) {
      throw new BadRequestException(
        'Role query param is required and must be brand or creator',
      );
    }

    return this.authService.signup(dto, role);
  }

  @Post('verify')
  async verifyEmail(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyEmail(token, res);
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(
      body.email,
      body.password,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { accessToken, user };
  }

  @Post('token-after-signup')
  async generateTokenAfterSignup(
    @Body() body: { userId: number },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.issueTokenAfterSignup(body.userId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'Successfully logged out' });
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {
    return;
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: GoogleAuthRequest, @Res() res: Response) {
    const rawState = req.query.state || '{}';
    const decodedState = decodeURIComponent(rawState);
    const state: OAuthState = JSON.parse(decodedState);
    const role = state.role;

    const { accessToken, user } = await this.authService.loginGoogle(
      req.user,
      role,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    if (role === 'creator') {
      return res.redirect(
        `${process.env.VITE_APP_BASE_URL}/auth-success?role=creator`,
      );
    } else {
      return res.redirect(
        `${process.env.VITE_APP_BASE_URL}/auth-success?role=brand`,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
