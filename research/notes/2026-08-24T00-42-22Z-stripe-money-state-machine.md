# Stripe 首笔银行卡付款的最小资金状态机

研究时间：2026-08-24T00:42:22Z  
研究范围：Horizon A；美国 operator 是唯一 merchant of record；Stripe Payments；USD；单次预付、自动 capture 的银行卡付款；一个窄范围软件服务。  
性质：这是产品控制与实验设计，不是法律、会计、税务或财务建议。收入确认、退款准备金、税务负债、实体和州法仍需持牌会计师及律师按实际合同、州、客户与业务复核。

## 研究问题

在美国 operator 作为唯一 merchant of record、首版只接受 Stripe 银行卡预付的前提下，什么最小状态机应当控制：

1. 何时可以保留 job budget；
2. 何时可以产生真实 provider spend；
3. 何时可以称为已交付收入；
4. 何时最多只能称为“policy-available surplus”，而不能称为最终、不可撤销资金？

## 为什么重要

`PaymentIntent.succeeded`、Stripe `pending`、Stripe `available`、银行 payout、履约完成、收入确认和可用盈余回答的是不同问题。把它们压成一个 `paid=true` 会造成四类错误：用尚不可动用的 Stripe 余额买算力；把客户预付款当成自由现金；遗漏退款与 dispute 负债；把内部余额或 payout 状态当作外部银行资金证明。

本轮只回答银行卡首笔付款的状态与控制门槛，不决定账户实体类型、税率、准备金比例或 Connect 架构。

## 搜索方法与查询

只把 Stripe 官方动态文档和 API reference 当作产品事实来源。检索并交叉核对以下主题：

- `Stripe PaymentIntent lifecycle succeeded requires_capture processing`
- `Stripe balance pending available balance transaction available_on`
- `Stripe card refunds pending failed insufficient available balance`
- `Stripe dispute lifecycle debit 120 days`
- `Stripe payout paid later failed reconciliation`
- `Stripe webhook duplicate events ordering retries`
- `Stripe sandbox test cards dispute asynchronous refund available balance`

所有动态文档均在 2026-08-24 UTC 重新访问。Stripe 没有在这些页面标示单独的首次发布日期；来源账本据实记录“未标示，访问日”，不虚构发布日期。

## 来源账本

| 标题 | 机构 / 作者 | 发布或修订日期 | 稳定链接 | Pinpoint 与实际建立的事实 |
|---|---|---:|---|---|
| How PaymentIntents and SetupIntents work | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/payments/paymentintents/lifecycle | `Processing`、`Succeeded`：`succeeded` 表示 payment flow 完成并可履约；手动 capture 会出现 `requires_capture`；异步方式可能进入 `processing`。不证明资金已进入 available balance 或无争议风险。 |
| Balances and settlement time | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/payments/balances | `Balance states`、`Settlement time`、`Best practices`：charge 净额先为 pending，不能 withdraw/spend；到 `available_on` 后变为 available；美国示例与表格为 2 business days；minimum balance 用于 refunds、fees、chargebacks。 |
| The Balance Transaction object | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/api/balance_transactions/object | `available_on`、`net`、`status`、`reporting_category`：BalanceTransaction 是连接 charge、费用、净额和 pending/available 状态的最小可核验对象。 |
| Refund and cancel payments | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/refunds | `Start here`、`Handle failed refunds`、`Refund events`：refund 只使用 available balance；余额不足时 card refund 可 pending；refund 可先成功后失败，失败资金返回且需替代退款路径；原支付不会被抹除。 |
| How disputes work | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/disputes/how-disputes-work | `During the dispute`、`Dispute timing`：Stripe 在 dispute 创建时扣除 disputed amount 和 fee；银行卡通常可在付款后 120 天内发起，部分情况更久；完整周期可再持续 2–3 个月。 |
| Receive payouts | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/payouts | `Settlement timing`、`Payout failures`：美国标准 settlement 为 T+2 business days；银行可在最多 5 个额外工作日后退回 payout；payout 可能先显示 `paid` 再变 `failed`。 |
| Payout reconciliation report | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/reports/payout-reconciliation | `Itemized payout reconciliation`：报告把 PaymentIntent、charge、BalanceTransaction、`available_on`、automatic payout 和 bank trace 连接起来；manual/instant payout 需要 operator 自行匹配。 |
| Receive Stripe events in your webhook endpoint | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/webhooks | `Event delivery behaviors`：live webhook 最多重试三天；不保证顺序；可能重复；需要验签、对象重取与幂等处理。 |
| Testing | Stripe | 未标示；访问 2026-08-24 | https://docs.stripe.com/testing | `Simulate a dispute`、`Simulate an asynchronous refund`、`Send funds to your available balance`：sandbox 有官方 PaymentMethod fixtures 可触发 dispute、refund pending→succeeded、refund succeeded→failed 与绕过 pending；测试交易不移动真实资金。 |

