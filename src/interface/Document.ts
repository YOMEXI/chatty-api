export interface User {
  _id: any;
  email: string;
  password: string;
  age: number;
  firstname: string;
  lastname: string;
  username: string | any;
  role: string;
  imgUrl?: string | any;
  img_id?: string;
  unreadMessage?: boolean;
  unreadNotification?: boolean;
  newMessagePopup: boolean;
  resetToken: string;
  expireToken: string;
  country: string;
}
