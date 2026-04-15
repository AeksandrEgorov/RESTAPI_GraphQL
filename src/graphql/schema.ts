export const typeDefs = `#graphql

  enum BookSortBy {
    title
    publishedYear
  }

  enum SortOrder {
    asc
    desc
  }

  type Book {
    id: ID!
    title: String!
    isbn: String!
    publishedYear: Int!
    pageCount: Int!
    language: String!
    description: String!
    coverImage: String!
    genres: [String!]!
    authorId: ID
    publisherId: ID
    createdAt: String!
    updatedAt: String!
    author: Author
    publisher: Publisher
    reviews: [Review!]!
  }

  type Author {
    id: ID!
    firstName: String!
    lastName: String!
    birthYear: Int!
    books: [Book!]!
  }

  type Publisher {
    id: ID!
    name: String!
    books: [Book!]!
  }

  type Review {
    id: ID!
    bookId: ID!
    userName: String!
    rating: Int!
    comment: String!
    createdAt: String!
    book: Book
  }

  type BooksResponse {
    data: [Book!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  input CreateBookInput {
    title: String!
    isbn: String!
    publishedYear: Int
    pageCount: Int
    language: String
    description: String
    coverImage: String
    genres: [String!]
    authorId: ID
    publisherId: ID
  }

  input UpdateBookInput {
    title: String
    isbn: String
    publishedYear: Int
    pageCount: Int
    language: String
    description: String
    coverImage: String
    genres: [String!]
    authorId: ID
    publisherId: ID
  }

  input CreateReviewInput {
    bookId: ID!
    userName: String!
    rating: Int!
    comment: String!
  }

  type Query {
    books(
      title: String
      language: String
      year: Int
      sortBy: BookSortBy
      order: SortOrder
      page: Int
      limit: Int
    ): BooksResponse!

    book(id: ID!): Book

    authors: [Author!]!
    author(id: ID!): Author

    publishers: [Publisher!]!
    publisher(id: ID!): Publisher

    reviews(bookId: ID!): [Review!]!

    languages: [String!]!
    genres: [String!]!
  }

  type Mutation {
    createBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book
    deleteBook(id: ID!): Boolean!

    createReview(input: CreateReviewInput!): Review!
  }

`;