## 直接证据

### 1. `PaymentIntent.succeeded` 是履约门，不是最终资金门

Stripe 明确允许在银行卡 PaymentIntent 进入 `succeeded` 后履约。另一个独立对象 BalanceTransaction 决定净额仍为 `pending` 还是已为 `available`。因此，仅凭 `succeeded` 不能证明该笔净额可用于 Stripe debit、payout 或 refund。

分类：**Direct fact**。

### 2. `available` 是 Stripe 内可用性，不是不可撤销性

BalanceTransaction 到达 `available_on` 后，净额可用于 payout、refund、transfer 或其他 debit。银行卡持有人通常仍可在付款后 120 天内提出 dispute，某些场景更久；dispute 创建时 Stripe 会扣回金额与费用。

分类：**Direct fact**。

### 3. payout 改变资金保管位置，但不终结客户追索

Stripe available balance 发往 operator 银行会生成 payout。`paid` 状态仍可能在最多 5 个额外工作日内变为 `failed`。即使银行已入账，后续 dispute 仍可能形成 Stripe 负余额或对外部银行的追偿路径。

分类：**Direct fact**。

### 4. refund 是独立的资金事件和状态机

成功付款之后必须创建 Refund；它不删除原 Charge。card refund 可以因 available balance 不足而 pending，也可以先显示 succeeded 后失败。失败时 operator 仍欠客户退款，并需替代处理路径。

分类：**Direct fact**。

### 5. webhook 是提示，不是单一事实源

Stripe webhook 可能重复、乱序和重试。资金状态变更必须按 event ID 与对象 ID 幂等记录，并在处理时从 Stripe API 重取 PaymentIntent、Charge、BalanceTransaction、Refund、Dispute 或 Payout 的当前状态。

分类：**Direct fact**。

## 反证与反方向证据

Stripe 同时写明 `PaymentIntent.succeeded` 后可以“confidently fulfill”。这反驳了“必须等到 Stripe balance available 或银行 payout 才能开始任何履约”的绝对规则。对于能承受 working-capital 风险的 operator，成功 capture 后立即履约是官方支持的正常路径。

但这不反驳本轮的分层结论：pending funds 仍不能被 withdraw 或 spend；若 SELF/FUNDING 不允许 operator 临时垫付 provider cost，就必须等到 linked BalanceTransaction available 后才能产生真实外部支出。

分类：**Direct fact + Bounded inference**。

另一个反方向证据是 Stripe sandbox 可以让 test payment 直接进入 available balance。该 fixture 适合覆盖分支，但不能证明 live settlement latency、真实 bank deposit 或真实 refund/dispute recovery，因为官方明确测试交易不移动资金。

分类：**Direct fact**。

## 有界推论与本轮 buildable decision

### 决策 A：采用一个复合状态，而不是 `paid` 布尔值

首版每个 job 至少保存四个独立维度：

```text
payment_flow       = incomplete | succeeded | canceled
stripe_custody     = none | pending | available | paid_out | payout_failed
customer_obligation= open | delivered | refund_pending | refunded | disputed
allocation         = unavailable | job_reserved | policy_available | frozen
```

