export type Article = {
  _id?: string;
  title?: string;
  authors?: string;
  claim?: string;
  practice?: string;
  result?: string;
  year?: number;
  doi?: string;
  updated_date?: Date;
};

export const DefaultEmptyArticle: Article = {
  _id: undefined,
  title: '',
  authors: '',
  claim: '',
  practice: '',
  result: '',
  year: undefined,
  doi: '',
  updated_date: undefined,
};
