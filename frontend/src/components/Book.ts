export type Book = {
    _id?: string;
    title?: string;
    authors?: string[];
    journal_conference?: string;
    year_of_publication?: number;
    volume?: string;
    number?: string;
    pages?: string;
    doi?: string;
};

export const DefaultEmptyBook: Book = {
    _id: undefined,
    title: '',
    authors: [],
    journal_conference: '',
    year_of_publication: undefined,
    volume: '',
    number: '',
    pages: '',
    doi: '',
};