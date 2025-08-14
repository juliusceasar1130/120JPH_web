/**
 * 最后修改时间->2025-08-11 16:40
 * 作者：chenliang
 */
//用于项目的logo和标题配置

// 获取环境变量中的API基础地址
const API_BASE = import.meta.env.VITE_SERVE || 'http://localhost:8080';

export default {
    title: import.meta.env.VITE_APP_TITLE || '120JPH数字化平台',
    logo: '/public/logo.png',
    logoHidden: true,//Logo组件是否隐藏

    // 统一API配置 - 使用环境变量
    avatar_upload_path: `${API_BASE}/file/avatarupload`,
    RP2_importData_path: `${API_BASE}/rp2/importData`,
    RP3_importData_path: `${API_BASE}/rp3/importData`,
}