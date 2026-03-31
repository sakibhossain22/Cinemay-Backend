
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
var config;
var init_class = __esm({
  "generated/prisma/internal/class.ts"() {
    "use strict";
    config = {
      "previewFeatures": [],
      "clientVersion": "7.5.0",
      "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
      "activeProvider": "postgresql",
      "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// --- Enums ---\n\nenum ContentType {\n  FREE\n  PREMIUM\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n}\n\nenum Role {\n  USER\n  ADMIN\n}\n\nenum MediaType {\n  MOVIE\n  SERIES\n  ANIMATION\n}\n\nenum PurchaseType {\n  BUY\n  RENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel User {\n  id               String        @id @default(uuid())\n  name             String\n  email            String\n  emailVerified    Boolean       @default(false)\n  image            String?\n  createdAt        DateTime      @default(now())\n  updatedAt        DateTime      @updatedAt\n  role             Role          @default(USER)\n  status           UserStatus?   @default(ACTIVE)\n  phone            String?\n  isPremium        Boolean       @default(false)\n  resetCode        Int? // \u09EC \u09A1\u09BF\u099C\u09BF\u099F\u09C7\u09B0 \u0995\u09CB\u09A1 \u098F\u0996\u09BE\u09A8\u09C7 \u09B8\u09C7\u09AD \u09B9\u09AC\u09C7\n  resetCodeExpires DateTime?\n  sessions         Session[]\n  accounts         Account[]\n  // App specific relations\n  purchases        Purchase[]\n  reviews          Review[]\n  watchlists       Watchlist[]\n  payments         Payment[]\n  likes            Like[]\n  comments         Comment[]\n  viewHistories    ViewHistory[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel ViewHistory {\n  id       String   @id @default(uuid())\n  userId   String\n  mediaId  String\n  viewedAt DateTime @default(now())\n\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n  media Movie @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n}\n\nmodel Purchase {\n  id     String @id @default(uuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  movieId String\n  movie   Movie  @relation(fields: [movieId], references: [id], onDelete: Cascade)\n\n  type   PurchaseType @default(BUY) // BUY \u0985\u09A5\u09AC\u09BE RENT\n  amount Float\n\n  // \u09B0\u09C7\u09A8\u09CD\u099F\u09BE\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u0995\u09CD\u09B8\u09C7\u09B8 \u09AA\u09BF\u09B0\u09BF\u09AF\u09BC\u09A1\n  startsAt  DateTime  @default(now())\n  expiresAt DateTime? // \u09AE\u09C1\u09AD\u09BF \u0995\u09BF\u09A8\u09B2\u09C7 \u098F\u099F\u09BF null \u09B9\u09AC\u09C7, \u09B0\u09C7\u09A8\u09CD\u099F \u0995\u09B0\u09B2\u09C7 \u09A1\u09C7\u099F \u09A5\u09BE\u0995\u09AC\u09C7\n\n  createdAt DateTime @default(now())\n\n  @@map("purchase")\n}\n\nmodel Payment {\n  id            String        @id @default(uuid())\n  amount        Float\n  currency      String        @default("USD")\n  status        PaymentStatus @default(PENDING)\n  transactionId String        @unique\n  clientSecret  String? // Stripe \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09CD\u09B2\u09BE\u09AF\u09BC\u09C7\u09A8\u09CD\u099F \u09B8\u09BF\u0995\u09CD\u09B0\u09C7\u099F\n  method        String? // Stripe, SSLCommerz, etc.\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@map("payment")\n}\n\n// --- Movie Portal Specific Models ---\n\nmodel Movie {\n  id            String        @id @default(uuid())\n  tmdb_id       String\n  title         String\n  customid      String?       @unique\n  type          MediaType     @default(MOVIE) // MOVIE \u0985\u09A5\u09AC\u09BE SERIES\n  synopsis      String        @db.Text\n  posterUrl     String?\n  genre         String[]\n  releaseYear   Int\n  director      String\n  cast          String[]\n  streamingLink String?\n  downloadLink  String?\n  episodeLinks  String[] // \u09B8\u09BF\u09B0\u09BF\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u098F\u09AA\u09BF\u09B8\u09CB\u09A1 \u09B2\u09BF\u0999\u09CD\u0995\u09C7\u09B0 \u0985\u09CD\u09AF\u09BE\u09B0\u09C7\n  contentType   ContentType   @default(FREE)\n  ratingAverage Float         @default(0.0)\n  buyPrice      Float?        @default(0)\n  rentPrice     Float?        @default(0)\n  rentDuration  Int?          @default(48) // \u0995\u09A4 \u0998\u09A3\u09CD\u099F\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09B0\u09C7\u09A8\u09CD\u099F (\u09AF\u09C7\u09AE\u09A8: \u09EA\u09EE \u0998\u09A3\u09CD\u099F\u09BE)\n  // \u09B0\u09BF\u09B2\u09C7\u09B6\u09A8\u09B6\u09BF\u09AA\u09B8\n  reviews       Review[]\n  watchlists    Watchlist[]\n  // \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF \u09AC\u09BE \u0995\u09BE\u09B2\u09C7\u0995\u09B6\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF (\u09AF\u09C7\u09AE\u09A8: Trending, Oscars Winner)\n  categories    Category[]    @relation("MovieCategories")\n  viewHistories ViewHistory[]\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  purchases     Purchase[]\n\n  @@map("movie")\n}\n\n// \u09A8\u09A4\u09C1\u09A8 \u09AE\u09A1\u09C7\u09B2: \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF \u09AC\u09BE \u0995\u09BE\u09B2\u09C7\u0995\u09B6\u09A8 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF\nmodel Category {\n  id          String  @id @default(uuid())\n  name        String  @unique\n  description String?\n  movies      Movie[] @relation("MovieCategories")\n\n  @@map("category")\n}\n\nmodel Review {\n  id         String  @id @default(uuid())\n  rating     Int // 1-10\n  content    String  @db.Text\n  isApproved Boolean @default(false)\n  hasSpoiler Boolean @default(false)\n\n  userId  String\n  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n  movieId String\n  movie   Movie  @relation(fields: [movieId], references: [id], onDelete: Cascade)\n\n  likeCount Int       @default(0) // \u098F\u099F\u09BF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8 \u09B2\u09BE\u0987\u0995 \u098F\u09AC\u0982 \u0986\u09A8\u09B2\u09BE\u0987\u0995 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF\n  likes     Like[]\n  comments  Comment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("review")\n}\n\n// --- \u09B2\u09BE\u0987\u0995 \u098F\u09AC\u0982 \u0995\u09AE\u09C7\u09A8\u09CD\u099F \u09AE\u09A1\u09C7\u09B2 ---\nmodel Like {\n  id        String @id @default(uuid())\n  userId    String\n  reviewId  String\n  likeCount Int    @default(0) // \u09B2\u09BE\u0987\u0995 \u09AC\u09BE \u0986\u09A8\u09B2\u09BE\u0987\u0995 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF\n  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n  review    Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, reviewId])\n}\n\nmodel Comment {\n  id      String @id @default(uuid())\n  content String @db.Text\n\n  // \u09B0\u09BF\u09B2\u09C7\u09B6\u09A8\u09B8\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  reviewId String\n  review   Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n\n  // \u09B0\u09BF\u09AA\u09CD\u09B2\u09BE\u0987 \u09B2\u099C\u09BF\u0995 (Self-Referencing)\n  parentId String? // \u09AF\u09A6\u09BF \u098F\u099F\u09BF \u0995\u09CB\u09A8\u09CB \u0995\u09AE\u09C7\u09A8\u09CD\u099F\u09C7\u09B0 \u09B0\u09BF\u09AA\u09CD\u09B2\u09BE\u0987 \u09B9\u09DF\n  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)\n  replies  Comment[] @relation("CommentReplies")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("comment")\n}\n\nmodel Watchlist {\n  id      String   @id @default(uuid())\n  userId  String\n  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  movieId String\n  movie   Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)\n  addedAt DateTime @default(now())\n\n  @@unique([userId, movieId]) // \u098F\u0995\u0987 \u09AE\u09C1\u09AD\u09BF \u09A6\u09C1\u09AC\u09BE\u09B0 \u0985\u09CD\u09AF\u09BE\u09A1 \u0995\u09B0\u09BE \u09AF\u09BE\u09AC\u09C7 \u09A8\u09BE\n  @@map("watchlist")\n}\n\nmodel Session {\n  id        String   @id @default(uuid())\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id @default(uuid())\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
      "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
      },
      "parameterizationSchema": {
        "strings": [],
        "graph": ""
      }
    };
    config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isPremium","kind":"scalar","type":"Boolean"},{"name":"resetCode","kind":"scalar","type":"Int"},{"name":"resetCodeExpires","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"purchases","kind":"object","type":"Purchase","relationName":"PurchaseToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"watchlists","kind":"object","type":"Watchlist","relationName":"UserToWatchlist"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"likes","kind":"object","type":"Like","relationName":"LikeToUser"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"},{"name":"viewHistories","kind":"object","type":"ViewHistory","relationName":"UserToViewHistory"}],"dbName":"user"},"ViewHistory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"viewedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToViewHistory"},{"name":"media","kind":"object","type":"Movie","relationName":"MovieToViewHistory"}],"dbName":null},"Purchase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PurchaseToUser"},{"name":"movieId","kind":"scalar","type":"String"},{"name":"movie","kind":"object","type":"Movie","relationName":"MovieToPurchase"},{"name":"type","kind":"enum","type":"PurchaseType"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"purchase"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"clientSecret","kind":"scalar","type":"String"},{"name":"method","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"payment"},"Movie":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tmdb_id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"customid","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"MediaType"},{"name":"synopsis","kind":"scalar","type":"String"},{"name":"posterUrl","kind":"scalar","type":"String"},{"name":"genre","kind":"scalar","type":"String"},{"name":"releaseYear","kind":"scalar","type":"Int"},{"name":"director","kind":"scalar","type":"String"},{"name":"cast","kind":"scalar","type":"String"},{"name":"streamingLink","kind":"scalar","type":"String"},{"name":"downloadLink","kind":"scalar","type":"String"},{"name":"episodeLinks","kind":"scalar","type":"String"},{"name":"contentType","kind":"enum","type":"ContentType"},{"name":"ratingAverage","kind":"scalar","type":"Float"},{"name":"buyPrice","kind":"scalar","type":"Float"},{"name":"rentPrice","kind":"scalar","type":"Float"},{"name":"rentDuration","kind":"scalar","type":"Int"},{"name":"reviews","kind":"object","type":"Review","relationName":"MovieToReview"},{"name":"watchlists","kind":"object","type":"Watchlist","relationName":"MovieToWatchlist"},{"name":"categories","kind":"object","type":"Category","relationName":"MovieCategories"},{"name":"viewHistories","kind":"object","type":"ViewHistory","relationName":"MovieToViewHistory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"purchases","kind":"object","type":"Purchase","relationName":"MovieToPurchase"}],"dbName":"movie"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"movies","kind":"object","type":"Movie","relationName":"MovieCategories"}],"dbName":"category"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"content","kind":"scalar","type":"String"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"hasSpoiler","kind":"scalar","type":"Boolean"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"movieId","kind":"scalar","type":"String"},{"name":"movie","kind":"object","type":"Movie","relationName":"MovieToReview"},{"name":"likeCount","kind":"scalar","type":"Int"},{"name":"likes","kind":"object","type":"Like","relationName":"LikeToReview"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"review"},"Like":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"likeCount","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"LikeToUser"},{"name":"review","kind":"object","type":"Review","relationName":"LikeToReview"}],"dbName":null},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CommentToUser"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"review","kind":"object","type":"Review","relationName":"CommentToReview"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"comment"},"Watchlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchlist"},{"name":"movieId","kind":"scalar","type":"String"},{"name":"movie","kind":"object","type":"Movie","relationName":"MovieToWatchlist"},{"name":"addedAt","kind":"scalar","type":"DateTime"}],"dbName":"watchlist"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
    config.parameterizationSchema = {
      strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","movie","review","likes","parent","replies","_count","comments","reviews","watchlists","movies","categories","media","viewHistories","purchases","payments","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_avg","_sum","_min","_max","User.groupBy","User.aggregate","ViewHistory.findUnique","ViewHistory.findUniqueOrThrow","ViewHistory.findFirst","ViewHistory.findFirstOrThrow","ViewHistory.findMany","ViewHistory.createOne","ViewHistory.createMany","ViewHistory.createManyAndReturn","ViewHistory.updateOne","ViewHistory.updateMany","ViewHistory.updateManyAndReturn","ViewHistory.upsertOne","ViewHistory.deleteOne","ViewHistory.deleteMany","ViewHistory.groupBy","ViewHistory.aggregate","Purchase.findUnique","Purchase.findUniqueOrThrow","Purchase.findFirst","Purchase.findFirstOrThrow","Purchase.findMany","Purchase.createOne","Purchase.createMany","Purchase.createManyAndReturn","Purchase.updateOne","Purchase.updateMany","Purchase.updateManyAndReturn","Purchase.upsertOne","Purchase.deleteOne","Purchase.deleteMany","Purchase.groupBy","Purchase.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Movie.findUnique","Movie.findUniqueOrThrow","Movie.findFirst","Movie.findFirstOrThrow","Movie.findMany","Movie.createOne","Movie.createMany","Movie.createManyAndReturn","Movie.updateOne","Movie.updateMany","Movie.updateManyAndReturn","Movie.upsertOne","Movie.deleteOne","Movie.deleteMany","Movie.groupBy","Movie.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Like.findUnique","Like.findUniqueOrThrow","Like.findFirst","Like.findFirstOrThrow","Like.findMany","Like.createOne","Like.createMany","Like.createManyAndReturn","Like.updateOne","Like.updateMany","Like.updateManyAndReturn","Like.upsertOne","Like.deleteOne","Like.deleteMany","Like.groupBy","Like.aggregate","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","Comment.groupBy","Comment.aggregate","Watchlist.findUnique","Watchlist.findUniqueOrThrow","Watchlist.findFirst","Watchlist.findFirstOrThrow","Watchlist.findMany","Watchlist.createOne","Watchlist.createMany","Watchlist.createManyAndReturn","Watchlist.updateOne","Watchlist.updateMany","Watchlist.updateManyAndReturn","Watchlist.upsertOne","Watchlist.deleteOne","Watchlist.deleteMany","Watchlist.groupBy","Watchlist.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","AND","OR","NOT","id","identifier","value","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","movieId","addedAt","content","reviewId","parentId","likeCount","rating","isApproved","hasSpoiler","name","description","tmdb_id","title","customid","MediaType","type","synopsis","posterUrl","genre","releaseYear","director","cast","streamingLink","downloadLink","episodeLinks","ContentType","contentType","ratingAverage","buyPrice","rentPrice","rentDuration","has","hasEvery","hasSome","amount","currency","PaymentStatus","status","transactionId","clientSecret","method","PurchaseType","startsAt","mediaId","viewedAt","email","emailVerified","image","Role","role","UserStatus","phone","isPremium","resetCode","resetCodeExpires","every","some","none","userId_mediaId","userId_movieId","userId_reviewId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
      graph: "kgd60AEZBAAAsgMAIAUAALMDACAIAAC4AwAgDAAAuQMAIA0AALUDACAOAAC2AwAgEgAAugMAIBMAALQDACAUAAC3AwAg7QEAAKsDADDuAQAASgAQ7wEAAKsDADDwAQEAAAAB9AFAAPcCACH1AUAA9wIAIZcCAQD2AgAhswIAAK8DwQIjuwIBAAAAAbwCIACsAwAhvQIBAK0DACG_AgAArgO_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_AgAArgO_AiLBAgEArQMAIcICIACsAwAhwwICALADACHEAkAAsQMAIQ4EAACkBgAgBQAApQYAIAgAAKoGACAMAACrBgAgDQAApwYAIA4AAKgGACASAACsBgAgEwAApgYAIBQAAKkGACCzAgAA2wMAIL0CAADbAwAgwQIAANsDACDDAgAA2wMAIMQCAADbAwAgAwAAAEoAIAEAAEsAMAIAAAEAIAMAAABKACABAABLADACAAABACADAAAASgAgAQAASwAwAgAAAQAgFgQAAJsGACAFAACcBgAgCAAAoQYAIAwAAKIGACANAACeBgAgDgAAnwYAIBIAAKMGACATAACdBgAgFAAAoAYAIPABAQAAAAH0AUAAAAAB9QFAAAAAAZcCAQAAAAGzAgAAAMECA7sCAQAAAAG8AiAAAAABvQIBAAAAAb8CAAAAvwICwQIBAAAAAcICIAAAAAHDAgIAAAABxAJAAAAAAQEaAABPACAN8AEBAAAAAfQBQAAAAAH1AUAAAAABlwIBAAAAAbMCAAAAwQIDuwIBAAAAAbwCIAAAAAG9AgEAAAABvwIAAAC_AgLBAgEAAAABwgIgAAAAAcMCAgAAAAHEAkAAAAABARoAAFEAMAEaAABRADAWBAAAuAUAIAUAALkFACAIAAC-BQAgDAAAvwUAIA0AALsFACAOAAC8BQAgEgAAwAUAIBMAALoFACAUAAC9BQAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhlwIBANkDACGzAgAAtwXBAiO7AgEA2QMAIbwCIACVBAAhvQIBAN8DACG_AgAAtgW_AiLBAgEA3wMAIcICIACVBAAhwwICAMcEACHEAkAA4AMAIQIAAAABACAaAABUACAN8AEBANkDACH0AUAA2gMAIfUBQADaAwAhlwIBANkDACGzAgAAtwXBAiO7AgEA2QMAIbwCIACVBAAhvQIBAN8DACG_AgAAtgW_AiLBAgEA3wMAIcICIACVBAAhwwICAMcEACHEAkAA4AMAIQIAAABKACAaAABWACACAAAASgAgGgAAVgAgAwAAAAEAICEAAE8AICIAAFQAIAEAAAABACABAAAASgAgCgsAALEFACAnAACyBQAgKAAAtQUAICkAALQFACAqAACzBQAgswIAANsDACC9AgAA2wMAIMECAADbAwAgwwIAANsDACDEAgAA2wMAIBDtAQAApAMAMO4BAABdABDvAQAApAMAMPABAQDuAgAh9AFAAO8CACH1AUAA7wIAIZcCAQDuAgAhswIAAKYDwQIjuwIBAO4CACG8AiAAiAMAIb0CAQD5AgAhvwIAAKUDvwIiwQIBAPkCACHCAiAAiAMAIcMCAgCSAwAhxAJAAPoCACEDAAAASgAgAQAAXAAwJgAAXQAgAwAAAEoAIAEAAEsAMAIAAAEAIAEAAAAvACABAAAALwAgAwAAAC0AIAEAAC4AMAIAAC8AIAMAAAAtACABAAAuADACAAAvACADAAAALQAgAQAALgAwAgAALwAgBgMAAOkEACARAACwBQAg8AEBAAAAAYMCAQAAAAG5AgEAAAABugJAAAAAAQEaAABlACAE8AEBAAAAAYMCAQAAAAG5AgEAAAABugJAAAAAAQEaAABnADABGgAAZwAwBgMAAOcEACARAACvBQAg8AEBANkDACGDAgEA2QMAIbkCAQDZAwAhugJAANoDACECAAAALwAgGgAAagAgBPABAQDZAwAhgwIBANkDACG5AgEA2QMAIboCQADaAwAhAgAAAC0AIBoAAGwAIAIAAAAtACAaAABsACADAAAALwAgIQAAZQAgIgAAagAgAQAAAC8AIAEAAAAtACADCwAArAUAICkAAK4FACAqAACtBQAgB-0BAACjAwAw7gEAAHMAEO8BAACjAwAw8AEBAO4CACGDAgEA7gIAIbkCAQDuAgAhugJAAO8CACEDAAAALQAgAQAAcgAwJgAAcwAgAwAAAC0AIAEAAC4AMAIAAC8AIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgCgMAANsEACAGAACrBQAg8AEBAAAAAfMBQAAAAAH0AUAAAAABgwIBAAAAAY4CAQAAAAGdAgAAALgCArACCAAAAAG4AkAAAAABARoAAHsAIAjwAQEAAAAB8wFAAAAAAfQBQAAAAAGDAgEAAAABjgIBAAAAAZ0CAAAAuAICsAIIAAAAAbgCQAAAAAEBGgAAfQAwARoAAH0AMAoDAADZBAAgBgAAqgUAIPABAQDZAwAh8wFAAOADACH0AUAA2gMAIYMCAQDZAwAhjgIBANkDACGdAgAA1wS4AiKwAggAxQQAIbgCQADaAwAhAgAAAA0AIBoAAIABACAI8AEBANkDACHzAUAA4AMAIfQBQADaAwAhgwIBANkDACGOAgEA2QMAIZ0CAADXBLgCIrACCADFBAAhuAJAANoDACECAAAACwAgGgAAggEAIAIAAAALACAaAACCAQAgAwAAAA0AICEAAHsAICIAAIABACABAAAADQAgAQAAAAsAIAYLAAClBQAgJwAApgUAICgAAKkFACApAACoBQAgKgAApwUAIPMBAADbAwAgC-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gAArgEAIAMAAAAqACAhAACnAQAgIgAArAEAIAEAAAAqACABAAAAKAAgDAsAAIsFACAnAACMBQAgKAAAjwUAICkAAI4FACAqAACNBQAgmwIAANsDACCfAgAA2wMAIKQCAADbAwAgpQIAANsDACCqAgAA2wMAIKsCAADbAwAgrAIAANsDACAY7QEAAIwDADDuAQAAtQEAEO8BAACMAwAw8AEBAO4CACH0AUAA7wIAIfUBQADvAgAhmQIBAO4CACGaAgEA7gIAIZsCAQD5AgAhnQIAAI0DnQIingIBAO4CACGfAgEA-QIAIaACAACOAwAgoQICAIQDACGiAgEA7gIAIaMCAACOAwAgpAIBAPkCACGlAgEA-QIAIaYCAACOAwAgqAIAAI8DqAIiqQIIAJADACGqAggAkQMAIasCCACRAwAhrAICAJIDACEDAAAAKAAgAQAAtAEAMCYAALUBACADAAAAKAAgAQAAKQAwAgAAKgAgAQAAACYAIAEAAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgAwAAACQAIAEAACUAMAIAACYAIAMAAAAkACABAAAlADACAAAmACAEDwAAigUAIPABAQAAAAGXAgEAAAABmAIBAAAAAQEaAAC9AQAgA_ABAQAAAAGXAgEAAAABmAIBAAAAAQEaAAC_AQAwARoAAL8BADAEDwAAtgQAIPABAQDZAwAhlwIBANkDACGYAgEA3wMAIQIAAAAmACAaAADCAQAgA_ABAQDZAwAhlwIBANkDACGYAgEA3wMAIQIAAAAkACAaAADEAQAgAgAAACQAIBoAAMQBACADAAAAJgAgIQAAvQEAICIAAMIBACABAAAAJgAgAQAAACQAIAQLAACzBAAgKQAAtQQAICoAALQEACCYAgAA2wMAIAbtAQAAiwMAMO4BAADLAQAQ7wEAAIsDADDwAQEA7gIAIZcCAQDuAgAhmAIBAPkCACEDAAAAJAAgAQAAygEAMCYAAMsBACADAAAAJAAgAQAAJQAwAgAAJgAgAQAAABEAIAEAAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAMAAAAPACABAAAQADACAAARACAOAwAArwQAIAYAALAEACAIAACxBAAgDAAAsgQAIPABAQAAAAH0AUAAAAAB9QFAAAAAAYMCAQAAAAGOAgEAAAABkAIBAAAAAZMCAgAAAAGUAgIAAAABlQIgAAAAAZYCIAAAAAEBGgAA0wEAIArwAQEAAAAB9AFAAAAAAfUBQAAAAAGDAgEAAAABjgIBAAAAAZACAQAAAAGTAgIAAAABlAICAAAAAZUCIAAAAAGWAiAAAAABARoAANUBADABGgAA1QEAMA4DAACWBAAgBgAAlwQAIAgAAJgEACAMAACZBAAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhgwIBANkDACGOAgEA2QMAIZACAQDZAwAhkwICAIsEACGUAgIAiwQAIZUCIACVBAAhlgIgAJUEACECAAAAEQAgGgAA2AEAIArwAQEA2QMAIfQBQADaAwAh9QFAANoDACGDAgEA2QMAIY4CAQDZAwAhkAIBANkDACGTAgIAiwQAIZQCAgCLBAAhlQIgAJUEACGWAiAAlQQAIQIAAAAPACAaAADaAQAgAgAAAA8AIBoAANoBACADAAAAEQAgIQAA0wEAICIAANgBACABAAAAEQAgAQAAAA8AIAULAACQBAAgJwAAkQQAICgAAJQEACApAACTBAAgKgAAkgQAIA3tAQAAhwMAMO4BAADhAQAQ7wEAAIcDADDwAQEA7gIAIfQBQADvAgAh9QFAAO8CACGDAgEA7gIAIY4CAQDuAgAhkAIBAO4CACGTAgIAhAMAIZQCAgCEAwAhlQIgAIgDACGWAiAAiAMAIQMAAAAPACABAADgAQAwJgAA4QEAIAMAAAAPACABAAAQADACAAARACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAYDAACOBAAgBwAAjwQAIPABAQAAAAGDAgEAAAABkQIBAAAAAZMCAgAAAAEBGgAA6QEAIATwAQEAAAABgwIBAAAAAZECAQAAAAGTAgIAAAABARoAAOsBADABGgAA6wEAMAYDAACMBAAgBwAAjQQAIPABAQDZAwAhgwIBANkDACGRAgEA2QMAIZMCAgCLBAAhAgAAABUAIBoAAO4BACAE8AEBANkDACGDAgEA2QMAIZECAQDZAwAhkwICAIsEACECAAAAEwAgGgAA8AEAIAIAAAATACAaAADwAQAgAwAAABUAICEAAOkBACAiAADuAQAgAQAAABUAIAEAAAATACAFCwAAhgQAICcAAIcEACAoAACKBAAgKQAAiQQAICoAAIgEACAH7QEAAIMDADDuAQAA9wEAEO8BAACDAwAw8AEBAO4CACGDAgEA7gIAIZECAQDuAgAhkwICAIQDACEDAAAAEwAgAQAA9gEAMCYAAPcBACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABkAIAEAAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACALAwAAggQAIAcAAIMEACAJAACFBAAgCgAAhAQAIPABAQAAAAH0AUAAAAAB9QFAAAAAAYMCAQAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAEBGgAA_wEAIAfwAQEAAAAB9AFAAAAAAfUBQAAAAAGDAgEAAAABkAIBAAAAAZECAQAAAAGSAgEAAAABARoAAIECADABGgAAgQIAMAEAAAAXACALAwAA8gMAIAcAAPMDACAJAAD0AwAgCgAA9QMAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIYMCAQDZAwAhkAIBANkDACGRAgEA2QMAIZICAQDfAwAhAgAAABkAIBoAAIUCACAH8AEBANkDACH0AUAA2gMAIfUBQADaAwAhgwIBANkDACGQAgEA2QMAIZECAQDZAwAhkgIBAN8DACECAAAAFwAgGgAAhwIAIAIAAAAXACAaAACHAgAgAQAAABcAIAMAAAAZACAhAAD_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-QIAIYUCAQD5AgAhhgIBAPkCACGHAkAA-gIAIYgCQAD6AgAhiQIBAPkCACGKAgEA-QIAIQMAAAAHACABAADQAgAwJgAA0QIAIAMAAAAHACABAAAIADACAAAJACAJ7QEAAPUCADDuAQAA1wIAEO8BAAD1AgAw8AEBAAAAAfEBAQD2AgAh8gEBAPYCACHzAUAA9wIAIfQBQAD3AgAh9QFAAPcCACEBAAAA1AIAIAEAAADUAgAgCe0BAAD1AgAw7gEAANcCABDvAQAA9QIAMPABAQD2AgAh8QEBAPYCACHyAQEA9gIAIfMBQAD3AgAh9AFAAPcCACH1AUAA9wIAIQADAAAA1wIAIAEAANgCADACAADUAgAgAwAAANcCACABAADYAgAwAgAA1AIAIAMAAADXAgAgAQAA2AIAMAIAANQCACAG8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABARoAANwCACAG8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABARoAAN4CADABGgAA3gIAMAbwAQEA2QMAIfEBAQDZAwAh8gEBANkDACHzAUAA2gMAIfQBQADaAwAh9QFAANoDACECAAAA1AIAIBoAAOECACAG8AEBANkDACHxAQEA2QMAIfIBAQDZAwAh8wFAANoDACH0AUAA2gMAIfUBQADaAwAhAgAAANcCACAaAADjAgAgAgAAANcCACAaAADjAgAgAwAAANQCACAhAADcAgAgIgAA4QIAIAEAAADUAgAgAQAAANcCACADCwAA1gMAICkAANgDACAqAADXAwAgCe0BAADtAgAw7gEAAOoCABDvAQAA7QIAMPABAQDuAgAh8QEBAO4CACHyAQEA7gIAIfMBQADvAgAh9AFAAO8CACH1AUAA7wIAIQMAAADXAgAgAQAA6QIAMCYAAOoCACADAAAA1wIAIAEAANgCADACAADUAgAgCe0BAADtAgAw7gEAAOoCABDvAQAA7QIAMPABAQDuAgAh8QEBAO4CACHyAQEA7gIAIfMBQADvAgAh9AFAAO8CACH1AUAA7wIAIQ4LAADxAgAgKQAA9AIAICoAAPQCACD2AQEAAAAB9wEBAAAABPgBAQAAAAT5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAPMCACH-AQEAAAAB_wEBAAAAAYACAQAAAAELCwAA8QIAICkAAPICACAqAADyAgAg9gFAAAAAAfcBQAAAAAT4AUAAAAAE-QFAAAAAAfoBQAAAAAH7AUAAAAAB_AFAAAAAAf0BQADwAgAhCwsAAPECACApAADyAgAgKgAA8gIAIPYBQAAAAAH3AUAAAAAE-AFAAAAABPkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQAAAAAH9AUAA8AIAIQj2AQIAAAAB9wECAAAABPgBAgAAAAT5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAAAAB_QECAPECACEI9gFAAAAAAfcBQAAAAAT4AUAAAAAE-QFAAAAAAfoBQAAAAAH7AUAAAAAB_AFAAAAAAf0BQADyAgAhDgsAAPECACApAAD0AgAgKgAA9AIAIPYBAQAAAAH3AQEAAAAE-AEBAAAABPkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEA8wIAIf4BAQAAAAH_AQEAAAABgAIBAAAAAQv2AQEAAAAB9wEBAAAABPgBAQAAAAT5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAPQCACH-AQEAAAAB_wEBAAAAAYACAQAAAAEJ7QEAAPUCADDuAQAA1wIAEO8BAAD1AgAw8AEBAPYCACHxAQEA9gIAIfIBAQD2AgAh8wFAAPcCACH0AUAA9wIAIfUBQAD3AgAhC_YBAQAAAAH3AQEAAAAE-AEBAAAABPkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEA9AIAIf4BAQAAAAH_AQEAAAABgAIBAAAAAQj2AUAAAAAB9wFAAAAABPgBQAAAAAT5AUAAAAAB-gFAAAAAAfsBQAAAAAH8AUAAAAAB_QFAAPICACEQ7QEAAPgCADDuAQAA0QIAEO8BAAD4AgAw8AEBAO4CACH0AUAA7wIAIfUBQADvAgAhgQIBAO4CACGCAgEA7gIAIYMCAQDuAgAhhAIBAPkCACGFAgEA-QIAIYYCAQD5AgAhhwJAAPoCACGIAkAA-gIAIYkCAQD5AgAhigIBAPkCACEOCwAA_AIAICkAAP8CACAqAAD_AgAg9gEBAAAAAfcBAQAAAAX4AQEAAAAF-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQD-AgAh_gEBAAAAAf8BAQAAAAGAAgEAAAABCwsAAPwCACApAAD9AgAgKgAA_QIAIPYBQAAAAAH3AUAAAAAF-AFAAAAABfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQAAAAAH9AUAA-wIAIQsLAAD8AgAgKQAA_QIAICoAAP0CACD2AUAAAAAB9wFAAAAABfgBQAAAAAX5AUAAAAAB-gFAAAAAAfsBQAAAAAH8AUAAAAAB_QFAAPsCACEI9gECAAAAAfcBAgAAAAX4AQIAAAAF-QECAAAAAfoBAgAAAAH7AQIAAAAB_AECAAAAAf0BAgD8AgAhCPYBQAAAAAH3AUAAAAAF-AFAAAAABfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQAAAAAH9AUAA_QIAIQ4LAAD8AgAgKQAA_wIAICoAAP8CACD2AQEAAAAB9wEBAAAABfgBAQAAAAX5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAP4CACH-AQEAAAAB_wEBAAAAAYACAQAAAAEL9gEBAAAAAfcBAQAAAAX4AQEAAAAF-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQD_AgAh_gEBAAAAAf8BAQAAAAGAAgEAAAABC-0BAACAAwAw7gEAALsCABDvAQAAgAMAMPABAQDuAgAh8wFAAO8CACH0AUAA7wIAIfUBQADvAgAhgwIBAO4CACGLAgEA7gIAIYwCAQD5AgAhjQIBAPkCACEH7QEAAIEDADDuAQAApQIAEO8BAACBAwAw8AEBAO4CACGDAgEA7gIAIY4CAQDuAgAhjwJAAO8CACEK7QEAAIIDADDuAQAAjwIAEO8BAACCAwAw8AEBAO4CACH0AUAA7wIAIfUBQADvAgAhgwIBAO4CACGQAgEA7gIAIZECAQDuAgAhkgIBAPkCACEH7QEAAIMDADDuAQAA9wEAEO8BAACDAwAw8AEBAO4CACGDAgEA7gIAIZECAQDuAgAhkwICAIQDACENCwAA8QIAICcAAIYDACAoAADxAgAgKQAA8QIAICoAAPECACD2AQIAAAAB9wECAAAABPgBAgAAAAT5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAAAAB_QECAIUDACENCwAA8QIAICcAAIYDACAoAADxAgAgKQAA8QIAICoAAPECACD2AQIAAAAB9wECAAAABPgBAgAAAAT5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAAAAB_QECAIUDACEI9gEIAAAAAfcBCAAAAAT4AQgAAAAE-QEIAAAAAfoBCAAAAAH7AQgAAAAB_AEIAAAAAf0BCACGAwAhDe0BAACHAwAw7gEAAOEBABDvAQAAhwMAMPABAQDuAgAh9AFAAO8CACH1AUAA7wIAIYMCAQDuAgAhjgIBAO4CACGQAgEA7gIAIZMCAgCEAwAhlAICAIQDACGVAiAAiAMAIZYCIACIAwAhBQsAAPECACApAACKAwAgKgAAigMAIPYBIAAAAAH9ASAAiQMAIQULAADxAgAgKQAAigMAICoAAIoDACD2ASAAAAAB_QEgAIkDACEC9gEgAAAAAf0BIACKAwAhBu0BAACLAwAw7gEAAMsBABDvAQAAiwMAMPABAQDuAgAhlwIBAO4CACGYAgEA-QIAIRjtAQAAjAMAMO4BAAC1AQAQ7wEAAIwDADDwAQEA7gIAIfQBQADvAgAh9QFAAO8CACGZAgEA7gIAIZoCAQDuAgAhmwIBAPkCACGdAgAAjQOdAiKeAgEA7gIAIZ8CAQD5AgAhoAIAAI4DACChAgIAhAMAIaICAQDuAgAhowIAAI4DACCkAgEA-QIAIaUCAQD5AgAhpgIAAI4DACCoAgAAjwOoAiKpAggAkAMAIaoCCACRAwAhqwIIAJEDACGsAgIAkgMAIQcLAADxAgAgKQAAmgMAICoAAJoDACD2AQAAAJ0CAvcBAAAAnQII-AEAAACdAgj9AQAAmQOdAiIE9gEBAAAABa0CAQAAAAGuAgEAAAAErwIBAAAABAcLAADxAgAgKQAAmAMAICoAAJgDACD2AQAAAKgCAvcBAAAAqAII-AEAAACoAgj9AQAAlwOoAiINCwAA8QIAICcAAIYDACAoAACGAwAgKQAAhgMAICoAAIYDACD2AQgAAAAB9wEIAAAABPgBCAAAAAT5AQgAAAAB-gEIAAAAAfsBCAAAAAH8AQgAAAAB_QEIAJYDACENCwAA_AIAICcAAJQDACAoAACUAwAgKQAAlAMAICoAAJQDACD2AQgAAAAB9wEIAAAABfgBCAAAAAX5AQgAAAAB-gEIAAAAAfsBCAAAAAH8AQgAAAAB_QEIAJUDACENCwAA_AIAICcAAJQDACAoAAD8AgAgKQAA_AIAICoAAPwCACD2AQIAAAAB9wECAAAABfgBAgAAAAX5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAAAAB_QECAJMDACENCwAA_AIAICcAAJQDACAoAAD8AgAgKQAA_AIAICoAAPwCACD2AQIAAAAB9wECAAAABfgBAgAAAAX5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAAAAB_QECAJMDACEI9gEIAAAAAfcBCAAAAAX4AQgAAAAF-QEIAAAAAfoBCAAAAAH7AQgAAAAB_AEIAAAAAf0BCACUAwAhDQsAAPwCACAnAACUAwAgKAAAlAMAICkAAJQDACAqAACUAwAg9gEIAAAAAfcBCAAAAAX4AQgAAAAF-QEIAAAAAfoBCAAAAAH7AQgAAAAB_AEIAAAAAf0BCACVAwAhDQsAAPECACAnAACGAwAgKAAAhgMAICkAAIYDACAqAACGAwAg9gEIAAAAAfcBCAAAAAT4AQgAAAAE-QEIAAAAAfoBCAAAAAH7AQgAAAAB_AEIAAAAAf0BCACWAwAhBwsAAPECACApAACYAwAgKgAAmAMAIPYBAAAAqAIC9wEAAACoAgj4AQAAAKgCCP0BAACXA6gCIgT2AQAAAKgCAvcBAAAAqAII-AEAAACoAgj9AQAAmAOoAiIHCwAA8QIAICkAAJoDACAqAACaAwAg9gEAAACdAgL3AQAAAJ0CCPgBAAAAnQII_QEAAJkDnQIiBPYBAAAAnQIC9wEAAACdAgj4AQAAAJ0CCP0BAACaA50CIgztAQAAmwMAMO4BAACfAQAQ7wEAAJsDADDwAQEA7gIAIfQBQADvAgAhgwIBAO4CACGwAggAkAMAIbECAQDuAgAhswIAAJwDswIitAIBAO4CACG1AgEA-QIAIbYCAQD5AgAhBwsAAPECACApAACeAwAgKgAAngMAIPYBAAAAswIC9wEAAACzAgj4AQAAALMCCP0BAACdA7MCIgcLAADxAgAgKQAAngMAICoAAJ4DACD2AQAAALMCAvcBAAAAswII-AEAAACzAgj9AQAAnQOzAiIE9gEAAACzAgL3AQAAALMCCPgBAAAAswII_QEAAJ4DswIiC-0BAACfAwAw7gEAAIkBABDvAQAAnwMAMPABAQDuAgAh8wFAAPoCACH0AUAA7wIAIYMCAQDuAgAhjgIBAO4CACGdAgAAoAO4AiKwAggAkAMAIbgCQADvAgAhBwsAAPECACApAACiAwAgKgAAogMAIPYBAAAAuAIC9wEAAAC4Agj4AQAAALgCCP0BAAChA7gCIgcLAADxAgAgKQAAogMAICoAAKIDACD2AQAAALgCAvcBAAAAuAII-AEAAAC4Agj9AQAAoQO4AiIE9gEAAAC4AgL3AQAAALgCCPgBAAAAuAII_QEAAKIDuAIiB-0BAACjAwAw7gEAAHMAEO8BAACjAwAw8AEBAO4CACGDAgEA7gIAIbkCAQDuAgAhugJAAO8CACEQ7QEAAKQDADDuAQAAXQAQ7wEAAKQDADDwAQEA7gIAIfQBQADvAgAh9QFAAO8CACGXAgEA7gIAIbMCAACmA8ECI7sCAQDuAgAhvAIgAIgDACG9AgEA-QIAIb8CAAClA78CIsECAQD5AgAhwgIgAIgDACHDAgIAkgMAIcQCQAD6AgAhBwsAAPECACApAACqAwAgKgAAqgMAIPYBAAAAvwIC9wEAAAC_Agj4AQAAAL8CCP0BAACpA78CIgcLAAD8AgAgKQAAqAMAICoAAKgDACD2AQAAAMECA_cBAAAAwQIJ-AEAAADBAgn9AQAApwPBAiMHCwAA_AIAICkAAKgDACAqAACoAwAg9gEAAADBAgP3AQAAAMECCfgBAAAAwQIJ_QEAAKcDwQIjBPYBAAAAwQID9wEAAADBAgn4AQAAAMECCf0BAACoA8ECIwcLAADxAgAgKQAAqgMAICoAAKoDACD2AQAAAL8CAvcBAAAAvwII-AEAAAC_Agj9AQAAqQO_AiIE9gEAAAC_AgL3AQAAAL8CCPgBAAAAvwII_QEAAKoDvwIiGQQAALIDACAFAACzAwAgCAAAuAMAIAwAALkDACANAAC1AwAgDgAAtgMAIBIAALoDACATAAC0AwAgFAAAtwMAIO0BAACrAwAw7gEAAEoAEO8BAACrAwAw8AEBAPYCACH0AUAA9wIAIfUBQAD3AgAhlwIBAPYCACGzAgAArwPBAiO7AgEA9gIAIbwCIACsAwAhvQIBAK0DACG_AgAArgO_AiLBAgEArQMAIcICIACsAwAhwwICALADACHEAkAAsQMAIQL2ASAAAAAB_QEgAIoDACEL9gEBAAAAAfcBAQAAAAX4AQEAAAAF-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQD_AgAh_gEBAAAAAf8BAQAAAAGAAgEAAAABBPYBAAAAvwIC9wEAAAC_Agj4AQAAAL8CCP0BAACqA78CIgT2AQAAAMECA_cBAAAAwQIJ-AEAAADBAgn9AQAAqAPBAiMI9gECAAAAAfcBAgAAAAX4AQIAAAAF-QECAAAAAfoBAgAAAAH7AQIAAAAB_AECAAAAAf0BAgD8AgAhCPYBQAAAAAH3AUAAAAAF-AFAAAAABfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQAAAAAH9AUAA_QIAIQPFAgAAAwAgxgIAAAMAIMcCAAADACADxQIAAAcAIMYCAAAHACDHAgAABwAgA8UCAAALACDGAgAACwAgxwIAAAsAIAPFAgAADwAgxgIAAA8AIMcCAAAPACADxQIAACAAIMYCAAAgACDHAgAAIAAgA8UCAAA5ACDGAgAAOQAgxwIAADkAIAPFAgAAEwAgxgIAABMAIMcCAAATACADxQIAABcAIMYCAAAXACDHAgAAFwAgA8UCAAAtACDGAgAALQAgxwIAAC0AIA0DAAC-AwAg7QEAALsDADDuAQAAOQAQ7wEAALsDADDwAQEA9gIAIfQBQAD3AgAhgwIBAPYCACGwAggAvAMAIbECAQD2AgAhswIAAL0DswIitAIBAPYCACG1AgEArQMAIbYCAQCtAwAhCPYBCAAAAAH3AQgAAAAE-AEIAAAABPkBCAAAAAH6AQgAAAAB-wEIAAAAAfwBCAAAAAH9AQgAhgMAIQT2AQAAALMCAvcBAAAAswII-AEAAACzAgj9AQAAngOzAiIbBAAAsgMAIAUAALMDACAIAAC4AwAgDAAAuQMAIA0AALUDACAOAAC2AwAgEgAAugMAIBMAALQDACAUAAC3AwAg7QEAAKsDADDuAQAASgAQ7wEAAKsDADDwAQEA9gIAIfQBQAD3AgAh9QFAAPcCACGXAgEA9gIAIbMCAACvA8ECI7sCAQD2AgAhvAIgAKwDACG9AgEArQMAIb8CAACuA78CIsECAQCtAwAhwgIgAKwDACHDAgIAsAMAIcQCQACxAwAhywIAAEoAIMwCAABKACACgwIBAAAAAbkCAQAAAAEJAwAAvgMAIBEAAMEDACDtAQAAwAMAMO4BAAAtABDvAQAAwAMAMPABAQD2AgAhgwIBAPYCACG5AgEA9gIAIboCQAD3AgAhHw0AALUDACAOAAC2AwAgEAAAxwMAIBIAALoDACATAAC0AwAg7QEAAMIDADDuAQAAKAAQ7wEAAMIDADDwAQEA9gIAIfQBQAD3AgAh9QFAAPcCACGZAgEA9gIAIZoCAQD2AgAhmwIBAK0DACGdAgAAwwOdAiKeAgEA9gIAIZ8CAQCtAwAhoAIAAI4DACChAgIAxAMAIaICAQD2AgAhowIAAI4DACCkAgEArQMAIaUCAQCtAwAhpgIAAI4DACCoAgAAxQOoAiKpAggAvAMAIaoCCADGAwAhqwIIAMYDACGsAgIAsAMAIcsCAAAoACDMAgAAKAAgHQ0AALUDACAOAAC2AwAgEAAAxwMAIBIAALoDACATAAC0AwAg7QEAAMIDADDuAQAAKAAQ7wEAAMIDADDwAQEA9gIAIfQBQAD3AgAh9QFAAPcCACGZAgEA9gIAIZoCAQD2AgAhmwIBAK0DACGdAgAAwwOdAiKeAgEA9gIAIZ8CAQCtAwAhoAIAAI4DACChAgIAxAMAIaICAQD2AgAhowIAAI4DACCkAgEArQMAIaUCAQCtAwAhpgIAAI4DACCoAgAAxQOoAiKpAggAvAMAIaoCCADGAwAhqwIIAMYDACGsAgIAsAMAIQT2AQAAAJ0CAvcBAAAAnQII-AEAAACdAgj9AQAAmgOdAiII9gECAAAAAfcBAgAAAAT4AQIAAAAE-QECAAAAAfoBAgAAAAH7AQIAAAAB_AECAAAAAf0BAgDxAgAhBPYBAAAAqAIC9wEAAACoAgj4AQAAAKgCCP0BAACYA6gCIgj2AQgAAAAB9wEIAAAABfgBCAAAAAX5AQgAAAAB-gEIAAAAAfsBCAAAAAH8AQgAAAAB_QEIAJQDACEDxQIAACQAIMYCAAAkACDHAgAAJAAgBw8AAMkDACDtAQAAyAMAMO4BAAAkABDvAQAAyAMAMPABAQD2AgAhlwIBAPYCACGYAgEArQMAIQPFAgAAKAAgxgIAACgAIMcCAAAoACACgwIBAAAAAY4CAQAAAAEJAwAAvgMAIAYAAMEDACDtAQAAywMAMO4BAAAgABDvAQAAywMAMPABAQD2AgAhgwIBAPYCACGOAgEA9gIAIY8CQAD3AgAhDgMAAL4DACAHAADNAwAgCQAAzgMAIAoAALkDACDtAQAAzAMAMO4BAAAXABDvAQAAzAMAMPABAQD2AgAh9AFAAPcCACH1AUAA9wIAIYMCAQD2AgAhkAIBAPYCACGRAgEA9gIAIZICAQCtAwAhEwMAAL4DACAGAADBAwAgCAAAuAMAIAwAALkDACDtAQAA0QMAMO4BAAAPABDvAQAA0QMAMPABAQD2AgAh9AFAAPcCACH1AUAA9wIAIYMCAQD2AgAhjgIBAPYCACGQAgEA9gIAIZMCAgDEAwAhlAICAMQDACGVAiAArAMAIZYCIACsAwAhywIAAA8AIMwCAAAPACAQAwAAvgMAIAcAAM0DACAJAADOAwAgCgAAuQMAIO0BAADMAwAw7gEAABcAEO8BAADMAwAw8AEBAPYCACH0AUAA9wIAIfUBQAD3AgAhgwIBAPYCACGQAgEA9gIAIZECAQD2AgAhkgIBAK0DACHLAgAAFwAgzAIAABcAIAKDAgEAAAABkQIBAAAAAQkDAAC-AwAgBwAAzQMAIO0BAADQAwAw7gEAABMAEO8BAADQAwAw8AEBAPYCACGDAgEA9gIAIZECAQD2AgAhkwICAMQDACERAwAAvgMAIAYAAMEDACAIAAC4AwAgDAAAuQMAIO0BAADRAwAw7gEAAA8AEO8BAADRAwAw8AEBAPYCACH0AUAA9wIAIfUBQAD3AgAhgwIBAPYCACGOAgEA9gIAIZACAQD2AgAhkwICAMQDACGUAgIAxAMAIZUCIACsAwAhlgIgAKwDACENAwAAvgMAIAYAAMEDACDtAQAA0gMAMO4BAAALABDvAQAA0gMAMPABAQD2AgAh8wFAALEDACH0AUAA9wIAIYMCAQD2AgAhjgIBAPYCACGdAgAA0wO4AiKwAggAvAMAIbgCQAD3AgAhBPYBAAAAuAIC9wEAAAC4Agj4AQAAALgCCP0BAACiA7gCIhEDAAC-AwAg7QEAANQDADDuAQAABwAQ7wEAANQDADDwAQEA9gIAIfQBQAD3AgAh9QFAAPcCACGBAgEA9gIAIYICAQD2AgAhgwIBAPYCACGEAgEArQMAIYUCAQCtAwAhhgIBAK0DACGHAkAAsQMAIYgCQACxAwAhiQIBAK0DACGKAgEArQMAIQwDAAC-AwAg7QEAANUDADDuAQAAAwAQ7wEAANUDADDwAQEA9gIAIfMBQAD3AgAh9AFAAPcCACH1AUAA9wIAIYMCAQD2AgAhiwIBAPYCACGMAgEArQMAIY0CAQCtAwAhAAAAAdACAQAAAAEB0AJAAAAAAQAAAAAB0AIBAAAAAQHQAkAAAAABBSEAAI4HACAiAACRBwAgzQIAAI8HACDOAgAAkAcAINMCAAABACADIQAAjgcAIM0CAACPBwAg0wIAAAEAIAAAAAUhAACJBwAgIgAAjAcAIM0CAACKBwAgzgIAAIsHACDTAgAAAQAgAyEAAIkHACDNAgAAigcAINMCAAABACAAAAAFIQAAgQcAICIAAIcHACDNAgAAggcAIM4CAACGBwAg0wIAAAEAIAUhAAD_BgAgIgAAhAcAIM0CAACABwAgzgIAAIMHACDTAgAAKgAgAyEAAIEHACDNAgAAggcAINMCAAABACADIQAA_wYAIM0CAACABwAg0wIAACoAIAAAAAUhAADzBgAgIgAA_QYAIM0CAAD0BgAgzgIAAPwGACDTAgAAAQAgBSEAAPEGACAiAAD6BgAgzQIAAPIGACDOAgAA-QYAINMCAAARACAHIQAA7wYAICIAAPcGACDNAgAA8AYAIM4CAAD2BgAg0QIAABcAINICAAAXACDTAgAAGQAgCyEAAPYDADAiAAD7AwAwzQIAAPcDADDOAgAA-AMAMM8CAAD5AwAg0AIAAPoDADDRAgAA-gMAMNICAAD6AwAw0wIAAPoDADDUAgAA_AMAMNUCAAD9AwAwCQMAAIIEACAHAACDBAAgCgAAhAQAIPABAQAAAAH0AUAAAAAB9QFAAAAAAYMCAQAAAAGQAgEAAAABkQIBAAAAAQIAAAAZACAhAACBBAAgAwAAABkAICEAAIEEACAiAACABAAgARoAAPUGADAOAwAAvgMAIAcAAM0DACAJAADOAwAgCgAAuQMAIO0BAADMAwAw7gEAABcAEO8BAADMAwAw8AEBAAAAAfQBQAD3AgAh9QFAAPcCACGDAgEA9gIAIZACAQD2AgAhkQIBAPYCACGSAgEArQMAIQIAAAAZACAaAACABAAgAgAAAP4DACAaAAD_AwAgCu0BAAD9AwAw7gEAAP4DABDvAQAA_QMAMPABAQD2AgAh9AFAAPcCACH1AUAA9wIAIYMCAQD2AgAhkAIBAPYCACGRAgEA9gIAIZICAQCtAwAhCu0BAAD9AwAw7gEAAP4DABDvAQAA_QMAMPABAQD2AgAh9AFAAPcCACH1AUAA9wIAIYMCAQD2AgAhkAIBAPYCACGRAgEA9gIAIZICAQCtAwAhBvABAQDZAwAh9AFAANoDACH1AUAA2gMAIYMCAQDZAwAhkAIBANkDACGRAgEA2QMAIQkDAADyAwAgBwAA8wMAIAoAAPUDACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGDAgEA2QMAIZACAQDZAwAhkQIBANkDACEJAwAAggQAIAcAAIMEACAKAACEBAAg8AEBAAAAAfQBQAAAAAH1AUAAAAABgwIBAAAAAZACAQAAAAGRAgEAAAABAyEAAPMGACDNAgAA9AYAINMCAAABACADIQAA8QYAIM0CAADyBgAg0wIAABEAIAQhAAD2AwAwzQIAAPcDADDPAgAA-QMAINMCAAD6AwAwAyEAAO8GACDNAgAA8AYAINMCAAAZACAAAAAAAAXQAgIAAAAB1gICAAAAAdcCAgAAAAHYAgIAAAAB2QICAAAAAQUhAADnBgAgIgAA7QYAIM0CAADoBgAgzgIAAOwGACDTAgAAAQAgBSEAAOUGACAiAADqBgAgzQIAAOYGACDOAgAA6QYAINMCAAARACADIQAA5wYAIM0CAADoBgAg0wIAAAEAIAMhAADlBgAgzQIAAOYGACDTAgAAEQAgAAAAAAAB0AIgAAAAAQUhAADbBgAgIgAA4wYAIM0CAADcBgAgzgIAAOIGACDTAgAAAQAgBSEAANkGACAiAADgBgAgzQIAANoGACDOAgAA3wYAINMCAAAqACALIQAAowQAMCIAAKgEADDNAgAApAQAMM4CAAClBAAwzwIAAKYEACDQAgAApwQAMNECAACnBAAw0gIAAKcEADDTAgAApwQAMNQCAACpBAAw1QIAAKoEADALIQAAmgQAMCIAAJ4EADDNAgAAmwQAMM4CAACcBAAwzwIAAJ0EACDQAgAA-gMAMNECAAD6AwAw0gIAAPoDADDTAgAA-gMAMNQCAACfBAAw1QIAAP0DADAJAwAAggQAIAkAAIUEACAKAACEBAAg8AEBAAAAAfQBQAAAAAH1AUAAAAABgwIBAAAAAZACAQAAAAGSAgEAAAABAgAAABkAICEAAKIEACADAAAAGQAgIQAAogQAICIAAKEEACABGgAA3gYAMAIAAAAZACAaAAChBAAgAgAAAP4DACAaAACgBAAgBvABAQDZAwAh9AFAANoDACH1AUAA2gMAIYMCAQDZAwAhkAIBANkDACGSAgEA3wMAIQkDAADyAwAgCQAA9AMAIAoAAPUDACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGDAgEA2QMAIZACAQDZAwAhkgIBAN8DACEJAwAAggQAIAkAAIUEACAKAACEBAAg8AEBAAAAAfQBQAAAAAH1AUAAAAABgwIBAAAAAZACAQAAAAGSAgEAAAABBAMAAI4EACDwAQEAAAABgwIBAAAAAZMCAgAAAAECAAAAFQAgIQAArgQAIAMAAAAVACAhAACuBAAgIgAArQQAIAEaAADdBgAwCgMAAL4DACAHAADNAwAg7QEAANADADDuAQAAEwAQ7wEAANADADDwAQEAAAABgwIBAPYCACGRAgEA9gIAIZMCAgDEAwAhygIAAM8DACACAAAAFQAgGgAArQQAIAIAAACrBAAgGgAArAQAIAftAQAAqgQAMO4BAACrBAAQ7wEAAKoEADDwAQEA9gIAIYMCAQD2AgAhkQIBAPYCACGTAgIAxAMAIQftAQAAqgQAMO4BAACrBAAQ7wEAAKoEADDwAQEA9gIAIYMCAQD2AgAhkQIBAPYCACGTAgIAxAMAIQPwAQEA2QMAIYMCAQDZAwAhkwICAIsEACEEAwAAjAQAIPABAQDZAwAhgwIBANkDACGTAgIAiwQAIQQDAACOBAAg8AEBAAAAAYMCAQAAAAGTAgIAAAABAyEAANsGACDNAgAA3AYAINMCAAABACADIQAA2QYAIM0CAADaBgAg0wIAACoAIAQhAACjBAAwzQIAAKQEADDPAgAApgQAINMCAACnBAAwBCEAAJoEADDNAgAAmwQAMM8CAACdBAAg0wIAAPoDADAAAAAKIQAAtwQAMCIAALsEADDNAgAAuAQAMM4CAAC5BAAw0AIAALoEADDRAgAAugQAMNICAAC6BAAw0wIAALoEADDUAgAAvAQAMNUCAAC9BAAwGQ0AAIYFACAOAACHBQAgEgAAiAUAIBMAAIkFACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGdAgAAAJ0CAp4CAQAAAAGfAgEAAAABoAIAAIMFACChAgIAAAABogIBAAAAAaMCAACEBQAgpAIBAAAAAaUCAQAAAAGmAgAAhQUAIKgCAAAAqAICqQIIAAAAAaoCCAAAAAGrAggAAAABrAICAAAAAQIAAAAqACAhAACCBQAgAwAAACoAICEAAIIFACAiAADIBAAgHQ0AALUDACAOAAC2AwAgEAAAxwMAIBIAALoDACATAAC0AwAg7QEAAMIDADDuAQAAKAAQ7wEAAMIDADDwAQEAAAAB9AFAAPcCACH1AUAA9wIAIZkCAQD2AgAhmgIBAPYCACGbAgEAAAABnQIAAMMDnQIingIBAPYCACGfAgEArQMAIaACAACOAwAgoQICAMQDACGiAgEA9gIAIaMCAACOAwAgpAIBAK0DACGlAgEArQMAIaYCAACOAwAgqAIAAMUDqAIiqQIIALwDACGqAggAxgMAIasCCADGAwAhrAICALADACECAAAAKgAgGgAAyAQAIAIAAAC-BAAgGgAAvwQAIBjtAQAAvQQAMO4BAAC-BAAQ7wEAAL0EADDwAQEA9gIAIfQBQAD3AgAh9QFAAPcCACGZAgEA9gIAIZoCAQD2AgAhmwIBAK0DACGdAgAAwwOdAiKeAgEA9gIAIZ8CAQCtAwAhoAIAAI4DACChAgIAxAMAIaICAQD2AgAhowIAAI4DACCkAgEArQMAIaUCAQCtAwAhpgIAAI4DACCoAgAAxQOoAiKpAggAvAMAIaoCCADGAwAhqwIIAMYDACGsAgIAsAMAIRjtAQAAvQQAMO4BAAC-BAAQ7wEAAL0EADDwAQEA9gIAIfQBQAD3AgAh9QFAAPcCACGZAgEA9gIAIZoCAQD2AgAhmwIBAK0DACGdAgAAwwOdAiKeAgEA9gIAIZ8CAQCtAwAhoAIAAI4DACChAgIAxAMAIaICAQD2AgAhowIAAI4DACCkAgEArQMAIaUCAQCtAwAhpgIAAI4DACCoAgAAxQOoAiKpAggAvAMAIaoCCADGAwAhqwIIAMYDACGsAgIAsAMAIRXwAQEA2QMAIfQBQADaAwAh9QFAANoDACGZAgEA2QMAIZoCAQDZAwAhmwIBAN8DACGdAgAAwASdAiKeAgEA2QMAIZ8CAQDfAwAhoAIAAMEEACChAgIAiwQAIaICAQDZAwAhowIAAMIEACCkAgEA3wMAIaUCAQDfAwAhpgIAAMMEACCoAgAAxASoAiKpAggAxQQAIaoCCADGBAAhqwIIAMYEACGsAgIAxwQAIQHQAgAAAJ0CAgLQAgEAAAAE2gIBAAAABQLQAgEAAAAE2gIBAAAABQLQAgEAAAAE2gIBAAAABQHQAgAAAKgCAgXQAggAAAAB1gIIAAAAAdcCCAAAAAHYAggAAAAB2QIIAAAAAQXQAggAAAAB1gIIAAAAAdcCCAAAAAHYAggAAAAB2QIIAAAAAQXQAgIAAAAB1gICAAAAAdcCAgAAAAHYAgIAAAAB2QICAAAAARkNAADJBAAgDgAAygQAIBIAAMsEACATAADMBAAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhmQIBANkDACGaAgEA2QMAIZsCAQDfAwAhnQIAAMAEnQIingIBANkDACGfAgEA3wMAIaACAADBBAAgoQICAIsEACGiAgEA2QMAIaMCAADCBAAgpAIBAN8DACGlAgEA3wMAIaYCAADDBAAgqAIAAMQEqAIiqQIIAMUEACGqAggAxgQAIasCCADGBAAhrAICAMcEACELIQAA9gQAMCIAAPsEADDNAgAA9wQAMM4CAAD4BAAwzwIAAPkEACDQAgAA-gQAMNECAAD6BAAw0gIAAPoEADDTAgAA-gQAMNQCAAD8BAAw1QIAAP0EADALIQAA6gQAMCIAAO8EADDNAgAA6wQAMM4CAADsBAAwzwIAAO0EACDQAgAA7gQAMNECAADuBAAw0gIAAO4EADDTAgAA7gQAMNQCAADwBAAw1QIAAPEEADALIQAA3AQAMCIAAOEEADDNAgAA3QQAMM4CAADeBAAwzwIAAN8EACDQAgAA4AQAMNECAADgBAAw0gIAAOAEADDTAgAA4AQAMNQCAADiBAAw1QIAAOMEADALIQAAzQQAMCIAANIEADDNAgAAzgQAMM4CAADPBAAwzwIAANAEACDQAgAA0QQAMNECAADRBAAw0gIAANEEADDTAgAA0QQAMNQCAADTBAAw1QIAANQEADAIAwAA2wQAIPABAQAAAAHzAUAAAAAB9AFAAAAAAYMCAQAAAAGdAgAAALgCArACCAAAAAG4AkAAAAABAgAAAA0AICEAANoEACADAAAADQAgIQAA2gQAICIAANgEACABGgAA2AYAMA0DAAC-AwAgBgAAwQMAIO0BAADSAwAw7gEAAAsAEO8BAADSAwAw8AEBAAAAAfMBQACxAwAh9AFAAPcCACGDAgEA9gIAIY4CAQD2AgAhnQIAANMDuAIisAIIALwDACG4AkAA9wIAIQIAAAANACAaAADYBAAgAgAAANUEACAaAADWBAAgC-0BAADUBAAw7gEAANUEABDvAQAA1AQAMPABAQD2AgAh8wFAALEDACH0AUAA9wIAIYMCAQD2AgAhjgIBAPYCACGdAgAA0wO4AiKwAggAvAMAIbgCQAD3AgAhC-0BAADUBAAw7gEAANUEABDvAQAA1AQAMPABAQD2AgAh8wFAALEDACH0AUAA9wIAIYMCAQD2AgAhjgIBAPYCACGdAgAA0wO4AiKwAggAvAMAIbgCQAD3AgAhB_ABAQDZAwAh8wFAAOADACH0AUAA2gMAIYMCAQDZAwAhnQIAANcEuAIisAIIAMUEACG4AkAA2gMAIQHQAgAAALgCAggDAADZBAAg8AEBANkDACHzAUAA4AMAIfQBQADaAwAhgwIBANkDACGdAgAA1wS4AiKwAggAxQQAIbgCQADaAwAhBSEAANMGACAiAADWBgAgzQIAANQGACDOAgAA1QYAINMCAAABACAIAwAA2wQAIPABAQAAAAHzAUAAAAAB9AFAAAAAAYMCAQAAAAGdAgAAALgCArACCAAAAAG4AkAAAAABAyEAANMGACDNAgAA1AYAINMCAAABACAEAwAA6QQAIPABAQAAAAGDAgEAAAABugJAAAAAAQIAAAAvACAhAADoBAAgAwAAAC8AICEAAOgEACAiAADmBAAgARoAANIGADAKAwAAvgMAIBEAAMEDACDtAQAAwAMAMO4BAAAtABDvAQAAwAMAMPABAQAAAAGDAgEA9gIAIbkCAQD2AgAhugJAAPcCACHIAgAAvwMAIAIAAAAvACAaAADmBAAgAgAAAOQEACAaAADlBAAgB-0BAADjBAAw7gEAAOQEABDvAQAA4wQAMPABAQD2AgAhgwIBAPYCACG5AgEA9gIAIboCQAD3AgAhB-0BAADjBAAw7gEAAOQEABDvAQAA4wQAMPABAQD2AgAhgwIBAPYCACG5AgEA9gIAIboCQAD3AgAhA_ABAQDZAwAhgwIBANkDACG6AkAA2gMAIQQDAADnBAAg8AEBANkDACGDAgEA2QMAIboCQADaAwAhBSEAAM0GACAiAADQBgAgzQIAAM4GACDOAgAAzwYAINMCAAABACAEAwAA6QQAIPABAQAAAAGDAgEAAAABugJAAAAAAQMhAADNBgAgzQIAAM4GACDTAgAAAQAgBAMAAO0DACDwAQEAAAABgwIBAAAAAY8CQAAAAAECAAAAIgAgIQAA9QQAIAMAAAAiACAhAAD1BAAgIgAA9AQAIAEaAADMBgAwCgMAAL4DACAGAADBAwAg7QEAAMsDADDuAQAAIAAQ7wEAAMsDADDwAQEAAAABgwIBAPYCACGOAgEA9gIAIY8CQAD3AgAhyQIAAMoDACACAAAAIgAgGgAA9AQAIAIAAADyBAAgGgAA8wQAIAftAQAA8QQAMO4BAADyBAAQ7wEAAPEEADDwAQEA9gIAIYMCAQD2AgAhjgIBAPYCACGPAkAA9wIAIQftAQAA8QQAMO4BAADyBAAQ7wEAAPEEADDwAQEA9gIAIYMCAQD2AgAhjgIBAPYCACGPAkAA9wIAIQPwAQEA2QMAIYMCAQDZAwAhjwJAANoDACEEAwAA6wMAIPABAQDZAwAhgwIBANkDACGPAkAA2gMAIQQDAADtAwAg8AEBAAAAAYMCAQAAAAGPAkAAAAABDAMAAK8EACAIAACxBAAgDAAAsgQAIPABAQAAAAH0AUAAAAAB9QFAAAAAAYMCAQAAAAGQAgEAAAABkwICAAAAAZQCAgAAAAGVAiAAAAABlgIgAAAAAQIAAAARACAhAACBBQAgAwAAABEAICEAAIEFACAiAACABQAgARoAAMsGADARAwAAvgMAIAYAAMEDACAIAAC4AwAgDAAAuQMAIO0BAADRAwAw7gEAAA8AEO8BAADRAwAw8AEBAAAAAfQBQAD3AgAh9QFAAPcCACGDAgEA9gIAIY4CAQD2AgAhkAIBAPYCACGTAgIAxAMAIZQCAgDEAwAhlQIgAKwDACGWAiAArAMAIQIAAAARACAaAACABQAgAgAAAP4EACAaAAD_BAAgDe0BAAD9BAAw7gEAAP4EABDvAQAA_QQAMPABAQD2AgAh9AFAAPcCACH1AUAA9wIAIYMCAQD2AgAhjgIBAPYCACGQAgEA9gIAIZMCAgDEAwAhlAICAMQDACGVAiAArAMAIZYCIACsAwAhDe0BAAD9BAAw7gEAAP4EABDvAQAA_QQAMPABAQD2AgAh9AFAAPcCACH1AUAA9wIAIYMCAQD2AgAhjgIBAPYCACGQAgEA9gIAIZMCAgDEAwAhlAICAMQDACGVAiAArAMAIZYCIACsAwAhCfABAQDZAwAh9AFAANoDACH1AUAA2gMAIYMCAQDZAwAhkAIBANkDACGTAgIAiwQAIZQCAgCLBAAhlQIgAJUEACGWAiAAlQQAIQwDAACWBAAgCAAAmAQAIAwAAJkEACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGDAgEA2QMAIZACAQDZAwAhkwICAIsEACGUAgIAiwQAIZUCIACVBAAhlgIgAJUEACEMAwAArwQAIAgAALEEACAMAACyBAAg8AEBAAAAAfQBQAAAAAH1AUAAAAABgwIBAAAAAZACAQAAAAGTAgIAAAABlAICAAAAAZUCIAAAAAGWAiAAAAABGQ0AAIYFACAOAACHBQAgEgAAiAUAIBMAAIkFACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGdAgAAAJ0CAp4CAQAAAAGfAgEAAAABoAIAAIMFACChAgIAAAABogIBAAAAAaMCAACEBQAgpAIBAAAAAaUCAQAAAAGmAgAAhQUAIKgCAAAAqAICqQIIAAAAAaoCCAAAAAGrAggAAAABrAICAAAAAQHQAgEAAAAEAdACAQAAAAQB0AIBAAAABAQhAAD2BAAwzQIAAPcEADDPAgAA-QQAINMCAAD6BAAwBCEAAOoEADDNAgAA6wQAMM8CAADtBAAg0wIAAO4EADAEIQAA3AQAMM0CAADdBAAwzwIAAN8EACDTAgAA4AQAMAQhAADNBAAwzQIAAM4EADDPAgAA0AQAINMCAADRBAAwAyEAALcEADDNAgAAuAQAMNMCAAC6BAAwAAAAAAAKIQAAkQUAMCIAAJUFADDNAgAAkgUAMM4CAACTBQAw0AIAAJQFADDRAgAAlAUAMNICAACUBQAw0wIAAJQFADDUAgAAlgUAMNUCAACXBQAwA_ABAQAAAAGXAgEAAAABmAIBAAAAAQIAAAAmACAhAACbBQAgAwAAACYAICEAAJsFACAiAACaBQAgBw8AAMkDACDtAQAAyAMAMO4BAAAkABDvAQAAyAMAMPABAQAAAAGXAgEAAAABmAIBAK0DACECAAAAJgAgGgAAmgUAIAIAAACYBQAgGgAAmQUAIAbtAQAAlwUAMO4BAACYBQAQ7wEAAJcFADDwAQEA9gIAIZcCAQD2AgAhmAIBAK0DACEG7QEAAJcFADDuAQAAmAUAEO8BAACXBQAw8AEBAPYCACGXAgEA9gIAIZgCAQCtAwAhA_ABAQDZAwAhlwIBANkDACGYAgEA3wMAIQPwAQEA2QMAIZcCAQDZAwAhmAIBAN8DACED8AEBAAAAAZcCAQAAAAGYAgEAAAABAyEAAJEFADDNAgAAkgUAMNMCAACUBQAwAAAAAAAB0AIAAACzAgIFIQAAxgYAICIAAMkGACDNAgAAxwYAIM4CAADIBgAg0wIAAAEAIAMhAADGBgAgzQIAAMcGACDTAgAAAQAgAAAAAAAFIQAAwQYAICIAAMQGACDNAgAAwgYAIM4CAADDBgAg0wIAACoAIAMhAADBBgAgzQIAAMIGACDTAgAAKgAgAAAABSEAALwGACAiAAC_BgAgzQIAAL0GACDOAgAAvgYAINMCAAAqACADIQAAvAYAIM0CAAC9BgAg0wIAACoAIAAAAAAAAdACAAAAvwICAdACAAAAwQIDCyEAAI8GADAiAACUBgAwzQIAAJAGADDOAgAAkQYAMM8CAACSBgAg0AIAAJMGADDRAgAAkwYAMNICAACTBgAw0wIAAJMGADDUAgAAlQYAMNUCAACWBgAwCyEAAIMGADAiAACIBgAwzQIAAIQGADDOAgAAhQYAMM8CAACGBgAg0AIAAIcGADDRAgAAhwYAMNICAACHBgAw0wIAAIcGADDUAgAAiQYAMNUCAACKBgAwCyEAAPoFADAiAAD-BQAwzQIAAPsFADDOAgAA_AUAMM8CAAD9BQAg0AIAANEEADDRAgAA0QQAMNICAADRBAAw0wIAANEEADDUAgAA_wUAMNUCAADUBAAwCyEAAPEFADAiAAD1BQAwzQIAAPIFADDOAgAA8wUAMM8CAAD0BQAg0AIAAPoEADDRAgAA-gQAMNICAAD6BAAw0wIAAPoEADDUAgAA9gUAMNUCAAD9BAAwCyEAAOgFADAiAADsBQAwzQIAAOkFADDOAgAA6gUAMM8CAADrBQAg0AIAAO4EADDRAgAA7gQAMNICAADuBAAw0wIAAO4EADDUAgAA7QUAMNUCAADxBAAwCyEAANwFADAiAADhBQAwzQIAAN0FADDOAgAA3gUAMM8CAADfBQAg0AIAAOAFADDRAgAA4AUAMNICAADgBQAw0wIAAOAFADDUAgAA4gUAMNUCAADjBQAwCyEAANMFADAiAADXBQAwzQIAANQFADDOAgAA1QUAMM8CAADWBQAg0AIAAKcEADDRAgAApwQAMNICAACnBAAw0wIAAKcEADDUAgAA2AUAMNUCAACqBAAwCyEAAMoFADAiAADOBQAwzQIAAMsFADDOAgAAzAUAMM8CAADNBQAg0AIAAPoDADDRAgAA-gMAMNICAAD6AwAw0wIAAPoDADDUAgAAzwUAMNUCAAD9AwAwCyEAAMEFADAiAADFBQAwzQIAAMIFADDOAgAAwwUAMM8CAADEBQAg0AIAAOAEADDRAgAA4AQAMNICAADgBAAw0wIAAOAEADDUAgAAxgUAMNUCAADjBAAwBBEAALAFACDwAQEAAAABuQIBAAAAAboCQAAAAAECAAAALwAgIQAAyQUAIAMAAAAvACAhAADJBQAgIgAAyAUAIAEaAAC7BgAwAgAAAC8AIBoAAMgFACACAAAA5AQAIBoAAMcFACAD8AEBANkDACG5AgEA2QMAIboCQADaAwAhBBEAAK8FACDwAQEA2QMAIbkCAQDZAwAhugJAANoDACEEEQAAsAUAIPABAQAAAAG5AgEAAAABugJAAAAAAQkHAACDBAAgCQAAhQQAIAoAAIQEACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAECAAAAGQAgIQAA0gUAIAMAAAAZACAhAADSBQAgIgAA0QUAIAEaAAC6BgAwAgAAABkAIBoAANEFACACAAAA_gMAIBoAANAFACAG8AEBANkDACH0AUAA2gMAIfUBQADaAwAhkAIBANkDACGRAgEA2QMAIZICAQDfAwAhCQcAAPMDACAJAAD0AwAgCgAA9QMAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZACAQDZAwAhkQIBANkDACGSAgEA3wMAIQkHAACDBAAgCQAAhQQAIAoAAIQEACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAEEBwAAjwQAIPABAQAAAAGRAgEAAAABkwICAAAAAQIAAAAVACAhAADbBQAgAwAAABUAICEAANsFACAiAADaBQAgARoAALkGADACAAAAFQAgGgAA2gUAIAIAAACrBAAgGgAA2QUAIAPwAQEA2QMAIZECAQDZAwAhkwICAIsEACEEBwAAjQQAIPABAQDZAwAhkQIBANkDACGTAgIAiwQAIQQHAACPBAAg8AEBAAAAAZECAQAAAAGTAgIAAAABCPABAQAAAAH0AUAAAAABsAIIAAAAAbECAQAAAAGzAgAAALMCArQCAQAAAAG1AgEAAAABtgIBAAAAAQIAAAA7ACAhAADnBQAgAwAAADsAICEAAOcFACAiAADmBQAgARoAALgGADANAwAAvgMAIO0BAAC7AwAw7gEAADkAEO8BAAC7AwAw8AEBAAAAAfQBQAD3AgAhgwIBAPYCACGwAggAvAMAIbECAQD2AgAhswIAAL0DswIitAIBAAAAAbUCAQCtAwAhtgIBAK0DACECAAAAOwAgGgAA5gUAIAIAAADkBQAgGgAA5QUAIAztAQAA4wUAMO4BAADkBQAQ7wEAAOMFADDwAQEA9gIAIfQBQAD3AgAhgwIBAPYCACGwAggAvAMAIbECAQD2AgAhswIAAL0DswIitAIBAPYCACG1AgEArQMAIbYCAQCtAwAhDO0BAADjBQAw7gEAAOQFABDvAQAA4wUAMPABAQD2AgAh9AFAAPcCACGDAgEA9gIAIbACCAC8AwAhsQIBAPYCACGzAgAAvQOzAiK0AgEA9gIAIbUCAQCtAwAhtgIBAK0DACEI8AEBANkDACH0AUAA2gMAIbACCADFBAAhsQIBANkDACGzAgAAogWzAiK0AgEA2QMAIbUCAQDfAwAhtgIBAN8DACEI8AEBANkDACH0AUAA2gMAIbACCADFBAAhsQIBANkDACGzAgAAogWzAiK0AgEA2QMAIbUCAQDfAwAhtgIBAN8DACEI8AEBAAAAAfQBQAAAAAGwAggAAAABsQIBAAAAAbMCAAAAswICtAIBAAAAAbUCAQAAAAG2AgEAAAABBAYAAO4DACDwAQEAAAABjgIBAAAAAY8CQAAAAAECAAAAIgAgIQAA8AUAIAMAAAAiACAhAADwBQAgIgAA7wUAIAEaAAC3BgAwAgAAACIAIBoAAO8FACACAAAA8gQAIBoAAO4FACAD8AEBANkDACGOAgEA2QMAIY8CQADaAwAhBAYAAOwDACDwAQEA2QMAIY4CAQDZAwAhjwJAANoDACEEBgAA7gMAIPABAQAAAAGOAgEAAAABjwJAAAAAAQwGAACwBAAgCAAAsQQAIAwAALIEACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGOAgEAAAABkAIBAAAAAZMCAgAAAAGUAgIAAAABlQIgAAAAAZYCIAAAAAECAAAAEQAgIQAA-QUAIAMAAAARACAhAAD5BQAgIgAA-AUAIAEaAAC2BgAwAgAAABEAIBoAAPgFACACAAAA_gQAIBoAAPcFACAJ8AEBANkDACH0AUAA2gMAIfUBQADaAwAhjgIBANkDACGQAgEA2QMAIZMCAgCLBAAhlAICAIsEACGVAiAAlQQAIZYCIACVBAAhDAYAAJcEACAIAACYBAAgDAAAmQQAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIY4CAQDZAwAhkAIBANkDACGTAgIAiwQAIZQCAgCLBAAhlQIgAJUEACGWAiAAlQQAIQwGAACwBAAgCAAAsQQAIAwAALIEACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGOAgEAAAABkAIBAAAAAZMCAgAAAAGUAgIAAAABlQIgAAAAAZYCIAAAAAEIBgAAqwUAIPABAQAAAAHzAUAAAAAB9AFAAAAAAY4CAQAAAAGdAgAAALgCArACCAAAAAG4AkAAAAABAgAAAA0AICEAAIIGACADAAAADQAgIQAAggYAICIAAIEGACABGgAAtQYAMAIAAAANACAaAACBBgAgAgAAANUEACAaAACABgAgB_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_QUAINMCAADRBAAwBCEAAPEFADDNAgAA8gUAMM8CAAD0BQAg0wIAAPoEADAEIQAA6AUAMM0CAADpBQAwzwIAAOsFACDTAgAA7gQAMAQhAADcBQAwzQIAAN0FADDPAgAA3wUAINMCAADgBQAwBCEAANMFADDNAgAA1AUAMM8CAADWBQAg0wIAAKcEADAEIQAAygUAMM0CAADLBQAwzwIAAM0FACDTAgAA-gMAMAQhAADBBQAwzQIAAMIFADDPAgAAxAUAINMCAADgBAAwAAAAAAAAAAAADgQAAKQGACAFAAClBgAgCAAAqgYAIAwAAKsGACANAACnBgAgDgAAqAYAIBIAAKwGACATAACmBgAgFAAAqQYAILMCAADbAwAgvQIAANsDACDBAgAA2wMAIMMCAADbAwAgxAIAANsDACAMDQAApwYAIA4AAKgGACAQAACvBgAgEgAArAYAIBMAAKYGACCbAgAA2wMAIJ8CAADbAwAgpAIAANsDACClAgAA2wMAIKoCAADbAwAgqwIAANsDACCsAgAA2wMAIAAABAMAAK0GACAGAACuBgAgCAAAqgYAIAwAAKsGACAFAwAArQYAIAcAALEGACAJAACyBgAgCgAAqwYAIJICAADbAwAgB_ABAQAAAAHzAUAAAAAB9AFAAAAAAfUBQAAAAAGLAgEAAAABjAIBAAAAAY0CAQAAAAEM8AEBAAAAAfQBQAAAAAH1AUAAAAABgQIBAAAAAYICAQAAAAGEAgEAAAABhQIBAAAAAYYCAQAAAAGHAkAAAAABiAJAAAAAAYkCAQAAAAGKAgEAAAABB_ABAQAAAAHzAUAAAAAB9AFAAAAAAY4CAQAAAAGdAgAAALgCArACCAAAAAG4AkAAAAABCfABAQAAAAH0AUAAAAAB9QFAAAAAAY4CAQAAAAGQAgEAAAABkwICAAAAAZQCAgAAAAGVAiAAAAABlgIgAAAAAQPwAQEAAAABjgIBAAAAAY8CQAAAAAEI8AEBAAAAAfQBQAAAAAGwAggAAAABsQIBAAAAAbMCAAAAswICtAIBAAAAAbUCAQAAAAG2AgEAAAABA_ABAQAAAAGRAgEAAAABkwICAAAAAQbwAQEAAAAB9AFAAAAAAfUBQAAAAAGQAgEAAAABkQIBAAAAAZICAQAAAAED8AEBAAAAAbkCAQAAAAG6AkAAAAABGQ0AAIYFACAOAACHBQAgEAAAnAUAIBMAAIkFACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGdAgAAAJ0CAp4CAQAAAAGfAgEAAAABoAIAAIMFACChAgIAAAABogIBAAAAAaMCAACEBQAgpAIBAAAAAaUCAQAAAAGmAgAAhQUAIKgCAAAAqAICqQIIAAAAAaoCCAAAAAGrAggAAAABrAICAAAAAQIAAAAqACAhAAC8BgAgAwAAACgAICEAALwGACAiAADABgAgGwAAACgAIA0AAMkEACAOAADKBAAgEAAAkAUAIBMAAMwEACAaAADABgAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhmQIBANkDACGaAgEA2QMAIZsCAQDfAwAhnQIAAMAEnQIingIBANkDACGfAgEA3wMAIaACAADBBAAgoQICAIsEACGiAgEA2QMAIaMCAADCBAAgpAIBAN8DACGlAgEA3wMAIaYCAADDBAAgqAIAAMQEqAIiqQIIAMUEACGqAggAxgQAIasCCADGBAAhrAICAMcEACEZDQAAyQQAIA4AAMoEACAQAACQBQAgEwAAzAQAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZkCAQDZAwAhmgIBANkDACGbAgEA3wMAIZ0CAADABJ0CIp4CAQDZAwAhnwIBAN8DACGgAgAAwQQAIKECAgCLBAAhogIBANkDACGjAgAAwgQAIKQCAQDfAwAhpQIBAN8DACGmAgAAwwQAIKgCAADEBKgCIqkCCADFBAAhqgIIAMYEACGrAggAxgQAIawCAgDHBAAhGQ0AAIYFACAOAACHBQAgEAAAnAUAIBIAAIgFACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGdAgAAAJ0CAp4CAQAAAAGfAgEAAAABoAIAAIMFACChAgIAAAABogIBAAAAAaMCAACEBQAgpAIBAAAAAaUCAQAAAAGmAgAAhQUAIKgCAAAAqAICqQIIAAAAAaoCCAAAAAGrAggAAAABrAICAAAAAQIAAAAqACAhAADBBgAgAwAAACgAICEAAMEGACAiAADFBgAgGwAAACgAIA0AAMkEACAOAADKBAAgEAAAkAUAIBIAAMsEACAaAADFBgAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhmQIBANkDACGaAgEA2QMAIZsCAQDfAwAhnQIAAMAEnQIingIBANkDACGfAgEA3wMAIaACAADBBAAgoQICAIsEACGiAgEA2QMAIaMCAADCBAAgpAIBAN8DACGlAgEA3wMAIaYCAADDBAAgqAIAAMQEqAIiqQIIAMUEACGqAggAxgQAIasCCADGBAAhrAICAMcEACEZDQAAyQQAIA4AAMoEACAQAACQBQAgEgAAywQAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZkCAQDZAwAhmgIBANkDACGbAgEA3wMAIZ0CAADABJ0CIp4CAQDZAwAhnwIBAN8DACGgAgAAwQQAIKECAgCLBAAhogIBANkDACGjAgAAwgQAIKQCAQDfAwAhpQIBAN8DACGmAgAAwwQAIKgCAADEBKgCIqkCCADFBAAhqgIIAMYEACGrAggAxgQAIawCAgDHBAAhFQQAAJsGACAFAACcBgAgCAAAoQYAIAwAAKIGACANAACeBgAgDgAAnwYAIBIAAKMGACATAACdBgAg8AEBAAAAAfQBQAAAAAH1AUAAAAABlwIBAAAAAbMCAAAAwQIDuwIBAAAAAbwCIAAAAAG9AgEAAAABvwIAAAC_AgLBAgEAAAABwgIgAAAAAcMCAgAAAAHEAkAAAAABAgAAAAEAICEAAMYGACADAAAASgAgIQAAxgYAICIAAMoGACAXAAAASgAgBAAAuAUAIAUAALkFACAIAAC-BQAgDAAAvwUAIA0AALsFACAOAAC8BQAgEgAAwAUAIBMAALoFACAaAADKBgAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhlwIBANkDACGzAgAAtwXBAiO7AgEA2QMAIbwCIACVBAAhvQIBAN8DACG_AgAAtgW_AiLBAgEA3wMAIcICIACVBAAhwwICAMcEACHEAkAA4AMAIRUEAAC4BQAgBQAAuQUAIAgAAL4FACAMAAC_BQAgDQAAuwUAIA4AALwFACASAADABQAgEwAAugUAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZcCAQDZAwAhswIAALcFwQIjuwIBANkDACG8AiAAlQQAIb0CAQDfAwAhvwIAALYFvwIiwQIBAN8DACHCAiAAlQQAIcMCAgDHBAAhxAJAAOADACEJ8AEBAAAAAfQBQAAAAAH1AUAAAAABgwIBAAAAAZACAQAAAAGTAgIAAAABlAICAAAAAZUCIAAAAAGWAiAAAAABA_ABAQAAAAGDAgEAAAABjwJAAAAAARUEAACbBgAgBQAAnAYAIAgAAKEGACAMAACiBgAgDQAAngYAIA4AAJ8GACATAACdBgAgFAAAoAYAIPABAQAAAAH0AUAAAAAB9QFAAAAAAZcCAQAAAAGzAgAAAMECA7sCAQAAAAG8AiAAAAABvQIBAAAAAb8CAAAAvwICwQIBAAAAAcICIAAAAAHDAgIAAAABxAJAAAAAAQIAAAABACAhAADNBgAgAwAAAEoAICEAAM0GACAiAADRBgAgFwAAAEoAIAQAALgFACAFAAC5BQAgCAAAvgUAIAwAAL8FACANAAC7BQAgDgAAvAUAIBMAALoFACAUAAC9BQAgGgAA0QYAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZcCAQDZAwAhswIAALcFwQIjuwIBANkDACG8AiAAlQQAIb0CAQDfAwAhvwIAALYFvwIiwQIBAN8DACHCAiAAlQQAIcMCAgDHBAAhxAJAAOADACEVBAAAuAUAIAUAALkFACAIAAC-BQAgDAAAvwUAIA0AALsFACAOAAC8BQAgEwAAugUAIBQAAL0FACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGXAgEA2QMAIbMCAAC3BcECI7sCAQDZAwAhvAIgAJUEACG9AgEA3wMAIb8CAAC2Bb8CIsECAQDfAwAhwgIgAJUEACHDAgIAxwQAIcQCQADgAwAhA_ABAQAAAAGDAgEAAAABugJAAAAAARUEAACbBgAgBQAAnAYAIAgAAKEGACAMAACiBgAgDQAAngYAIA4AAJ8GACASAACjBgAgFAAAoAYAIPABAQAAAAH0AUAAAAAB9QFAAAAAAZcCAQAAAAGzAgAAAMECA7sCAQAAAAG8AiAAAAABvQIBAAAAAb8CAAAAvwICwQIBAAAAAcICIAAAAAHDAgIAAAABxAJAAAAAAQIAAAABACAhAADTBgAgAwAAAEoAICEAANMGACAiAADXBgAgFwAAAEoAIAQAALgFACAFAAC5BQAgCAAAvgUAIAwAAL8FACANAAC7BQAgDgAAvAUAIBIAAMAFACAUAAC9BQAgGgAA1wYAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZcCAQDZAwAhswIAALcFwQIjuwIBANkDACG8AiAAlQQAIb0CAQDfAwAhvwIAALYFvwIiwQIBAN8DACHCAiAAlQQAIcMCAgDHBAAhxAJAAOADACEVBAAAuAUAIAUAALkFACAIAAC-BQAgDAAAvwUAIA0AALsFACAOAAC8BQAgEgAAwAUAIBQAAL0FACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGXAgEA2QMAIbMCAAC3BcECI7sCAQDZAwAhvAIgAJUEACG9AgEA3wMAIb8CAAC2Bb8CIsECAQDfAwAhwgIgAJUEACHDAgIAxwQAIcQCQADgAwAhB_ABAQAAAAHzAUAAAAAB9AFAAAAAAYMCAQAAAAGdAgAAALgCArACCAAAAAG4AkAAAAABGQ4AAIcFACAQAACcBQAgEgAAiAUAIBMAAIkFACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGdAgAAAJ0CAp4CAQAAAAGfAgEAAAABoAIAAIMFACChAgIAAAABogIBAAAAAaMCAACEBQAgpAIBAAAAAaUCAQAAAAGmAgAAhQUAIKgCAAAAqAICqQIIAAAAAaoCCAAAAAGrAggAAAABrAICAAAAAQIAAAAqACAhAADZBgAgFQQAAJsGACAFAACcBgAgCAAAoQYAIAwAAKIGACAOAACfBgAgEgAAowYAIBMAAJ0GACAUAACgBgAg8AEBAAAAAfQBQAAAAAH1AUAAAAABlwIBAAAAAbMCAAAAwQIDuwIBAAAAAbwCIAAAAAG9AgEAAAABvwIAAAC_AgLBAgEAAAABwgIgAAAAAcMCAgAAAAHEAkAAAAABAgAAAAEAICEAANsGACAD8AEBAAAAAYMCAQAAAAGTAgIAAAABBvABAQAAAAH0AUAAAAAB9QFAAAAAAYMCAQAAAAGQAgEAAAABkgIBAAAAAQMAAAAoACAhAADZBgAgIgAA4QYAIBsAAAAoACAOAADKBAAgEAAAkAUAIBIAAMsEACATAADMBAAgGgAA4QYAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZkCAQDZAwAhmgIBANkDACGbAgEA3wMAIZ0CAADABJ0CIp4CAQDZAwAhnwIBAN8DACGgAgAAwQQAIKECAgCLBAAhogIBANkDACGjAgAAwgQAIKQCAQDfAwAhpQIBAN8DACGmAgAAwwQAIKgCAADEBKgCIqkCCADFBAAhqgIIAMYEACGrAggAxgQAIawCAgDHBAAhGQ4AAMoEACAQAACQBQAgEgAAywQAIBMAAMwEACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGZAgEA2QMAIZoCAQDZAwAhmwIBAN8DACGdAgAAwASdAiKeAgEA2QMAIZ8CAQDfAwAhoAIAAMEEACChAgIAiwQAIaICAQDZAwAhowIAAMIEACCkAgEA3wMAIaUCAQDfAwAhpgIAAMMEACCoAgAAxASoAiKpAggAxQQAIaoCCADGBAAhqwIIAMYEACGsAgIAxwQAIQMAAABKACAhAADbBgAgIgAA5AYAIBcAAABKACAEAAC4BQAgBQAAuQUAIAgAAL4FACAMAAC_BQAgDgAAvAUAIBIAAMAFACATAAC6BQAgFAAAvQUAIBoAAOQGACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGXAgEA2QMAIbMCAAC3BcECI7sCAQDZAwAhvAIgAJUEACG9AgEA3wMAIb8CAAC2Bb8CIsECAQDfAwAhwgIgAJUEACHDAgIAxwQAIcQCQADgAwAhFQQAALgFACAFAAC5BQAgCAAAvgUAIAwAAL8FACAOAAC8BQAgEgAAwAUAIBMAALoFACAUAAC9BQAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhlwIBANkDACGzAgAAtwXBAiO7AgEA2QMAIbwCIACVBAAhvQIBAN8DACG_AgAAtgW_AiLBAgEA3wMAIcICIACVBAAhwwICAMcEACHEAkAA4AMAIQ0DAACvBAAgBgAAsAQAIAwAALIEACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGDAgEAAAABjgIBAAAAAZACAQAAAAGTAgIAAAABlAICAAAAAZUCIAAAAAGWAiAAAAABAgAAABEAICEAAOUGACAVBAAAmwYAIAUAAJwGACAMAACiBgAgDQAAngYAIA4AAJ8GACASAACjBgAgEwAAnQYAIBQAAKAGACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGXAgEAAAABswIAAADBAgO7AgEAAAABvAIgAAAAAb0CAQAAAAG_AgAAAL8CAsECAQAAAAHCAiAAAAABwwICAAAAAcQCQAAAAAECAAAAAQAgIQAA5wYAIAMAAAAPACAhAADlBgAgIgAA6wYAIA8AAAAPACADAACWBAAgBgAAlwQAIAwAAJkEACAaAADrBgAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhgwIBANkDACGOAgEA2QMAIZACAQDZAwAhkwICAIsEACGUAgIAiwQAIZUCIACVBAAhlgIgAJUEACENAwAAlgQAIAYAAJcEACAMAACZBAAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhgwIBANkDACGOAgEA2QMAIZACAQDZAwAhkwICAIsEACGUAgIAiwQAIZUCIACVBAAhlgIgAJUEACEDAAAASgAgIQAA5wYAICIAAO4GACAXAAAASgAgBAAAuAUAIAUAALkFACAMAAC_BQAgDQAAuwUAIA4AALwFACASAADABQAgEwAAugUAIBQAAL0FACAaAADuBgAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhlwIBANkDACGzAgAAtwXBAiO7AgEA2QMAIbwCIACVBAAhvQIBAN8DACG_AgAAtgW_AiLBAgEA3wMAIcICIACVBAAhwwICAMcEACHEAkAA4AMAIRUEAAC4BQAgBQAAuQUAIAwAAL8FACANAAC7BQAgDgAAvAUAIBIAAMAFACATAAC6BQAgFAAAvQUAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZcCAQDZAwAhswIAALcFwQIjuwIBANkDACG8AiAAlQQAIb0CAQDfAwAhvwIAALYFvwIiwQIBAN8DACHCAiAAlQQAIcMCAgDHBAAhxAJAAOADACEKAwAAggQAIAcAAIMEACAJAACFBAAg8AEBAAAAAfQBQAAAAAH1AUAAAAABgwIBAAAAAZACAQAAAAGRAgEAAAABkgIBAAAAAQIAAAAZACAhAADvBgAgDQMAAK8EACAGAACwBAAgCAAAsQQAIPABAQAAAAH0AUAAAAAB9QFAAAAAAYMCAQAAAAGOAgEAAAABkAIBAAAAAZMCAgAAAAGUAgIAAAABlQIgAAAAAZYCIAAAAAECAAAAEQAgIQAA8QYAIBUEAACbBgAgBQAAnAYAIAgAAKEGACANAACeBgAgDgAAnwYAIBIAAKMGACATAACdBgAgFAAAoAYAIPABAQAAAAH0AUAAAAAB9QFAAAAAAZcCAQAAAAGzAgAAAMECA7sCAQAAAAG8AiAAAAABvQIBAAAAAb8CAAAAvwICwQIBAAAAAcICIAAAAAHDAgIAAAABxAJAAAAAAQIAAAABACAhAADzBgAgBvABAQAAAAH0AUAAAAAB9QFAAAAAAYMCAQAAAAGQAgEAAAABkQIBAAAAAQMAAAAXACAhAADvBgAgIgAA-AYAIAwAAAAXACADAADyAwAgBwAA8wMAIAkAAPQDACAaAAD4BgAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhgwIBANkDACGQAgEA2QMAIZECAQDZAwAhkgIBAN8DACEKAwAA8gMAIAcAAPMDACAJAAD0AwAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhgwIBANkDACGQAgEA2QMAIZECAQDZAwAhkgIBAN8DACEDAAAADwAgIQAA8QYAICIAAPsGACAPAAAADwAgAwAAlgQAIAYAAJcEACAIAACYBAAgGgAA-wYAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIYMCAQDZAwAhjgIBANkDACGQAgEA2QMAIZMCAgCLBAAhlAICAIsEACGVAiAAlQQAIZYCIACVBAAhDQMAAJYEACAGAACXBAAgCAAAmAQAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIYMCAQDZAwAhjgIBANkDACGQAgEA2QMAIZMCAgCLBAAhlAICAIsEACGVAiAAlQQAIZYCIACVBAAhAwAAAEoAICEAAPMGACAiAAD-BgAgFwAAAEoAIAQAALgFACAFAAC5BQAgCAAAvgUAIA0AALsFACAOAAC8BQAgEgAAwAUAIBMAALoFACAUAAC9BQAgGgAA_gYAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZcCAQDZAwAhswIAALcFwQIjuwIBANkDACG8AiAAlQQAIb0CAQDfAwAhvwIAALYFvwIiwQIBAN8DACHCAiAAlQQAIcMCAgDHBAAhxAJAAOADACEVBAAAuAUAIAUAALkFACAIAAC-BQAgDQAAuwUAIA4AALwFACASAADABQAgEwAAugUAIBQAAL0FACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGXAgEA2QMAIbMCAAC3BcECI7sCAQDZAwAhvAIgAJUEACG9AgEA3wMAIb8CAAC2Bb8CIsECAQDfAwAhwgIgAJUEACHDAgIAxwQAIcQCQADgAwAhGQ0AAIYFACAQAACcBQAgEgAAiAUAIBMAAIkFACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGZAgEAAAABmgIBAAAAAZsCAQAAAAGdAgAAAJ0CAp4CAQAAAAGfAgEAAAABoAIAAIMFACChAgIAAAABogIBAAAAAaMCAACEBQAgpAIBAAAAAaUCAQAAAAGmAgAAhQUAIKgCAAAAqAICqQIIAAAAAaoCCAAAAAGrAggAAAABrAICAAAAAQIAAAAqACAhAAD_BgAgFQQAAJsGACAFAACcBgAgCAAAoQYAIAwAAKIGACANAACeBgAgEgAAowYAIBMAAJ0GACAUAACgBgAg8AEBAAAAAfQBQAAAAAH1AUAAAAABlwIBAAAAAbMCAAAAwQIDuwIBAAAAAbwCIAAAAAG9AgEAAAABvwIAAAC_AgLBAgEAAAABwgIgAAAAAcMCAgAAAAHEAkAAAAABAgAAAAEAICEAAIEHACADAAAAKAAgIQAA_wYAICIAAIUHACAbAAAAKAAgDQAAyQQAIBAAAJAFACASAADLBAAgEwAAzAQAIBoAAIUHACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGZAgEA2QMAIZoCAQDZAwAhmwIBAN8DACGdAgAAwASdAiKeAgEA2QMAIZ8CAQDfAwAhoAIAAMEEACChAgIAiwQAIaICAQDZAwAhowIAAMIEACCkAgEA3wMAIaUCAQDfAwAhpgIAAMMEACCoAgAAxASoAiKpAggAxQQAIaoCCADGBAAhqwIIAMYEACGsAgIAxwQAIRkNAADJBAAgEAAAkAUAIBIAAMsEACATAADMBAAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhmQIBANkDACGaAgEA2QMAIZsCAQDfAwAhnQIAAMAEnQIingIBANkDACGfAgEA3wMAIaACAADBBAAgoQICAIsEACGiAgEA2QMAIaMCAADCBAAgpAIBAN8DACGlAgEA3wMAIaYCAADDBAAgqAIAAMQEqAIiqQIIAMUEACGqAggAxgQAIasCCADGBAAhrAICAMcEACEDAAAASgAgIQAAgQcAICIAAIgHACAXAAAASgAgBAAAuAUAIAUAALkFACAIAAC-BQAgDAAAvwUAIA0AALsFACASAADABQAgEwAAugUAIBQAAL0FACAaAACIBwAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhlwIBANkDACGzAgAAtwXBAiO7AgEA2QMAIbwCIACVBAAhvQIBAN8DACG_AgAAtgW_AiLBAgEA3wMAIcICIACVBAAhwwICAMcEACHEAkAA4AMAIRUEAAC4BQAgBQAAuQUAIAgAAL4FACAMAAC_BQAgDQAAuwUAIBIAAMAFACATAAC6BQAgFAAAvQUAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZcCAQDZAwAhswIAALcFwQIjuwIBANkDACG8AiAAlQQAIb0CAQDfAwAhvwIAALYFvwIiwQIBAN8DACHCAiAAlQQAIcMCAgDHBAAhxAJAAOADACEVBQAAnAYAIAgAAKEGACAMAACiBgAgDQAAngYAIA4AAJ8GACASAACjBgAgEwAAnQYAIBQAAKAGACDwAQEAAAAB9AFAAAAAAfUBQAAAAAGXAgEAAAABswIAAADBAgO7AgEAAAABvAIgAAAAAb0CAQAAAAG_AgAAAL8CAsECAQAAAAHCAiAAAAABwwICAAAAAcQCQAAAAAECAAAAAQAgIQAAiQcAIAMAAABKACAhAACJBwAgIgAAjQcAIBcAAABKACAFAAC5BQAgCAAAvgUAIAwAAL8FACANAAC7BQAgDgAAvAUAIBIAAMAFACATAAC6BQAgFAAAvQUAIBoAAI0HACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGXAgEA2QMAIbMCAAC3BcECI7sCAQDZAwAhvAIgAJUEACG9AgEA3wMAIb8CAAC2Bb8CIsECAQDfAwAhwgIgAJUEACHDAgIAxwQAIcQCQADgAwAhFQUAALkFACAIAAC-BQAgDAAAvwUAIA0AALsFACAOAAC8BQAgEgAAwAUAIBMAALoFACAUAAC9BQAg8AEBANkDACH0AUAA2gMAIfUBQADaAwAhlwIBANkDACGzAgAAtwXBAiO7AgEA2QMAIbwCIACVBAAhvQIBAN8DACG_AgAAtgW_AiLBAgEA3wMAIcICIACVBAAhwwICAMcEACHEAkAA4AMAIRUEAACbBgAgCAAAoQYAIAwAAKIGACANAACeBgAgDgAAnwYAIBIAAKMGACATAACdBgAgFAAAoAYAIPABAQAAAAH0AUAAAAAB9QFAAAAAAZcCAQAAAAGzAgAAAMECA7sCAQAAAAG8AiAAAAABvQIBAAAAAb8CAAAAvwICwQIBAAAAAcICIAAAAAHDAgIAAAABxAJAAAAAAQIAAAABACAhAACOBwAgAwAAAEoAICEAAI4HACAiAACSBwAgFwAAAEoAIAQAALgFACAIAAC-BQAgDAAAvwUAIA0AALsFACAOAAC8BQAgEgAAwAUAIBMAALoFACAUAAC9BQAgGgAAkgcAIPABAQDZAwAh9AFAANoDACH1AUAA2gMAIZcCAQDZAwAhswIAALcFwQIjuwIBANkDACG8AiAAlQQAIb0CAQDfAwAhvwIAALYFvwIiwQIBAN8DACHCAiAAlQQAIcMCAgDHBAAhxAJAAOADACEVBAAAuAUAIAgAAL4FACAMAAC_BQAgDQAAuwUAIA4AALwFACASAADABQAgEwAAugUAIBQAAL0FACDwAQEA2QMAIfQBQADaAwAh9QFAANoDACGXAgEA2QMAIbMCAAC3BcECI7sCAQDZAwAhvAIgAJUEACG9AgEA3wMAIb8CAAC2Bb8CIsECAQDfAwAhwgIgAJUEACHDAgIAxwQAIcQCQADgAwAhCgQGAgUKAwg9BwsAEQw-CA03Bg44CxI_DhMOBBQ8EAEDAAEBAwABAgMAAQYABQYLAA8NEgYOIwsQJwwSMA4TMQQFAwABBgAFCBYHCwAKDBoIAgMAAQcABgUDAAEHAAYJGwgKHAgLAAkBCh0AAggeAAwfAAIDAAEGAAUCCwANDysFAQ8sAAIDAAERAAUFDTIADjMAEDQAEjUAEzYAAQMAAQkEQAAFQQAIRgAMRwANQwAORAASSAATQgAURQAAAAAFCwAWJwAXKAAYKQAZKgAaAAAAAAAFCwAWJwAXKAAYKQAZKgAaAgMAAREABQIDAAERAAUDCwAfKQAgKgAhAAAAAwsAHykAICoAIQIDAAEGAAUCAwABBgAFBQsAJicAJygAKCkAKSoAKgAAAAAABQsAJicAJygAKCkAKSoAKgEDAAEBAwABBQsALycAMCgAMSkAMioAMwAAAAAABQsALycAMCgAMSkAMioAMwAABQsAOCcAOSgAOikAOyoAPAAAAAAABQsAOCcAOSgAOikAOyoAPAAAAwsAQSkAQioAQwAAAAMLAEEpAEIqAEMCAwABBgAFAgMAAQYABQULAEgnAEkoAEopAEsqAEwAAAAAAAULAEgnAEkoAEopAEsqAEwCAwABBwAGAgMAAQcABgULAFEnAFIoAFMpAFQqAFUAAAAAAAULAFEnAFIoAFMpAFQqAFUDAwABBwAGCYQCCAMDAAEHAAYJigIIAwsAWikAWyoAXAAAAAMLAFopAFsqAFwCAwABBgAFAgMAAQYABQMLAGEpAGIqAGMAAAADCwBhKQBiKgBjAQMAAQEDAAEDCwBoKQBpKgBqAAAAAwsAaCkAaSoAagEDAAEBAwABAwsAbykAcCoAcQAAAAMLAG8pAHAqAHEAAAADCwB3KQB4KgB5AAAAAwsAdykAeCoAeRUCARZJARdMARhNARlOARtQARxSEh1TEx5VAR9XEiBYFCNZASRaASVbEiteFSxfGy1gDi5hDi9iDjBjDjFkDjJmDjNoEjRpHDVrDjZtEjduHThvDjlwDjpxEjt0Hjx1Ij12BD53BD94BEB5BEF6BEJ8BEN-EkR_I0WBAQRGgwESR4QBJEiFAQRJhgEESocBEkuKASVMiwErTYwBEE6NARBPjgEQUI8BEFGQARBSkgEQU5QBElSVASxVlwEQVpkBEleaAS1YmwEQWZwBEFqdARJboAEuXKEBNF2iAQVeowEFX6QBBWClAQVhpgEFYqgBBWOqARJkqwE1Za0BBWavARJnsAE2aLEBBWmyAQVqswESa7YBN2y3AT1tuAEMbrkBDG-6AQxwuwEMcbwBDHK-AQxzwAESdMEBPnXDAQx2xQESd8YBP3jHAQx5yAEMeskBEnvMAUB8zQFEfc4BBn7PAQZ_0AEGgAHRAQaBAdIBBoIB1AEGgwHWARKEAdcBRYUB2QEGhgHbARKHAdwBRogB3QEGiQHeAQaKAd8BEosB4gFHjAHjAU2NAeQBB44B5QEHjwHmAQeQAecBB5EB6AEHkgHqAQeTAewBEpQB7QFOlQHvAQeWAfEBEpcB8gFPmAHzAQeZAfQBB5oB9QESmwH4AVCcAfkBVp0B-gEIngH7AQifAfwBCKAB_QEIoQH-AQiiAYACCKMBggISpAGDAlelAYYCCKYBiAISpwGJAlioAYsCCKkBjAIIqgGNAhKrAZACWawBkQJdrQGSAguuAZMCC68BlAILsAGVAguxAZYCC7IBmAILswGaAhK0AZsCXrUBnQILtgGfAhK3AaACX7gBoQILuQGiAgu6AaMCErsBpgJgvAGnAmS9AagCAr4BqQICvwGqAgLAAasCAsEBrAICwgGuAgLDAbACEsQBsQJlxQGzAgLGAbUCEscBtgJmyAG3AgLJAbgCAsoBuQISywG8AmfMAb0Ca80BvgIDzgG_AgPPAcACA9ABwQID0QHCAgPSAcQCA9MBxgIS1AHHAmzVAckCA9YBywIS1wHMAm3YAc0CA9kBzgID2gHPAhLbAdICbtwB0wJy3QHVAnPeAdYCc98B2QJz4AHaAnPhAdsCc-IB3QJz4wHfAhLkAeACdOUB4gJz5gHkAhLnAeUCdegB5gJz6QHnAnPqAegCEusB6wJ27AHsAno"
    };
    config.compilerWasm = {
      getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
      getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
        return await decodeBase64AsWasm(wasm);
      },
      importName: "./query_compiler_fast_bg.js"
    };
  }
});

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext, NullTypes2, TransactionIsolationLevel, defineExtension;
var init_prismaNamespace = __esm({
  "generated/prisma/internal/prismaNamespace.ts"() {
    "use strict";
    getExtensionContext = runtime2.Extensions.getExtensionContext;
    NullTypes2 = {
      DbNull: runtime2.NullTypes.DbNull,
      JsonNull: runtime2.NullTypes.JsonNull,
      AnyNull: runtime2.NullTypes.AnyNull
    };
    TransactionIsolationLevel = runtime2.makeStrictEnum({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    defineExtension = runtime2.Extensions.defineExtension;
  }
});

// generated/prisma/enums.ts
var ContentType, PaymentStatus, Role, MediaType, PurchaseType, UserStatus;
var init_enums = __esm({
  "generated/prisma/enums.ts"() {
    "use strict";
    ContentType = {
      FREE: "FREE",
      PREMIUM: "PREMIUM"
    };
    PaymentStatus = {
      PENDING: "PENDING",
      SUCCESS: "SUCCESS",
      FAILED: "FAILED"
    };
    Role = {
      USER: "USER",
      ADMIN: "ADMIN"
    };
    MediaType = {
      MOVIE: "MOVIE",
      SERIES: "SERIES",
      ANIMATION: "ANIMATION"
    };
    PurchaseType = {
      BUY: "BUY",
      RENT: "RENT"
    };
    UserStatus = {
      ACTIVE: "ACTIVE",
      BANNED: "BANNED"
    };
  }
});

// generated/prisma/client.ts
var PrismaClient;
var init_client = __esm({
  "generated/prisma/client.ts"() {
    "use strict";
    init_class();
    init_prismaNamespace();
    init_enums();
    init_enums();
    PrismaClient = getPrismaClientClass();
  }
});

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString, adapter, prisma;
var init_prisma = __esm({
  "src/lib/prisma.ts"() {
    "use strict";
    init_client();
    connectionString = `${process.env.DATABASE_URL}`;
    adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  }
});

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oAuthProxy } from "better-auth/plugins";
var auth;
var init_auth = __esm({
  "src/lib/auth.ts"() {
    "use strict";
    init_prisma();
    init_enums();
    auth = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "postgresql"
      }),
      // আপনার ফ্রন্টেন্ড ডোমেইন এখানে দিন
      trustedOrigins: [process.env.APP_URL || "https://cinemay.vercel.app"],
      // baseURL অবশ্যই ব্যাকেন্ডের ডোমেইন হতে হবে যদি আলাদা হয়
      baseURL: process.env.BACKEND_URL || "https://cinemay-server.vercel.app",
      emailAndPassword: {
        enabled: true
      },
      advanced: {
        cookies: {
          // সেশন টোকেনের কনফিগারেশন
          session_token: {
            name: "better-auth.session_token",
            attributes: {
              httpOnly: true,
              secure: true,
              sameSite: "none"
              // ক্রস-ডোমেইন সাপোর্ট করার জন্য
            }
          },
          // স্টেট কুকির নাম আলাদা হতে হবে!
          state: {
            name: "better-auth.state",
            // এটি পরিবর্তন করুন
            attributes: {
              httpOnly: true,
              secure: true,
              sameSite: "none"
            }
          }
        }
      },
      user: {
        additionalFields: {
          role: { type: "string", isRequired: true, default: Role.USER },
          status: { type: "string", required: true, default: UserStatus.ACTIVE },
          phone: { type: "string", required: false },
          isPremium: { type: "boolean", required: true, default: false },
          resetCodeExpires: { type: "date", required: false },
          resetCode: { type: "string", required: false }
        }
      },
      socialProviders: {
        google: {
          prompt: "select_account consent",
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }
      },
      plugins: [oAuthProxy()]
    });
  }
});

