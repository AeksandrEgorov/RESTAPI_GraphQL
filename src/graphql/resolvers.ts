import { books } from "../data/mock/books.mock.faker.js";
import { authors } from "../data/mock/authors.mock.faker.js";
import { publishers } from "../data/mock/publishers.mock.faker.js";
import { reviews } from "../data/mock/reviews.mock.faker.js";

type BookInput = {
  title: string;
  isbn: string;
  publishedYear?: number;
  pageCount?: number;
  language?: string;
  description?: string;
  coverImage?: string;
  genres?: string[];
  authorId?: string;
  publisherId?: string;
};

type UpdateBookInput = {
  title?: string;
  isbn?: string;
  publishedYear?: number;
  pageCount?: number;
  language?: string;
  description?: string;
  coverImage?: string;
  genres?: string[];
  authorId?: string;
  publisherId?: string;
};

type CreateReviewInput = {
  bookId: string;
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
};

type BooksArgs = {
  title?: string;
  language?: string;
  year?: number;
  sortBy?: "title" | "publishedYear";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

function validateCreateBookInput(input: BookInput): void {
  if (!input.title.trim()) {
    throw new Error("Title is required");
  }

  if (!input.isbn.trim()) {
    throw new Error("ISBN is required");
  }

  if (input.publishedYear !== undefined && input.publishedYear < 0) {
    throw new Error("Published year must be 0 or greater");
  }

  if (input.pageCount !== undefined && input.pageCount < 0) {
    throw new Error("Page count must be 0 or greater");
  }
}

function validateUpdateBookInput(input: UpdateBookInput): void {
  if (input.title !== undefined && !input.title.trim()) {
    throw new Error("Title cannot be empty");
  }

  if (input.isbn !== undefined && !input.isbn.trim()) {
    throw new Error("ISBN cannot be empty");
  }

  if (input.publishedYear !== undefined && input.publishedYear < 0) {
    throw new Error("Published year must be 0 or greater");
  }

  if (input.pageCount !== undefined && input.pageCount < 0) {
    throw new Error("Page count must be 0 or greater");
  }
}

function validateCreateReviewInput(input: CreateReviewInput): void {
  if (!input.userName.trim()) {
    throw new Error("User name is required");
  }

  if (!input.comment.trim()) {
    throw new Error("Comment is required");
  }

  if (input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
}

export const resolvers = {
  Query: {
    books: (_parent: unknown, args: BooksArgs) => {
      let result = [...books];

      if (args.title) {
        const title = args.title.toLowerCase();
        result = result.filter((book) =>
          book.title.toLowerCase().includes(title)
        );
      }

      if (args.language) {
        const lang = args.language.toLowerCase();
        result = result.filter(
          (book) => book.language.toLowerCase() === lang
        );
      }

      if (args.year !== undefined) {
        result = result.filter((book) => book.publishedYear === args.year);
      }

      if (args.sortBy) {
        result.sort((a, b) => {
          if (args.sortBy === "title") {
            const compare = a.title.localeCompare(b.title);
            return args.order === "desc" ? -compare : compare;
          }

          if (args.sortBy === "publishedYear") {
            const compare = a.publishedYear - b.publishedYear;
            return args.order === "desc" ? -compare : compare;
          }

          return 0;
        });
      }

      const total = result.length;
      const page = args.page ?? 1;
      const limit = args.limit ?? (total || 1);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = result.slice(start, end);
      const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

      return {
        data: paginatedData,
        total,
        page,
        limit,
        totalPages,
      };
    },

    book: (_parent: unknown, args: { id: string }) =>
      books.find((book) => book.id === Number(args.id)) ?? null,

    authors: () => authors,

    author: (_parent: unknown, args: { id: string }) =>
      authors.find((author) => author.id === Number(args.id)) ?? null,

    publishers: () => publishers,

    publisher: (_parent: unknown, args: { id: string }) =>
      publishers.find((publisher) => publisher.id === Number(args.id)) ?? null,

    reviews: (_parent: unknown, args: { bookId: string }) =>
      reviews.filter((review) => review.bookId === Number(args.bookId)),

    languages: () => [...new Set(books.map((book) => book.language))],

    genres: () => [...new Set(books.flatMap((book) => book.genres))],
  },

  Book: {
    author: (book: { authorId?: number | null }) =>
      authors.find((author) => author.id === book.authorId) ?? null,

    publisher: (book: { publisherId?: number | null }) =>
      publishers.find((publisher) => publisher.id === book.publisherId) ?? null,

    reviews: (book: { id: number }) =>
      reviews.filter((review) => review.bookId === book.id),
  },

  Author: {
    books: (author: { id: number }) =>
      books.filter((book) => book.authorId === author.id),
  },

  Publisher: {
    books: (publisher: { id: number }) =>
      books.filter((book) => book.publisherId === publisher.id),
  },

  Review: {
    book: (review: { bookId: number }) =>
      books.find((book) => book.id === review.bookId) ?? null,
  },

  Mutation: {
    createBook: (_parent: unknown, args: { input: BookInput }) => {
      validateCreateBookInput(args.input);

      const newId =
        books.length > 0
          ? Math.max(...books.map((book) => book.id)) + 1
          : 1;

      const newBook = {
        id: newId,
        title: args.input.title.trim(),
        isbn: args.input.isbn.trim(),
        publishedYear: args.input.publishedYear ?? 0,
        pageCount: args.input.pageCount ?? 0,
        language: args.input.language?.trim() ?? "",
        description: args.input.description?.trim() ?? "",
        coverImage: args.input.coverImage?.trim() ?? "",
        genres: args.input.genres ?? [],
        authorId: args.input.authorId ? Number(args.input.authorId) : 0,
        publisherId: args.input.publisherId
          ? Number(args.input.publisherId)
          : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      books.push(newBook);
      return newBook;
    },

    updateBook: (
      _parent: unknown,
      args: { id: string; input: UpdateBookInput }
    ) => {
      validateUpdateBookInput(args.input);

      const bookIndex = books.findIndex(
        (book) => book.id === Number(args.id)
      );

      if (bookIndex === -1) {
        return null;
      }

      const currentBook = books[bookIndex];

      const updatedBook = {
        ...currentBook,
        ...args.input,
        title:
          args.input.title !== undefined
            ? args.input.title.trim()
            : currentBook.title,
        isbn:
          args.input.isbn !== undefined
            ? args.input.isbn.trim()
            : currentBook.isbn,
        language:
          args.input.language !== undefined
            ? args.input.language.trim()
            : currentBook.language,
        description:
          args.input.description !== undefined
            ? args.input.description.trim()
            : currentBook.description,
        coverImage:
          args.input.coverImage !== undefined
            ? args.input.coverImage.trim()
            : currentBook.coverImage,
        authorId:
          args.input.authorId !== undefined
            ? Number(args.input.authorId)
            : currentBook.authorId,
        publisherId:
          args.input.publisherId !== undefined
            ? Number(args.input.publisherId)
            : currentBook.publisherId,
        updatedAt: new Date().toISOString(),
      };

      books[bookIndex] = updatedBook;
      return updatedBook;
    },

    deleteBook: (_parent: unknown, args: { id: string }) => {
      const bookIndex = books.findIndex(
        (book) => book.id === Number(args.id)
      );

      if (bookIndex === -1) {
        return false;
      }

      books.splice(bookIndex, 1);
      return true;
    },

    createReview: (_parent: unknown, args: { input: CreateReviewInput }) => {
      validateCreateReviewInput(args.input);

      const bookExists = books.find(
        (book) => book.id === Number(args.input.bookId)
      );

      if (!bookExists) {
        throw new Error("Book not found");
      }

      const newId =
        reviews.length > 0
          ? Math.max(...reviews.map((review) => review.id)) + 1
          : 1;

      const newReview = {
        id: newId,
        bookId: Number(args.input.bookId),
        userName: args.input.userName.trim(),
        rating: args.input.rating,
        comment: args.input.comment.trim(),
        createdAt: new Date().toISOString(),
      };

      reviews.push(newReview);
      return newReview;
    },
  },
};