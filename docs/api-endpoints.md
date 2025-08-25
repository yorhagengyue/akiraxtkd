# Akira X Taekwondo API Endpoints

基于Cloudflare Workers和D1数据库的RESTful API设计

## 🎯 Base URL
```
Production: https://akiraxtkd.pages.dev/api
Preview: https://preview.akiraxtkd.pages.dev/api
```

## 🔐 Authentication
- 使用JWT tokens进行身份验证
- 管理员和教练有不同的权限级别
- 所有写操作需要验证

## 📊 API Endpoints Overview

### 🧑‍🎓 Students Management
```
GET    /api/students              # 获取学员列表 (支持分页、筛选、搜索)
POST   /api/students              # 创建新学员
GET    /api/students/{id}         # 获取特定学员详情
PUT    /api/students/{id}         # 更新学员信息
DELETE /api/students/{id}         # 删除学员 (软删除)
GET    /api/students/{id}/belt-history    # 获取学员腰带进度历史
POST   /api/students/{id}/promote          # 学员升级腰带
GET    /api/students/{id}/attendance       # 获取学员出勤记录
GET    /api/students/{id}/payments         # 获取学员付费记录
GET    /api/students/{id}/classes          # 获取学员注册的课程
```

### 🥋 Belt System Management
```
GET    /api/belts                 # 获取所有腰带等级
POST   /api/belts                 # 创建新腰带等级
GET    /api/belts/{id}            # 获取特定腰带详情
PUT    /api/belts/{id}            # 更新腰带信息
DELETE /api/belts/{id}            # 删除腰带等级
GET    /api/belts/progression     # 获取腰带进度路径
```

### 📚 Classes Management
```
GET    /api/classes               # 获取所有课程
POST   /api/classes               # 创建新课程
GET    /api/classes/{id}          # 获取特定课程详情
PUT    /api/classes/{id}          # 更新课程信息
DELETE /api/classes/{id}          # 删除课程
GET    /api/classes/{id}/students # 获取课程的学员列表
POST   /api/classes/{id}/enroll   # 学员注册课程
DELETE /api/classes/{id}/students/{student_id} # 取消学员课程注册
GET    /api/classes/{id}/attendance/{date}      # 获取特定日期的出勤情况
POST   /api/classes/{id}/attendance             # 记录出勤
```

### 👨‍🏫 Instructors Management
```
GET    /api/instructors           # 获取教练列表
POST   /api/instructors           # 添加新教练
GET    /api/instructors/{id}      # 获取教练详情
PUT    /api/instructors/{id}      # 更新教练信息
DELETE /api/instructors/{id}      # 删除教练
GET    /api/instructors/{id}/classes    # 获取教练的课程安排
GET    /api/instructors/{id}/students   # 获取教练的学员列表
```

### 📍 Locations Management
```
GET    /api/locations             # 获取所有训练场地
POST   /api/locations             # 添加新场地
GET    /api/locations/{id}        # 获取场地详情
PUT    /api/locations/{id}        # 更新场地信息
DELETE /api/locations/{id}        # 删除场地
GET    /api/locations/{id}/classes      # 获取场地的课程安排
```

### 📋 Attendance Management
```
GET    /api/attendance            # 获取出勤记录 (支持日期范围筛选)
POST   /api/attendance            # 批量记录出勤
GET    /api/attendance/statistics # 获取出勤统计
GET    /api/attendance/student/{id}     # 获取特定学员出勤记录
GET    /api/attendance/class/{id}       # 获取特定课程出勤记录
PUT    /api/attendance/{id}             # 更新出勤记录
DELETE /api/attendance/{id}             # 删除出勤记录
```

### 💰 Payments Management
```
GET    /api/payments              # 获取付费记录
POST   /api/payments              # 记录新付费
GET    /api/payments/{id}         # 获取付费详情
PUT    /api/payments/{id}         # 更新付费记录
DELETE /api/payments/{id}         # 删除付费记录
GET    /api/payments/overdue      # 获取逾期付费
GET    /api/payments/statistics   # 获取付费统计
GET    /api/payments/student/{id} # 获取学员付费历史
```

