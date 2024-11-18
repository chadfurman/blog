import {z} from "zod";
import {SharedMediaComponentDTO} from "@/resources/SharedMediaComponent";
import {SharedQuoteComponentDTO} from "@/resources/SharedQuoteComponent";
import {SharedRichTextComponentDTO} from "@/resources/SharedRichTextComponent";

export const BlockDTO = z.union(
  [
    SharedMediaComponentDTO,
    SharedQuoteComponentDTO,
    SharedRichTextComponentDTO,
  ]
)
export type BlockType = z.infer<typeof BlockDTO>;