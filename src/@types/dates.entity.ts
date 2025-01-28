export interface CreatedAt {
  seconds: number;
  nanoseconds: number;
}

export interface UpdatedAt extends CreatedAt {}
