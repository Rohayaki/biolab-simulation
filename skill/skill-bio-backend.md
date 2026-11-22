---
name: bio-lab-minimalist-backend
description: Hợp đồng dữ liệu và API Backend (Express + MongoDB) cho mô phỏng thí nghiệm. Kiến trúc tinh gọn 1 Collection `Experiments`, 2 endpoint GET. Đây là NGUỒN SỰ THẬT về cấu trúc JSON mà Frontend sử dụng.
---

# Ưu tiên và phạm vi

- Skill `ai-architect-skeleton-generator` có quyền ưu tiên cao hơn. Ở đây AI được viết **Schema, seed data, route**; còn **nội dung controller** chỉ là khung (HTTP 501 + TODO).
- MVP: **1 collection** `Experiments`, **2 endpoint**: `GET /experiments`, `GET /experiments/:id`. Không có POST/PUT/DELETE, không có collection khác (User, Session, Result...).
- Mỗi bài thí nghiệm là **1 document duy nhất**, chứa toàn bộ kịch bản.

# Hợp đồng dữ liệu (Data Contract)

## Cấp document

| Trường | Kiểu | Bắt buộc | Ý nghĩa |
|---|---|---|---|
| `title` | String | có | Tên bài thí nghiệm |
| `description` | String | có | Mô tả ngắn, hiển thị trên card |
| `tools` | Array of Tool | có | Danh sách dụng cụ/hóa chất của Kho vật tư (Source Zone) |
| `tubes` | Array of Tube | có | Các ống nghiệm trên Bàn thí nghiệm (Action Zone), kèm trạng thái ban đầu |
| `reference_tube` | Object | có | Ống nghiệm nước cất đối chứng ở cột giữa. Ở bài glucose và Biuret nó tham gia thí nghiệm (là `target` của một số bước), ở bài lipid nó chỉ để so màu (xem mục Reference tube) |
| `steps` | Array of Step | có | Kịch bản các bước, sắp theo `step_order` |

## Tool

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `id` | String | Duy nhất trong document, snake_case (VD: `benedict_reagent`) |
| `name` | String | Tên hiển thị tiếng Việt (VD: "Thuốc thử Benedict") |
| `type` | String enum | `chemical` (hóa chất, thao tác `inject`), `heater` (đèn cồn, thao tác `heat`), `shaker` (kẹp ống nghiệm, thao tác `shake`) |

## Tube

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `id` | String | VD: `tube_1`, `tube_2` |
| `label` | String | Nhãn hiển thị |
| `initial_volume` | Number | **% chiều cao ống**, từ 0 đến 100 |
| `initial_color` | String | Mã **HEX** (VD: `#E8F4FA`) |

## Reference tube (ống đối chứng)

Ống nước cất đứng giữa Kho vật tư và Bàn thí nghiệm, để người học so màu mẫu thử với mẫu đối chứng (đối chứng âm). Có hai chế độ, **suy ra từ dữ liệu `steps`, không có cờ riêng**:

- **Tham gia thí nghiệm:** nếu có step nào có `target` bằng `reference_tube.id` (bài glucose và Biuret). Khi đó ống click được và là đích hợp lệ của thao tác.
- **Chỉ để so màu:** nếu không step nào nhắm vào nó (bài lipid). Khi đó ống hoàn toàn tĩnh.

Ống đối chứng **không nằm trong mảng `tubes`** của document (mảng đó chỉ là các ống thao tác), nhưng khi chạy, Frontend nạp nó vào state `tubes` theo `reference_tube.id`. Nó **không bao giờ** là `required_tool` của bước `pour` (không được dùng làm ống nguồn).

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `id` | String | Duy nhất, khác mọi `tube.id`. Quy ước: `tube_ref` |
| `label` | String | Nhãn hiển thị (VD: "Nước cất") |
| `volume` | Number | Thể tích **ban đầu**, **% chiều cao ống**, từ 0 đến 100 |
| `color` | String | Mã **HEX** ban đầu. Giá trị dùng trong seed: `#E8F4FA` (cùng màu `initial_color` của ống thao tác để so sánh công bằng) |

Quy ước thể tích để so màu công bằng: thể tích cuối của ống đối chứng bằng thể tích cuối của ống mẫu (VD glucose: đối chứng 25 + 25 = 50, mẫu 50).

## Step (CỰC KỲ QUAN TRỌNG)

Mỗi step là một "bước kiểm tra" cho Frontend. Frontend so sánh thao tác của người dùng với đúng 3 trường `action`, `required_tool`, `target`.

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `step_order` | Number | Thứ tự bước, bắt đầu từ 1 |
| `action` | String enum | `inject` \| `heat` \| `shake` \| `pour` |
| `required_tool` | String | "Chọn gì". Với `inject/heat/shake` là `tool.id`. Với `pour` là `tube.id` của ống **nguồn** |
| `target` | String | "Kết hợp với gì": `tube.id` của ống đích chịu tác động, hoặc `reference_tube.id` nếu bước tác động lên ống đối chứng |
| `success_ui_update` | Object | Kết quả hiển thị nếu thao tác đúng (xem bên dưới) |
| `error_message` | String | Thông báo khi thao tác sai ở bước này |

