# 收款路径与 agent 自己购买 API 算力的可行性

研究时间：2026-08-24T00:59:44Z  
研究范围：Horizon A 为美国 operator 的近期可运行闭环；Horizon B 为 agent-native 收款与算力购买。  
性质：产品控制与实验设计，不是法律、会计、税务、证券、银行或加密资产建议。任何 live 账户、钱包、发卡、MoR、税务和资金隔离设计仍需按实际实体、州、产品与合同复核。

## 研究问题

1. Stripe 之外，哪些收款路径能让 SELF/FUNDING 收到真实资金并继续履约？
2. agent 能否把自己赚到的钱自动变成 OpenAI、Claude、OpenRouter 或其他 API 的可用算力？
3. 哪条路径今天可以跑通，哪条仍缺少关键基础设施？

## 结论摘要

**“agent 自己给自己充值”需要拆成两个不同命题。**

- **法律与账户意义上的自己：目前不成立。** OpenAI、Claude、OpenRouter、Square、Stripe Projects、MoR 和受监管的加密 onramp 都仍把账户、付款方式、商户责任或身份验证归给一个人或组织。agent 可以是被授权的执行器，不是这些账户的独立 Customer、seller 或 owner。
- **经济与控制意义上的自己：今天可以实现。** operator 可以预先建立账户、付款方式、限额与自动续费；agent 只读取收入、成本和余额，提出或执行被 policy 允许的算力购买。只要新算力的真实成本由已交付工作的可分配资金覆盖，就可以称为“operator-owned agent economically finances its next API usage”。
- **直接、通用的 `POST /top-up` 仍然缺失。** OpenAI 和 Claude 的公开资料把购买/自动续费放在 Billing UI；OpenAI 公开 Admin API 能读取 usage 与 costs，但未公开购买 credits 的 endpoint。OpenRouter 公开 Credits API 只能读取余额；原有 Coinbase programmatic purchase endpoint 已返回 `410 Gone`，现要求 web purchase flow。
- **最接近 agent-native 的闭环是 x402。** agent 可以让自己的付费 endpoint 直接收 USDC 到一个 wallet，再从该 wallet 支付其他 x402 endpoint。这个闭环不需要每次经过银行卡充值，但目前不能假设 OpenAI 或 Claude 原生接受 x402；Coinbase Agentic Wallet MCP 也明确禁止 agent 自己 onramp、转任意地址或修改 spending limits。

## 搜索方法

只使用当前一手资料：OpenAI、Anthropic、OpenRouter、Stripe、Square、Paddle、Lemon Squeezy 与 Coinbase CDP 官方文档、帮助中心、协议和条款。重点检索：

- prepaid credits、auto recharge、usage/cost API、purchase API；
- provider provisioning、pay-as-you-go、spending caps；
- seller account、merchant of record、payout、checking/debit access；
- x402 seller wallet、agentic wallet permissions、onramp、spending limits；
- 旧充值 endpoint 的弃用或失败状态。

动态页面均在 2026-08-24 UTC 重新访问。没有标注发布日期的页面据实记录访问日，不虚构发布日期。

## 来源账本

