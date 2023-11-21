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
}

export interface IDuplicate {
  string: number;
}