### `success_ui_update`

| Trường | Kiểu | Ghi chú |
|---|---|---|
| `colorCode` | String | **Chỉ dùng mã HEX**, KHÔNG dùng class Tailwind (Tailwind không sinh CSS cho class lấy từ API) |
| `addedVolume` | Number | **% chiều cao ống** cộng thêm vào `target`. Được phép bằng 0 (VD: bước đun nóng). Frontend phải chặn trần 100 |
| `effect` | String enum | `none` \| `bubbles` \| `precipitate` (kết tủa đáy ống: đỏ gạch Cu₂O ở glucose, xanh lam Cu(OH)₂ ở ống đối chứng Biuret; màu cặn là tông đậm hơn của chính `colorCode`) \| `cloudy` (huyền phù trắng đục). Mặc định `none` |

Quy ước riêng cho `pour`: ống nguồn (`required_tool`) về thể tích 0; ống đích (`target`) cộng `addedVolume` và nhận `colorCode`, `effect`.

# Mongoose Schema (được viết đầy đủ)

```js
const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['chemical', 'heater', 'shaker'], required: true },
}, { _id: false });

const TubeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  initial_volume: { type: Number, min: 0, max: 100, default: 0 },
  initial_color: { type: String, default: '#E8F4FA' },
}, { _id: false });

const StepSchema = new mongoose.Schema({
  step_order: { type: Number, required: true },
  action: { type: String, enum: ['inject', 'heat', 'shake', 'pour'], required: true },
  required_tool: { type: String, required: true },
  target: { type: String, required: true },
  success_ui_update: {
    colorCode: { type: String, required: true },
    addedVolume: { type: Number, min: 0, max: 100, default: 0 },
    effect: { type: String, enum: ['none', 'bubbles', 'precipitate', 'cloudy'], default: 'none' },
  },
  error_message: { type: String, required: true },
}, { _id: false });

const ReferenceTubeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  volume: { type: Number, min: 0, max: 100, default: 50 },
  color: { type: String, default: '#E8F4FA' },
}, { _id: false });

const ExperimentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tools: { type: [ToolSchema], required: true },
  tubes: { type: [TubeSchema], required: true },
  reference_tube: { type: ReferenceTubeSchema, required: true },
  steps: { type: [StepSchema], required: true },
});

module.exports = mongoose.model('Experiment', ExperimentSchema, 'Experiments');
```

# API

| Method | Đường dẫn | Phản hồi thành công | Lỗi |
|---|---|---|---|
| GET | `/experiments` | 200 + mảng `{ _id, title, description }` (không trả `steps`) | 500 |
| GET | `/experiments/:id` | 200 + document đầy đủ | 400 nếu `id` sai định dạng ObjectId; 404 nếu không tìm thấy; 500 lỗi server |

- Không có tiền tố `/api`.
- Mọi khối `catch` phải trả phản hồi, không để request treo.
- Giai đoạn dựng khung: controller trả `501` + `// TODO:`. Người dùng tự viết truy vấn.

# Ví dụ document rút gọn (đúng hợp đồng)

```json
{
  "title": "Nhận biết protein (phép thử Biuret)",
  "description": "Nhận biết protein bằng phản ứng màu của liên kết peptide với Cu2+ trong môi trường kiềm.",
  "tools": [
    { "id": "albumin_solution", "name": "Dung dịch albumin 1%", "type": "chemical" },
    { "id": "naoh_dilute", "name": "NaOH loãng", "type": "chemical" }
  ],
  "tubes": [
    { "id": "tube_1", "label": "Ống nghiệm 1", "initial_volume": 0, "initial_color": "#E8F4FA" }
  ],
  "reference_tube": { "id": "tube_ref", "label": "Nước cất", "volume": 15, "color": "#E8F4FA" },
  "steps": [
    {
      "step_order": 1,
      "action": "inject",
      "required_tool": "albumin_solution",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#EEF3F7", "addedVolume": 15, "effect": "none" },
      "error_message": "Bước 1: Hãy cho dung dịch albumin vào ống nghiệm trước."
    }
  ]
}
```

Dữ liệu đầy đủ của 3 bài nằm trong skill `bio-10-curriculum-context`.

# Seed data

- File `server/src/seed/experiments.seed.json`: mảng 3 document lấy từ `bio-10-curriculum-context`.
- File `server/src/seed/seed.js`: xóa collection cũ rồi `insertMany`. Chỉ dùng cho môi trường dev.