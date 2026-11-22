---
name: bio-10-curriculum-context
description: Ngữ cảnh chuyên môn Sinh học 10 (Bài 6: Thực hành nhận biết một số phân tử sinh học) và dữ liệu seed JSON của 3 thí nghiệm, tuân thủ hợp đồng dữ liệu của bio-lab-minimalist-backend.
---

# Ưu tiên và phạm vi

- Tuân thủ `ai-architect-skeleton-generator` (ưu tiên cao nhất) và hợp đồng dữ liệu của `bio-lab-minimalist-backend`.
- Chỉ có **3 thí nghiệm** của Bài 6 (glucose, lipid, protein). Không tự thêm bài khác (VD: tinh bột/iodine không thuộc Bài 6).
- Mọi thao tác, dụng cụ, hiện tượng phải bám sát giáo khoa. Không chép bất kỳ chuỗi tham chiếu nào như `[cite: ...]` vào dữ liệu.
- Dữ liệu seed bên dưới được phép chép **nguyên văn** vào `server/src/seed/experiments.seed.json` (là một mảng gồm 3 document).

# Danh mục vật tư thí nghiệm (Inventory)

- **Dụng cụ:** ống nghiệm, bình thuỷ tinh chịu nhiệt, pipet, ống nhỏ giọt, đèn cồn, kẹp ống nghiệm.
- **Hoá chất / nguyên liệu:** thuốc thử Benedict, nước cất, cồn ethanol tuyệt đối, NaOH loãng (10%), HCl, CuSO4 (1%), albumin 1%, đường glucose, lòng trắng trứng, dầu ăn.

Với MVP, mỗi thí nghiệm chỉ đưa vào `tools` những vật tư thực sự dùng trong kịch bản của nó.

# Quy ước chuyển nội dung giáo khoa thành dữ liệu

- "Chọn gì" là `required_tool`, "kết hợp với gì" là `target` (ống nghiệm chịu tác động).
- Hoá chất (`type: chemical`) dùng `inject`; đèn cồn (`heater`) dùng `heat`; kẹp ống nghiệm (`shaker`) dùng `shake`; rót sang ống khác dùng `pour`.
- `addedVolume` là **% chiều cao ống**. Quy ước: ~5 mL ≈ 20%, vài giọt ≈ 5%.
- Màu chỉ dùng mã **HEX**.
- Mọi thí nghiệm đều có `reference_tube` (`id` `tube_ref`, nước cất, `color` `#E8F4FA`) là ống đối chứng âm.
  - **Glucose:** `volume` ban đầu 25. Sau khi làm xong ống mẫu, người học cho Benedict vào ống đối chứng rồi đun nóng giống ống mẫu. Ống đối chứng giữ màu xanh, không kết tủa.
  - **Biuret:** `volume` ban đầu 15. Người học cho NaOH rồi CuSO4 vào ống đối chứng. Không có protein nên Cu²⁺ không tạo phức tím mà phản ứng với NaOH: CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄. Vì vậy ống đối chứng giữ màu xanh và **có kết tủa Cu(OH)₂ màu xanh lam** dưới đáy (bước 5 dùng `effect: "precipitate"`). Ống mẫu có protein thì chuyển tím và **không** có kết tủa.
  - **Lipid:** `volume` 50, không step nào nhắm vào nó, nên ống chỉ để so màu.
  - Thể tích cuối của ống đối chứng bằng thể tích cuối của ống mẫu (glucose 50, Biuret 55). Màu cuối của hai ống đối chứng cần giáo viên Sinh học xác nhận trước khi dùng trong lớp.

# Thí nghiệm 1: Nhận biết đường glucose (phép thử Benedict)

- **Nguyên lí:** trong môi trường kiềm, dung dịch copper sulphate (màu xanh) phản ứng với glucose khi đun nóng tạo kết tủa màu đỏ gạch của copper (I) oxide (Cu2O).
- **Các bước:**
  1. Hoà tan glucose vào nước để được dung dịch loãng.
  2. Trộn dung dịch glucose với thuốc thử Benedict (thể tích bằng nhau) trong ống nghiệm.
  3. Đun nóng bằng đun cách thuỷ hoặc hơ trên ngọn lửa đèn cồn, **không để sôi**.
- **Hiện tượng:** màu dung dịch chuyển dần từ xanh lục sang vàng, cam, và cuối cùng xuất hiện kết tủa đỏ gạch dưới đáy ống.

