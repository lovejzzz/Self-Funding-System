# Stripe Projects + OpenRouter：账单对象与最小可对账证据

研究时间：2026-08-24T01:44:21Z
研究范围：Horizon A；美国 verified operator、USD、Stripe Projects、OpenRouter pay-as-you-go。
性质：支付控制、供应商成本与实验设计约束，不是法律、会计、税务或财务建议。具体实体、州、payment method、费用确认时点、税务处理和凭证留存仍需美国律师与会计师按 live 合同和账单复核。

## 研究问题

**Stripe Projects 为 OpenRouter pay-as-you-go 实际建立了什么付款对象；当前公开证据是否足以把一笔 OpenRouter job cost 对账到 operator 的真实外部付款？**

这是一个问题，而不是两个并行产品比较：对象类型决定了哪些状态、权限和对账证据今天可以建立，也决定了第一笔 live provider spend 是否能在不扩大 agent 权限的前提下完成。

## 为什么重要

上一轮已经证明 Stripe Projects 可以 provision OpenRouter，但“能够调用模型”不等于“供应商成本已经被完整核算”。SELF/FUNDING 只有在以下链条闭合后才能把一笔模型调用描述成由已交付收入支持：

```text
job reservation
  → generation-level usage
  → provider billing event
  → external payment attempt and result
  → bank/card posting
  → internal expense + payable/cash entry
  → reconciliation with no unexplained difference
```

如果 Stripe Projects 只提供 credential delegation 和月度 provider aggregate，它不能单独证明某个 job 对应了哪一笔真实现金支出、何时扣款、失败后是否重试、是否需要 3DS，或退款如何关联。

## 搜索方法与查询

只使用 2026-08-24 UTC 重新访问的一手资料：Stripe Projects 官方文档、Stripe Shared Payment Token 文档与 API 示例、OpenRouter 的 Stripe Projects integration、billing FAQ、guardrail、Activity/Analytics API 和第一方发布说明。没有安装 Stripe CLI，也没有 operator live account，因此没有创建项目、payment method、SPT、OpenRouter account 或真实 charge。

检索词包括：

- `site:docs.stripe.com/projects Stripe Projects billing spend limit Shared Payment Token`
- `site:docs.stripe.com agentic commerce shared payment token PaymentIntent events`
- `site:openrouter.ai/docs/guides/overview/stripe-projects pay-as-you-go billing`
- `site:openrouter.ai/docs OpenRouter guardrails budget activity analytics cost`
- `site:github.com/stripe "stripe projects spend" billing update`

同时检查本机是否存在可做只读 CLI schema inspection 的 Stripe CLI；结果为 `__STRIPE_CLI_NOT_INSTALLED__`。因此本轮不把未观察到的 CLI JSON 字段或 dashboard 对象写成事实。

## 来源账本

| 来源 | 机构 / 作者 | 日期 | 稳定链接 | pinpoints 与实际建立的事实 |
|---|---|---:|---|---|
| Stripe Projects CLI | Stripe | 未标注；访问 2026-08-24 | https://docs.stripe.com/projects | “Upgrade a service tier”说明付费升级会把 Stripe-stored payment credential tokenized 为 SPT，provider 使用 token charge；“Manage billing”说明 `billing show/add`、provider-month `spend` 与 global/per-provider limits。 |
| Shared payment tokens — Agents / Sellers | Stripe | private preview；示例 API version `2026-04-22.preview`；访问 2026-08-24 | https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens | “Issue/Use a shared payment token”与 event table：seller 用 granted SPT 创建自己的 PaymentIntent；agent side 可收到 requires-action、used、deactivated events；SPT 有 currency、max amount、expiry。 |
| Stripe Projects integration | OpenRouter | 未标注；访问 2026-08-24 | https://openrouter.ai/docs/guides/overview/stripe-projects | “What gets provisioned”与“Plans and billing”：OpenRouter account/API key 被创建或关联；付费 plan 把 Stripe-stored credential 变成 scoped SPT；底层卡/银行详情不直接交给 OpenRouter。 |
| OpenRouter FAQ | OpenRouter | 未标注；访问 2026-08-24 | https://openrouter.ai/docs/faq | “How do I get billed”与“Credit and billing systems”：usage cost 从 credits 扣除；Activity 可看 usage；Stripe credit purchase 可能延迟显示；unused credits 的退款窗口与不可退 fee。 |
| Guardrails | OpenRouter | 未标注；访问 2026-08-24 | https://openrouter.ai/docs/guides/features/guardrails | “Budget Enforcement”：可对 member/key 设置 USD budget、周期、model/provider allowlist；多层限制同时存在时较低限制生效；超限请求返回 403。 |
| Get user activity grouped by endpoint | OpenRouter | 未标注；访问 2026-08-24 | https://openrouter.ai/docs/api/api-reference/analytics/get-user-activity | `GET /api/v1/activity` 可按 UTC date、API-key hash、user 过滤，返回 model、provider、tokens、requests 与 usage；需要 management key。 |
| Create OpenRouter Accounts via CLI with Stripe Projects | OpenRouter / Chris Watts | 2026-04-29 | https://openrouter.ai/announcements/openrouter-on-stripe-projects | 第一方发布说明 account/key provisioning 和 operator Stripe payment method attachment；是产品发布证据，不作为独立性能证明。 |

