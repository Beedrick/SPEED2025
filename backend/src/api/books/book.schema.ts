import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, type: [String] })
    authors: string[];

    @Prop({ required: true })
    journal_conference: string;

    @Prop({ required: true })
    year_of_publication: number;

    @Prop({ type: [String], default: [] })
    se_practices: string[];

    @Prop({ type: [String], default: [] })
    claims: string[];

    @Prop()
    volume: string;

    @Prop()
    number: string;

    @Prop()
    pages: string;

    @Prop({ required: true })
    doi: string;

}


export const BookSchema = SchemaFactory.createForClass(Book);