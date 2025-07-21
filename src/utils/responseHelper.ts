export const successResponse = (data: any, message: string = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

export const errorResponse = (message: string, errors?: any) => {
  return {
    success: false,
    message,
    errors
  };
};

export const paginationResponse = (data: any[], total: number, page: number, limit: number) => {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};