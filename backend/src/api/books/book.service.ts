import { Injectable } from '@nestjs/common';
import { Book } from './book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BookService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

    test(): string {
        return 'book route testing';
    }

    async findAll(): Promise<Book[]> {
        return await this.bookModel.find().exec();
    }
    
    async findOne(id: string): Promise<Book | null> {
        return await this.bookModel.findById(id).exec();
    }
    
    async create(createBookDto: CreateBookDto) {
        return await this.bookModel.create(createBookDto);
    }
    
    async update(id: string, createBookDto: CreateBookDto) {
        return await this.bookModel.findByIdAndUpdate(id, createBookDto).exec();
    }
    
    async delete(id: string) {
        const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
        return deletedBook;
    }

    // Updated search method with filter support
    // Final clean search method
    async search(query?: string, sePractice?: string, claim?: string): Promise<Book[]> {
        // Build the search conditions
        const conditions: any[] = [];

        // Text search condition
        if (query && query.trim() !== '') {
            const searchRegex = new RegExp(query.trim(), 'i');
            conditions.push({
                $or: [
                    { title: { $regex: searchRegex } },
                    { authors: { $regex: searchRegex } },
                    { journal_conference: { $regex: searchRegex } },
                    { doi: { $regex: searchRegex } }
                ]
            });
        }

        // SE Practice filter
        if (sePractice && sePractice.trim() !== '') {
            conditions.push({
                se_practices: sePractice.trim()
            });
        }

        // Claim filter
        if (claim && claim.trim() !== '') {
            conditions.push({
                claims: claim.trim()
            });
        }

        // If no conditions, return all books
        if (conditions.length === 0) {
            return await this.findAll();
        }

        // Combine all conditions with $and
        const searchQuery = conditions.length === 1 ? conditions[0] : { $and: conditions };

        return await this.bookModel.find(searchQuery).exec();
    }
}