---
name: bio-lab-workspace-ui
description: Hướng dẫn dựng giao diện React + Tailwind cho Màn hình danh sách và Không gian làm việc (LabWorkspace), State bằng React Context, kèm chính sách chấm điểm thời gian thực (Wrong Action Policy). Tuân theo ai-architect-skeleton-generator.
---

# Ưu tiên và phạm vi

- Skill `ai-architect-skeleton-generator` có quyền ưu tiên cao hơn. AI chỉ dựng **UI tĩnh + khai báo State + hàm rỗng/TODO**. Toàn bộ logic ở mục "Chính sách chấm điểm" do người dùng tự viết.
- Dữ liệu lấy từ API của skill `bio-lab-minimalist-backend` (đúng tên trường, không tự đặt tên khác).
- Không dùng thư viện Drag-and-Drop. Chỉ point-and-click.

# Màn hình 1: Danh sách thí nghiệm (`ExperimentListPage`)

- Route `/`. Gọi `GET /experiments` **một lần** khi vào trang.
- Hiển thị dạng lưới thẻ card (`grid grid-cols-1 md:grid-cols-3 gap-4`). Mỗi `ExperimentCard` có `title`, `description` và nút "Bắt đầu".
- Click card điều hướng sang `/experiments/:id` (dùng `react-router-dom`).
- Cần có 3 trạng thái UI tĩnh: đang tải, lỗi tải, danh sách rỗng.

# Màn hình 2: Không gian làm việc (`LabPage` + `LabWorkspace`)

- Route `/experiments/:id`. Gọi `GET /experiments/:id` **một lần**, nạp vào Context. Sau đó mọi thao tác chạy cục bộ, **không gọi API thêm**.
- Có `StepProgress` (thanh/danh sách bước) ở phía trên để thể hiện bước hiện tại. Mỗi nhãn bước ("Bước 1") phải có `whitespace-nowrap` để không bị xuống dòng. `StepProgress` CHỈ hiển thị nhãn "Bước N" và trạng thái (đã xong, hiện tại, chưa tới). KHÔNG hiển thị `action`, `required_tool`, `target` hay `error_message` của bất kỳ bước nào, vì như vậy là lộ đáp án.

## Bố cục (grid 3 cột, trái - giữa - phải)

Container: `grid grid-cols-[minmax(0,1fr)_128px_minmax(0,1fr)] gap-3`. Thứ tự từ trái sang phải: Kho vật tư, Ống đối chứng, Bàn thí nghiệm.

**Bên trái: Kho vật tư (Source Zone), Read-only**
- Render từ mảng `experiment.tools` (hiển thị `name`), không hardcode.
- Trạng thái (thể tích, màu) của các bình ở đây là **BẤT BIẾN**. Không được viết state làm giảm lượng chất lỏng khi "hút".
- Chức năng duy nhất: click để chọn dụng cụ (`activeTool = tool.id`). Người dùng không thể đổ/bơm gì vào khu vực này.
- Click vào Source Zone khi đã đang cầm dụng cụ: **return sớm, không đổi bất kỳ state nào, không hiện Modal**.

**Bên phải: Bàn thí nghiệm (Action Zone)**
- Render từ `experiment.tubes`: mỗi ống là một `TestTube`.
- Đây là nơi duy nhất thay đổi state hiển thị (thể tích, màu, hiệu ứng).
- Hiển thị dụng cụ đang cầm bằng `name` tiếng Việt (tra theo `experiment.tools`), không hiển thị id kỹ thuật (VD `benedict_reagent`, `pour_from:tube_1`). Giao diện cũng không hiển thị `tool.type` và không ghi các thuật ngữ kỹ thuật "Source Zone"/"Action Zone" trong tiêu đề; dùng "Kho vật tư" và "Bàn thí nghiệm".
- Click vào một ống = thực hiện thao tác lên ống đó (xem chính sách chấm điểm).
- Với thao tác `pour`: người dùng click ống nguồn để đặt `activeTool = 'pour_from:<tube_id>'`, rồi click ống đích.

