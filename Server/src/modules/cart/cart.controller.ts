import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService, CartValidationPipe } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/utils/HttpExceptionFilter';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Create a new cart
  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({
    status: 201,
    description: 'The cart has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new CartValidationPipe())
  async create(@Body() createCartDto: CreateCartDto) {
    try {
      const newCart = await this.cartService.create(createCartDto);
      return {
        success: true,
        message: 'Cart created successfully',
        cart: newCart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create cart',
        error: error.message,
      };
    }
  }

  // Add a product to a cart
  @Post(':id/add-product')
  @ApiOperation({ summary: 'Add an product to a cart' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully added.',
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async addItem(
    @Param('id', ParseIntPipe) cart_id: number,
    @Body() item: { productId: number; quantity: number },
  ) {
    try {
      const product = await this.cartService.addItem(cart_id, item);
      return {
        success: true,
        message: 'Item added successfully',
        product: product,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add item',
        error: error.message,
      };
    }
  }

  // Get all carts
  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'Return all carts.' })
  async findAll() {
    try {
      const carts = await this.cartService.findAll();
      return {
        success: true,
        message: 'Carts retrieved successfully',
        carts: carts,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve carts',
        error: error.message,
      };
    }
  }

  // Get a cart by id
  @Get(':id')
  @ApiOperation({ summary: 'Get a cart by id' })
  @ApiResponse({ status: 200, description: 'Return the cart.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const cart = await this.cartService.findById(+id);
      return {
        success: true,
        message: 'Cart retrieved successfully',
        cart: cart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve cart',
        error: error.message,
      };
    }
  }

  // Get Calculate total price of a cart
  @Get(':id/total')
  @ApiOperation({ summary: 'Calculate total price of a cart' })
  @ApiResponse({
    status: 200,
    description: 'The total price has been successfully calculated.',
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async calculateTotal(@Param('id', ParseIntPipe) cart_id: number) {
    try {
      const calculatedTotal = await this.cartService.calculateTotal(cart_id);
      return {
        success: true,
        message: 'Total price calculated successfully',
        total: calculatedTotal,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to calculate total price',
        error: error.message,
      };
    }
  }

  // Update a cart
  @Patch(':id')
  @ApiOperation({ summary: 'Update a cart' })
  @ApiResponse({
    status: 200,
    description: 'The cart has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    try {
      const updatedCart = await this.cartService.update(+id, updateCartDto);
      return {
        success: true,
        message: 'Cart updated successfully',
        cart: updatedCart,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update cart',
        error: error.message,
      };
    }
  }

  // Delete a cart
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cart' })
  @ApiResponse({
    status: 200,
    description: 'The cart has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async remove(@Param('id') id: string) {
    try {
      await this.cartService.remove(+id);
      return {
        success: true,
        message: 'Cart deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete cart',
        error: error.message,
      };
    }
  }
  // Remove an product from a cart
  @Delete(':id/products/:productId')
  @ApiOperation({ summary: 'Remove an product from a cart' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully removed.',
  })
  @ApiResponse({ status: 404, description: 'Cart or product not found.' })
  async removeItem(
    @Param('id', ParseIntPipe) cart_id: number,
    @Param('itemId', ParseIntPipe) item_id: number,
  ) {
    try {
      const product = await this.cartService.removeItem(cart_id, item_id);
      return {
        success: true,
        message: 'Item removed successfully',
        product: product,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to remove item',
        error: error.message,
      };
    }
  }

  // Clear all items from a cart
  @Delete(':id/products')
  @ApiOperation({ summary: 'Clear all items from a cart' })
  @ApiResponse({
    status: 200,
    description: 'The cart has been successfully cleared.',
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  async clear(@Param('id', ParseIntPipe) cart_id: number) {
    try {
      await this.cartService.clear(cart_id);
      return {
        success: true,
        message: 'Cart cleared successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to clear cart',
        error: error.message,
      };
    }
  }
}