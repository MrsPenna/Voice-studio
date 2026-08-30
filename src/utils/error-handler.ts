/**
 * Error handling utilities
 */

export class ErrorHandler {
  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  }

  /**
   * Log error for debugging
   */
  static log(context: string, error: unknown): void {
    console.error(`[${context}]`, error);
  }

  /**
   * Handle async errors
   */
  static async handleAsync<T>(
    fn: () => Promise<T>,
    context: string
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      this.log(context, error);
      return null;
    }
  }

  /**
   * Create app error
   */
  static createAppError(
    code: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    return {
      code,
      message,
      timestamp: new Date(),
      context
    };
  }

  /**
   * Check if error is network related
   */
  static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('network') ||
        error.message.includes('fetch') ||
        error.message.includes('offline')
      );
    }
    return false;
  }

  /**
   * Check if error is timeout
   */
  static isTimeoutError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('timeout') || error.message.includes('timed out');
    }
    return false;
  }
}

export default ErrorHandler;