```json
{
  "title": "Nhận biết đường glucose (phép thử Benedict)",
  "description": "Dùng thuốc thử Benedict và đun nóng để nhận biết đường glucose qua kết tủa đỏ gạch.",
  "tools": [
    { "id": "glucose", "name": "Đường glucose", "type": "chemical" },
    { "id": "distilled_water", "name": "Nước cất", "type": "chemical" },
    { "id": "benedict_reagent", "name": "Thuốc thử Benedict", "type": "chemical" },
    { "id": "alcohol_lamp", "name": "Đèn cồn", "type": "heater" }
  ],
  "tubes": [
    { "id": "tube_1", "label": "Ống nghiệm", "initial_volume": 0, "initial_color": "#E8F4FA" }
  ],
  "reference_tube": { "id": "tube_ref", "label": "Nước cất", "volume": 25, "color": "#E8F4FA" },
  "steps": [
    {
      "step_order": 1,
      "action": "inject",
      "required_tool": "glucose",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#F4F6F7", "addedVolume": 10, "effect": "none" },
      "error_message": "Bước 1: Hãy cho đường glucose vào ống nghiệm trước."
    },
    {
      "step_order": 2,
      "action": "inject",
      "required_tool": "distilled_water",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#E8F4FA", "addedVolume": 15, "effect": "none" },
      "error_message": "Bước 2: Cho nước cất vào để hoà tan glucose thành dung dịch loãng."
    },
    {
      "step_order": 3,
      "action": "inject",
      "required_tool": "benedict_reagent",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#2E86C1", "addedVolume": 25, "effect": "none" },
      "error_message": "Bước 3: Cho thuốc thử Benedict vào ống nghiệm (thể tích bằng dung dịch glucose)."
    },
    {
      "step_order": 4,
      "action": "heat",
      "required_tool": "alcohol_lamp",
      "target": "tube_1",
      "success_ui_update": {
        "colorCode": "#B7410E",
        "addedVolume": 0,
        "effect": "precipitate"
      },
      "error_message": "Bước 4: Đun nóng ống nghiệm trên ngọn lửa đèn cồn (không để sôi)."
    },
    {
      "step_order": 5,
      "action": "inject",
      "required_tool": "benedict_reagent",
      "target": "tube_ref",
      "success_ui_update": { "colorCode": "#2E86C1", "addedVolume": 25, "effect": "none" },
      "error_message": "Bước 5: Cho thuốc thử Benedict vào ống nước cất đối chứng để so sánh."
    },
    {
      "step_order": 6,
      "action": "heat",
      "required_tool": "alcohol_lamp",
      "target": "tube_ref",
      "success_ui_update": { "colorCode": "#2E86C1", "addedVolume": 0, "effect": "none" },
      "error_message": "Bước 6: Đun nóng ống đối chứng trên đèn cồn giống ống mẫu (không để sôi)."
    }
  ]
}
```

# Thí nghiệm 2: Nhận biết lipid (phép thử nhũ tương)

- **Nguyên lí:** lipid không tan trong nước nhưng tan trong dung môi không phân cực như cồn; sự có mặt của lipid được nhận biết qua phép thử nhũ tương.
- **Các bước:**
  1. Cho 2 giọt dầu ăn vào ống nghiệm cùng 5 mL cồn tuyệt đối, lắc mạnh cho hoà tan hoàn toàn.
  2. Rót dung dịch này sang ống nghiệm khác chứa vài mL nước.
- **Hiện tượng:** xuất hiện huyền phù màu trắng sữa (dung dịch trở nên trắng như đám mây).

```json
{
  "title": "Nhận biết lipid (phép thử nhũ tương)",
  "description": "Hoà tan dầu ăn trong cồn rồi rót vào nước để quan sát huyền phù trắng sữa.",
  "tools": [
    { "id": "cooking_oil", "name": "Dầu ăn", "type": "chemical" },
    { "id": "absolute_ethanol", "name": "Cồn ethanol tuyệt đối", "type": "chemical" },
    { "id": "test_tube_holder", "name": "Kẹp ống nghiệm (lắc)", "type": "shaker" }
  ],
  "tubes": [
    { "id": "tube_1", "label": "Ống nghiệm 1", "initial_volume": 0, "initial_color": "#E8F4FA" },
    { "id": "tube_2", "label": "Ống chứa nước", "initial_volume": 30, "initial_color": "#E8F4FA" }
  ],
  "reference_tube": { "id": "tube_ref", "label": "Nước cất", "volume": 50, "color": "#E8F4FA" },
  "steps": [
    {
      "step_order": 1,
      "action": "inject",
      "required_tool": "cooking_oil",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#F4D03F", "addedVolume": 5, "effect": "none" },
      "error_message": "Bước 1: Cho 2 giọt dầu ăn vào ống nghiệm 1 trước."
    },
    {
      "step_order": 2,
      "action": "inject",
      "required_tool": "absolute_ethanol",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#F9E79F", "addedVolume": 20, "effect": "none" },
      "error_message": "Bước 2: Cho cồn ethanol tuyệt đối (5 mL) vào ống nghiệm 1."
    },
    {
      "step_order": 3,
      "action": "shake",
      "required_tool": "test_tube_holder",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#FEF9E7", "addedVolume": 0, "effect": "bubbles" },
      "error_message": "Bước 3: Dùng kẹp ống nghiệm lắc mạnh ống 1 cho dầu hoà tan hoàn toàn."
    },
    {
      "step_order": 4,
      "action": "pour",
      "required_tool": "tube_1",
      "target": "tube_2",
      "success_ui_update": { "colorCode": "#F3EFE4", "addedVolume": 25, "effect": "cloudy" },
      "error_message": "Bước 4: Rót dung dịch từ ống 1 sang ống 2 chứa nước."
    }
  ]
}
```

