import {z} from "zod";
import {FileDTO} from "@/resources/File";

export const SharedMediaComponentDTO = z.object({
  id: z.number(),
  __component: z.literal("shared.media"),
  file: FileDTO,
});

export type SharedMediaComponentType = z.infer<typeof SharedMediaComponentDTO>;
