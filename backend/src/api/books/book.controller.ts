import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
  } from '@nestjs/common';
  import { BookService } from './book.service';
  import { CreateBookDto } from './create-book.dto';
  import { error } from 'console';
  
  @Controller('api/books')
  export class BookController {
    constructor(private readonly bookService: BookService) {}
  
    // Test route
    @Get('/test')
    test() {
      return this.bookService.test();
    }
  
    // Search books
    @Get('/search')
    async search(
      @Query('q') query?: string,
      @Query('se_practice') sePractice?: string,
      @Query('claim') claim?: string,
    ) {
      try {
        console.log('Controller received - query:', query, 'sePractice:', sePractice, 'claim:', claim);
        // Pass ALL three parameters to the service (this was the original bug)
        return await this.bookService.search(query, sePractice, claim);
      } catch (error) {
        console.error('Search error:', error);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error searching books',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }

    // Get all books
    @Get('/')
    async findAll() {
      try {
        return this.bookService.findAll();
      } catch {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No Books found',
          },
          HttpStatus.NOT_FOUND,
          { cause: error },
        );
      }
    }
  
    // Get one book by ID
    @Get('/:id')
    async findOne(@Param('id') id: string) {
      try {
        return this.bookService.findOne(id);
      } catch {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No Book found',
          },
          HttpStatus.NOT_FOUND,
          { cause: error },
        );
      }
    }
  
    // Create a new book
    @Post('/')
    async addBook(@Body() createBookDto: CreateBookDto) {
      try {
        await this.bookService.create(createBookDto);
        return { message: 'Book added successfully' };
      } catch {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Unable to add this book',
          },
          HttpStatus.BAD_REQUEST,
          { cause: error },
        );
      }
    }
  
    // Update an existing book
    @Put('/:id')
    async updateBook(
      @Param('id') id: string,
      @Body() createBookDto: CreateBookDto,
    ) {
      try {
        await this.bookService.update(id, createBookDto);
        return { message: 'Book updated successfully' };
      } catch {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Unable to update this book',
          },
          HttpStatus.BAD_REQUEST,
          { cause: error },
        );
      }
    }
  
    // Delete a book
    @Delete('/:id')
    async deleteBook(@Param('id') id: string) {
      try {
        return await this.bookService.delete(id);
      } catch {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'No such a book',
          },
          HttpStatus.NOT_FOUND,
          { cause: error },
        );
      }
    }
  
  }