## 直接证据

### 1. 付款对象不是 operator Stripe account 上的普通 provider invoice

**Direct fact。** Stripe Projects 官方文档说明：付费 tier 会把 operator 存在 Stripe 的 payment credential 变成一个 **Shared Payment Token**，并把该 payment credential 授给 provider；provider 使用该 token charge。

**Direct fact。** Stripe 的 SPT seller flow 进一步说明：收到 granted SPT 的 seller 用自己的 Stripe secret key 创建 `PaymentIntent`，`payment_method_data[shared_payment_granted_token]` 指向 SPT。Stripe 随后把底层 payment method clone 到 seller 的 PaymentIntent；退款和 reporting 按 seller-side PaymentIntent 继续处理。

因此当前已建立的对象链是：

```text
operator bank/card payment method            REAL FUNDS SOURCE
  → Stripe Projects billing registration     PAYMENT CREDENTIAL REGISTRATION
  → SharedPaymentIssuedToken                  SCOPED CREDENTIAL, NOT MONEY
  → OpenRouter granted token
  → OpenRouter-created PaymentIntent          PROVIDER-SIDE EXTERNAL PAYMENT OBJECT
  → operator bank/card authorization/posting  REAL FUNDS MOVE IF SUCCESSFUL
```

Stripe Projects 不是这笔 provider cost 的 merchant ledger；OpenRouter 是使用 token 发起付款的 seller/provider。`stripe projects spend` 是一个 Projects 汇总视图，不等同于 operator 自己 Stripe payments balance 的 BalanceTransaction，也不证明销售余额与 provider cost 已经 netted。

### 2. Projects 的可见性和限制粒度低于 job-level ledger

**Direct fact。** `stripe projects spend` 公开文档只承诺 current/previous month、按 provider 汇总的 spend；可用 date range 或 provider filter。文档没有承诺 generation ID、job ID、SPT ID、PaymentIntent ID、receipt ID、charge timestamp、retry state 或 refund ID。

**Direct fact。** `stripe projects billing update` 可设 global 或 per-provider spend limit，且 per-provider limit 优先于 global limit。它是有用的 hard outer cap，但不是每个 job 的 budget reservation。

### 3. OpenRouter 提供 job attribution 所需的一部分证据

**Direct fact。** OpenRouter 的 API response/Activity 记录 model、token 与 cost；Analytics endpoint 可以按 API-key hash 和日期返回 usage。Guardrail 可把模型、provider 和周期预算限制在一个 key/member 上，多层 budget 取更严格者，超限返回 403。

这允许把一个 dedicated job key 或 environment key 的 inference usage 归到某个 job，但它仍是 provider-side usage/credit 记录，不是 bank/card settlement 记录。

### 4. 公开文档没有说明 Projects plan 的 charge cadence

**Unknown / conflicting。** OpenRouter 的通用 FAQ 说 inference cost 从 credits 扣除，credit purchase 可能在 Stripe charge 后最多约一小时才显示；Stripe Projects integration 则把 plan 称为 pay-as-you-go 并说明在 upgrade 时授予 SPT。公开资料没有说明 Projects plan 是：

