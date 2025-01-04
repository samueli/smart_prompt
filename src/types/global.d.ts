/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "next-intl/middleware" {
  const createMiddleware: any;
  export default createMiddleware;
} 