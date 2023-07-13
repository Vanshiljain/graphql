import { Module } from '@nestjs/common';
import { BookResolver } from './book.resolver';
import { AuthorsSchema, Book, BookSchema } from './book.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Authors', schema: AuthorsSchema }]),
  ],
  providers: [BookResolver, BookService],
  exports: [BookService, BookResolver, MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]), MongooseModule.forFeature([{ name: 'Authors', schema: AuthorsSchema }])],
})
export class BookModule { }
