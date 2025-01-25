// Badge variants
export const badgeVariants = {
  default: "bg-primary hover:bg-primary/80 text-primary-foreground",
  secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
  outline: "text-foreground",
  destructive: "bg-destructive hover:bg-destructive/80 text-destructive-foreground",
};

// Button variants
export const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

// Form variants
export const formVariants = {
  default: "space-y-8",
  inline: "flex items-center space-x-4",
};

// Navigation menu variants
export const navigationMenuTriggerStyle = "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50";

// Toggle variants
export const toggleVariants = {
  default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
  outline: "border border-input hover:bg-accent hover:text-accent-foreground",
};
