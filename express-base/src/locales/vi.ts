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
  auth: {
    registered: 'Đăng ký thành công',
    loggedIn: 'Đăng nhập thành công',
    refreshed: 'Làm mới token thành công',
    invalidCredentials: 'Email hoặc mật khẩu không đúng',
    emailTaken: 'Email đã được đăng ký',
    unauthorized: 'Yêu cầu xác thực',
    invalidToken: 'Token không hợp lệ hoặc đã hết hạn',
    forbidden: 'Bạn không có quyền thực hiện hành động này',
    inactive: 'Tài khoản đã bị vô hiệu hóa',
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
