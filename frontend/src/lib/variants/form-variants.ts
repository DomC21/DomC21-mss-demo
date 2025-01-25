import { cva } from "class-variance-authority"

export const formVariants = cva(
  "space-y-4",
  {
    variants: {
      layout: {
        default: "space-y-8",
        inline: "flex items-center space-x-4",
      },
    },
    defaultVariants: {
      layout: "default",
    },
  }
)
