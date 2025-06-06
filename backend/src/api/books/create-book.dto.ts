import { Date } from 'mongoose';

export class CreateBookDto {
    title: string;
    authors: string[];
    journal_conference: string;
    year_of_publication: number;
    se_practices: string[];
    claims: string[];
    volume?: string;
    number?: string;
    pages?: string;
    doi: string;
}