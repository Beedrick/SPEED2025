interface Article {
  _id: string;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
 
}