任何 UI balance 都必须声明它显示哪一个维度。`policy_available` 是 operator 自定的内部控制标签，不是 Stripe、银行或会计准则提供的“最终资金”状态。

分类：**Bounded inference / buildable decision**。

### 决策 B：内部 reserve 可在 `succeeded` 时建立，真实 provider spend 需要可用资金来源

- 在 `PaymentIntent.succeeded` 且关联 Charge / BalanceTransaction 可重取后，系统可以接受 job、记录 customer obligation 并在内部账本建立 job budget reservation。
- 如果 provider spend 依赖这笔客户款，必须等待关联 BalanceTransaction `status=available`。
- 如果 operator 预先提供了独立 working capital，则可在 `succeeded` 后提前履约，但 policy 必须证明：外部 available operating balance 同时覆盖最大 job cost、完整退款和最低 reserve。不能把 pending customer funds 当作覆盖来源。

分类：**Bounded inference / buildable decision**。

### 决策 C：不建立名为 `final` 或 `unrestricted_cash` 的银行卡状态

首版只建立 `policy_available_surplus`：交付已由独立 verifier 接受；linked net amount 已 available 或已在银行确认；费用和 provider cost 已 posted；refund、dispute、tax 和最低运行准备金已保留；Stripe 与内部账本完成当日 reconciliation；不存在 open refund、dispute、early fraud warning 或 unexplained difference。

该金额仍有 residual chargeback、合同、税务与运营风险，所以网站与 dashboard 不得称其为“irreversible”“risk-free”或“finally settled”。

分类：**Bounded inference / product design constraint**。

### 决策 D：首版不需要把五个用途伪装成五个银行账户

真实资金首版可以只在 operator 的 Stripe Payments balance 与一个 operator bank account 中移动；receiving、job operating、refund、tax 和 reserve 用内部复式子账户与硬 policy 分开。只有在 Stripe refund/dispute prefunding balance、独立 bank account 或其他真实外部容器已配置并对账时，才能称为“externally segregated”。

分类：**Bounded inference**。是否需要法律上的信托、客户资金隔离或更多银行账户是本轮未解决的专业复核问题。

## 具体状态转移

| 状态 | 进入证据 | 真实资金在哪里 | 内部记账 / 限制 | 允许动作 | 禁止或停止 |
|---|---|---|---|---|---|
| `QUOTED` | signed quote；无成功 Charge | customer payment method；未到 operator | 无客户资金；只记录 quote | 接受付款 | 运行付费 provider |
| `PAYMENT_INCOMPLETE` | PaymentIntent 为 `requires_*`、`processing` 或未 capture | 未确认或在 rail 处理中 | 不记 settled receipt | 等待 / 取消适用状态 | 履约与收入确认 |
| `CAPTURED_PENDING` | PaymentIntent `succeeded`；linked BalanceTransaction `pending` | Stripe 为 operator 处理的 pending payments balance | 记 customer obligation 与 Stripe-pending control account；建立内部 job reserve | 零成本校验；若独立 working capital 覆盖则可履约 | 把 pending 当可支出余额或 surplus |
| `AVAILABLE_OBLIGATION` | linked BalanceTransaction `available`；gross、fee、net、currency 与 job 匹配 | operator 的 Stripe available payments balance | customer obligation 仍 open；job/refund reserve 有效 | policy 内 provider spend；refund 能力 | 任意 payee；discretionary allocation |
| `DELIVERED_RECONCILING` | verifier 接受 artifact；成本与 fee 已 posted | Stripe available 或 payout in transit / bank | 可提出收入确认；仍保留 refund/dispute/tax reserve | 生成日报与 payout mapping | 宣称 unrestricted surplus |
| `POLICY_AVAILABLE` | 交付、成本、准备金和 rail reconciliation 全部通过；无 open exception | Stripe available 或 operator bank，具体位置必须显示 | 仅剩经批准的 surplus 子账户；会计处理待政策复核 | 有上限的下一 job / reserve allocation | 称为不可撤销或 agent-owned |
| `REFUND_PENDING` | Refund `pending` / `requires_action` 或已请求未闭环 | Stripe available 被占用、退款 rail 中或 operator 仍欠款 | 原收款保留；新增退款负债与 outbound event | 轮询 / webhook + API 重取；客户通知 | 继续把相关金额算 surplus |
| `REFUNDED` | Refund `succeeded` 且 balance transaction 对账 | 已发往原 payment method；仍可能有 rail trace 延迟 | 关闭对应退款负债；保留原 receipt 与 refund 两条记录 | 关闭 job | 删除或净额覆盖原事件 |
| `REFUND_FAILED` | Refund `failed` / `canceled` | 金额回到 Stripe balance 或仍待核实 | 重开退款负债；冻结相关 surplus | 人工替代退款与事故记录 | 将失败当作客户已收款 |
| `DISPUTED` | Dispute object / `charge.dispute.created`；Stripe debit | disputed amount 和 fee 已从 Stripe balance 扣除 | 冻结 job surplus；记录 dispute 与证据 deadline | 接受或提交证据 | dispute open 时另行 refund；自主继续分配 |
| `PAYOUT_IN_TRANSIT` | Payout created / pending | 离开 Stripe、尚未由银行独立确认 | clearing account；逐笔或批次映射 | 等待 bank / report | 把 payout UI 当 bank deposit 证据 |
| `PAYOUT_RECONCILED` | bank statement / bank API credit + Stripe payout report + 无差异 | operator bank account | Stripe clearing 转 bank；保留 dispute reserve | 关闭 payout reconciliation | 删除 Stripe 原始交易映射 |
| `FROZEN` | 任意重复/乱序未闭环、金额不符、payout failure、refund failure、dispute 或 credential incident | 以 API / bank 读取为准 | discrepancy / incident account | 只允许 refund、recovery、reconciliation | 新 discretionary spend |