### 🏆 Competitions Management
```
GET    /api/competitions          # 获取比赛列表
POST   /api/competitions          # 创建新比赛
GET    /api/competitions/{id}     # 获取比赛详情
PUT    /api/competitions/{id}     # 更新比赛信息
DELETE /api/competitions/{id}     # 删除比赛
GET    /api/competitions/{id}/participants  # 获取比赛参与者
POST   /api/competitions/{id}/register      # 学员报名比赛
PUT    /api/competitions/{id}/results       # 更新比赛结果
```

### 📊 Dashboard & Statistics
```
GET    /api/dashboard/stats       # 获取仪表板统计数据
GET    /api/dashboard/recent-activities    # 获取最近活动
GET    /api/reports/attendance    # 出勤报告
GET    /api/reports/revenue       # 收入报告
GET    /api/reports/belt-progression      # 腰带进度报告
GET    /api/reports/student-growth        # 学员增长报告
```

### 🔍 Search & Filters
```
GET    /api/search/students       # 搜索学员
GET    /api/search/global         # 全局搜索
```

## 📝 Request/Response Examples

### Create Student
```http
POST /api/students
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "2010-05-15",
  "gender": "Male",
  "phone": "+65 8123 4567",
  "email": "parent@example.com",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+65 8765 4321",
  "emergency_contact_relationship": "Mother",
  "address": "123 Main Street",
  "postal_code": "123456"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": 22,
    "student_code": "AXT2024022",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "date_of_birth": "2010-05-15",
    "gender": "Male",
    "phone": "+65 8123 4567",
    "email": "parent@example.com",
    "emergency_contact_name": "Jane Doe",
    "emergency_contact_phone": "+65 8765 4321",
    "emergency_contact_relationship": "Mother",
    "address": "123 Main Street",
    "postal_code": "123456",
    "joined_date": "2024-12-19",
    "status": "Active",
    "created_at": "2024-12-19T10:30:00Z",
    "updated_at": "2024-12-19T10:30:00Z"
  },
  "message": "Student created successfully"
}
```

### Get Students with Filters
```http
GET /api/students?page=1&limit=10&status=Active&gender=Male&belt_level_id=7&search=john&sort_field=joined_date&sort_order=DESC
```

### Response with Pagination
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "student_code": "AXT2024003",
      "first_name": "Avaneesh",
      "last_name": "",
      "full_name": "Avaneesh ",
      "date_of_birth": "2016-09-11",
      "gender": "Male",
      "status": "Active",
      "current_belt": {
        "id": 7,
        "belt_name": "Green Belt",
        "belt_color": "Green",
        "level_order": 7
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "total_pages": 2,
    "has_next": true,
    "has_prev": false
  }
}
```

### Record Attendance
```http
POST /api/attendance
Content-Type: application/json

{
  "class_id": 1,
  "attendance_date": "2024-12-19",
  "records": [
    {
      "student_id": 1,
      "status": "Present",
      "arrival_time": "20:00"
    },
    {
      "student_id": 2,
      "status": "Late",
      "arrival_time": "20:15"
    },
    {
      "student_id": 3,
      "status": "Absent"
    }
  ]
}
```

## 🔒 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid student data provided",
  "details": {
    "field_errors": {
      "email": "Invalid email format",
      "date_of_birth": "Date cannot be in the future"
    }
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## 🚀 Implementation Priority

### Phase 1 (MVP)
1. Students CRUD operations
2. Belt levels management
3. Basic classes management
4. Simple attendance recording
5. Basic dashboard stats

### Phase 2 (Enhanced Features)
1. Payment management
2. Advanced reporting
3. Competition management
4. Instructor management
5. Location management

### Phase 3 (Advanced Features)
1. Real-time notifications
2. Mobile app API
3. Parent portal
4. Automated billing
5. Advanced analytics

## 📱 Frontend Integration

### React Hook Examples
```typescript
// Custom hooks for API calls
const { students, loading, error } = useStudents({
  page: 1,
  limit: 10,
  filters: { status: 'Active' }
});

const { mutate: createStudent } = useCreateStudent();
const { mutate: recordAttendance } = useRecordAttendance();
```

这个API设计确保了：
- ✅ RESTful规范
- ✅ 完整的CRUD操作
- ✅ 灵活的查询和筛选
- ✅ 分页支持
- ✅ 错误处理
- ✅ 扩展性考虑
- ✅ 前端友好的数据结构

