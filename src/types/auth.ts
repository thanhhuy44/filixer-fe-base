import { z } from "zod";

import { loginSchema } from "@/zod/login-schema";
import { registerSchema } from "@/zod/register-schema";

export type LoginBody = z.infer<typeof loginSchema>;

export type RegisterBody = z.infer<typeof registerSchema>;
