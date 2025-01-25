import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-primary",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-white dark:hover:bg-red-900/90",
        outline:
          "border border-primary bg-white shadow-sm hover:bg-primary/10 hover:text-primary dark:border-primary dark:bg-background dark:hover:bg-primary/20 dark:hover:text-white",
        secondary:
          "bg-secondary text-white shadow-sm hover:bg-secondary/80 dark:bg-secondary dark:text-white dark:hover:bg-secondary/80",
        ghost: "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline dark:text-primary-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
