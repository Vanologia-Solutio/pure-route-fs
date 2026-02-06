export type ApiResponse<T> = {
  data: T
  success: boolean
  message: string
}

export type PaginatedResponse<T> = {
  success: boolean
  message: string
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export function generatePaginatedResponse<T>(
  data: T[],
  pagination: PaginatedResponse<T>['pagination'],
  message: string = 'Paginated data fetched successfully',
): PaginatedResponse<T> {
  return {
    success: true,
    message,
    data,
    pagination,
  }
}

export function generateSuccessResponse<T>(
  data: T,
  message: string = 'Operation successful',
): ApiResponse<T> {
  return {
    data,
    message,
    success: true,
  }
}

export function generateErrorResponse(
  message: string = 'Operation failed',
): ApiResponse<null> {
  return {
    data: null,
    message,
    success: false,
  }
}
