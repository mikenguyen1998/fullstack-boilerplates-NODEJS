import type { TranslationSchema } from './en.js';

export const vi: TranslationSchema = {
  common: {
    success: 'Thành công',
    created: 'Tạo mới thành công',
    notFound: 'Không tìm thấy tài nguyên',
    routeNotFound: 'Không tìm thấy route {{method}} {{path}}',
    internalError: 'Lỗi máy chủ nội bộ',
    validationFailed: 'Dữ liệu không hợp lệ',
    tooManyRequests: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
    badRequest: 'Yêu cầu không hợp lệ',
    conflict: 'Tài nguyên đã tồn tại',
  },
  user: {
    notFound: 'Không tìm thấy người dùng',
    updated: 'Cập nhật người dùng thành công',
    deleted: 'Xóa người dùng thành công',
  },
  health: {
    ok: 'Dịch vụ hoạt động bình thường',
  },
};
