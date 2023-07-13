import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Author, Book, BookInput } from './book.schema';
import { BookService } from './book.service';
import { Types } from 'mongoose';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) { }

  @Mutation(() => Book)
  async createBook(
    @Args('title') title: string,
    @Args({ name: 'author', type: () => [Author] }) author: Author[],
    @Args('price') price: number,
    @Args('year') year: number,
    @Args('userId') userId: string,
  ): Promise<Book> {
    return this.bookService.createBook(title, author, price, year, new Types.ObjectId(userId));
  }

  @Query(() => [Book])
  async findAllBookUser(): Promise<Book[]> {
    return await this.bookService.findUserById();
  }

  @Mutation(() => Book)
  async updateBook(@Args('bookInput') bookInput: BookInput, @Args('_id') _id: string): Promise<Book> {
    return this.bookService.updateBook(bookInput, _id);
  }

  @Query(() => [Book])
  async findAllAuhtor(): Promise<Author[]> {
    return this.bookService.getAuthors();
  }
}