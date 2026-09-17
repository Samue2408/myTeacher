export interface Review {
  _id: string;
  bookingId: string;
  rating: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comments: string;
}

export interface UpdateReviewPayload {
  rating: number;
  comments: string;
}
