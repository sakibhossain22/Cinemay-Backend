import z4 from "zod/v4";

const validate = z4.object({
    email: z4.string().email(),
    password: z4.string().min(8),
});