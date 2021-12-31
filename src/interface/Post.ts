export interface Post {
  text: string;
  title: string;
  user: string | any;
  picUrl?: string;
  likes?: any[];
  unlikes?: any[];
  comments?: any;
  pic_id: string;
}

export interface Follower {
  user: string | any;
  followers: any;
  following: any;
}

export interface Notification {
  user: string | {};
  notifications: any[];
  post: any;
  commentId?: string;
  text?: string;
  date?: any;
}

export interface Messages {
  text: string | {};
  conversationId: string;
  sender?: any;
}
