declare module 'aos' {
  interface AosOptions {
    duration?: number;
    once?: boolean;
    [key: string]: any;
  }

  interface AOS {
    init(options?: AosOptions): void;
    refresh(): void;
  }

  const aos: AOS;
  export = aos;
}