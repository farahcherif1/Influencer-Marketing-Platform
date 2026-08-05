import { IsInt, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBookingItemDto } from '../../booking-item/dto/create-booking-item.dto';

export class CreateBookingDto {
  @IsInt()
  brandId: number;

  @IsNumber()
  price: number;

  @IsString()
  status: string;
  //   @ValidateNested({ each: true })
  //   @Type(() => CreateBookingItemDto)
  //   items: CreateBookingItemDto[];
}
