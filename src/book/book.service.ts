import { Types } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Book, BookInput, NewAuthors } from "./book.schema";
import { User } from "src/user/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Author } from "./book.schema";


@Injectable()
export class BookService {
  constructor(
    @InjectModel('Book') private readonly bookModel: Model<Book>,
    @InjectModel('User') private readonly UserModel: Model<User>,
    @InjectModel('Authors') private readonly NewAuthorsModel: Model<NewAuthors>,
  ) {}

  async createBook(title: string, author: Author[], price: number, year: number, userId: Types.ObjectId): Promise<Book> {
    const book = new this.bookModel({ title, author, price, year, userId });
    this.createAutor(author);
    return book.save();
  }

  async findUserById(): Promise<Book[]> {
    const result = await this.bookModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userCollection',
        },
      },
      {
        $unwind: '$userCollection',
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorCollection',
        },
      },
      {
        $unwind: '$authorCollection',
      },
      {
        $project: {
          title: 1,
          price: 1,
          year: 1,
          userCollection: 1,
          authorCollection: 1,
        },
      },
    ]).exec();
    console.log(result);
    return result;
  }

  async createAutor(NewAuthors): Promise<Author> {
    const author = new this.NewAuthorsModel(NewAuthors[0]);
    return author.save();
  }

  async updateBook(bookInput: BookInput, _id: string): Promise<Book> {
    const existingBook = await this.bookModel.findById(_id);
    if (!existingBook) {
      throw new Error('Book not found');
    }
    bookInput.author = [...existingBook.author, ...bookInput.author];

    const updatedBook = await this.bookModel.findOneAndUpdate(
      { _id },
      { $set: bookInput },
      { new: true }
    );

    if (!updatedBook) {
      throw new Error('Failed to update book');
    }
    return updatedBook;
  }

  async getAuthors(): Promise<Author[]> {
    return this.NewAuthorsModel.find().exec();
  }
}
