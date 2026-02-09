# IMAGE Reorganization Report

时间：2026-02-08 (PST)
目录：`/home/galaxy/projects/babynails/web-app/public/images/products`

## 1) 盘点结果（迁移前）
发现子目录：
- `brand_generated`
- `brand_generated_highend`
- `showcase_highend`
- `showcase_highend_noface`
- `originals_backup`
- `remastered`
- 根目录若干产品图

迁移前文件总数：40（含 `.gitkeep`）

## 2) 分类规则
按以下规则归类到 3 大类，并设置 `pending_review` 作为不确定缓冲：

1. **供货商原图** → `supplier_originals/`
   - `originals_backup/**`
   - 根目录基础产品图（如 `slug.png`）

2. **AI 产品图** → `ai_product_images/`
   - `brand_generated/**`
   - `brand_generated_highend/**`
   - `remastered/**`

3. **AI 展示图** → `ai_showcase_images/`
   - `showcase_*/**`

4. **待确认** → `pending_review/`
   - 命名语义不明确、无法高置信判断的文件

## 3) 真迁移（可回滚）
已执行 `move`（非拷贝）。

### 3.1 迁移前快照
- `public/images/products/reorg-snapshot-before.json`

### 3.2 回滚能力
- 回滚脚本：`public/images/products/reorg-rollback.sh`
  - 逆序移动文件到原位置
  - 同步回滚 `web-app` 内路径引用
- 引用变更 patch：`public/images/products/reorg-reference.patch`

## 4) 引用更新（避免断图）
已更新 `web-app` 内引用路径与查找逻辑：
- 批量路径替换（历史构建产物等）
- 源码逻辑更新：
  - `src/lib/products.ts`：改为在新分类目录中递归按 slug 查找（AI 产品图 / AI 展示图 / 供货商原图 / 待确认）
  - `src/app/api/vton/route.ts`：改为在 `public/images/products` 下递归定位产品图，兼容迁移后结构

## 5) 交付摘要（必填）
- **迁移文件数**：39
- **改引用处数 / 文件数**：207 处 / 8 文件（含 2 个源码逻辑文件）
- **残留待确认项**：1 项
  - `blush-aura-korean-style.png`

### 关键路径变更示例（2-3条）
1. `3d-chrome-molten-gold.png` → `supplier_originals/3d-chrome-molten-gold.png`
2. `brand_generated/3d-chrome-molten-gold-brand-v1.png` → `ai_product_images/brand_generated/3d-chrome-molten-gold-brand-v1.png`
3. `showcase_highend/french-glazed-donut-showcase-v1-01.jpg` → `ai_showcase_images/showcase_highend/french-glazed-donut-showcase-v1-01.jpg`

## 6) 机器可读汇总
- `public/images/products/reorg-summary.json`

---
如需，我可以再补一个 `pending_review` 的确认清单（建议归类 + 预览链接）以便你 1 次确认后自动落位。
## 空目录清理

- 时间：2026-02-08 01:56:46 PST
- 目标目录：`/home/galaxy/projects/babynails/web-app/public/images/products`
- 删除空目录数量：6

### 删除的目录列表
- `/home/galaxy/projects/babynails/web-app/public/images/products/showcase_highend_noface`
- `/home/galaxy/projects/babynails/web-app/public/images/products/showcase_highend`
- `/home/galaxy/projects/babynails/web-app/public/images/products/remastered`
- `/home/galaxy/projects/babynails/web-app/public/images/products/originals_backup`
- `/home/galaxy/projects/babynails/web-app/public/images/products/brand_generated_highend`
- `/home/galaxy/projects/babynails/web-app/public/images/products/brand_generated`

### 无法删除的目录
- （无）

### 分类目录检查
- supplier_originals: ✅ 存在且非空
- ai_product_images: ✅ 存在且非空
- ai_showcase_images: ✅ 存在且非空
- pending_review: ✅ 存在且非空
