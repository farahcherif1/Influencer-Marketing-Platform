import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'express';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('me')
  getActiveCart(@Request() req: AuthenticatedRequest) {
    const brandId = req.user.id;
    return this.cartService.getCartWithFullDetails(brandId);
  }
}
