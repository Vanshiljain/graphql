import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, Product, UserInput, AccessTokenResponse } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
<<<<<<< HEAD
import { Args, ID } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
import { Octokit } from 'octokit';


=======
import { Args } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7

@Injectable()
export class UserService {
  findById(userId: string) {
    throw new Error('Method not implemented.');
  }
<<<<<<< HEAD
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;  
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
=======
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7

  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }
  async createUser(userInput: UserInput): Promise<User> {
<<<<<<< HEAD
    
    // const nodemailer = require("nodemailer");
  
    // const transporter = nodemailer.createTransport({
=======
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      }
    });

    const aggregation = new this.userModel({ ...userInput, password: await bcrypt.hash(userInput.password, 10) });
    aggregation.product.map((p: Product) => {
      const totalPrice = p.description.unit.quantity * p.description.unit.pricePerUnit;
      p.description.unit.totalPrice = totalPrice;
    });
    const totalSumPrice = aggregation.product.reduce((sum: number, p: Product) => {
      return sum + p.description.unit.totalPrice;
    }, 0);
    aggregation.totalSumPrice = totalSumPrice;
    const result = JSON.stringify(aggregation);
    const info = await transporter.sendMail({
      from: "niharkushwahcomputer@gmail.com",
      to: "nihark@linkites.com",
      subject: "Hello ✔",
      text: "User registered successfully!",
      html: `
      <h1>User registered successfully!</h1>
      <table border="1">
      <tr>
          <th>Name</th>
          <th>email</th>
          <th>userName</th>
          <th>age</th>
          <th>mobile number</th>
          <th>Address</th>
        </tr>
        <tr>
          <td>${aggregation.name}</td>
          <td>${aggregation.email}</td>
          <td>${aggregation.userName}</td>
          <td>${aggregation.age}</td>
          <td>${aggregation.mobileNumber}</td>
          <td>${aggregation.address.mainAddress}, ${aggregation.address.city}, ${aggregation.address.pincode}</td>
          </tr>
          </table>
      `,
    });
    console.log("Message sent: %s", info.messageId);
    return aggregation.save();
  }
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7

    //   service:'gmail',
    //   auth: {
        
    //     user: 'vanshiljain08@gmail.com',
    //     pass: 'kibcxcjkzutaayek'
    //   }
    // });


  const aggregation = new this.userModel({ ...userInput, password: await bcrypt.hash(userInput.password, 10) });
  aggregation.product.map((p: Product) => {
    const totalPrice = p.description.unit.quantity * p.description.unit.pricePerUnit;
    p.description.unit.totalPrice = totalPrice;
  });
  const totalSumPrice = aggregation.product.reduce((sum: number, p: Product) => {
    return sum + p.description.unit.totalPrice;
  }, 0);
  aggregation.totalSumPrice = totalSumPrice;
  const result = JSON.stringify(aggregation);
//   const info = await transporter.sendMail({
//     from: "vanshiljain08@gmail.com", 
//     to: "vanshiljain3@gmail.com", 
//     subject: "Hello ✔", 
//     text: "User registered successfully!",
//     html: `
//     <h2>User Details:</h2>
//     <table border="1" cellpadding="5" style="border-collapse: collapse;">
//       <tr>
//         <td><strong>Name:</strong></td>
//         <td>${userInput.name}</td>
//       </tr>
//       <tr>
//         <td><strong>Username:</strong></td>
//         <td>${userInput.username}</td>
//       </tr>
//       <tr>
//         <td><strong>Email:</strong></td>
//         <td>${userInput.email}</td>
//       </tr>
//       <tr>
//         <td><strong>Age:</strong></td>
//         <td>${userInput.age}</td>
//       </tr>
//       <tr>
//         <td><strong>Mobile Number:</strong></td>
//         <td>${userInput.mobileNumber}</td>
//       </tr>
//       <tr>
//         <td><strong>Address</strong></td>
//         <td>${userInput.address.mainAddress}</td>
//       </tr>
//       <tr>
//       // <td><strong>Password</strong></td>
//       // <td>${userInput.password}</td>
//     </tr>
//     </table>
//   `,
// });

//   console.log("Message sent: %s", info.messageId);
  return aggregation.save();

}

  async findAllUser(role: Role, minAge: number, maxAge: number) {
    console.log('Fetching users with role:', role, 'and age between', minAge, 'and', maxAge);
    return this.userModel.find({ role, age: { $gte: minAge, $lte: maxAge } }).exec();
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
          userName: 1,
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
          userName: "$userName",
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
  async updateUser(email: string, updateData: Partial<User>): Promise<User> {
    // Update the user with the provided email and updateData
    return this.userModel.findOneAndUpdate({ email }, updateData, { new: true }).exec();
  }
  

<<<<<<< HEAD
  async deleteUser(userId: string): Promise<User> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
  async checkUserExists(email: string): Promise<boolean> {

    const existingUser = await this.userModel.findOne({ email }).exec();
    return !!existingUser;
  }
 
  
}
=======
  async deleteUser(_id: string): Promise<User> {
    return this.userModel.findOneAndDelete({ _id: _id });
  }

  async findEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email });
  }
}
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