| 来源 | 机构 | 日期 | 稳定链接 | 实际建立的事实 |
|---|---|---:|---|---|
| How can I set up prepaid billing? | OpenAI | 更新于 2026-08 | https://help.openai.com/en/articles/8264644 | API prepaid billing 支持 threshold、recharge amount 和 monthly limit；额外 credits 通过 Billing portal 购买。 |
| Organization Usage and Costs API | OpenAI | 访问 2026-08-24 | https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage | Admin API 公开 usage 和 costs 读取；公开 reference 未列 credit-purchase endpoint。 |
| OpenAI Services Agreement | OpenAI | 生效 2026-01-01 | https://openai.com/policies/services-agreement/ | Services 购买和使用发生在 Customer Account；Customer 对账户和付款承担责任。 |
| How do I pay for my Claude API usage? | Anthropic | 更新于 2026-08 | https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage | Billing/Admin 角色在 UI 买 credits；auto-reload 按阈值触发；月结客户通过 Stripe 支付 invoice。 |
| OpenRouter FAQ | OpenRouter | 访问 2026-08-24 | https://openrouter.ai/docs/faq | 支持 manual top-up、auto top-up、USDC/card/Alipay；Credits API 用于读取余额。 |
| Get remaining credits | OpenRouter | 访问 2026-08-24 | https://openrouter.ai/docs/api/api-reference/credits/get-credits | 公开 Credits endpoint 为 `GET /api/v1/credits`，需要 management key。 |
| Crypto API — deprecated | OpenRouter | 访问 2026-08-24 | https://openrouter.ai/docs/cookbook/administration/crypto-api | 旧 `POST /api/v1/credits/coinbase` 已移除并返回 410；现用 web credits purchase flow。 |
| Terms of Service §§4.1–4.5 | OpenRouter | 2026-08 | https://openrouter.ai/terms | Credits 绑定账户、不可作为货币转移；付款由指定 payment method 通过 Stripe 或 Coinbase 完成。 |
| Stripe Projects | Stripe Support | 访问 2026-08-24 | https://support.stripe.com/questions/stripe-projects | Projects 可 provision 第三方服务并集中凭据/账单；provider costs 由 Stripe account 上的 payment method 支付；支持 global 和 per-provider spend limit。 |
| OpenRouter Projects integration | OpenRouter / Stripe Projects | 访问 2026-08-24 | https://openrouter.ai/docs/guides/overview/stripe-projects | agent 可用 CLI provision OpenRouter free 或 pay-as-you-go service，并获得 scoped API key。 |
| Take Payments | Square | 访问 2026-08-24 | https://developer.squareup.com/docs/payments-api/take-payments | Square 接受 card、wallet、ACH 等并把资金记入 seller 的 Square account；seller 可转银行或使用 Square debit access。 |
| Square Checking and Debit Card | Square | 访问 2026-08-24 | https://squareup.com/help/us/en/article/7594-get-started-with-square-checking | 美国 verified account owner 可把 Square sales 直接用于 checking/debit card；账户只能签发给 Square account owner。 |
| Merchant of Record / Getting paid | Lemon Squeezy | 访问 2026-08-24 | https://docs.lemonsqueezy.com/help/payments/merchant-of-record | Lemon Squeezy 是 end-customer MoR，负责 payment、tax、refund、chargeback；seller 仍需 identity verification 后按周期收 bank/PayPal payout。 |
| Bank transfer | Paddle | 访问 2026-08-24 | https://developer.paddle.com/concepts/payment-methods/wire-transfer/ | Paddle 作为 MoR 可让 invoice 通过 bank transfer 支付并自动 reconciliation，之后 payout 给 supplier。 |
| x402 overview and wallet | Coinbase CDP | 访问 2026-08-24 | https://docs.cdp.coinbase.com/x402/welcome | paid HTTP resource 可由 human 或 machine 用 stablecoin programmatically 支付；seller wallet 收款，buyer wallet 付款。 |
| Agentic Wallet MCP tools | Coinbase CDP | 访问 2026-08-24 | https://docs.cdp.coinbase.com/agentic-wallet/mcp/mcp-tools/overview | agent 可查余额和自动支付 x402；只有用户能 onramp、转账和改 per-call/session limit。 |
| Monetize Service / Pay for Service | Coinbase CDP | 访问 2026-08-24 | https://docs.cdp.coinbase.com/agentic-wallet/cli/skills/monetize-service | 同一 wallet address 可作为 x402 `payTo`，收到 USDC 后再以余额支付其他 x402 API。 |

## 收款路径比较

| 路径 | 谁是账户或商户 | agent 自动化能力 | 钱何时可买算力 | 适合首版吗 |
|---|---|---|---|---|
| Stripe / Square 等 PSP | verified operator 是 seller / merchant | 高：checkout、Payment API、webhook、refund、payout | available funds 经 bank/card，或 Square Checking/debit；仍需 reserve | **是，首选通用路径** |
| Paddle / Lemon Squeezy MoR | MoR 对最终客户销售；operator 是 supplier | 中：checkout、subscription、webhook；payout 较慢 | MoR 结算并 payout 后，才能进入 operator 的算力账户 | **适合标准 SaaS/数字产品，不适合即时循环** |
| ACH / bank wire / invoice | operator 或 MoR 的 bank account | 中：invoice 和 reconciliation 可自动化，客户动作较重 | 银行到账并对账后 | **适合高客单 B2B，不适合微任务** |
| Marketplace / app store payout | 平台账户和平台规则定义 seller | 低到中；身份、审核、提现和 bot policy 依平台 | payout 后 | **只作为分销渠道，不能做核心 treasury** |
| x402 stablecoin | wallet address 收款；法律归属仍需 operator policy | 高：HTTP 402、wallet signature、facilitator settlement | onchain receipt 后可直接支付另一个 x402 endpoint | **最好的 agent-native 实验路径** |

### 关键判断

换一个 PSP 不会自动解决身份问题；Square 与 PayPal 类路径仍是软件代表 seller account 行动。MoR 能显著减少 sales-tax、refund 和跨境支付负担，但把资金交付变成对 MoR 的周期性应收账款，延长了“收入 → API fuel”的时间。x402 缩短了技术结算路径，却没有自动解决 wallet 的法律归属、税务、制裁、责任、密钥恢复或 fiat off-ramp。

