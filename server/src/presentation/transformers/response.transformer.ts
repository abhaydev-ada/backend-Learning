// Response Transformer — consistent API response format
export class ResponseTransformer {
  static success(data: any, message: string = 'Success', meta?: any) {
    return {
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    };
  }

  static error(message: string, errors?: any) {
    return {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    };
  }

  static paginated(data: any[], total: number, page: number, limit: number, message: string = 'Success') {
    return {
      success: true,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
