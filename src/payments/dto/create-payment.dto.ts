import {
    IsEnum,
    IsNotEmpty,
    IsString,
    ValidateIf,
    IsCreditCard,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_SLIP = 'BANK_SLIP',
}

export class CreatePaymentDto {
    @ApiProperty({
        description: "The payment method",
        enum: PaymentMethod,
        example: PaymentMethod.CREDIT_CARD,
    })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    method: PaymentMethod;

    @ApiPropertyOptional({
        description: "The type of credit card (required if method is CREDIT_CARD)",
        example: "VISA",
    })
    @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
    @IsString()
    @IsNotEmpty()
    cardType?: string;

    @ApiPropertyOptional({
        description: "The credit card number (required if method is CREDIT_CARD)",
        example: "4111111111111111",
    })
    @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
    @IsCreditCard()
    @IsNotEmpty()
    cardNumber?: string;

    @ApiPropertyOptional({
        description: "The name of the credit card holder (required if method is CREDIT_CARD)",
        example: "John Doe",
    })
    @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
    @IsString()
    @IsNotEmpty()
    cardHolderName?: string;

    @ApiPropertyOptional({
        description: "The expiry date of the credit card in MM/YY format (required if method is CREDIT_CARD)",
        example: "12/25",
    })
    @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
    @IsString()
    @IsNotEmpty()
    cardExpiryDate?: string;

    @ApiPropertyOptional({
        description: "The CVV of the credit card (required if method is CREDIT_CARD)",
        example: "123",
    })
    @ValidateIf(o => o.method === PaymentMethod.CREDIT_CARD)
    @IsString()
    @IsNotEmpty()
    cardCvv?: string;
}