不存在自动进入的 `FINAL` 状态。

## 权限与真实资金矩阵

| 组件 / 角色 | 是否持有真实资金 | 可提议 | 可批准 | 可签署 / 执行 | 可复核 |
|---|---|---|---|---|---|
| Customer | 付款前持有自己的资金 | 付款、退款或 dispute 请求 | 自己的付款授权 | 通过 issuer / Stripe flow | 收据与退款结果 |
| Operator | 是；资金和义务归属主体 | 任意合法业务动作 | policy、payee、账户、例外 | 人工后台高影响动作 | 全部账、税务与责任 |
| Stripe Payments / banking partners | 是；Stripe balance / rail 上的真实资金 | 不适用 | 按产品与风控规则 | capture、refund、debit、payout、reserve | API objects、reports、trace IDs |
| Operator bank | 是；payout 到账后的真实资金 | 不适用 | 按账户 mandate | 银行转账 / debit | statement / bank API |
| Agent | 否 | quote、job plan、provider spend proposal、refund proposal | 否 | 否；不得持有 unrestricted secret key | 只读状态和解释材料 |
| Deterministic policy | 否；只控制许可 | 否 | allowlisted provider、精确金额、nonce、expiry、reserve gates | 只向 signer 发精确 mandate | policy decision log |
| Isolated payment adapter / signer | 否；持有受限调用能力，不拥有资金 | 否 | 否 | 只执行已批准的 Stripe API request | request ID、idempotency key、response |
| Internal ledger | 否；只记录 claim、purpose 与 obligation | 否 | 否 | 只追加 balanced entries | hash / transaction / source-object linkage |
| Verifier | 否 | delivery pass/fail | 只批准技术交付状态 | 否 | artifact、test log、hash |
| Reconciler + independent reviewer | 否 | discrepancy / close proposal | 关闭日结或冻结 | 不能改 rail 资金 | Stripe API/report + bank statement + ledger |

## 最便宜的下一步实验

在 Stripe sandbox 建立一张事件夹具表并要求同一状态 reducer 通过至少以下路径：

