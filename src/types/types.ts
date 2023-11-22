export interface IUser {
  first_name: string,
  last_name: string,
  photo_50: string,
  id: number,
  sex: number,
  bdate?: string,
  friends?: number
  counters?: {
    friends: number
  }
}

export interface IUserMini {
  name: string,
  photo_50: string,
  id: number,
  sex: number,
  bdate?: number | null,
  friends?: number,
  commonFriends?: number,
  isFriend?: boolean,
  isAuto?: boolean,
}

export interface IDuplicate {
  string: number;
}

export interface IPostResponse{
  response: {
    count: number,
    items: IPostData[],
  }
}

interface IRepost{
  type: string,
  text: string,
}

export interface IPostData{
  date: number,
  from_id: number | string,
  id: number,
  text: string,
  copy_history?: IRepost[]
}

export interface IPost{
  date: string,
  name: number | string,
  id: number,
  text: string,
  repost?: string,
}