**Ở giữa: Ống đối chứng (Reference Tube)**
- Render từ `experiment.reference_tube` (`id`, `label`, `volume`, `color`) làm giá trị khởi tạo, nhưng **thể tích và màu đang hiển thị lấy từ state `tubes[reference_tube.id]`** (vì ống có thể thay đổi khi tham gia thí nghiệm). Card có viền nét đứt (`border-dashed`). Nhãn trên cùng "Đối chứng", dưới ống ghi `label`.
- **Hai chế độ, suy ra từ dữ liệu:** đặt `isReferenceInteractive = experiment.steps.some(step => step.target === experiment.reference_tube.id)`.
  - `isReferenceInteractive = true` (glucose, Biuret): ống click được (`cursor-pointer`), click gọi cùng handler với ống thao tác (`handleActOnTube(reference_tube.id)`). Dòng phụ dưới nhãn là "Mẫu đối chứng".
  - `isReferenceInteractive = false` (lipid): hoàn toàn tĩnh, bọc `pointer-events-none select-none`, không `onClick`. Dòng phụ là "Chỉ để so màu". Click không phải là thao tác: không chấm điểm, không Modal, không đổi `activeTool`.
- Ống đối chứng luôn nằm trong state `tubes` (được nạp từ `reference_tube`), nhưng KHÔNG nằm trong mảng `experiment.tubes` và KHÔNG bao giờ được dùng làm ống nguồn của `pour` (click nó khi `activeTool = null` không được "cầm ống").
- Cùng kích thước ống (`w-[76px] h-[210px]`), cùng đường đáy và cùng cấu trúc nhãn với ống ở Bàn thí nghiệm để mắt so màu chính xác. Độ cao chất lỏng đặt bằng style inline (`height: volume%`, `backgroundColor: color`), hiệu ứng `effect` (kể cả `precipitate`) dùng chung với `TestTube`, nên tách phần chất lỏng và hiệu ứng thành một component dùng chung (VD `TubeLiquid`) để hai ống luôn hiển thị giống nhau.
- Làm sai bước thì ống đối chứng cũng không đổi (như mọi ống). "Làm lại" đưa nó về `reference_tube.volume` và `reference_tube.color`.
- `reference_tube` là trường **bắt buộc** của mọi document, nên luôn render cột giữa. Không viết nhánh fallback bố cục 2 cột.

## Hành động suy ra từ loại dụng cụ

Frontend khai báo hằng số (không lấy từ DB):

| `tool.type` | Hành động khi click ống |
|---|---|
| `chemical` | `inject` |
| `heater` | `heat` |
| `shaker` | `shake` |
| (ống nguồn đang được chọn) | `pour` |

# State toàn cục (React Context, `LabContext.jsx`)

Chỉ được **khai báo** `initialState`, action types và `useLab()`; các case của reducer để `// TODO:`.

```js
export const initialState = {
  experiment: null,        // document từ GET /experiments/:id
  currentStep: 0,          // chỉ số trong experiment.steps (0-based)
  activeTool: null,        // null | tool.id | 'pour_from:<tube_id>'
  tubes: {},               // { [tube_id]: { volume, color, effect } }, nạp từ experiment.tubes VÀ reference_tube (khóa là reference_tube.id)
  status: 'idle',          // 'idle' | 'playing' | 'error' | 'completed'
  errorMessage: '',        // error_message của bước hiện tại khi sai
};
```

# Chính sách chấm điểm (Wrong Action Policy)

> Phần này do người dùng tự viết. AI chỉ để TODO nhắc đúng tên chính sách này.

- **Thời điểm chấm:** khi người dùng thực hiện thao tác lên một ống (click ống). KHÔNG chấm lúc chỉ chọn dụng cụ ở Source Zone.
- **Cách chấm:** so sánh `(action, required_tool, target)` của thao tác với `experiment.steps[currentStep]` đã có sẵn trong State. Không gọi API.
- **Nếu ĐÚNG:**
  1. Áp dụng `success_ui_update` lên `target`: `volume = Math.min(100, volume + addedVolume)`, `color = colorCode` (đổi thẳng sang màu cuối, không đổi dần), `effect = effect`.
  2. Với `pour`: ống nguồn về `volume = 0`.
  3. `activeTool = null`, `currentStep + 1`, phát hiệu ứng chuyển bước (xem dưới).
  4. Nếu vừa xong bước cuối thì `status = 'completed'`. Khi `completed`, **KHÔNG thay thế** Bàn thí nghiệm bằng màn hình khác: ống nghiệm với màu cuối phải còn hiển thị cạnh ống đối chứng để người học so màu. `CompletionScreen` chỉ là một banner/khung nhỏ nằm trong bố cục (không che ống nghiệm) kèm nút "Làm lại" và "Về danh sách". Mọi thao tác lên ống bị chặn khi `status !== 'playing'`.
