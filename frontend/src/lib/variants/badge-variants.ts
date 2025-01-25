import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white shadow hover:bg-primary/80 dark:bg-primary dark:text-white dark:hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-white hover:bg-secondary/80 dark:bg-secondary dark:text-white dark:hover:bg-secondary/80",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-white dark:hover:bg-red-900/80",
        outline: "text-primary border-primary dark:text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