// src/lib/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not Found",
    path: req.originalUrl,
    date: Date()
  });
}
var init_notFound = __esm({
  "src/lib/middlewares/notFound.ts"() {
    "use strict";
  }
});

// src/payment/payment.routes.ts
import { Router } from "express";
var router, paymentRoutes;
var init_payment_routes = __esm({
  "src/payment/payment.routes.ts"() {
    "use strict";
    router = Router();
    paymentRoutes = router;
  }
});

// src/lib/stripe.service.ts
import Stripe from "stripe";
var stripe, createPaymentIntent, stripeService;
var init_stripe_service = __esm({
  "src/lib/stripe.service.ts"() {
    "use strict";
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-01-27.acacia"
    });
    createPaymentIntent = async (amount, currency = "usd") => {
      return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Stripe takes amount in cents
        currency,
        payment_method_types: ["card"]
      });
    };
    stripeService = {
      createPaymentIntent
    };
  }
});

// src/user/user.services.ts
var getUserDashboardData, updateProfile, getProfile, userService;
var init_user_services = __esm({
  "src/user/user.services.ts"() {
    "use strict";
    init_prisma();
    getUserDashboardData = async (userId) => {
      const [profile, purchases, watchlists, reviews, comments] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId }
        }),
        prisma.purchase.findMany({
          where: {
            userId,
            OR: [
              { type: "BUY" },
              { type: "RENT", expiresAt: { gt: /* @__PURE__ */ new Date() } }
            ]
          },
          include: { movie: { select: { id: true, title: true, posterUrl: true, type: true } } },
          orderBy: { createdAt: "desc" }
        }),
        prisma.watchlist.findMany({
          where: { userId },
          include: { movie: { select: { id: true, title: true, posterUrl: true, ratingAverage: true } } }
        }),
        prisma.review.findMany({
          where: { userId },
          include: { movie: { select: { title: true } } },
          orderBy: { createdAt: "desc" }
        }),
        prisma.comment.findMany({
          where: { userId },
          include: { replies: true, review: { include: { movie: { select: { title: true } } } } },
          orderBy: { createdAt: "desc" }
        })
      ]);
      return { profile, purchases, watchlists, reviews, comments };
    };
    updateProfile = async (userId, data) => {
      return await prisma.user.update({
        where: { id: userId },
        data
      });
    };
    getProfile = async (userId) => {
      return await prisma.user.findUnique({
        where: {
          id: userId
        }
      });
    };
    userService = {
      getUserDashboardData,
      updateProfile,
      getProfile
    };
  }
});