1. 每次 generation 后单独 charge；
2. 先用 SPT 买 credits，再逐次扣 credits；
3. threshold auto-top-up；
4. 周期性 aggregated charge；或
5. 由 account 状态决定的混合模式。

也没有公开说明 declined payment、3DS `requires_action`、retry、partial use、unused-credit refund、SPT expiration 和 resource downgrade 之间的 Projects-specific 状态机。

## 反证与不利证据

1. **Counterevidence：并非完全不可观察。** Projects 有 provider-month spend 和 spend limits；OpenRouter 有 generation/activity usage；两者可以形成 provider aggregate ↔ generation sum 的交叉检查。
2. **Counterevidence：SPT 协议本身支持更多事件。** issued-token side 可以收到 `requires_action`、`used` 和 `deactivated` events；seller-side PaymentIntent 继承普通 refund/reporting 行为。这说明协议层可能提供外部付款锚点。
3. **限制：Projects 是否把 token ID、issued-token event 或 seller PaymentIntent reference 暴露给普通 operator account，当前 Projects 文档没有建立。** 不能把通用 SPT 能力直接写成 Projects 产品已提供的可见字段。
4. **不利证据：OpenRouter 一般 credit purchase 有最低 fee 且 fee 不随 unused-credit refund 退回。** 因而一次极小 generation 可能产生比 inference cost 更大的真实 purchase cost；只记 token cost会低估首笔实验的全成本。

## 有界推论

1. **Bounded inference。** Stripe Projects 当前可作为 provider provisioning、credential delegation 和 outer spend cap；在 live evidence 出现前，不应作为 SELF/FUNDING 的唯一 provider-cost ledger。
2. **Bounded inference。** 最小可对账设计必须保留至少四个不同层次：generation usage、OpenRouter billing/credit transaction、SPT/payment result、bank/card posting。Projects spend 只做第五个 aggregate cross-check。
3. **Bounded inference。** agent 可以持有 dedicated OpenRouter inference key，但不能持有 Projects billing credential、management key、payment method control或提高 limit 的权限。
4. **Bounded inference。** `policy_available_surplus → fuel_reservation` 只证明内部授权来源；只有真实 provider charge 被外部对账后，才能把 reservation close 为 cash-paid provider cost。

## 可测试假设

1. **Testable hypothesis。** 一个 dedicated OpenRouter key 的单次 paid generation cost，能够与 Activity/API response、OpenRouter credit/billing record、Projects provider spend delta 和 operator payment-method posting 在一个预先定义的窗口内一致。
2. **Testable hypothesis。** OpenRouter key guardrail 的低限额与 Stripe Projects per-provider limit 同时设置时，较低的 OpenRouter limit 会先以 403 阻止第二次请求；Projects limit仍作为凭证层 outer cap。
3. **Testable hypothesis。** operator Stripe account 能观察到与 Projects SPT 有关的 issued-token event 或 receipt reference；如果不能，bank/card receipt 与 OpenRouter billing export 必须成为外部付款锚点。

## 当前未知

1. Projects-paid OpenRouter 的准确 charge cadence、minimum charge、fee、retry 与 3DS 行为。
2. Projects CLI `--json` 对 `spend`、`billing show`、upgrade 和 failure 返回哪些稳定字段。
3. operator 是否能检索 SPT ID、issued-token events、seller PaymentIntent reference 或 receipt URL。
4. OpenRouter Projects plan 是否使用一般 credits/auto-top-up，unused-credit refund 规则是否完全相同。
5. payment method 是 card 还是 bank 时，authorization、posting 和 refund 时间是否不同。
6. Stripe Projects 是否提供 sandbox/test-mode OpenRouter paid plan；公开 Projects integration 只证明 SPT 协议本身可 test，不证明该 provider integration 有 end-to-end sandbox。
7. 美国会计上 usage、credit purchase、provider fee 与 unused credits 的确认和分类；需要 operator 的 CPA 按实际 invoice/statement 复核。

## 最小状态转换

