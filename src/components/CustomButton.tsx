import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        button: "bg-[#3758F9] text-neutral-100 hover:bg-[#1B44C8] active:bg-[#1B44C8]",
        submit: "bg-[#10B981] text-neutral-100 hover:bg-[#088566] active:bg-[#088566]",
        cancel: "bg-[#F43F5E] text-neutral-100 hover:bg-[#B90202] active:bg-[#B90202]",
        edit: "bg-[#FFFFFF] border border-[#1B44C8] text-[#3758F9] rounded-[35px] hover:bg-[#1B44C8] hover:text-[#FFFFFF] active:bg-[#3758F9] active:text-[#FFFFFF] p-0",
        delete:
          "bg-[#FFFFFF] border border-[#F43F5E] text-[#FF0000] rounded-[35px] hover:bg-[#E58C8C] hover:text-[#FF0000] active:bg-[#E58C8C] active:text-[#FF0000] p-0",
        lock: "bg-[#FFFFFF] border border-[#EA580C] text-[#EA580C] rounded-[35px] hover:bg-[#EA580C] hover:text-[#FFFFFF] active:bg-[#EA580C] active:text-[#FFFFFF] p-0",
        unlock:
          "bg-[#FFFFFF] border border-[#14B8A6] text-[#14B8A6] rounded-[35px] hover:bg-[#088566] hover:text-[#FFFFFF] active:bg-[#088566] active:text-[#FFFFFF] p-0",
        active:
          "bg-[#DAF8E6] text-[#1A8245] rounded-[35px] hover:bg-[#1A8245] hover:text-[#FFFFFF] active:bg-[#146A36] active:text-[#FFFFFF] p-0",
        deactivate:
          "bg-[#FEEBEB] text-[#E10E0E] rounded-[35px] hover:bg-[#E10E0E] hover:text-[#FFFFFF] active:bg-[#B80B0B] active:text-[#FFFFFF] p-0",
        lockSta: "bg-[#FED7AA] text-[#EA580C] rounded-[35px]p-0",
        update:
          "bg-[#FFFFFF] border border-[#3758F9] text-[#3758F9] rounded-[35px] hover:bg-[#3758F9] hover:text-[#FFFFFF] active:bg-[#3758F9] active:text-[#FFFFFF] p-0",
        dispose:
          "bg-[#FFFFFF] border border-[#BF71E3] text-[#BF71E3] rounded-[35px] hover:bg-[#BF71E3] hover:text-[#FFFFFF] active:bg-[#BF71E3] active:text-[#FFFFFF] p-0",
        viewStockList:
          "bg-[#FFFFFF] border border-[#F6B40A] text-[#F6B40A] rounded-[35px] hover:bg-[#BF71E3] hover:text-[#FFFFFF] active:bg-[#BF71E3] active:text-[#FFFFFF] p-0",
        viewDisposalList:
          "bg-[#FFFFFF] border border-[#BF71E3] text-[#BF71E3] rounded-[35px] hover:bg-[#BF71E3] hover:text-[#FFFFFF] active:bg-[#BF71E3] active:text-[#FFFFFF] p-0",
      },
      size: {
        button: "h-10 px-4 py-2",
        modal: "h-10 px-4 py-2 w-[120]",
        md: "h-8 px-3",
        sm: "h-6 px-3",
      },
    },
    defaultVariants: {
      variant: "button",
      size: "button",
    },
  },
);

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
CustomButton.displayName = "Button";

export { CustomButton as Button, buttonVariants };
