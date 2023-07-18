import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Address, User, Courses, Gender, Role, Product, UserInput } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserModule } from './user.modul';
import { Args, ID } from '@nestjs/graphql';

@Injectable()
export class UserService {
  findById(userId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async createUser(userInput: UserInput): Promise<User> {
    const aggregation = new this.userModel({ ...userInput });
    aggregation.product.map((p: Product) => {
      const totalPrice = p.description.unit.quantity * p.description.unit.pricePerUnit;
      p.description.unit.totalPrice = totalPrice;
    });
    const totalSumPrice = aggregation.product.reduce((sum: number, p: Product) => {
      return sum + p.description.unit.totalPrice;
    }, 0);
    aggregation.totalSumPrice = totalSumPrice;
    return aggregation.save();
  }

  async findAllUser() {
    return this.userModel.find().exec();
  }

  async findUserByMatch(role: string) {
    return this.userModel.aggregate([
      {
        $match: {
          $and: [
            { role: "user" },
            { age: { $gte: 18, $lte: 35 } },
          ]
        }
      },
      {
        $addFields: {
          length: {
            $size: "$completedCourses",
          }
        },
      },
      {
        $project: {
          courses: 1,
          name: 1,
          username: 1,
          email: 1,
          password: 1,

          completedCourses: {
            $filter: {
              input: "$courses",
              as: "course",
              cond: {
                $and: [
                  { $eq: ["$$course.courseStatus", "Completed"] },
                  { $eq: ["$$course.publication", "Publisher A"] }
                ]
              }
            }
          },
          lastCourse: {
            $arrayElemAt: ["$courses", -1]
          }
        }
      },
      {
        $addFields: {
          length: {
            $size: "$completedCourses",
          }
        },
      },
      {
        $match: {
          length: { $gt: 0 },
        }
      }
    ]).exec();
  }


  async findUserByQty(quantity: number) {
    return this.userModel.aggregate([
      {
        $project: {
          name: "$name",
          username: "$username",
          role: "$role",
          email: "$email",
          password: "$password",
          product: 1,
          filterProducts: {
            $filter: {
              input: "$product",
              as: "item",
              cond: {
                $let: {
                  vars: { description: "$$item.description" },
                  in: { $gte: ["$$description.unit.quantity", quantity] }
                }
              }
            }
          },
        }
      },
      {
        $addFields: {
          totalSumPrice: {
            $sum: "$filterProducts.description.unit.totalPrice"
          },
        }
      },
      {
        $addFields: {
          totalSumPrice: {
            $sum: '$product.description.unit.totalPrice',
          },
        },
      },
    ]).exec();
  }

  async totalSumPrice() {
    const result = await this.userModel.aggregate([
      {
        $group: {
          _id: null,
          totalSumPrice: { $sum: "$totalSumPrice" },
        }
      }
    ]).exec();
    return result[0].totalSumPrice;
  }


  async getAllCourses() {
    return this.userModel.aggregate([
      {
        $addFields: {
          allCourses: {
            $map: {
              input: '$courses',
              as: 'courseObj',
              in: {
                $cond: [
                  {
                    $eq: ['$$courseObj.courseStatus', 'Completed'],
                  },
                  {
                    $mergeObjects: [
                      '$$courseObj',
                      {
                        courseName: '$$courseObj.courseName',
                        courseStatus: '$$courseObj.courseStatus',
                        publication: '$$courseObj.publication',
                        year: { $add: ['$$courseObj.year', 2] },
                      },
                    ],
                  },
                  '$$courseObj',
                ],
              },
            },
          },
        },
      },
    ]).exec();
  }

  async findOne(@Args('email') email: String): Promise<User> {
    return this.userModel.findOne({ email: email });
  }

  async updateUser(email: string, userInput: UserInput): Promise<User> {
    return this.userModel.findOneAndUpdate({ email: email }, userInput, { new: true });
  }

}