- **Nếu SAI:**
  1. **KHÔNG** áp dụng `success_ui_update` (ống giữ nguyên thể tích, màu, hiệu ứng). Phải kiểm tra xong rồi mới được cập nhật UI.
  2. `activeTool = null` (bỏ lựa chọn sai).
  3. `currentStep` **GIỮ NGUYÊN**.
  4. `status = 'error'`, `errorMessage` = `error_message` của bước hiện tại, hiện `ErrorModal`.
  5. Đóng Modal thì `status = 'playing'`. Sai bao nhiêu lần cũng không được kẹt ở `error`.
- **Click ống khi `activeTool = null`:**
  - Nếu `experiment.tubes` có từ 2 ống trở lên, ống đó KHÔNG phải ống đối chứng, và có `volume > 0`: coi là "cầm ống nguồn", đặt `activeTool = 'pour_from:<tube_id>'`. Việc này KHÔNG chấm điểm, không tính là sai.
  - Các trường hợp còn lại: bỏ qua, không tính là sai.
- **Click chính ống nguồn đang cầm (`pour_from:<id>` trùng ống được click):** bỏ chọn (`activeTool = null`), không tính là sai.
- **Click ống đích khác khi `activeTool = 'pour_from:<id>'`:** chấm điểm như mọi thao tác khác, với `action = 'pour'`, `required_tool = <id ống nguồn>`, `target = <id ống được click>`.
- **Click ống đối chứng:**
  - Nếu `isReferenceInteractive = false` (lipid): bỏ qua hoàn toàn, `activeTool` giữ nguyên.
  - Nếu `isReferenceInteractive = true` và `activeTool = null`: bỏ qua (không "cầm ống").
  - Nếu `isReferenceInteractive = true` và đang cầm dụng cụ: chấm điểm như mọi thao tác, với `target = reference_tube.id`. Sai (VD đúng dụng cụ nhưng sai ống đích) thì báo lỗi theo Wrong Action Policy, ống đối chứng không đổi.

# Hiệu ứng

- **Chuyển bước đúng:** `StepProgress` đánh dấu bước vừa xong (đổi màu xanh) và bước kế tiếp được nhấn mạnh, dùng `transition-all duration-500`. Có thể thêm viền xanh nháy ngắn quanh ống.
- **Chất lỏng:** `TestTube` có `div` ngoài (khung ống) và `div` trong (chất lỏng) dùng `transition-all duration-500 ease-in-out`.
- **`effect`:** `bubbles` (các chấm nổi), `precipitate` (lớp cặn dưới đáy ống, màu là tông đậm hơn của CHÍNH màu chất lỏng nên đỏ gạch ở glucose và xanh lam ở ống đối chứng Biuret; KHÔNG dùng một màu cố định), `cloudy` (lớp phủ trắng mờ, `opacity`).

# Quy tắc Tailwind (QUAN TRỌNG)

- Tailwind quét class lúc build, nên **không** tạo class từ chuỗi nối hoặc từ dữ liệu API (`bg-${color}`, `h-[${v}%]` sẽ không có CSS).
- Màu và chiều cao lấy từ API/State phải đặt bằng **style inline**:

```jsx
<div
  className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
  style={{ height: `${tube.volume}%`, backgroundColor: tube.color }}
/>
```

- Class Tailwind chỉ dùng cho giá trị tĩnh (bố cục, viền, bo góc, transition).

# Quy tắc cho AI khi dựng khung

- Handler (`handleSelectTool`, `handleActOnTube`, `handleCloseModal`) chỉ chứa `// TODO:` nêu rõ mục chính sách tương ứng. Không có `setState`/`dispatch` thật.
- Gắn sẵn `onClick` nhưng trỏ tới các handler rỗng.
- Cursor đổi hình khi có `activeTool` (class tĩnh `cursor-pointer`, TODO cho phần đổi cursor theo state).