import * as z from "zod";

// form validation for line
export const LineValidation = z.object({
  text: z.string().min(1, { message: "Please write something" }),
  media: z.string().url().array().optional(),
  accountId: z.string(),
});

// form validation for comment
export const CommentValidation = z.object({
  comment: z.string().min(1, { message: "Please write something" }),
});