| 状态 | 进入证据 | 谁可推动 | 真钱是否移动 | 允许的下一步 |
|---|---|---|---|---|
| `billing_method_registered` | `stripe projects billing show` 的非敏感摘要 | Operator | 否；只登记 payment credential | 设置 global/provider cap |
| `provider_cap_set` | reviewed policy + CLI confirmation | Operator | 否 | 创建/关联 free resource |
| `paid_upgrade_authorized` | OpenRouter plan、cap、refund/fee 规则已记录 | Operator；agent 不可自批 | 否 | Stripe 创建 scoped SPT |
| `spt_issued` | SPT reference/event（若可见）或 upgrade receipt | Stripe Projects | 否；credential 不是余额 | OpenRouter 可在 scope 内发起付款 |
| `job_fuel_reserved` | balanced internal entry + job/key/model cap | Deterministic policy | 否；内部 earmark | 允许一次 inference |
| `generation_billed` | generation ID + `usage.cost` + Activity record | OpenRouter | 可能尚未；只证明 provider usage/credit debit | 等 provider billing event |
| `provider_payment_attempted` | SPT `used/requires_action`、receipt 或 billing record | OpenRouter seller account | 可能 authorization；未必 posted | success / fail / action |
| `provider_payment_posted` | operator card/bank statement + provider receipt | External rail | **是** | 记 provider cash cost/payable close |
| `reconciled` | generation sum = provider billing basis；receipt = external posting；internal entries balance | Reconciler + independent reviewer | 不新增移动 | release unused reserve or open exception |
| `exception` | missing object、amount/time mismatch、decline、3DS、late/reversed posting | Deterministic stop + Operator | 未知或回退 | freeze new provider spend |

## 权限矩阵

| 动作 | Agent | Deterministic policy / reconciler | Isolated adapter | Operator |
|---|---|---|---|---|
| 读取 generation cost | 只读当前 job result | 校验 generation ID、key、model、cap | 使用 inference key | 审计 |
| 创建 Projects payment method | 否 | 否 | 否 | **是** |
| 提高 global/provider limit | 否 | 否 | 否 | **是，独立审批** |
| Upgrade 到 paid plan / 接受 provider terms | 仅可提出 | 必须拒绝未预授权变更 | 不持有 billing credential | **是** |
| 调用 allowlisted model | 可请求 | 检查 job reserve、key limit、model allowlist | 发送单次 API call | 可暂停 |
| 创建 provider PaymentIntent | 否 | 只观察结果 | 否 | OpenRouter 作为 seller/provider 执行 |
| 读取 Projects spend / OpenRouter activity | 不持 management key | 定时拉取最小字段 | read-only collector | 审计和处理例外 |
| 处理 3DS、refund 或 payment-method replacement | 否 | 自动冻结新 spend | 否 | **是** |
| 将 reservation 标为 cash-paid cost | 否 | 仅在 external posting 对账后 | 否 | independent review |

## 哪个组件持有真金，哪个只记录或提议

| 组件 | 角色 |
|---|---|
| Operator bank/card account | **持有并最终支付真实外部资金**；authorization 与 posted transaction 是 cash evidence。 |
| Stripe / card network during provider charge | **移动真实资金的外部 rail**；Projects 并未证明销售余额被直接 net。 |
| OpenRouter seller account | 创建 provider-side PaymentIntent，并提供 usage/credit/billing evidence；其 credits 是对未来服务的 provider claim，不是 operator bank cash。 |
| Shared Payment Token | **只是一项 scoped payment credential**；不是资金、余额、收入或费用。 |
| `stripe projects spend` | provider-month aggregate record；不是 job ledger、bank statement 或 settlement proof。 |
| OpenRouter generation/Activity | provider usage record；可归因 job，但单独不证明外部付款。 |
| SELF/FUNDING internal ledger | 记录 reservation、expense、payable/cash 和 reconciliation；不持有真实外部资金。 |
| Agent | 只提出 job/model call；不持有 payment method、SPT issuance authority 或 unrestricted management key。 |

## Buildable decision

**Stripe Projects 保留为 provisioning 与 outer-cap 组件，但 paid provider loop 标记为 `RECONCILIATION_BLOCKED`，直到一次 capped live test 证明对象和时点。**

实现规则：

