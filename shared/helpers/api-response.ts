export type ApiResponse<T> = {
  data: T
  success: boolean
  message: string
  timestamp: Date
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
  timestamp: Date
}

export function generatePaginatedResponse<T>(
  data: T[],
  pagination: PaginatedResponse<T>['pagination'],
  message: string = 'Paginated data fetched successfully',
  timestamp: Date = new Date(),
): PaginatedResponse<T> {
  return {
    success: true,
    message,
    data,
    pagination,
    timestamp,
  }
}

export function generateSuccessResponse<T>(
  data: T,
  message: string = 'Operation successful',
  timestamp: Date = new Date(),
): ApiResponse<T> {
  return {
    data,
    message,
    success: true,
    timestamp,
  }
}

export function generateErrorResponse(
  message: string = 'Operation failed',
  timestamp: Date = new Date(),
): ApiResponse<null> {
  return {
    data: null,
    message,
    success: false,
    timestamp,
  }
}
