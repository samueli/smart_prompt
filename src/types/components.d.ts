declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    style?: React.CSSProperties;
  }
}

declare module "@radix-ui/react-slot" {
  export interface SlotProps {
    children?: React.ReactNode;
  }
  export const Slot: React.FC<SlotProps>;
}

declare module "class-variance-authority" {
  export function cva(base: string, config: any): (...args: any[]) => string;
  export type VariantProps<T> = T extends (...args: any[]) => any
    ? Parameters<T>[0]
    : never;
} 