// src/user/user.controller.ts
var subscribeUser, confirmUserSubscription, getDashboard, updateMyProfile, getMyProfile, userController;
var init_user_controller = __esm({
  "src/user/user.controller.ts"() {
    "use strict";
    init_stripe_service();
    init_prisma();
    init_user_services();
    init_enums();
    subscribeUser = async (req, res) => {
      try {
        const userId = req.user?.id;
        const { subscriptionType } = req.body;
        const existingPayment = await prisma.payment.findFirst({
          where: {
            userId,
            method: "STRIPE_USER_SUBSCRIPTION",
            status: PaymentStatus.PENDING
          }
        });
        if (existingPayment) return res.status(400).json(
          {
            success: false,
            ok: false,
            message: "You have a pending subscription. Please complete the payment.",
            transactionId: existingPayment.transactionId,
            clientSecret: existingPayment.clientSecret
          }
        );
        const userAlreadySubscribed = await prisma.payment.findFirst({
          where: {
            userId,
            method: "STRIPE_USER_SUBSCRIPTION",
            status: PaymentStatus.SUCCESS
          }
        });
        if (userAlreadySubscribed) return res.status(400).json({
          success: false,
          ok: false,
          message: "You already have an active subscription"
        });
        const price = subscriptionType === "MONTHLY" ? 199 : 1999;
        const user = await prisma.user.findUnique(
          {
            where: {
              id: userId
            }
          }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        const paymentIntent = await stripeService.createPaymentIntent(price);
        console.log(paymentIntent);
        if (!paymentIntent) return res.status(500).json({ message: "Failed to create payment intent" });
        const newPayment = await prisma.payment.create({
          data: {
            userId,
            amount: price,
            currency: "USD",
            transactionId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            method: "STRIPE_USER_SUBSCRIPTION"
          }
        });
        res.status(200).json({
          success: true,
          ok: true,
          message: "Payment Intent created successfully",
          ...newPayment
        });
      } catch (error) {
        res.status(500).json(
          {
            success: false,
            message: error.message
          }
        );
      }
    };
    confirmUserSubscription = async (req, res) => {
      try {
        const userId = req.user?.id;
        const { transactionId } = req.body;
        const updateUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            isPremium: true
          }
        });
        const updatePayment = await prisma.payment.update({
          where: {
            transactionId
          },
          data: {
            status: PaymentStatus.SUCCESS
          }
        });
        res.status(201).json({
          success: true,
          ok: true,
          message: "Subscription confirmed and access granted",
          data: updateUser
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };
    getDashboard = async (req, res) => {
      try {
        const userId = req.user?.id;
        const data = await userService.getUserDashboardData(userId);
        res.status(200).json({
          success: true,
          ok: true,
          message: "Dashboard data retrieved successfully",
          data
        });
      } catch (error) {
        res.status(500).json(
          {
            success: false,
            message: error.message
          }
        );
      }
    };
    updateMyProfile = async (req, res) => {
      try {
        const userId = req.user?.id;
        const { name, image, phone } = req.body;
        const updatedUser = await userService.updateProfile(userId, { name, image, phone });
        res.status(200).json({
          success: true,
          ok: true,
          message: "Profile updated successfully",
          data: updatedUser
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };
    getMyProfile = async (req, res) => {
      try {
        const userId = req.user?.id;
        const user = await userService.getProfile(userId);
        res.status(200).json({
          success: true,
          ok: true,
          message: "Profile retrieved successfully",
          data: user
        });
      } catch (error) {
        res.status(500).json(
          {
            success: false,
            message: error.message
          }
        );
      }
    };
    userController = {
      confirmUserSubscription,
      subscribeUser,
      getDashboard,
      updateMyProfile,
      getMyProfile
    };
  }
});

// src/lib/middlewares/checkAuth.ts
var checkAuth, checkAuth_default;
var init_checkAuth = __esm({
  "src/lib/middlewares/checkAuth.ts"() {
    "use strict";
    init_prisma();
    checkAuth = (...role) => {
      return async (req, res, next) => {
        const authCookie = req.cookies["better-auth.session_token"];
        console.log("Auth Cookie: ", authCookie);
        if (!authCookie) {
          return res.status(401).json({ error: "Unauthorized: No token found" });
        }
        const token = authCookie.split(".")[0];
        console.log("authcookie", authCookie);
        const session = await prisma.session.findFirst({
          where: {
            token
          },
          include: {
            user: true
          }
        });
        console.log("session ", session);
        if (!session || !session.user) {
          console.log("session ", session);
          return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          emailVerified: session.user.emailVerified,
          status: session.user.status,
          isPremium: session.user.isPremium
        };
        if (role.length > 0 && (!req.user.role || !role.includes(req.user.role))) {
          return res.status(403).json({ error: "Forbidden: You don't have permission" });
        }
        next();
      };
    };
    checkAuth_default = checkAuth;
  }
});

// src/user/user.routes.ts
import { Router as Router2 } from "express";
var router2, userRoutes;
var init_user_routes = __esm({
  "src/user/user.routes.ts"() {
    "use strict";
    init_user_controller();
    init_checkAuth();
    init_enums();
    router2 = Router2();
    router2.get("/dashboard", checkAuth_default(Role.USER), userController.getDashboard);
    router2.get("/profile", checkAuth_default(Role.USER, Role.ADMIN), userController.getMyProfile);
    router2.post("/subscribe", checkAuth_default(Role.USER), userController.subscribeUser);
    router2.post("/confirm-subscription", checkAuth_default(Role.USER), userController.confirmUserSubscription);
    router2.patch("/profile/update", checkAuth_default(Role.USER, Role.ADMIN), userController.updateMyProfile);
    userRoutes = router2;
  }
});

// src/error/AppError.ts
var AppError;
var init_AppError = __esm({
  "src/error/AppError.ts"() {
    "use strict";
    AppError = class extends Error {
      statusCode;
      constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
      }
    };
  }
});

// src/watchlist/watchlist.services.ts
var addToWatchlist, getWatchlistByUserId, removeFromWatchlist, watchlistService;
var init_watchlist_services = __esm({
  "src/watchlist/watchlist.services.ts"() {
    "use strict";
    init_AppError();
    init_prisma();
    addToWatchlist = async (data) => {
      try {
        const { userId, movieId } = data;
        const existingItem = await prisma.watchlist.findFirst({
          where: {
            userId,
            movieId
          }
        });
        if (existingItem) {
          throw new AppError("Media already in watchlist");
        }
        return await prisma.watchlist.create({
          data: {
            userId,
            movieId
          },
          include: {
            user: {},
            movie: {
              select: {
                id: true,
                title: true,
                genre: true,
                releaseYear: true,
                cast: true,
                reviews: {
                  select: {
                    rating: true
                  }
                },
                contentType: true,
                watchlists: {
                  select: {
                    userId: true
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError("Failed to Add to Watchlist");
      }
    };
    getWatchlistByUserId = async (userId) => {
      try {
        return await prisma.watchlist.findMany({
          where: {
            userId
          },
          include: {
            movie: {
              select: {
                id: true,
                title: true,
                customid: true,
                genre: true,
                releaseYear: true,
                cast: true,
                ratingAverage: true,
                contentType: true,
                posterUrl: true
              }
            }
          }
        });
      } catch (error) {
        throw new AppError("Failed to fetch watchlist");
      }
    };
    removeFromWatchlist = async (userId, movieId) => {
      try {
        console.log(movieId, userId);
        const existingItem = await prisma.watchlist.findFirst({
          where: {
            userId,
            movieId
          }
        });
        console.log(existingItem);
        if (!existingItem) {
          throw new AppError("Media not found in watchlist");
        }
        await prisma.watchlist.delete({
          where: {
            id: existingItem.id
          }
        });
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError("Failed to Remove from Watchlist");
      }
    };
    watchlistService = {
      addToWatchlist,
      getWatchlistByUserId,
      removeFromWatchlist
    };
  }
});

// src/watchlist/watchlist.controller.ts
var addToWatchlist2, getWatchlistByUserId2, removeFromWatchlist2, watchlistController;
var init_watchlist_controller = __esm({
  "src/watchlist/watchlist.controller.ts"() {
    "use strict";
    init_watchlist_services();
    addToWatchlist2 = async (req, res) => {
      try {
        const user = req.user;
        if (!user) {
          return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const { movieId } = req.body;
        const watchlistItem = await watchlistService.addToWatchlist({ userId: user.id, movieId });
        res.status(200).json({
          success: true,
          message: "Media added to watchlist successfully",
          ok: true,
          data: watchlistItem
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Add to Watchlist";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getWatchlistByUserId2 = async (req, res) => {
      try {
        const user = req.user;
        if (!user) {
          return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const watchlistItems = await watchlistService.getWatchlistByUserId(user.id);
        res.status(200).json({
          success: true,
          message: "Watchlist retrieved successfully",
          ok: true,
          data: watchlistItems
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Retrieve Watchlist";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    removeFromWatchlist2 = async (req, res) => {
      try {
        const user = req.user;
        if (!user) {
          return res.status(401).json({ success: false, message: "Unauthorized", data: null });
        }
        const movieId = req.params.id;
        const response = await watchlistService.removeFromWatchlist(user.id, movieId);
        res.status(200).json({
          success: true,
          message: "Media removed from watchlist successfully",
          ok: true,
          data: response
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Remove from Watchlist";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    watchlistController = {
      addToWatchlist: addToWatchlist2,
      getWatchlistByUserId: getWatchlistByUserId2,
      removeFromWatchlist: removeFromWatchlist2
    };
  }
});

// src/watchlist/watchlist.routes.ts
import { Router as Router3 } from "express";
var router3, watchListRoutes;
var init_watchlist_routes = __esm({
  "src/watchlist/watchlist.routes.ts"() {
    "use strict";
    init_checkAuth();
    init_enums();
    init_watchlist_controller();
    router3 = Router3();
    router3.post("/", checkAuth_default(Role.USER), watchlistController.addToWatchlist);
    router3.get("/", checkAuth_default(Role.USER), watchlistController.getWatchlistByUserId);
    router3.delete("/:id", checkAuth_default(Role.USER), watchlistController.removeFromWatchlist);
    watchListRoutes = router3;
  }
});

// src/review/review.services.ts
var addReview, editReview, deleteReview, getAllReviews, addLikeInReview, reviewServices;
var init_review_services = __esm({
  "src/review/review.services.ts"() {
    "use strict";
    init_AppError();
    init_prisma();
    addReview = async (reviewData, userId) => {
      try {
        const { movieId, rating, content, hasSpoiler } = reviewData;
        const result = await prisma.review.create({
          data: {
            movieId,
            content,
            rating,
            userId,
            hasSpoiler
          },
          include: {
            user: {
              select: {
                email: true,
                name: true,
                isPremium: true,
                image: true
              }
            },
            comments: true,
            likes: true
          }
        });
        return result;
      } catch (error) {
        throw error;
      }
    };
    editReview = async (reviewId, reviewData, userId) => {
      try {
        const { rating, content, movieId } = reviewData;
        const existingReview = await prisma.review.findUnique({
          where: {
            id: reviewId
          }
        });
        if (!existingReview) {
          throw new AppError("Review not found");
        }
        if (existingReview.userId !== userId) {
          throw new AppError("You are not authorized to edit this review", 403);
        }
        if (existingReview.isApproved) {
          throw new AppError("Approved review cannot be edited because it has already been approved.", 400);
        }
        const result = await prisma.review.update({
          where: {
            id: reviewId
            // isApproved: false
          },
          data: {
            rating,
            content,
            movieId
          }
        });
        return result;
      } catch (error) {
        throw error;
      }
    };
    deleteReview = async (reviewId, userId) => {
      try {
        const existingReview = await prisma.review.findUnique({
          where: {
            id: reviewId
          }
        });
        if (!existingReview) {
          throw new AppError("Review not found");
        }
        if (existingReview.userId !== userId) {
          throw new AppError("You are not authorized to delete this review", 403);
        }
        const result = await prisma.review.delete({
          where: {
            id: reviewId
          }
        });
        return result;
      } catch (error) {
        throw error;
      }
    };
    getAllReviews = async (userId) => {
      try {
        const findUser = await prisma.user.findUnique({
          where: {
            id: userId
          }
        });
        if (!findUser) {
          throw new AppError("User not found", 404);
        }
        const result = await prisma.review.findMany({
          where: {
            userId
          },
          include: {
            user: {
              select: {
                email: true,
                name: true,
                isPremium: true,
                image: true
              }
            },
            comments: true,
            likes: true,
            movie: {
              select: {
                title: true,
                streamingLink: true,
                genre: true,
                releaseYear: true,
                cast: true,
                type: true
              }
            }
          }
        });
        return result;
      } catch (error) {
        throw error;
      }
    };
    addLikeInReview = async (reviewId, userId) => {
      try {
        console.log(reviewId, userId);
        const existingLike = await prisma.like.findUnique({
          where: {
            userId_reviewId: {
              userId,
              reviewId
            }
          }
        });
        return await prisma.$transaction(async (tx) => {
          if (existingLike) {
            await tx.like.delete({
              where: {
                id: existingLike.id
              }
            });
            const updatedReview = await tx.review.update({
              where: { id: reviewId },
              data: {
                likeCount: {
                  decrement: 1
                }
              }
            });
            return {
              message: "Like removed",
              liked: false,
              totalLikes: updatedReview.likeCount
            };
          } else {
            await tx.like.create({
              data: {
                reviewId,
                userId
              }
            });
            const updatedReview = await tx.review.update({
              where: { id: reviewId },
              data: {
                likeCount: {
                  increment: 1
                }
              }
            });
            return {
              message: "Like added",
              liked: true,
              totalLikes: updatedReview.likeCount
            };
          }
        });
      } catch (error) {
        console.error("Error in addLikeInReview:", error);
        throw new Error("Failed to toggle like on review");
      }
    };
    reviewServices = {
      addReview,
      deleteReview,
      addLikeInReview,
      editReview,
      getAllReviews
    };
  }
});

// src/review/review.controller.ts
var addReview2, editReview2, deleteReview2, addLikeInReview2, getAllReviews2, reviewController;
var init_review_controller = __esm({
  "src/review/review.controller.ts"() {
    "use strict";
    init_review_services();
    addReview2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const reviewData = req.body;
        const result = await reviewServices.addReview(reviewData, userId);
        res.status(200).json({
          success: true,
          message: "Review Added Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Add Review";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    editReview2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const reviewId = req.params.reviewId;
        const reviewData = req.body;
        const result = await reviewServices.editReview(reviewId, reviewData, userId);
        res.status(200).json({
          success: true,
          message: "Review Updated Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Edit Review";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    deleteReview2 = async (req, res) => {
      try {
        const reviewId = req.params.reviewId;
        const userId = req.user?.id;
        const result = await reviewServices.deleteReview(reviewId, userId);
        res.status(200).json({
          success: true,
          message: "Review Deleted Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Delete Review";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    addLikeInReview2 = async (req, res) => {
      try {
        const { reviewId } = req.body;
        const userId = req.user?.id;
        const result = await reviewServices.addLikeInReview(reviewId, userId);
        res.status(200).json({
          success: true,
          message: "Review Liked Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Like Review";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllReviews2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const result = await reviewServices.getAllReviews(userId);
        res.status(200).json({
          success: true,
          message: "All Reviews Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Retrieve Reviews";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    reviewController = {
      addReview: addReview2,
      editReview: editReview2,
      deleteReview: deleteReview2,
      getAllReviews: getAllReviews2,
      addLikeInReview: addLikeInReview2
    };
  }
});

// src/review/review.routes.ts
import { Router as Router4 } from "express";
var router4, reviewRoutes;
var init_review_routes = __esm({
  "src/review/review.routes.ts"() {
    "use strict";
    init_review_controller();
    init_checkAuth();
    init_enums();
    router4 = Router4();
    router4.get("/", checkAuth_default(Role.USER), reviewController.getAllReviews);
    router4.post("/like-review", checkAuth_default(Role.USER), reviewController.addLikeInReview);
    router4.post("/add-review", checkAuth_default(Role.USER), reviewController.addReview);
    router4.patch("/:reviewId", checkAuth_default(Role.USER), reviewController.editReview);
    router4.delete("/:reviewId", checkAuth_default(Role.USER), reviewController.deleteReview);
    reviewRoutes = router4;
  }
});

// src/media/media.services.ts
var addMedia, getAllMedia, getMovie, getSeries, getAnimation, getMediaById, mediaService;
var init_media_services = __esm({
  "src/media/media.services.ts"() {
    "use strict";
    init_prisma();
    init_enums();
    addMedia = async (movie) => {
      try {
        const { category, customId, tmdb_id, ...movieData } = movie;
        let generatedCustomId = customId || movie.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").concat(`-${movie.releaseYear}`);
        const isCustomIdExist = await prisma.movie.findUnique({
          where: { customid: generatedCustomId }
        });
        if (isCustomIdExist) {
          generatedCustomId = `${generatedCustomId}-${Math.floor(100 + Math.random() * 900)}`;
        }
        const categoryConnection = Array.isArray(category) ? category.map((catName) => ({
          where: { name: catName.toUpperCase().trim() },
          create: { name: catName.toUpperCase().trim() }
        })) : [];
        const res = await prisma.movie.create({
          data: {
            ...movieData,
            type: movie.type,
            contentType: movie.contentType,
            tmdb_id: tmdb_id || movie.tmdb_id,
            customid: generatedCustomId,
            categories: {
              connectOrCreate: categoryConnection
            }
          },
          include: {
            categories: true
          }
        });
        return res;
      } catch (error) {
        console.error("Add Media Error:", error);
        throw new Error(error.message || "Failed to Add Media");
      }
    };
    getAllMedia = async (query) => {
      try {
        const {
          category,
          genre,
          releaseYear,
          rating,
          searchTerm,
          type,
          page = 1,
          limit = 10,
          sortBy,
          isPremium
        } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const andConditions = [];
        if (type) andConditions.push({ type });
        if (genre) andConditions.push({ genre: { has: genre } });
        if (releaseYear) andConditions.push({ releaseYear: parseInt(releaseYear) });
        if (rating) andConditions.push({ ratingAverage: { gte: parseFloat(rating) } });
        if (isPremium !== void 0) {
          const isPremiumValue = String(isPremium).toLowerCase() === "true";
          if (isPremiumValue) {
            andConditions.push({ contentType: ContentType.PREMIUM });
          } else {
            andConditions.push({ contentType: ContentType.FREE });
          }
        }
        if (category) {
          andConditions.push({
            categories: {
              some: {
                name: {
                  equals: category.toString().toUpperCase().trim()
                }
              }
            }
          });
        }
        if (searchTerm) {
          andConditions.push({
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { director: { contains: searchTerm, mode: "insensitive" } },
              { cast: { has: searchTerm } }
            ]
          });
        }
        const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};
        let orderBy = { createdAt: "desc" };
        if (sortBy === "priceLow") {
          orderBy = { buyPrice: "asc" };
        } else if (sortBy === "priceHigh") {
          orderBy = { buyPrice: "desc" };
        } else if (sortBy === "newest") {
          orderBy = { createdAt: "desc" };
        } else if (sortBy === "rating") {
          orderBy = { ratingAverage: "desc" };
        }
        const [data, total] = await prisma.$transaction([
          prisma.movie.findMany({
            where: whereCondition,
            skip,
            take,
            orderBy,
            // এখানে ডাইনামিক সর্টিং কাজ করবে
            include: { categories: true, reviews: true }
          }),
          prisma.movie.count({ where: whereCondition })
        ]);
        return {
          meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / take)
          },
          data
        };
      } catch (error) {
        console.error("PRISMA FILTER ERROR:", error);
        throw new Error("Failed to Get Filtered Media");
      }
    };
    getMovie = async (categoryName) => {
      try {
        return await prisma.movie.findMany({
          where: {
            type: MediaType.MOVIE,
            ...categoryName && {
              categories: { some: { name: { contains: categoryName, mode: "insensitive" } } }
            }
          },
          include: { categories: true },
          orderBy: { createdAt: "desc" }
        });
      } catch (error) {
        throw new Error("Failed to Get Movies");
      }
    };
    getSeries = async (categoryName) => {
      try {
        return await prisma.movie.findMany({
          where: {
            type: MediaType.SERIES,
            // আপনার এনুম অনুযায়ী TV_SHOW বা SERIES চেক করুন
            ...categoryName && {
              categories: { some: { name: { contains: categoryName, mode: "insensitive" } } }
            }
          },
          include: { categories: true },
          orderBy: { createdAt: "desc" }
        });
      } catch (error) {
        throw new Error("Failed to Get Series");
      }
    };
    getAnimation = async (categoryName) => {
      try {
        return await prisma.movie.findMany({
          where: {
            type: MediaType.ANIMATION,
            ...categoryName && {
              categories: { some: { name: { contains: categoryName, mode: "insensitive" } } }
            }
          },
          include: { categories: true }
        });
      } catch (error) {
        throw new Error("Failed to Get Animation");
      }
    };
    getMediaById = async (customid) => {
      try {
        return await prisma.movie.findUnique({
          where: { customid },
          include: {
            reviews: {
              where: { isApproved: true },
              include: {
                user: {
                  select: {
                    email: true,
                    name: true,
                    isPremium: true,
                    image: true,
                    phone: true
                  }
                },
                comments: {
                  include: {
                    user: {
                      select: {
                        email: true,
                        name: true,
                        isPremium: true,
                        image: true,
                        phone: true
                      }
                    }
                  }
                },
                _count: {
                  select: { comments: true, likes: true }
                }
              }
            },
            categories: true
          }
        });
      } catch (error) {
        throw new Error("Failed to Get Media by id");
      }
    };
    mediaService = {
      addMedia,
      getAllMedia,
      getMovie,
      getSeries,
      getAnimation,
      getMediaById
    };
  }
});

// src/media/media.controller.ts
var addMedia2, getAllMedia2, getMovie2, getSeries2, getAnimation2, getMediaById2, mediaController;
var init_media_controller = __esm({
  "src/media/media.controller.ts"() {
    "use strict";
    init_media_services();
    addMedia2 = async (req, res) => {
      try {
        const result = await mediaService.addMedia(req.body);
        res.status(200).json({
          success: true,
          message: "Media Added Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Add Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllMedia2 = async (req, res) => {
      try {
        const result = await mediaService.getAllMedia(req.query);
        res.status(200).json({
          success: true,
          message: "All Media Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Get  Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getMovie2 = async (req, res) => {
      try {
        const result = await mediaService.getMovie();
        res.status(200).json({
          success: true,
          message: "Movie Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Get  Movie";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getSeries2 = async (req, res) => {
      try {
        const result = await mediaService.getSeries();
        res.status(200).json({
          success: true,
          message: "Series Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Get  Series";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAnimation2 = async (req, res) => {
      try {
        const result = await mediaService.getAnimation();
        res.status(200).json({
          success: true,
          message: "Animation Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Get  Animation";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getMediaById2 = async (req, res) => {
      try {
        const { id } = req.params;
        const result = await mediaService.getMediaById(id);
        res.status(200).json({
          success: true,
          message: "Media Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Get  Media by id";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    mediaController = {
      addMedia: addMedia2,
      getAllMedia: getAllMedia2,
      getMovie: getMovie2,
      getSeries: getSeries2,
      getAnimation: getAnimation2,
      getMediaById: getMediaById2
    };
  }
});

// src/media/media.routes.ts
import { Router as Router5 } from "express";
var router5, mediaRoutes;
var init_media_routes = __esm({
  "src/media/media.routes.ts"() {
    "use strict";
    init_media_controller();
    init_checkAuth();
    init_enums();
    router5 = Router5();
    router5.post("/add-media", checkAuth_default(Role.ADMIN), mediaController.addMedia);
    router5.get("/all-media", mediaController.getAllMedia);
    router5.get("/movies", mediaController.getMovie);
    router5.get("/series", mediaController.getSeries);
    router5.get("/animations", mediaController.getAnimation);
    router5.get("/:id", mediaController.getMediaById);
    mediaRoutes = router5;
  }
});

// src/admin/admin.services.ts
var bulkAddMedia, getTheMovie, getAllUsers, banUser, deleteUser, getAllMedia3, editMedia, deleteMedia, addCategory, getAllPayments, getAllReviews3, updateReviewStatus, updateCategory, deleteReview3, getAllComments, deleteComment, getAllWatchlists, getAllCategories, deleteCategory, getAdminDashboardStats, adminServices;
var init_admin_services = __esm({
  "src/admin/admin.services.ts"() {
    "use strict";
    init_enums();
    init_AppError();
    init_prisma();
    bulkAddMedia = async (payload) => {
      const operations = payload.map((item) => {
        return prisma.movie.create({
          data: {
            tmdb_id: item.tmdb_id,
            title: item.title,
            customid: item.customid,
            type: item.type,
            // 'MOVIE' or 'SERIES'
            synopsis: item.synopsis,
            posterUrl: item.posterUrl,
            genre: item.genre,
            releaseYear: item.releaseYear,
            director: item.director,
            cast: item.cast,
            streamingLink: item.streamingLink,
            downloadLink: item.downloadLink,
            episodeLinks: item.episodeLinks,
            contentType: item.contentType,
            ratingAverage: item.ratingAverage,
            buyPrice: item.buyPrice,
            rentPrice: item.rentPrice,
            rentDuration: item.rentDuration,
            // ক্যাটাগরি কানেক্ট করার লজিক
            categories: {
              connect: item.categories?.map((catName) => ({ name: catName })) || []
            }
          }
        });
      });
      const results = await prisma.$transaction(operations);
      return results;
    };
    getTheMovie = async (id, type) => {
      const TMDB_API_KEY = "ce2a7837d2f4c072f0976a85f1d3a08a";
      if (!id) {
        throw new AppError("TMDB ID is required", 400);
      }
      const endpoint = type === "SERIES" ? "tv" : "movie";
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
        );
        if (!response.ok) {
          throw new AppError(`${type} not found on TMDB`, 404);
        }
        const data = await response.json();
        const title = type === "SERIES" ? data.name : data.title;
        const releaseDate = type === "SERIES" ? data.first_air_date : data.release_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
        const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
        const customid = year ? `${slug}-${year}` : slug;
        const formattedData = {
          tmdb_id: data.id.toString(),
          title,
          customid,
          type,
          // MOVIE অথবা SERIES
          synopsis: data.overview,
          posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w600_and_h900_face${data.poster_path}` : null,
          releaseYear: year,
          genre: data.genres?.map((g) => g.name).slice(0, 3) || [],
          // Series এর ক্ষেত্রে সাধারণত 'Created By' থাকে, Movie এর ক্ষেত্রে 'Director'
          director: type === "SERIES" ? data.created_by?.[0]?.name || "N/A" : data.credits?.crew?.find((c) => c.job === "Director")?.name || "Unknown",
          cast: data.credits?.cast?.slice(0, 8).map((c) => c.name) || [],
          ratingAverage: data.vote_average ? Number(data.vote_average.toFixed(1)) : 0
        };
        return formattedData;
      } catch (error) {
        console.error("TMDB Fetch Error:", error.message);
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to fetch details from TMDB", 500);
      }
    };
    getAllUsers = async (page = 1, limit = 10) => {
      const skip = (page - 1) * limit;
      const [users, totalUsers, countUsers, countAdmin] = await Promise.all([
        prisma.user.findMany({
          where: { role: Role.USER },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            image: true,
            isPremium: true,
            _count: {
              select: { reviews: true, payments: true, comments: true }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" }
        }),
        prisma.user.count(),
        prisma.user.count({ where: { role: Role.USER } }),
        prisma.user.count({ where: { role: Role.ADMIN } })
      ]);
      return { users, totalUsers, countUsers, countAdmin, page, totalPages: Math.ceil(countUsers / limit) };
    };
    banUser = async (userId, status) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError("User not found", 404);
      if (user.role === Role.ADMIN) throw new AppError("Admin cannot be banned", 403);
      return await prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.BANNED }
      });
    };
    deleteUser = async (userId) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError("User not found", 404);
      if (user.role === Role.ADMIN) throw new AppError("Admin cannot be deleted", 403);
      return await prisma.user.delete({ where: { id: userId } });
    };
    getAllMedia3 = async () => {
      const [media, totalMedia, mostReviewedMedia] = await Promise.all([
        prisma.movie.findMany({
          include: {
            categories: true,
            _count: { select: { reviews: true, purchases: true } }
          }
        }),
        prisma.movie.count(),
        prisma.movie.findMany({
          orderBy: { reviews: { _count: "desc" } },
          take: 5
        })
      ]);
      return { media, totalMedia, mostReviewedMedia };
    };
    editMedia = async (mediaId, updateData) => {
      const { category, ...movieData } = updateData;
      return await prisma.movie.update({
        where: { id: mediaId },
        data: {
          ...movieData,
          categories: category ? {
            set: [],
            connectOrCreate: category.map((name) => ({
              where: { name },
              create: { name }
            }))
          } : void 0
        }
      });
    };
    deleteMedia = async (mediaId) => {
      return await prisma.movie.delete({ where: { id: mediaId } });
    };
    addCategory = async (data) => {
      console.log(data);
      if (!data.name) {
        throw new AppError("Category name is required", 400);
      }
      if (data.name.length > 50) {
        throw new AppError("Category name must be less than 50 characters", 400);
      }
      const existingCategory = await prisma.category.findUnique({
        where: { name: data.name.toLocaleUpperCase() }
      });
      console.log(existingCategory);
      if (existingCategory) {
        throw new AppError("Category already exists", 400);
      }
      return await prisma.category.create({
        data: {
          name: data.name.toLocaleUpperCase(),
          description: data.description
        }
      });
    };
    getAllPayments = async () => {
      const [payments, revenueData, purchaseData] = await Promise.all([
        prisma.payment.findMany({
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" }
        }),
        prisma.payment.aggregate({
          where: { status: PaymentStatus.SUCCESS },
          _sum: { amount: true }
        }),
        prisma.purchase.groupBy({
          by: ["type"],
          _sum: { amount: true },
          _count: { id: true }
        })
      ]);
      const stats = {
        totalRevenue: revenueData._sum.amount || 0,
        buyRevenue: purchaseData.find((p) => p.type === PurchaseType.BUY)?._sum.amount || 0,
        rentRevenue: purchaseData.find((p) => p.type === PurchaseType.RENT)?._sum.amount || 0
      };
      return { payments, stats };
    };
    getAllReviews3 = async () => {
      const [reviews, stats, totalReviews] = await Promise.all([
        prisma.review.findMany({
          include: {
            user: { select: { name: true, image: true } },
            movie: { select: { title: true } }
          },
          orderBy: { createdAt: "desc" }
        }),
        prisma.review.aggregate({ _avg: { rating: true } }),
        prisma.review.count()
      ]);
      return { reviews, totalReviews, averageRating: stats._avg.rating || 0 };
    };
    updateReviewStatus = async (reviewId) => {
      return await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved: true }
      });
    };
    updateCategory = async (categoryId, name) => {
      const isDuplicate = await prisma.category.findFirst({
        where: {
          name,
          id: { not: categoryId }
        }
      });
      if (isDuplicate) {
        throw new AppError("Category name already exists", 400);
      }
      return await prisma.category.update({
        where: { id: categoryId },
        data: { name }
      });
    };
    deleteReview3 = async (reviewId) => {
      return await prisma.review.delete({
        where: { id: reviewId }
      });
    };
    getAllComments = async () => {
      const [comments, totalComments] = await Promise.all([
        prisma.comment.findMany({
          where: { parentId: null },
          // শুধু মেইন কমেন্টগুলো আনবে (Top-level)
          include: {
            user: { select: { name: true, image: true } },
            review: { include: { movie: { select: { title: true } } } },
            replies: {
              include: {
                user: { select: { name: true } }
              }
            }
          },
          orderBy: { createdAt: "desc" }
        }),
        prisma.comment.count()
      ]);
      return { comments, totalComments };
    };
    deleteComment = async (commentId) => {
      return await prisma.comment.delete({ where: { id: commentId } });
    };
    getAllWatchlists = async () => {
      const [watchlists, totalWatchlists] = await Promise.all([
        prisma.watchlist.findMany({
          include: {
            user: { select: { name: true, email: true } },
            movie: { select: { title: true, posterUrl: true } }
          }
        }),
        prisma.watchlist.count()
      ]);
      return { watchlists, totalWatchlists };
    };
    getAllCategories = async () => {
      try {
        return await prisma.category.findMany();
      } catch (error) {
        throw new AppError("Error fetching categories");
      }
    };
    deleteCategory = async (categoryId) => {
      try {
        return await prisma.category.delete({
          where: { id: categoryId },
          include: {
            movies: true
          }
        });
      } catch (error) {
        throw new AppError("Error deleting category");
      }
    };
    getAdminDashboardStats = async () => {
      try {
        const now = /* @__PURE__ */ new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const sevenDaysAgo = /* @__PURE__ */ new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const [
          totalUsers,
          totalMovies,
          totalReviews,
          totalComments,
          totalPurchases,
          totalWatchlistItems,
          currentMonthRevenueData,
          lastMonthRevenueData,
          contentDistribution,
          topRevenueMovies,
          activeRentalsCount,
          deviceStats,
          recentPayments
        ] = await prisma.$transaction([
          // বেসিক কাউন্টস
          prisma.user.count(),
          prisma.movie.count(),
          prisma.review.count(),
          prisma.comment.count(),
          prisma.purchase.count(),
          prisma.watchlist.count(),
          // বর্তমান মাসের রেভিনিউ
          prisma.payment.aggregate({
            where: { status: "SUCCESS", createdAt: { gte: firstDayOfMonth } },
            _sum: { amount: true }
          }),
          // গত মাসের রেভিনিউ
          prisma.payment.aggregate({
            where: {
              status: "SUCCESS",
              createdAt: { gte: firstDayOfLastMonth, lt: firstDayOfMonth }
            },
            _sum: { amount: true }
          }),
          // কন্টেন্ট ডিস্ট্রিবিউশন (Fix: _all এর বদলে নির্দিষ্ট ফিল্ড কাউন্ট)
          prisma.movie.groupBy({
            by: ["type"],
            _count: {
              type: true
            },
            orderBy: { type: "asc" }
          }),
          // Top 5 Most Profitable Movies (Fix: _all এর বদলে movieId কাউন্ট)
          prisma.purchase.groupBy({
            by: ["movieId"],
            _sum: { amount: true },
            _count: {
              movieId: true
            },
            orderBy: { _sum: { amount: "desc" } },
            take: 5
          }),
          // একটিভ রেন্টাল কাউন্ট
          prisma.purchase.count({
            where: {
              type: "RENT",
              expiresAt: { gte: now }
            }
          }),
          // ডিভাইস স্ট্যাটস (userAgent এর ওপর ভিত্তি করে)
          prisma.session.groupBy({
            by: ["userAgent"],
            _count: {
              userAgent: true
            },
            take: 5,
            orderBy: { _count: { userAgent: "desc" } }
          }),
          // রিসেন্ট ৫টি পেমেন্ট অ্যাক্টিভিটি
          prisma.payment.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true, image: true } } }
          })
        ]);
        const topMoviesFormatted = await Promise.all(
          topRevenueMovies.map(async (item) => {
            const movie = await prisma.movie.findUnique({
              where: { id: item.movieId },
              select: { title: true, posterUrl: true }
            });
            return {
              id: item.movieId,
              title: movie?.title || "Deleted Content",
              poster: movie?.posterUrl,
              totalRevenue: item._sum?.amount ?? 0,
              totalSales: item._count?.movieId ?? 0
            };
          })
        );
        const currentRev = currentMonthRevenueData._sum?.amount ?? 0;
        const lastRev = lastMonthRevenueData._sum?.amount ?? 0;
        let growthRate = "0.00";
        if (lastRev > 0) {
          growthRate = ((currentRev - lastRev) / lastRev * 100).toFixed(2);
        } else if (currentRev > 0) {
          growthRate = "100.00";
        }
        const salesDataRaw = await prisma.purchase.findMany({
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { createdAt: true, amount: true },
          orderBy: { createdAt: "asc" }
        });
        const premiumUsers = await prisma.user.count({ where: { isPremium: true } });
        return {
          success: true,
          data: {
            summary: {
              totalUsers,
              totalMovies,
              totalPurchases,
              totalComments,
              activeRentals: activeRentalsCount,
              totalRevenue: currentRev,
              revenueGrowth: `${growthRate}%`,
              premiumUsers
            },
            contentInsights: {
              distribution: contentDistribution.map((item) => ({
                type: item.type,
                count: item._count?.type ?? 0
              })),
              topPerforming: topMoviesFormatted
            },
            engagement: {
              totalWatchlistItems,
              totalReviews
            },
            recentActivities: {
              payments: recentPayments
            },
            technical: {
              deviceUsage: deviceStats.map((item) => ({
                browser: item.userAgent,
                count: item._count?.userAgent ?? 0
              }))
            },
            charts: {
              salesOverTime: salesDataRaw
            }
          }
        };
      } catch (error) {
        console.error("ADMIN_STATS_SERVICE_ERROR:", error);
        throw new Error(error.message || "Failed to generate admin report");
      }
    };
    adminServices = {
      addCategory,
      deleteCategory,
      getAllCategories,
      getTheMovie,
      getAllUsers,
      getAllReviews: getAllReviews3,
      getAllPayments,
      getAllMedia: getAllMedia3,
      editMedia,
      deleteMedia,
      updateReviewStatus,
      deleteReview: deleteReview3,
      deleteUser,
      banUser,
      getAllComments,
      deleteComment,
      getAllWatchlists,
      updateCategory,
      getAdminDashboardStats,
      bulkAddMedia
    };
  }
});

// src/admin/admin.controller.ts
var getAdminDashboardStats2, deleteCategory2, bulkAddMedia2, addCategory2, updateCategory2, getTheMovie2, getAllCategories2, getAllUsers2, getAllReviews4, getAllPayments2, getAllMedia4, getAllComments2, getAllWatchlists2, editMedia2, deleteMedia2, updateReviewStatus2, deleteReview4, deleteUser2, banUser2, deleteComment2, adminController;
var init_admin_controller = __esm({
  "src/admin/admin.controller.ts"() {
    "use strict";
    init_admin_services();
    init_AppError();
    getAdminDashboardStats2 = async (req, res) => {
      try {
        const result = await adminServices.getAdminDashboardStats();
        res.status(200).json({
          success: true,
          message: "Admin Dashboard Stats Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Admin Dashboard Stats";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    deleteCategory2 = async (req, res) => {
      try {
        const { id } = req.params;
        const result = await adminServices.deleteCategory(id);
        res.status(200).json({
          success: true,
          message: "Category Deleted Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Delete Category";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    bulkAddMedia2 = async (req, res) => {
      try {
        const data = req.body;
        const result = await adminServices.bulkAddMedia(data);
        res.status(200).json({
          success: true,
          message: "Media Added Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Add Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    addCategory2 = async (req, res) => {
      try {
        const data = req.body;
        const result = await adminServices.addCategory(data);
        res.status(200).json({
          success: true,
          message: "Category Added Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Add Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    updateCategory2 = async (req, res) => {
      try {
        const { id } = req.params;
        const { name } = req.body;
        const result = await adminServices.updateCategory(id, name);
        res.status(200).json({
          success: true,
          message: "Category Updated Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Update Category";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getTheMovie2 = async (req, res) => {
      try {
        const { id, type } = req.params;
        const result = await adminServices.getTheMovie(id, type);
        res.status(200).json({
          success: true,
          message: "The Movie DB Movie Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Movie";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllCategories2 = async (req, res) => {
      try {
        const result = await adminServices.getAllCategories();
        res.status(200).json({
          success: true,
          message: "Categories Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Categories";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllUsers2 = async (req, res) => {
      try {
        const result = await adminServices.getAllUsers();
        res.status(200).json({
          success: true,
          message: "Users Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Users";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllReviews4 = async (req, res) => {
      try {
        const result = await adminServices.getAllReviews();
        res.status(200).json({
          success: true,
          message: "Reviews Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Reviews";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllPayments2 = async (req, res) => {
      try {
        const result = await adminServices.getAllPayments();
        res.status(200).json({
          success: true,
          message: "Payments Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Payments";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllMedia4 = async (req, res) => {
      try {
        const result = await adminServices.getAllMedia();
        res.status(200).json({
          success: true,
          message: "Media Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllComments2 = async (req, res) => {
      try {
        const result = await adminServices.getAllComments();
        res.status(200).json({
          success: true,
          message: "Comments Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Retrieve Comments";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getAllWatchlists2 = async (req, res) => {
      try {
        const result = await adminServices.getAllWatchlists();
        res.status(200).json({
          success: true,
          message: "Watchlists Retrieved Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Retrieve Watchlists";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    editMedia2 = async (req, res) => {
      try {
        const { id } = req.params;
        const data = req.body;
        const result = await adminServices.editMedia(id, data);
        res.status(200).json({
          success: true,
          message: "Media Updated Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof AppError ? error.message : "Failed to Update Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    deleteMedia2 = async (req, res) => {
      try {
        const { id } = req.params;
        const result = await adminServices.deleteMedia(id);
        res.status(200).json({
          success: true,
          message: "Media Deleted Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Delete Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    updateReviewStatus2 = async (req, res) => {
      try {
        const { id } = req.params;
        const result = await adminServices.updateReviewStatus(id);
        res.status(200).json({
          success: true,
          message: "Review Status Updated Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Update Review Status";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    deleteReview4 = async (req, res) => {
      try {
        const { id } = req.params;
        const result = await adminServices.deleteReview(id);
        res.status(200).json({
          success: true,
          message: "Review Deleted Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Delete Review";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    deleteUser2 = async (req, res) => {
      try {
        const { id } = req.params;
        const result = await adminServices.deleteUser(id);
        res.status(200).json({
          success: true,
          message: "User Deleted Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Delete User";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    banUser2 = async (req, res) => {
      try {
        const { id } = req.params;
        const status = req.body.status;
        const result = await adminServices.banUser(id, status);
        res.status(200).json({
          success: true,
          message: "User Status Updated Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Update User Status";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    deleteComment2 = async (req, res) => {
      try {
        const { id } = req.params;
        const result = await adminServices.deleteComment(id);
        res.status(200).json({
          success: true,
          message: "Comment Deleted Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Delete Comment";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    adminController = {
      addCategory: addCategory2,
      getAdminDashboardStats: getAdminDashboardStats2,
      getTheMovie: getTheMovie2,
      getAllCategories: getAllCategories2,
      getAllUsers: getAllUsers2,
      getAllReviews: getAllReviews4,
      getAllPayments: getAllPayments2,
      getAllMedia: getAllMedia4,
      getAllComments: getAllComments2,
      getAllWatchlists: getAllWatchlists2,
      editMedia: editMedia2,
      deleteMedia: deleteMedia2,
      updateReviewStatus: updateReviewStatus2,
      deleteReview: deleteReview4,
      deleteUser: deleteUser2,
      banUser: banUser2,
      deleteComment: deleteComment2,
      updateCategory: updateCategory2,
      deleteCategory: deleteCategory2,
      bulkAddMedia: bulkAddMedia2
    };
  }
});

// src/admin/admin.routes.ts
import { Router as Router6 } from "express";
var router6, adminRoutes;
var init_admin_routes = __esm({
  "src/admin/admin.routes.ts"() {
    "use strict";
    init_admin_controller();
    init_checkAuth();
    init_enums();
    router6 = Router6();
    router6.get("/tmdb-movie/:id/:type", checkAuth_default(Role.ADMIN), adminController.getTheMovie);
    router6.get("/all-users", checkAuth_default(Role.ADMIN), adminController.getAllUsers);
    router6.get("/admin-dashboard-stats", checkAuth_default(Role.ADMIN), adminController.getAdminDashboardStats);
    router6.get("/all-reviews", checkAuth_default(Role.ADMIN), adminController.getAllReviews);
    router6.get("/all-payments", checkAuth_default(Role.ADMIN), adminController.getAllPayments);
    router6.get("/all-media", checkAuth_default(Role.ADMIN), adminController.getAllMedia);
    router6.get("/all-comments", checkAuth_default(Role.ADMIN), adminController.getAllComments);
    router6.get("/all-watchlists", checkAuth_default(Role.ADMIN), adminController.getAllWatchlists);
    router6.get("/all-categories", checkAuth_default(Role.ADMIN), adminController.getAllCategories);
    router6.post("/add-category", checkAuth_default(Role.ADMIN), adminController.addCategory);
    router6.post("/bulk-add-media", checkAuth_default(Role.ADMIN), adminController.bulkAddMedia);
    router6.patch("/edit-media/:id", checkAuth_default(Role.ADMIN), adminController.editMedia);
    router6.patch("/update-category/:id", checkAuth_default(Role.ADMIN), adminController.updateCategory);
    router6.patch("/update-review-status/:id", checkAuth_default(Role.ADMIN), adminController.updateReviewStatus);
    router6.patch("/update-user-status/:id", checkAuth_default(Role.ADMIN), adminController.banUser);
    router6.delete("/delete-media/:id", checkAuth_default(Role.ADMIN), adminController.deleteMedia);
    router6.delete("/delete-review/:id", checkAuth_default(Role.ADMIN), adminController.deleteReview);
    router6.delete("/delete-user/:id", checkAuth_default(Role.ADMIN), adminController.deleteUser);
    router6.delete("/delete-comment/:id", checkAuth_default(Role.ADMIN), adminController.deleteComment);
    router6.delete("/delete-category/:id", checkAuth_default(Role.ADMIN), adminController.deleteCategory);
    adminRoutes = router6;
  }
});

// src/lib/email.config.ts
import nodemailer from "nodemailer";
var transporter;
var init_email_config = __esm({
  "src/lib/email.config.ts"() {
    "use strict";
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
});

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken, verifyToken, decodeToken, jwtUtils;
var init_jwt = __esm({
  "src/utils/jwt.ts"() {
    "use strict";
    createToken = (payload, secret, { expiresIn }) => {
      const token = jwt.sign(payload, secret, { expiresIn });
      return token;
    };
    verifyToken = (token, secret) => {
      try {
        const verify = jwt.verify(token, secret);
        return {
          success: true,
          data: verify
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          error
        };
      }
    };
    decodeToken = (token) => {
      const decode = jwt.decode(token);
      return decode;
    };
    jwtUtils = {
      createToken,
      verifyToken,
      decodeToken
    };
  }
});

// src/utils/cookie.ts
var setCookie, getCookie, clearCookie, cookieFunc;
var init_cookie = __esm({
  "src/utils/cookie.ts"() {
    "use strict";
    setCookie = (res, key, value, options) => {
      res.cookie(key, value, options);
    };
    getCookie = (req, key) => {
      return req.cookies[key];
    };
    clearCookie = (res, key, options) => {
      res.clearCookie(key, options);
    };
    cookieFunc = {
      setCookie,
      getCookie,
      clearCookie
    };
  }
});

// src/utils/token.ts
var getAccessToken, setAccessTokenCookie, setBetterAuthAccessTokenCookie, tokenUtils;
var init_token = __esm({
  "src/utils/token.ts"() {
    "use strict";
    init_jwt();
    init_cookie();
    getAccessToken = async (payload) => {
      const accessToken = jwtUtils.createToken(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
      return accessToken;
    };
    setAccessTokenCookie = (res, token) => {
      cookieFunc.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        // 1 day
        maxAge: 60 * 60 * 24 * 1e3
      });
    };
    setBetterAuthAccessTokenCookie = (res, token) => {
      cookieFunc.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 1e3,
        path: "/"
      });
    };
    tokenUtils = {
      getAccessToken,
      setAccessTokenCookie,
      setBetterAuthAccessTokenCookie
    };
  }
});

// src/auth/auth.services.ts
import { hashPassword } from "better-auth/crypto";
var register, login, googleLogin, sendResetCode, verifyCodeAndResetPassword, authServices;
var init_auth_services = __esm({
  "src/auth/auth.services.ts"() {
    "use strict";
    init_enums();
    init_auth();
    init_email_config();
    init_prisma();
    init_token();
    init_AppError();
    register = async (data) => {
      try {
        const { email, password, name, phone } = data;
        const result = await auth.api.signUpEmail({
          body: {
            email,
            name,
            phone,
            role: Role.USER,
            status: UserStatus.ACTIVE,
            isPremium: false,
            password
          }
        });
        if (!result.user) {
          throw new Error("Registration failed");
        }
        let accessTokenGenerated = null;
        if (result?.token) {
          accessTokenGenerated = await tokenUtils.getAccessToken({
            token: result.token,
            id: result.user.id,
            email: result.user.email,
            emailVerified: result.user.emailVerified,
            role: result.user.role,
            status: result.user.status,
            isPremium: result.user.isPremium
          });
        }
        return { ...result, accessToken: accessTokenGenerated };
      } catch (error) {
        throw error;
      }
    };
    login = async (data) => {
      try {
        const { email, password } = data;
        const result = await auth.api.signInEmail({
          body: {
            email,
            password
          }
        });
        let accessTokenGenerated = null;
        if (result?.token) {
          accessTokenGenerated = await tokenUtils.getAccessToken({
            token: result.token,
            id: result.user.id,
            email: result.user.email,
            emailVerified: result.user.emailVerified,
            role: result.user.role,
            status: result.user.status,
            isPremium: result.user.isPremium
          });
        }
        return { ...result, accessToken: accessTokenGenerated };
      } catch (error) {
        throw error;
      }
    };
    googleLogin = async () => {
      try {
        const result = await auth.api.signInSocial({
          body: {
            provider: "google"
            // callbackURL: "http://localhost:3000/dashboard" // অপশনাল: লগইন শেষে কোথায় যাবে
          }
        });
        let accessTokenGenerated = null;
        return { ...result, accessToken: accessTokenGenerated };
      } catch (error) {
        console.error("Google Login Error:", error);
        throw error;
      }
    };
    sendResetCode = async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");
      const otpCode = Math.floor(1e5 + Math.random() * 9e5);
      const expires = new Date(Date.now() + 10 * 6e4);
      const data = await prisma.user.update({
        where: { email },
        data: {
          resetCode: otpCode,
          resetCodeExpires: expires
        }
      });
      const emailRes = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Password Reset Code",
        html: `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Password Reset Code</h2>
        <p>Use the following code to reset your password. It expires in 10 minutes.</p>
        <h1 style="color: #2563eb; letter-spacing: 5px;">${otpCode}</h1>
      </div>
    `
      });
      return { message: "Code sent to email" };
    };
    verifyCodeAndResetPassword = async (email, code, newPassword) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
          resetCode: code,
          resetCodeExpires: { gt: /* @__PURE__ */ new Date() }
        }
      });
      if (!user) throw new AppError("Invalid or expired code", 400);
      const hashedPassword = await hashPassword(newPassword);
      const result = await prisma.account.updateMany({
        where: {
          userId: user.id,
          providerId: "credential"
        },
        data: {
          password: hashedPassword
        }
      });
      await prisma.user.update({
        where: { email },
        data: {
          resetCode: null,
          resetCodeExpires: null
        }
      });
      return {
        success: true,
        message: "Password reset successful",
        ok: true,
        data: result
      };
    };
    authServices = {
      register,
      login,
      verifyCodeAndResetPassword,
      sendResetCode,
      googleLogin
    };
  }
});

// src/auth/auth.controller.ts
var register2, login2, forgotPassword, resetPassword, googleLogin2, authController;
var init_auth_controller = __esm({
  "src/auth/auth.controller.ts"() {
    "use strict";
    init_auth_services();
    init_token();
    register2 = async (req, res) => {
      try {
        console.log(req.body);
        const result = await authServices.register(req.body);
        if (result.accessToken) {
          tokenUtils.setBetterAuthAccessTokenCookie(res, result.token);
        }
        if (result.accessToken) {
          tokenUtils.setAccessTokenCookie(res, result.accessToken);
        }
        res.status(200).json({
          success: true,
          message: "User registered successfully",
          ok: true,
          result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Register User";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    login2 = async (req, res) => {
      try {
        const result = await authServices.login(req.body);
        if (result.accessToken) {
          tokenUtils.setBetterAuthAccessTokenCookie(res, result.token);
        }
        if (result.accessToken) {
          tokenUtils.setAccessTokenCookie(res, result.accessToken);
        }
        res.status(200).json({
          success: true,
          message: "User logged in successfully",
          ok: true,
          result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Login User";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    forgotPassword = async (req, res) => {
      try {
        const { email } = req.body;
        await authServices.sendResetCode(email);
        res.status(200).json({ success: true, message: "OTP sent to your email" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
    resetPassword = async (req, res) => {
      try {
        const { email, code, newPassword } = req.body;
        await authServices.verifyCodeAndResetPassword(email, code, newPassword);
        res.status(200).json({ success: true, message: "Password updated successfully" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
    googleLogin2 = async (req, res) => {
      try {
        const result = await authServices.googleLogin();
        res.status(200).json({
          success: true,
          message: "User logged in with Google successfully",
          ok: true,
          result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Login with Google";
        res.status(500).json({
          success: false,
          data: null,
          error: errorMessage
        });
      }
    };
    authController = {
      register: register2,
      login: login2,
      forgotPassword,
      resetPassword,
      googleLogin: googleLogin2
    };
  }
});

// src/auth/auth.routes.ts
import { Router as Router7 } from "express";
var router7, authRoutes;
var init_auth_routes = __esm({
  "src/auth/auth.routes.ts"() {
    "use strict";
    init_auth_controller();
    router7 = Router7();
    router7.post("/register", authController.register);
    router7.post("/login", authController.login);
    router7.post("/forgot-password", authController.forgotPassword);
    router7.post("/reset-password", authController.resetPassword);
    authRoutes = router7;
  }
});

// src/comment/comment.services.ts
var createComment, getCommentsByReview, deleteCommentById, commentServices;
var init_comment_services = __esm({
  "src/comment/comment.services.ts"() {
    "use strict";
    init_AppError();
    init_prisma();
    createComment = async (data) => {
      try {
        const newComment = await prisma.comment.create({
          data: {
            content: data.content,
            userId: data.userId,
            reviewId: data.reviewId,
            parentId: data.parentId || null
            // যদি রিপ্লাই হয় তবে parentId থাকবে
          },
          include: {
            user: {
              select: { name: true, image: true }
              // ইউজারের নাম ও ছবিসহ রিটার্ন করবে
            }
          }
        });
        return newComment;
      } catch (error) {
        throw new Error("Failed to post comment");
      }
    };
    getCommentsByReview = async (reviewId) => {
      return await prisma.comment.findMany({
        where: {
          reviewId,
          parentId: null
          // শুধু মেইন কমেন্টগুলো আগে আনবে
        },
        include: {
          user: { select: { name: true, image: true } },
          replies: {
            include: {
              user: { select: { name: true, image: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    };
    deleteCommentById = async (commentId, userId) => {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId }
      });
      if (!comment) {
        throw new AppError("Comment not found", 404);
      }
      if (comment.userId !== userId) {
        throw new AppError("Unauthorized to delete this comment", 403);
      }
      return await prisma.comment.delete({
        where: {
          id: commentId,
          userId
        }
      });
    };
    commentServices = {
      createComment,
      getCommentsByReview,
      deleteCommentById
    };
  }
});

// src/comment/comment.controller.ts
var postComment, getCommentsByReview2, deleteCommentById2, commentController;
var init_comment_controller = __esm({
  "src/comment/comment.controller.ts"() {
    "use strict";
    init_comment_services();
    postComment = async (req, res) => {
      const { content, reviewId, parentId } = req.body;
      const userId = req.user?.id;
      if (!content || !reviewId) {
        return res.status(400).json({ message: "Content and ReviewId are required" });
      }
      const commmentData = {
        content,
        reviewId,
        userId,
        parentId
      };
      const result = await commentServices.createComment(commmentData);
      res.status(201).json(
        {
          success: true,
          message: "Comment posted successfully",
          ok: true,
          data: result
        }
      );
    };
    getCommentsByReview2 = async (req, res) => {
      try {
        const { reviewId } = req.params;
        if (!reviewId) {
          return res.status(400).json({
            success: false,
            message: "Review ID is required"
          });
        }
        const comments = await commentServices.getCommentsByReview(reviewId);
        return res.status(200).json({
          success: true,
          ok: true,
          message: "Comments fetched successfully",
          count: comments.length,
          data: comments
        });
      } catch (error) {
        console.error("Fetch Comments Error:", error);
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch comments"
        });
      }
    };
    deleteCommentById2 = async (req, res) => {
      try {
        const { commentId } = req.params;
        const userId = req.user?.id;
        if (!commentId) {
          return res.status(400).json({
            success: false,
            message: "Comment ID is required"
          });
        }
        const comment = await commentServices.deleteCommentById(commentId, userId);
        return res.status(200).json({
          success: true,
          ok: true,
          message: "Comment deleted successfully",
          data: comment
        });
      } catch (error) {
        console.error("Delete Comment Error:", error);
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to delete comment"
        });
      }
    };
    commentController = {
      postComment,
      getCommentsByReview: getCommentsByReview2,
      deleteCommentById: deleteCommentById2
    };
  }
});

// src/comment/comment.routes.ts
import { Router as Router8 } from "express";
var router8, commentRoutes;
var init_comment_routes = __esm({
  "src/comment/comment.routes.ts"() {
    "use strict";
    init_client();
    init_checkAuth();
    init_comment_controller();
    router8 = Router8();
    router8.post("/add-comment", checkAuth_default(Role.USER), commentController.postComment);
    router8.get("/:reviewId", commentController.getCommentsByReview);
    router8.delete("/:commentId", checkAuth_default(Role.USER), commentController.deleteCommentById);
    commentRoutes = router8;
  }
});

// src/purchase/purchase.services.ts
var createPurchase, getUserPurchases, checkAccess, purchaseService;
var init_purchase_services = __esm({
  "src/purchase/purchase.services.ts"() {
    "use strict";
    init_enums();
    init_AppError();
    init_prisma();
    createPurchase = async (userId, movieId, type, paymentIntentId) => {
      const checkTransaction = await prisma.payment.findUnique({
        where: { transactionId: paymentIntentId }
      });
      if (!checkTransaction) throw new AppError("Payment transaction not found", 404);
      const alreadyPurchased = await prisma.purchase.findFirst({
        where: {
          userId,
          movieId,
          OR: [
            { type: "BUY" },
            {
              type: "RENT",
              expiresAt: { gt: /* @__PURE__ */ new Date() }
            }
          ]
        }
      });
      if (alreadyPurchased) throw new AppError("You have already purchased or rented this movie", 400);
      const movie = await prisma.movie.findUnique({
        where: { id: movieId }
      });
      if (!movie) throw new AppError("Movie not found", 404);
      if (movie.contentType === "FREE") throw new AppError("This movie is free, no need to purchase", 400);
      const amount = type === "BUY" ? movie.buyPrice : movie.rentPrice;
      let expiresAt = null;
      if (type === "RENT") {
        const duration = movie.rentDuration || 48;
        expiresAt = /* @__PURE__ */ new Date();
        expiresAt.setHours(expiresAt.getHours() + Number(duration));
      }
      const createPaymentInDB = await prisma.purchase.create({
        data: {
          userId,
          movieId,
          type,
          amount: amount || 0,
          expiresAt
          // explicit mapping
        },
        include: {
          movie: true,
          user: {
            select: { name: true, email: true, image: true }
          }
        }
      });
      const updatedPayment = await prisma.payment.update({
        where: { transactionId: paymentIntentId },
        data: {
          status: PaymentStatus.SUCCESS
        }
      });
      return { createPaymentInDB, updatedPayment };
    };
    getUserPurchases = async (userId) => {
      const now = /* @__PURE__ */ new Date();
      const movies = await prisma.purchase.findMany({
        where: {
          userId,
          OR: [
            {
              type: { not: "RENT" }
            },
            {
              type: "RENT",
              expiresAt: {
                gt: now
              }
            }
          ]
        },
        include: {
          movie: true
        },
        orderBy: { createdAt: "desc" }
      });
      const userSubscriptions = await prisma.payment.findMany({
        where: {
          userId,
          method: "STRIPE_USER_SUBSCRIPTION",
          status: PaymentStatus.SUCCESS
        },
        orderBy: { createdAt: "desc" }
      });
      return { movies, userSubscriptions };
    };
    checkAccess = async (userId, movieId) => {
      const purchase = await prisma.purchase.findFirst({
        where: {
          userId,
          movieId,
          OR: [
            { type: "BUY" },
            {
              type: "RENT",
              expiresAt: { gt: /* @__PURE__ */ new Date() }
            }
          ]
        }
      });
      return !!purchase;
    };
    purchaseService = {
      createPurchase,
      getUserPurchases,
      checkAccess
    };
  }
});

// src/purchase/purchase.controller.ts
var purchaseMovie, getMyMovies, startPurchase, confirmPurchase, purchaseController;
var init_purchase_controller = __esm({
  "src/purchase/purchase.controller.ts"() {
    "use strict";
    init_purchase_services();
    init_prisma();
    init_stripe_service();
    purchaseMovie = async (req, res) => {
      try {
        const { movieId, type } = req.body;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json(
          {
            success: false,
            message: "Unauthorized"
          }
        );
        const result = await purchaseService.createPurchase(userId, movieId, type);
        res.status(201).json({
          success: true,
          ok: true,
          message: `Movie ${type === "BUY" ? "purchased" : "rented"} successfully`,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed Purchase Media";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    getMyMovies = async (req, res) => {
      try {
        const userId = req.user?.id;
        const purchases = await purchaseService.getUserPurchases(userId);
        res.status(200).json(
          {
            success: true,
            ok: true,
            message: "User Purchases Movies retrieved successfully",
            data: purchases
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Get Movies";
        res.status(500).json(
          {
            success: false,
            data: null,
            error: errorMessage
          }
        );
      }
    };
    startPurchase = async (req, res) => {
      try {
        const { movieId, type } = req.body;
        const userId = req.user?.id;
        const movie = await prisma.movie.findUnique(
          {
            where: {
              id: movieId
            }
          }
        );
        if (movie?.contentType === "FREE") return res.status(400).json({ message: "This movie is free, no need to purchase" });
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        const isMovieAlreadyPurchased = await prisma.purchase.findFirst({
          where: {
            userId,
            movieId,
            OR: [
              { type: "BUY" },
              {
                AND: [
                  { type: "RENT" },
                  { expiresAt: { gt: /* @__PURE__ */ new Date() } }
                ]
              }
            ]
          }
        });
        if (isMovieAlreadyPurchased) return res.status(400).json(
          {
            success: false,
            ok: false,
            message: "You have already purchased or rented this movie"
          }
        );
        const price = type === "BUY" ? movie.buyPrice : movie.rentPrice;
        if (!price || price <= 0) return res.status(400).json({ message: "Invalid price" });
        const paymentIntent = await stripeService.createPaymentIntent(price);
        const newPayment = await prisma.payment.create({
          data: {
            userId,
            amount: price,
            currency: "USD",
            transactionId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            method: "STRIPE"
          }
        });
        res.status(200).json({
          success: true,
          ok: true,
          message: "Payment Intent created successfully",
          ...newPayment
        });
      } catch (error) {
        res.status(500).json(
          {
            success: false,
            message: error.message
          }
        );
      }
    };
    confirmPurchase = async (req, res) => {
      try {
        const { movieId, type, paymentIntentId } = req.body;
        const userId = req.user?.id;
        const purchase = await purchaseService.createPurchase(userId, movieId, type, paymentIntentId);
        res.status(201).json({
          success: true,
          ok: true,
          message: "Payment confirmed and access granted",
          data: purchase
        });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };
    purchaseController = {
      purchaseMovie,
      getMyMovies,
      startPurchase,
      confirmPurchase
    };
  }
});

// src/purchase/purchase.routes.ts
import { Router as Router9 } from "express";
var router9, purchaseRoutes;
var init_purchase_routes = __esm({
  "src/purchase/purchase.routes.ts"() {
    "use strict";
    init_enums();
    init_checkAuth();
    init_purchase_controller();
    router9 = Router9();
    router9.get("/", checkAuth_default(Role.USER), purchaseController.getMyMovies);
    router9.post("/create-payment-intent", checkAuth_default(Role.USER), purchaseController.startPurchase);
    router9.post("/confirm", checkAuth_default(Role.USER), purchaseController.confirmPurchase);
    purchaseRoutes = router9;
  }
});

// src/history/history.service.ts
var trackView, getHistory, clearHistory, historyService;
var init_history_service = __esm({
  "src/history/history.service.ts"() {
    "use strict";
    init_prisma();
    trackView = async (userId, data) => {
      return await prisma.viewHistory.upsert({
        where: {
          userId_mediaId: {
            userId,
            mediaId: data.mediaId
          }
        },
        update: {
          viewedAt: /* @__PURE__ */ new Date()
        },
        create: {
          userId,
          mediaId: data.mediaId
        }
      });
    };
    getHistory = async (userId) => {
      return await prisma.viewHistory.findMany({
        where: { userId },
        include: {
          media: true
        },
        orderBy: {
          viewedAt: "desc"
        }
      });
    };
    clearHistory = async (userId) => {
      return await prisma.viewHistory.deleteMany({
        where: { userId }
      });
    };
    historyService = {
      trackView,
      getHistory,
      clearHistory
    };
  }
});

// src/history/history.controller.ts
var trackView2, getHistory2, clearHistory2, historyController;
var init_history_controller = __esm({
  "src/history/history.controller.ts"() {
    "use strict";
    init_history_service();
    trackView2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(400).json({
            success: false,
            data: null,
            error: "User ID is required"
          });
        }
        const result = await historyService.trackView(userId, req.body);
        console.log(result);
        res.status(200).json({
          success: true,
          message: "History Updated Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Update History";
        res.status(500).json({
          success: false,
          data: null,
          error: errorMessage
        });
      }
    };
    getHistory2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(400).json({
            success: false,
            data: null,
            error: "User ID is required"
          });
        }
        const result = await historyService.getHistory(userId);
        res.status(200).json({
          success: true,
          message: "History Fetched Successfully",
          ok: true,
          data: result
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Fetch History";
        res.status(500).json({
          success: false,
          data: null,
          error: errorMessage
        });
      }
    };
    clearHistory2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(400).json({
            success: false,
            data: null,
            error: "User ID is required"
          });
        }
        await historyService.clearHistory(userId);
        res.status(200).json({
          success: true,
          message: "All History Cleared Successfully",
          ok: true,
          data: null
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to Clear History";
        res.status(500).json({
          success: false,
          data: null,
          error: errorMessage
        });
      }
    };
    historyController = {
      trackView: trackView2,
      getHistory: getHistory2,
      clearHistory: clearHistory2
    };
  }
});

// src/history/history.routes.ts
import express from "express";
var router10, HistoryRoutes;
var init_history_routes = __esm({
  "src/history/history.routes.ts"() {
    "use strict";
    init_enums();
    init_checkAuth();
    init_history_controller();
    router10 = express.Router();
    router10.post("/", checkAuth_default(Role.USER), historyController.trackView);
    router10.get("/", checkAuth_default(Role.USER), historyController.getHistory);
    router10.delete("/clear", checkAuth_default(Role.USER), historyController.clearHistory);
    HistoryRoutes = router10;
  }
});

// src/app.ts
import express2 from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import cookieParser from "cookie-parser";
var app, app_default;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    init_auth();
    init_notFound();
    init_payment_routes();
    init_user_routes();
    init_watchlist_routes();
    init_review_routes();
    init_media_routes();
    init_admin_routes();
    init_auth_routes();
    init_comment_routes();
    init_purchase_routes();
    init_history_routes();
    app = express2();
    app.use(cookieParser());
    app.use(express2.json());
    app.use(cors({
      origin: process.env.APP_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));
    app.all("/api/auth/*slat", toNodeHandler(auth));
    app.use("/api/media", mediaRoutes);
    app.use("/api/review", reviewRoutes);
    app.use("/api/watchlist", watchListRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/purchase", purchaseRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/history", HistoryRoutes);
    app.use("/api/authentication", authRoutes);
    app.get("/", async (req, res) => {
      res.send("Hello Cinemay Server");
    });
    app.use(notFound);
    app_default = app;
  }
});

// src/server.ts
import "dotenv/config";
var require_server = __commonJS({
  "src/server.ts"() {
    init_prisma();
    init_app();
    var port = process.env.PORT || 5e3;
    async function main() {
      try {
        await prisma.$connect();
        console.log("Database connected successfully...");
        app_default.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
        });
      } catch (error) {
        console.error("Error connecting to database:", error);
        await prisma.$disconnect();
        process.exit(1);
      }
    }
    main();
  }
});
export default require_server();
//# sourceMappingURL=server.mjs.map