1. normal card：`succeeded → pending → available`；
2. `pm_card_bypassPending`：直接 available，证明 reducer 不依赖固定延迟；
3. `pm_card_pendingRefund`：refund pending → succeeded；
4. `pm_card_refundFail`：refund 看似 succeeded → failed，必须重开负债；
5. `pm_card_createDisputeProductNotReceived`：成功付款后 dispute debit；
6. webhook duplicate、逆序与三天后重放；
7. payout `paid → failed` 的本地 fixture；
8. Stripe itemized payout report 与模拟 bank statement 差一分钱时自动 `FROZEN`。

通过门槛：任何事件顺序下，同一 source object 只产生一次业务转移；每个状态都能从 Stripe current object + append-only events 重建；`policy_available` 永不包含 pending、open refund、dispute 或 unexplained difference。sandbox 通过后仍需一笔小额 live payment 和一笔真实退款，因为 sandbox 不移动资金。

分类：**Testable hypothesis / concrete experiment**。

## 可测试假说

1. **Hypothesis A：** 四个独立状态维度可以阻止 `PaymentIntent.succeeded` 被错误提升为 unrestricted surplus，同时不妨碍及时履约。
2. **Hypothesis B：** 在没有外部 working-capital cover 时，把付费 provider 调用延迟到 BalanceTransaction `available`，最多增加美国银行卡标准 T+2 business days，但避免使用 operator 未拥有的可用现金。
3. **Hypothesis C：** Stripe sandbox 的 dispute、async refund 与 available-balance fixtures 足以覆盖 reducer 的主要分支；live round 只需验证实际 settlement、bank payout 和 refund trace。

## 未知与冲突

1. Stripe 对具体新账户、行业、风险和首笔 payout 的实际 settlement / reserve 行为可能不同；官方写明风险条件会改变 timing。
2. 合同何时完成、customer acceptance 是否构成控制转移、预付款应如何列报和何时收入确认，需要美国会计师基于实际条款判断；本轮状态名不构成 ASC 606 结论。
3. refund、dispute、tax 和运行准备金的比例没有本项目实测数据，不能从 Stripe 基础设施可用性推导。
4. 银行 statement 可证明 payout 到账，但无法消除 later dispute；不存在本轮能证明的绝对银行卡 finality timestamp。
5. 是否需要法律上的客户资金隔离、独立 bank account 或 Stripe refund/dispute prefunding balance，需要按 operator 州、实体、服务条款和资金使用方式做专业复核。
6. Stripe 文档支持 `succeeded` 后履约，但“等待 available”是否伤害转化与交付时间需要在真实客户实验中测量。

## 对网站当前主张的影响

- Architecture 应把单一 `Received` 拆成 `Captured / pending` 与 `Available / obligated`，并明确两者都不是 unrestricted surplus。
- Economics 应把 `PaymentIntent.succeeded`、Stripe pending、Stripe available、履约与 policy-available surplus 分开。
- “payment finality”不得用单一 Stripe 状态表达；对银行卡应写成分层证据与剩余 dispute 风险。
- 显示余额必须指出真实资金位置：Stripe pending、Stripe available、payout in transit 或 operator bank。内部 reserve 只记录用途，除非有独立外部余额证明，否则不称 physical segregation。

## 反证标准

以下任一证据会要求重做本轮设计：

1. Stripe 正式文档或合同提供一个对美国银行卡付款具有不可退款、不可 dispute、不可 reversal 且银行不可退回的最终状态；
2. live API 证明 BalanceTransaction `pending` 可以在没有 Instant Payout / credit / external capital 的情况下直接用于任意 provider debit；
3. sandbox 或 live 事件显示本轮 reducer 无法从 current Stripe objects 与 source IDs 消除重复、乱序或状态回退；
4. 会计师根据实际客户合同认定本轮 `customer_obligation → delivered` 的收入处理错误；
5. 一笔 live 小额付款 / 退款无法被 Stripe report、bank statement 与内部复式账闭合到零差异。

## 下一最高优先问题

在上述状态门已确定后，首版应如何把 receiving、operating、refund、tax 和 reserve 在真实 Stripe / bank 余额与内部复式子账户之间分层，才能让 provider spend 与退款都可执行，同时不把内部 earmark 误称为外部隔离资金？