# Thí nghiệm 3: Nhận biết protein (phép thử Biuret)

- **Nguyên lí:** các liên kết peptide trong protein phản ứng với Cu2+ trong môi trường kiềm (CuSO4 và NaOH) tạo phức chất màu xanh tím, tím hoặc tím đỏ.
- **Các bước:**
  1. Cho dung dịch albumin 1% (hoặc lòng trắng trứng) vào ống nghiệm cùng 5 mL dung dịch NaOH loãng.
  2. Thêm 5 mL dung dịch CuSO4 1%.
- **Hiện tượng:** dung dịch chuyển dần từ xanh sang xanh tím sau vài phút.

```json
{
  "title": "Nhận biết protein (phép thử Biuret)",
  "description": "Nhận biết protein bằng phản ứng màu của liên kết peptide với Cu2+ trong môi trường kiềm.",
  "tools": [
    { "id": "albumin_solution", "name": "Dung dịch albumin 1%", "type": "chemical" },
    { "id": "naoh_dilute", "name": "NaOH loãng", "type": "chemical" },
    { "id": "cuso4_1pct", "name": "CuSO4 1%", "type": "chemical" }
  ],
  "tubes": [
    { "id": "tube_1", "label": "Ống nghiệm", "initial_volume": 0, "initial_color": "#E8F4FA" }
  ],
  "reference_tube": { "id": "tube_ref", "label": "Nước cất", "volume": 15, "color": "#E8F4FA" },
  "steps": [
    {
      "step_order": 1,
      "action": "inject",
      "required_tool": "albumin_solution",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#EEF3F7", "addedVolume": 15, "effect": "none" },
      "error_message": "Bước 1: Hãy cho dung dịch albumin 1% vào ống nghiệm trước."
    },
    {
      "step_order": 2,
      "action": "inject",
      "required_tool": "naoh_dilute",
      "target": "tube_1",
      "success_ui_update": { "colorCode": "#EAF1F6", "addedVolume": 20, "effect": "none" },
      "error_message": "Bước 2: Cho 5 mL dung dịch NaOH loãng để tạo môi trường kiềm."
    },
    {
      "step_order": 3,
      "action": "inject",
      "required_tool": "cuso4_1pct",
      "target": "tube_1",
      "success_ui_update": {
        "colorCode": "#6C4FB3",
        "addedVolume": 20,
        "effect": "none"
      },
      "error_message": "Bước 3: Thêm 5 mL dung dịch CuSO4 1% vào ống nghiệm."
    },
    {
      "step_order": 4,
      "action": "inject",
      "required_tool": "naoh_dilute",
      "target": "tube_ref",
      "success_ui_update": { "colorCode": "#EAF1F6", "addedVolume": 20, "effect": "none" },
      "error_message": "Bước 4: Cho 5 mL dung dịch NaOH loãng vào ống nước cất đối chứng."
    },
    {
      "step_order": 5,
      "action": "inject",
      "required_tool": "cuso4_1pct",
      "target": "tube_ref",
      "success_ui_update": { "colorCode": "#2E86C1", "addedVolume": 20, "effect": "precipitate" },
      "error_message": "Bước 5: Thêm 5 mL dung dịch CuSO4 1% vào ống nước cất đối chứng."
    }
  ]
}
```

# Hướng dẫn áp dụng

1. Khi được yêu cầu tạo seed data, ghép 3 document trên thành một mảng JSON trong `experiments.seed.json`.
2. Mỗi document phải qua được Mongoose Schema của `bio-lab-minimalist-backend` (đúng tên trường, đúng enum, `colorCode` là HEX).
3. Tổng thể tích mỗi ống (kể cả ống đối chứng) không vượt 100 và thể tích cuối của ống đối chứng bằng ống mẫu (đã kiểm tra với 3 bài trên). Nếu thêm bước mới, giữ ràng buộc này.
4. Không thêm thí nghiệm ngoài Bài 6 nếu người dùng chưa yêu cầu.