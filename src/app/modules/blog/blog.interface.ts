export interface blogDataType {
  title: string;
  blogDetails: string;
  img: string;
  date: string;
  author: string;
  commentsArray: [];
  authorEmail: string;
  comment: number;
}
export interface CommentType {
  date: string;
  comment: string;
  email: string;
  name: string;
  postId: string;
  img: string;
  title: string;
}