分类：**Direct fact + Bounded inference**。

## 主流 API 的“自充值”能力

| Provider | 自动续费 | 可读取成本/余额 | 可编程购买 credits | 当前判断 |
|---|---|---|---|---|
| OpenAI API | 是，Billing UI 配 threshold、amount、monthly limit | 是，Admin Usage/Costs API | **未发现公开 endpoint** | agent 可监控，operator 预授权 auto recharge；不能声称 agent 直接充值 |
| Claude API | 是，Billing UI 配 minimum balance 与 reload-to amount | Billing UI；组织用量可管理 | **未发现公开 endpoint** | 与 OpenAI 相同，账户和卡属于 organization |
| OpenRouter | 是，manual/auto top-up | 是，`GET /api/v1/credits` | **旧 crypto endpoint 已 410；当前 web flow** | 可由 Stripe Projects provision pay-as-you-go；直接购买 API 不成立 |
| x402 service | 不使用 credits，逐请求付 USDC | 是，wallet balance 与 onchain receipt | 不需要 top-up endpoint | 如果服务支持 x402，agent 可在限额内直接支付 |

这里“未发现公开 endpoint”是对当前公开官方 reference 的有界结论，不等同于证明 provider 内部或 enterprise 合同绝不存在私有接口。

## 三条可以实际运行的算力补给路径

### 路径 A：operator auto-recharge（最稳妥，今天可用）

```text
customer payment
  → PSP available / bank reconciled
  → operator working-capital account
  → card or invoiced payment method
  → provider auto recharge / pay-as-you-go
  → project API key
  → measured inference
```

agent 不接触完整 card number，也不能提高 auto-recharge monthly limit。它只读取 provider cost、收入覆盖和 internal reserve，向 deterministic policy 提交一个 `fuel_reservation`。provider 在 operator 已设置的 payment method 上自动扣款。

分类：**Buildable now**。

### 路径 B：Stripe Projects → OpenRouter（最强的现成 agent provisioning）

Stripe Projects 可以让 coding agent provision OpenRouter pay-as-you-go resource、获取 scoped key，并由 operator Stripe account 上的 payment method 付款；global/per-provider caps 提供额外 guardrail。这比让 agent 控制 Billing UI 更可审计。

但它仍不是“Stripe 销售余额直接充值 OpenRouter”：官方说明 provider costs 由 Stripe account 上的 **payment method** 支付。若该 payment method 最终依赖 operator bank/card，就必须分别对账收入 payout 与 provider charge。

分类：**Buildable now; direct balance netting not established**。

### 路径 C：x402 earn → x402 spend（最接近 agent-native）

```text
buyer agent
  → HTTP 402 payment
  → SELF/FUNDING payTo wallet receives USDC
  → reserve / obligation policy
  → same wallet pays another x402 API
  → receipt + output reconciled
```

如果收入本来就进入同一 wallet，agent 不需要执行 onramp 才能继续购买 x402 服务。Coinbase MCP 的设计允许 agent 自动支付，但不允许它自己加钱、任意转账或提高限额。这是合理的能力分离。

当前 blocker 是供给面：不能假设所需 frontier LLM、sandbox、storage 和 deployment provider 都接受 x402。可以先用低额数据 API 做闭环实验，再研究 x402-compatible model gateway。若自建 gateway 代付主流模型，必须只销售自己的 bounded service/output，不能出售或转移 provider API keys，也要逐项核对 model-provider resale terms。

分类：**Technically executable for x402 services; incomplete for mainstream model stack**。

## 最小权限矩阵

| 动作 | Agent | Deterministic policy | Isolated adapter | Operator |
|---|---|---|---|---|
| 读取 PSP/provider/wallet 余额与成本 | 提议并读取最小字段 | 限制查询范围 | 使用只读 key | 可审计 |
| 增加 auto-recharge limit | 否 | 否 | 否 | 是 |
| 触发 OpenAI/Claude 手动 credit purchase | 否 | 无公开购买 API | 否 | Billing/Admin UI |
| Provision Stripe Projects provider | 可提议/执行允许的 catalog item | 检查 provider、tier、cap、environment | CLI 使用 scoped credential | 建立 payment method 与上限 |
| 支付 x402 endpoint | 可在 job plan 内请求 | 检查 URL、price、purpose、reserve、session cap | wallet signer 精确签名 | 设置 limits、recovery 与 onramp |
| 把收入称为 API fuel | 否 | 只有 delivery、reserve、reconciliation 通过才允许 | 只执行已批准支出 | 承担账户、税务与损失 |

## Buildable decision