1. 用一个独立 environment 和 dedicated OpenRouter key；只允许一个最低成本的 paid model。
2. Operator 先设置 Projects per-provider cap；OpenRouter key/guardrail limit 必须更低。
3. 每次 response 保存 generation ID、model、token、`usage.cost`、job ID 和 artifact hash。
4. Reconciler 拉取 OpenRouter Activity/Analytics、Projects `spend --json`（若实际 schema 支持）、provider billing/receipt 和 operator statement。
5. Projects spend 只作为 aggregate check；没有 receipt/payment event 与 external posting 时，不 close cash cost。
6. 任何 decline、3DS、missing record、amount mismatch、late posting 或 over-limit success 立即停止新 provider calls。
7. 不用 customer prepayment 作为首个 provider test 的资金来源；先用 operator 明确投入、可损失的最小测试资本，避免把客户 obligation 暴露给未知 charge behavior。

## 下一最便宜测试

1. Operator 安装当前 Stripe CLI/Projects plugin；记录版本，不把 `.env` 或 `.projects/vault/` 提交。
2. 初始化一个独立 test project，先 provision OpenRouter free plan，确认 resource、key rotation 与 removal path。
3. 在任何 paid upgrade 前，通过交互式 CLI 设置最低支持的 OpenRouter per-provider cap；另设更低的 OpenRouter key guardrail 和单模型 allowlist。
4. Operator 明确批准一次 live paid upgrade；记录 SPT/upgrade/receipt 的所有非敏感 ID 与 timestamp。
5. 发送一次固定 prompt 的最低成本 paid generation，并开启 response usage；保存 generation ID、usage、artifact hash。
6. 立即和定时采集 OpenRouter Activity/credits、Projects `spend --json`、Stripe issued-token events（如果账户可见）、receipt 与 payment-method statement，直到 posted、failed 或预注册 timeout。
7. 再发送一次会超过 key limit 的请求，要求收到 403 且外部 charge 不增加。
8. 只有当所有金额与时点能用稳定 ID 或审计记录连接时，才把状态从 `RECONCILIATION_BLOCKED` 改成 `TESTED`。

## 对当前网站主张的影响

1. Economics 中 Stripe Projects 的 provisioning 与 cap 可以保留为 supported direction。
2. “BUILDABLE NOW”需要收窄：account/key provisioning 可 build；`delivered revenue → provider cash cost → accepted output` 的 job-level reconciliation 仍是 exact blocker。
3. Public Journal 的 compute-fuel graphic 必须把 Stripe Projects 从“works now”改为“provisioning works; cash linkage untested”，并记录本轮精确未知。
4. 不新增观察值或图表；本轮没有 live charge、paid generation、receipt 或 measured latency。

## 反证标准

以下任一证据会要求修改当前结论：

1. Stripe Projects 官方文档或 CLI schema 公开稳定的 SPT ID、provider PaymentIntent/receipt ID、charge timestamp、retry/refund state 与 per-charge amount。
2. OpenRouter 明确发布 Projects plan 的 charge cadence、credit/top-up relationship、minimum fee、failure and refund state machine。
3. Capped live test 证明 generation → provider billing → SPT event → external posting 可用稳定 ID 和金额一一连接；届时 `RECONCILIATION_BLOCKED` 可升级为 `TESTED`。
4. Live test 出现 limit 以内也无法支付、limit 外仍成功 charge、账单金额无法从 usage/fee 重建、事件缺失或 charge 在 timeout 后才出现；届时应放弃 Stripe Projects 作为首版 provider rail。
5. Projects 实际允许直接从 delivered Stripe sales balance 且可逐 job net settle；这会推翻“另一个 payment method 承担 provider charge”的当前路径。

## 下一最高优先问题

**Deliberate live replication / Horizon A：在 operator 明确批准、双层 cap 和独立 test capital 下，一次最低成本 OpenRouter paid generation 能否让 generation ID、OpenRouter usage/billing、Projects spend、SPT/payment event 与 bank/card posting 在预注册窗口内对账为零差异？**

若没有 live account authority，这个问题的 exact blocker 是 operator onboarding 与 payment-method approval；在此之前不应转去 growth 或 customer segmentation。
