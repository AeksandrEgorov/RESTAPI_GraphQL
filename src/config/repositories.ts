// Config: repository wiring (mock by default)
import { BookRepository } from "../interfaces/book.repository.interface.js";
import { ReviewRepository } from "../interfaces/review.repository.interface.js";

import { MockBookRepository } from "../repositories/mock-book.repository.js"
import { MockReviewRepository } from "../repositories/mock-review.repository.js";

// choose data source
const DATA_SOURCE: string = "mock";

// instances
export const bookRepository: BookRepository = new MockBookRepository();
export const reviewRepository: ReviewRepository = new MockReviewRepository();

export { DATA_SOURCE };