首个现实版本不开发“agent 购买 credits”按钮。它实现一个 provider-agnostic `fuel_controller`：

```text
provider_account
  id, legal_owner, billing_mode, payment_method_ref
  balance_or_cost_source, auto_reload_cap, daily_cap
  credential_scope, allowed_models, stop_threshold

fuel_reservation
  job_id, provider, max_cost, source_surplus_entry
  policy_version, approved_at, expires_at, actual_cost
```

控制规则：

1. 只有 `policy_available_surplus` 或独立 working capital 可以支持新的 fuel reservation；
2. provider auto recharge 仍记作 operator payable / card charge，不等于即时消耗；
3. 每个 job 的模型调用成本必须回写实际 provider usage/cost source；
4. 达到 daily cap、monthly cap、负余额、对账差异或收入覆盖不足时停止新调用；
5. agent 永远不能更改 payment method、monthly cap、wallet recovery 或任意 payee；
6. 显示“self-funded”前必须把 provider charge 对账到已交付收入，而非只看到 API 仍可调用。

## 最便宜的下一步实验

### 实验 1：fiat fuel loop（不需要真的让 agent 操作银行卡）

1. 建立一个 operator-owned OpenRouter 或低额 provider account；
2. 配置 auto top-up 或 Stripe Projects pay-as-you-go，设置 5 USD provider cap；
3. agent 读取 credits/cost，不可读取 payment credential；
4. 用一笔已对账的测试收入建立 0.50 USD fuel reservation；
5. 调用一次确定性任务，记录 provider usage、card/provider charge 和 artifact；
6. 证明 `revenue source entry → fuel reservation → provider cost → accepted output` 可以闭合。

### 实验 2：x402 closed loop

1. 在 testnet 部署一个价格为 0.01 USDC 的 SELF/FUNDING endpoint；
2. buyer wallet 支付并把 USDC 收入发送到 seller wallet；
3. 在保留 obligation reserve 后，用同一 wallet 支付另一个 testnet x402 endpoint；
4. 验证两个 onchain receipts、两个 HTTP artifacts 和内部复式记录完全一致；
5. 主网前设置 per-call 0.01 USD、per-session 0.05 USD，并测试超限拒绝。

## 未知与冲突

1. OpenAI、Claude、OpenRouter 对具体 operator entity、付款卡、业务模式和自动充值额度的审批结果没有 live 证据。
2. Stripe Projects 的 OpenRouter pay-as-you-go charge timing、invoice detail、失败重试和 refund behavior 需要实际账户实验。
3. Square Checking 路径只适用于符合资格且通过验证的美国 account owner；Square Debit Card 是否被目标 API provider 接受必须实测。
4. MoR 是否接受“agent-produced coding service”取决于实际产品。Lemon Squeezy 明确更偏好 SaaS/数字产品，而不是平台外履约的任意服务。
5. x402 wallet address 是 protocol identity，不等同于法律主体；收入税务、制裁筛查、charge/refund policy、密钥恢复和 insolvency treatment 未解决。
6. Coinbase Agentic Wallet CLI 与 MCP 权限不同；首版应选 MCP 的更窄权限，不把任意 `send` 或 `trade` 能力交给 job agent。
7. 公开 API reference 的缺失不能证明 enterprise 私有 purchasing API 永不存在；任何新 provider endpoint 出现都应重新验证。

## 反证标准

以下证据会要求修改结论：

1. OpenAI、Claude 或 OpenRouter 公开一个受支持的 credit-purchase API，并提供 service account、idempotency、spend cap 和 refund/error semantics；
2. Stripe Projects 允许 provider charges 直接、受限且可核验地从 delivered Stripe sales balance net settle，而非通过另一个 payment method；
3. x402 或同类协议获得足够的 model、sandbox、storage 和 hosting provider，使完整 stack 无需 fiat onramp；
4. live experiment 显示 provider auto recharge 无法可靠映射到指定 payment source、cap 或 invoice；
5. provider terms 不允许 SELF/FUNDING 的实际 customer-facing use 或 gateway 设计。

## 下一最高优先问题

Horizon A：在 Stripe Projects + OpenRouter 与 Square-receipt + debit-card auto-reload 之间，哪一个能以最少账户和最低不可逆风险完成第一笔 `delivered revenue → reconciled API cost → accepted output`？先核实 Stripe Projects 的真实账单对象、付款时点、失败状态与 sandbox/低额 live 测试方式。

Horizon B：x402 Bazaar 是否已经存在满足 coding-agent 核心需求的 model inference、sandbox、storage 和 deployment endpoints；若不足，最小的 x402 model gateway 应如何在不转售 provider key 的前提下提供 bounded service？
