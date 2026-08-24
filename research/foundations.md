# SELF/FUNDING 研究底稿：这个想法究竟需要什么证据

日期：2026-08-23  
范围：对现有六个页面的论点进行证据审计；优先使用论文、标准、政府资料和官方技术文档。  
说明：法律部分只用于识别研究与产品风险，不构成法律意见。

## 1. 结论先行

SELF/FUNDING 是一个值得实验的研究命题，但目前还不能作为一个已经成立的商业事实来陈述。

现有网站把五个不同层级的命题连成了一条确定性叙事：

1. 软件智能体能够执行工具、修改代码、调用模型和付款。
2. 某些边界明确的软件任务可以被机器验收，并产生正的单次贡献毛利。
3. 一个经济路由器可以长期选择“足够好且足够便宜”的模型。
4. 机器客户会持续购买这些服务，使有限资金不再耗尽。
5. 这些盈余足以补贴面向人的免费智能服务。

研究结论是：

- 第 1 层已经有较强的工程证据。
- 第 2、3 层有研究支持，但必须在 SELF/FUNDING 自己的任务分布上验证。
- 第 4 层只有早期市场信号，没有代码服务需求的充分证据。
- 第 5 层是合理的双边市场假说，但目前完全没有被本项目的数据证明。

因此，网站最可信的定位不是“我们已经造出了会养活自己的智能”，而是：

> 一个有限资本、权限受限、公开核算的实验：验证窄范围软件服务能否为其使用的计算资源持续产生净现金。

## 2. 证据强度矩阵

| 当前主张 | 证据判断 | 研究依据 | 网站应如何表达 |
|---|---|---|---|
| 智能体可以完成真实软件工作 | 中等；强烈依赖任务边界 | SWE-bench 证明真实仓库任务可执行验证，但真实世界任务仍受上下文、任务长度和数据污染影响 | 写成“在部分可验证任务上已可用”，不要泛化成稳定的软件劳动者 |
| “会写代码”就等于“能创造可出售价值” | 较弱 | 能生成结果不等于有人愿意付费，也不等于交付成本低于价格 | 将需求、成交、交付、验收拆成四个独立指标 |
| 单元测试生成适合作为第一项服务 | 中等偏强 | Meta 的 TestGen-LLM 中，75% 构建成功、57% 稳定通过、25% 增加覆盖率；73% 的建议被工程师接受 | 把服务改成“改进已有测试套件”，并用构建、稳定性、覆盖率和 mutation score 过滤 |
| 自动代码审查适合作为第一项服务 | 较弱 | 2026 年 SWE-PRBench 中，前沿模型在 diff-only 条件下只检测到约 15–31% 的人工标注问题 | 暂不作为首个付费服务；最多作为非权威辅助报告 |
| 模型路由能够降低成本 | 中等偏强 | FrugalGPT、RouteLLM 和代码级联研究都显示明显的成本/质量折中改善 | 可以保留，但必须声明路由阈值是在本项目任务上校准，而非直接套用通用 benchmark |
| x402 已解决机器支付 | 技术上较强，市场上仍早期 | x402 v2 已提供支付、facilitator、服务发现和 MCP 调用；Google AP2、Visa TAP 也证明行业正在建立授权与信任层 | 写成“支付基础设施已经可组合”，不要写成“机器客户市场已经成熟” |
| Stripe 给 agent 提供了独立金融身份 | 不成立 | Stripe 用户、merchant of record 和 Financial Account 仍归属于经过验证的人或实体；ACP/SPT 让 agent 代表买方发起交易，但 business 仍是 MoR | 写成“经过验证的 operator 可以向 agent 委托受限支付操作”，不能写“agent 自己在 Stripe 开户或拥有资金” |
| x402 支持“验收后再结算” | 当前表述不准确 | x402 的 exact/upto 是执行后不可逆的 push payment；退款是卖方发起一笔新的转账，原生 escrow 仍是未来能力 | V0.1 应明确为预付费 + 失败退款，或另引入 escrow/hold；不能把预付签名描述成传统授权保留 |
| 双重记账 + 幂等键足以保证资金安全 | 部分成立 | 幂等、数据库事务、对账是必要条件，但不是充分条件；并发、重复事件、密钥泄漏、链重组和内部篡改仍需处理 | 使用“append-only、可对账、tamper-evident”，不要仅凭 Postgres 称“immutable” |
| 权限受限的智能体是安全的 | 方向正确，但不能称已解决 | AgentDojo、OWASP 与 NIST 均表明 prompt injection、过度权限、工具滥用和 Denial-of-Wallet 仍是现实风险 | 强调所有付款、权限、限额与结算由确定性代码执行，模型只能提出动作 |
| 共享资金池比每个 session 单独盈利更合理 | 理论上成立 | 双边市场、风险池与跨侧补贴理论支持聚合核算 | 写成经济设计原则，不能写成已被运营数据验证的事实 |
| 机器市场可以补贴免费人类产品 | 有理论基础、无本项目实证 | 双边市场允许一侧低价或免费，但前提是另一侧需求与网络外部性足够强 | 标为长期假说；V0.1 只验证付费服务的净贡献，不承诺“frontier AI free” |
| 10 个成功任务可以证明模型成立 | 不成立 | 小样本不能支持 90% 接受率或低于 5% 的退款率 | “10 次”只能作为工程 smoke test；正式实验需预注册统计判定规则 |

## 3. 目前最有力的研究支撑

### 3.1 理论基础其实不是“AI 有自己的钱”，而是 bounded optimality

Russell 与 Subramanian 的 bounded optimality 将智能定义为：在给定计算架构、资源限制和环境中，选择能够获得最高期望效用的程序。Rational metareasoning 则进一步研究“是否值得继续计算”。这比拟人化的“AI 想办法活下去”更严谨。

SELF/FUNDING 可以据此重新定义经济路由器：

> 它不是让模型产生求生欲，而是在每个任务上比较额外计算的预期价值与计算成本。

来源：[Provably Bounded-Optimal Agents](https://arxiv.org/abs/cs/9505103)、[Stuart Russell 对 rational metareasoning 的说明](https://aima.eecs.berkeley.edu/~russell/research-bo.html)。

### 3.2 模型路由具有真实研究基础，但通用 benchmark 结果不能直接变成业务毛利

FrugalGPT 在其研究任务上报告过最高 98% 的成本下降；RouteLLM 在若干 benchmark 上以明显更低的强模型调用比例保持接近强模型的质量；代码级联研究也报告平均约 26%、最高 70% 的成本下降。

这些结果支持“路由值得做”，但不支持网站当前隐含的精确毛利。代码任务的失败成本、重试、上下文长度与验证成本可能抵消节省。SELF/FUNDING 必须记录：

- 每种任务类型的模型成功率；
- 每个模型的完整 token、工具与 sandbox 成本；
- 路由决策的置信度校准；
- 便宜模型失败后升级造成的级联成本；
- 路由后的最终验收率，而非只看模型评分。

来源：[FrugalGPT](https://arxiv.org/abs/2305.05176)、[RouteLLM / ICLR 2025](https://arxiv.org/abs/2406.18665)、[Model Cascading for Code](https://arxiv.org/abs/2405.15842)。

### 3.3 代码工作证据是“混合的”，这正好支持选择非常窄的服务

有利证据：GitHub 的受控实验在一个有限 JavaScript 任务上观察到使用 Copilot 的参与者更快；Meta 的 TestGen-LLM 在真实产品代码中生成了被工程师接受的测试改进。

不利证据：METR 在熟悉自己大型开源仓库的资深开发者中观察到，early-2025 AI 工具让任务时间增加 19%；DORA 2025 将 AI 描述为组织能力的“放大器”，而不是独立的生产力保证；新的代码审查 benchmark 仍显示低召回率。

所以最强的内容不是“智能体已经是软件公司”，而是：

> 当前能力适合被压缩成输入明确、输出可执行验证、失败可自动退款的小任务。

来源：[Meta TestGen-LLM](https://arxiv.org/abs/2402.09171)、[TESTEVAL](https://arxiv.org/abs/2406.04531)、[METR 开发者生产力 RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)、[DORA 2025](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/)、[SWE-PRBench](https://arxiv.org/abs/2603.26130)。

### 3.4 机器支付基础设施已经存在，但“机器需求”还没有被证明

x402 v2 已支持 HTTP 原生稳定币支付、facilitator、MCP 服务发现和 Bazaar。Coinbase 的官方示例显示 Bazaar 中已有带价格、质量分和 transaction count 的服务；Google AP2 与 Visa Trusted Agent Protocol 则把用户授权、agent 身份、签名、支付凭证和责任链正式化。

这证明了“机器能够发现并购买服务”，但不能证明“机器会持续购买代码服务”。官方 Bazaar 示例仍主要是 crypto news、token data 和 DEX 数据，示例 transaction count 只有数十到数百。代码转换、测试改进和 PR 审查的真实机器需求仍需要单独验证。

来源：[x402 总览](https://docs.cdp.coinbase.com/x402/welcome)、[x402 Bazaar MCP](https://docs.cdp.coinbase.com/api-reference/v2/rest-api/x402-facilitator/bazaar-mcp-server)、[Bazaar 资源示例](https://docs.cdp.coinbase.com/agentic-wallet/mcp/mcp-tools/list-bazaar-resources)、[Google AP2](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol)、[AP2 v0.2 规范](https://github.com/google-agentic-commerce/AP2/blob/main/docs/ap2/specification.md)、[Visa Trusted Agent Protocol](https://developer.visa.com/capabilities/trusted-agent-protocol/trusted-agent-protocol-specifications/)。

## 4. 现有架构中必须修正的三个实质问题

### 4.1 x402 结算流程与网站的状态机不一致

网站现在写的是：Fund → reserve revenue → Run → Verify → Settle。

但 Coinbase 当前文档描述的 x402 基本流程是：客户端提供签名支付 payload，服务端验证并结算，然后返回资源。`exact` 与 `upto` 都是不可逆 push payment；失败退款需要卖方再发一笔 USDC，原生条件支付/escrow 仍属于未来扩展。

V0.1 应选择并明确其中一种：

1. **预付费模式**：quote → prepay → run → pass/return；失败则发起独立退款。
2. **托管模式**：先在受控 escrow 中锁定，验收后释放；这需要 x402 之外的组件。
3. **同步资源模式**：只销售可以在一次 HTTP 生命周期内完成并验证的极小服务。

首版建议使用第 1 种，并把退款、重复支付和退款失败作为账本的一等事件。

来源：[x402 Client / Server Flow](https://docs.cdp.coinbase.com/x402/core-concepts/client-server)、[x402 FAQ — refunds](https://docs.cdp.coinbase.com/x402/support/faq)。

### 4.2 “无隐藏补贴”与当前 E2B / 免费模型额度冲突

E2B 当前 Hobby tier 含一次性 $100 usage credits，Pro tier 为 $150/月再加 usage cost。一个只有 $20 的实验如果使用 $100 免费 credits，就已经接受了大于初始资本五倍的补贴；如果使用 Pro，则仅固定月费就超过资金。

因此所有免费额度、云赠金、免费模型层和创始人提供的基础设施都必须：

- 按公开 list price 计入成本；或
- 明确记为 donated capital，并加入初始资本；或
- 完全不使用。

否则“30 天后还有没有钱”不具有解释力。

来源：[E2B Pricing](https://e2b.dev/pricing)、[OpenAI API Pricing](https://openai.com/api/pricing/)、[Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)。

### 4.3 账本可以 append-only，但不能仅凭数据库设计称为 immutable

Postgres 的交易、约束与 serializable isolation 能保护一致性；幂等键能降低重复执行；外部支付对账能发现差异。但拥有数据库管理员权限的人仍能更改记录。

更准确的表述应为：

- append-only journal；
- balanced entries；
- serializable posting transaction；
- unique idempotency key；
- external-rail reconciliation；
- hash-chained / signed daily checkpoint；
- 独立只读审计副本。

来源：[PostgreSQL transactions](https://www.postgresql.org/docs/current/sql-start-transaction.html)、[PostgreSQL Serializable](https://wiki.postgresql.org/wiki/Serializable)、[Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)、[Stripe webhook delivery behavior](https://docs.stripe.com/webhooks)。

## 5. 安全研究对产品逻辑的要求

AgentDojo 证明，外部工具返回的数据可以通过间接 prompt injection 劫持智能体。OWASP 特别列出 excessive agency、tool misuse、Denial-of-Wallet、密钥泄漏与供应链攻击。Google AP2 也明确规定：验证和授权必须由确定性代码执行，Trusted Surface 必须是 non-agentic。

因此经济控制面必须遵循：

1. 模型只能提出 `proposed_action`，不能直接持有付款或部署权限。
2. 付款限额、收款地址、服务 allowlist、nonce、过期时间和预算由确定性策略引擎验证。
3. 读取不可信仓库内容的模型与持有钱包签名权的组件不能共享上下文或进程。
4. sandbox 默认断网；需要网络时采用域名、方法、字节数和时间预算 allowlist。
5. 每个任务限制 token、工具调用、重试、wall-clock、CPU、RAM 和最大现金损失。
6. 高影响动作必须经过与模型独立的审批面。
7. 所有安全属性都应进行 adversarial evaluation，而不是通过 prompt 声明。

来源：[AgentDojo](https://arxiv.org/abs/2406.13352)、[OWASP AI Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)、[NIST AI RMF GenAI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)、[Firecracker](https://www.usenix.org/conference/nsdi20/presentation/agache)、[AP2 Specification](https://github.com/google-agentic-commerce/AP2/blob/main/docs/ap2/specification.md)。

## 6. 法律和责任边界不能继续隐身

“智能体拥有资金”只是产品隐喻，不是当前法律结构。

- 美国 E-SIGN Act 明确允许电子代理参与合同形成，但前提是其行为可以法律上归属于被约束的人。
- 收到数字资产作为服务报酬，通常仍按收到时的美元公允价值确认普通收入。
- 自己收款并购买自己所需服务，与代表他人接收并转移资金的监管性质不同。后者可能触发 money transmission、AML/KYC 与州级要求。
- OFAC 对虚拟货币交易与法币交易适用同样的制裁合规义务。

因此网站需要出现真实的 operator / legal entity / contracting party，而不能让“自主机构”掩盖责任主体。

来源：[15 USC §7001(h)](https://uscode.house.gov/view.xhtml?req=%28title%3A15+section%3A7001+edition%3Aprelim%29)、[IRS digital asset FAQ](https://www.irs.gov/individuals/international-taxpayers/frequently-asked-questions-on-digital-asset-transactions)、[FinCEN virtual currency guidance](https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering)、[OFAC virtual currency guidance](https://ofac.treasury.gov/system/files/126/virtual_currency_guidance_brochure.pdf)。

### 6.1 Stripe 解决委托执行，不解决 agent 的独立人格

Stripe 的官方条款和产品结构没有把 agent 变成收款主体。Stripe Services Agreement 的 User 是个人或实体，并要求有权约束该 User 的 Representative；Connect charges 和 payouts 需要企业、个人、受益所有人与代表的验证；merchant of record 必须是平台或 connected account 中的一个，并承担退款与争议责任。

ACP、Shared Payment Token、Agent Toolkit 和 Stripe MCP 解决的是 agent 可以代表用户或企业发起受限动作。Stripe Financial Accounts 可以让符合条件、已经验证的 connected account 收、存、发资金，但账户依然附着于该主体。

所以首版正确架构是：

> operator 是 Stripe User、merchant of record、资金与义务的所有者；agent 是 operator 的 electronic agent，只能提出或执行被策略和凭证严格限制的动作。

美国 E-SIGN Act §7001(h) 也采用同样逻辑：电子代理参与形成合同不导致合同失效，但其动作必须能法律上归属于被约束的人。

详细证据与权限矩阵见：[Stripe 是否解决 agent 身份问题](notes/2026-08-24T00-25-34Z-stripe-agent-identity.md)。来源：[Stripe Services Agreement](https://stripe.com/legal/ssa)、[Stripe Services Terms](https://stripe.com/legal/ssa-services-terms)、[Stripe Connect identity verification](https://docs.stripe.com/connect/identity-verification)、[Stripe merchant of record](https://docs.stripe.com/connect/merchant-of-record)、[Stripe ACP design](https://stripe.com/blog/developing-an-open-standard-for-agentic-commerce)、[Stripe Financial Accounts guide](https://docs.stripe.com/issuing/integration-guides/embedded-finance)。

### 6.2 银行卡付款没有一个可以同时代表履约、可用现金与不可撤销性的 Stripe 状态

首版 Stripe 状态必须分层：

- `PaymentIntent.succeeded` 表示 payment flow 完成，Stripe 官方允许开始履约；
- linked BalanceTransaction `pending` 表示净额尚不可 withdraw 或 spend；
- BalanceTransaction `available` 表示净额可用于 payout、refund、transfer 或其他 debit，但仍有 refund 与 dispute 风险；
- payout `paid` 也可能在最多五个额外工作日后变为 `failed`；
- 银行入账只证明 custody location 改变，不消除之后的 card dispute；
- 只有在交付、成本、准备金和 external reconciliation 完成后，内部 policy 才能把剩余金额标为 `policy_available_surplus`，而且不得称为不可撤销资金。

因此每个 job 至少需要四个正交字段：payment flow、Stripe custody availability、customer obligation 和 internal allocation。内部 job/refund/tax/reserve 子账户只解释用途；除非资金确实位于独立 Stripe balance、银行账户或其他外部容器并被对账，否则不能称为物理隔离。

详细状态转移、权限矩阵、反证与 sandbox 实验见：[Stripe 首笔银行卡付款的最小资金状态机](notes/2026-08-24T00-42-22Z-stripe-money-state-machine.md)。来源：[Stripe PaymentIntent lifecycle](https://docs.stripe.com/payments/paymentintents/lifecycle)、[Balances and settlement time](https://docs.stripe.com/payments/balances)、[Balance Transaction object](https://docs.stripe.com/api/balance_transactions/object)、[Refunds](https://docs.stripe.com/refunds)、[Disputes](https://docs.stripe.com/disputes/how-disputes-work)、[Payouts](https://docs.stripe.com/payouts)、[Payout reconciliation](https://docs.stripe.com/reports/payout-reconciliation)、[Webhooks](https://docs.stripe.com/webhooks)、[Testing](https://docs.stripe.com/testing)。

### 6.2.1 V0.1 的真实资金隔离只有三处，其余用途必须诚实地写成账本限制

Stripe 当前公开文档补充了一个重要例外：`refund_and_dispute_prefunding` 是 operator 从外部银行注资的独立 balance，不参加 automatic payout；payments balance 不足时，refund/dispute 才会动用这笔 prefunding。它与“minimum balance”不同：minimum balance 只是 automatic payout 后保留在 payments balance 的 floor，可以被 Dashboard 管理员修改或关闭，且损失超过 floor 时仍会成为负数。Stripe 自己施加的 reserve 又是 Stripe 的风险 hold，不是 operator 可分配的 job、tax 或 runway 资金。

因此首版的最小外部 topology 是：operator 的 Stripe payments balance、operator 预先注资的 refund/dispute balance、以及与个人账户分开的 operator business checking。客户履约义务、job budget、tax estimate、general reserve 和 policy-available surplus 都必须在复式账本中分开，但在实际建立、注资并对账第二个银行账户或其他外部容器之前，只能称为 policy restriction，不能称为 physically segregated cash。首笔 provider 成本使用 operator 预先存在的 operating float，不使用尚未交付的 customer obligation，这样完整退款路径不依赖新收入先变成 working capital。

ASC 606 对采用 US GAAP 的主体要求在服务交付前把 customer prepayment 表示为 contract liability；这是一项会计列报，不会自动创造 escrow 或 trust account。IRS Publication 583 建议开设仅用于业务的 checking account、维护 journals/ledgers 并将银行 statement 与账簿对账，但本轮没有找到 generic software merchant 必须为 tax、job 与 general reserve 各开一个银行账户的 primary-source 证据。这个负面结果不排除 entity、州、合同或特定业务触发额外义务；上线前仍需 US 法律、税务与会计专业复核。

完整 source ledger、状态转移、authority matrix、fallback 与 falsification gates 见：[首笔 Stripe job 的 balance separation](notes/2026-08-24T02-12-52Z-stripe-balance-separation.md)。来源：[Stripe balances](https://docs.stripe.com/payments/balances)、[Stripe add funds](https://docs.stripe.com/get-started/account/add-funds)、[Stripe minimum balances](https://docs.stripe.com/payouts/minimum-balances-for-automatic-payouts)、[Stripe refunds](https://docs.stripe.com/refunds)、[FASB ASU 2014-09 / ASC 606](https://asc.fasb.org/layoutComponents/getPdf?fileName=GUID-922C9F73-BD0D-42C8-805D-1105C5CF9692.pdf&isSitesBucket=false)、[IRS Publication 583](https://www.irs.gov/publications/p583)。

### 6.2.2 V0.1 的 Stripe runtime 只持有读权限与受限退款权限；高影响变更保留给人

Stripe 当前支持按 resource 设置 `Read`、`Write` 或 `None` 的 restricted API key（RAK），且明确建议在 AI agent 场景用 RAK 代替 unrestricted secret key。首版因此不把 `sk_live_`、Dashboard session、top-up、payout、bank-account、API-key 或 team-management 权限交给 agent。最小 machine credential 是：一把只读 reconciliation RAK、一把只对已测试 refund path 开放写入的 refund RAK，以及一把只验证 inbound event 的 endpoint-specific webhook secret。退款仍按 `proposal → deterministic policy → isolated signer → Stripe → signed event/read-back → independent close` 执行；job sandbox、模型与 read worker 都不能接触 refund signer。

Dashboard role 不能自动形成 maker-checker：Stripe 的 Analyst 同时能 refund 与 payout，Developer 接触几乎全权限 secret key，Administrator 同时能操作 refund、payout、key、bank 和 payout schedule；multiple roles 又会叠加权限。因此 Refund Analyst 只处理退款例外，Administrator 在 phishing-resistant 2FA 下进行 key、own-bank 和 payout-schedule 变更，View Only reviewer 独立读取 payments、balances、payouts、logs、reports 与 security history。refund/dispute prefunding 的首次真实注资由人以 Top-up Specialist 或账户实际支持的 Dashboard flow 完成；公开 Top-ups API 的存在不能证明它等同于该账户的 live prefunding rail。

本轮也没有找到 standard merchant account 的 Stripe-wide one-click emergency stop。Connect Risk Analyst 的 pause payments/payouts 只作用于 connected account，不作用于这里假设的 operator account。因此 emergency stop 必须是组合控制：先在本地停止新任务、provider spend 与自动退款签名，再由人 expire/rotate 受影响的 RAK 或 webhook secret，导出 request/security history，完成外部对账与 negative-permission test 后才恢复。sandbox 可以验证 allow/deny、idempotency、signature、rotation 与 recovery；不能证明 live bank 验证、account feature、limits、settlement 或真实 refund-prefunding path。

完整 evidence ledger、authority matrix、控制状态转移与 pre-live gate 见：[V0.1 Stripe credential and approval matrix](notes/2026-08-24T02-44-43Z-stripe-credential-approval-matrix.md)。来源：[Stripe restricted API keys](https://docs.stripe.com/keys/restricted-api-keys)、[Stripe API keys](https://docs.stripe.com/keys)、[Stripe user roles](https://docs.stripe.com/get-started/account/teams/roles?locale=en-GB)、[Stripe team security](https://docs.stripe.com/get-started/account/orgs/team)、[Stripe webhooks](https://docs.stripe.com/webhooks)、[Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests)。

### 6.2.3 机器身份和经济身份必须分层：DID 或 agent key 不是银行账户、法律人格或独立 treasury

理想目标应拆成六层：`persistent machine identity → delegated transaction authority → legal attribution → financial account ownership → policy-bounded custody → observed economic closure`。前两层已经有相当成熟的技术 primitive：W3C DID 允许 digital subject 和 autonomous-software controller，Verifiable Credentials 能表达 issuer 对 subject 的防篡改 claim；AP2 autonomous flow 能由 Agent Key 签署 closed mandate。但是这些技术只证明 key/credential/mandate 的连续性和授权链，不迫使 bank、PSP、provider、court、tax authority 或 insurer 把 agent 当作独立 customer 或 liable principal。

当前制度证据仍把商业行为归到可识别主体。15 U.S.C. §7001(h) 要求 electronic-agent action legally attributable to the person to be bound；FinCEN CDD 对 legal entity customer 识别自然人 beneficial owner 和至少一名自然人 control person；Stripe 要求 User 是关联 User Bank Account 的 named account holder；OpenAI 把购买、payment method 和 account activity 责任放在 Customer Account。Coinbase Agentic Wallet 的权限分离也说明当前设计方向：agent 可以在 limits 内支付 x402 service，但只有用户能 onramp、任意 transfer 或提高 limits。

因此首版目标不是“给模型一张独立无限额银行卡”，而是建立一个持续的 agent identity bundle：`agent_id/DID、agent key lineage、software/policy version、operator legal-entity ID、root mandate、revocation state、recovery quorum`。agent 持有专属 economic record、provider project、subledger 和 action-specific credential；operator/entity 仍持有法律账户；deterministic policy 执行不可由 agent 提高的 amount、payee、purpose、expiry、reserve 和 daily/provider cap；isolated signer 精确执行；external rail 和 independent close 决定经济事实。

完整 gap matrix、evidence thresholds、identity-continuity drill、AP2-style sandbox 与真实闭环 gate 见：[Agent-native identity gap map](notes/2026-08-24T02-52-25Z-agent-native-identity-gap-map.md)。来源：[W3C DID Core](https://www.w3.org/TR/did-core/)、[W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model/)、[AP2 v0.2](https://github.com/google-agentic-commerce/AP2/blob/main/docs/ap2/specification.md)、[15 U.S.C. §7001](https://www.govinfo.gov/link/uscode/15/7001)、[FinCEN CDD FAQs](https://www.fincen.gov/resources/statutes-and-regulations/cdd-rule-faqs)、[Stripe Services Agreement](https://stripe.com/legal/ssa)、[OpenAI Services Agreement](https://openai.com/policies/services-agreement/)、[Coinbase Agentic Wallet MCP](https://docs.cdp.coinbase.com/agentic-wallet/mcp/mcp-tools/overview)。

### 6.3 “agent 自己充值 API”可以在经济控制意义上实现，但主流账户仍属于 operator

首版必须区分三种不同能力：

1. **Provider auto-recharge：今天可用。** OpenAI、Claude 和 OpenRouter 都允许 operator 预设 payment method、余额阈值或自动续费。agent 可以读取 usage、cost 或 credits 并在内部保留 fuel budget，但不能更改付款方式或提高 monthly limit。
2. **Agent-provisioned pay-as-you-go：provisioning 可用，job-to-cash reconciliation 尚未证明。** Stripe Projects 能 provision OpenRouter scoped credential，并设置 global/per-provider spending cap。付费升级会把 operator 存在 Stripe 的 payment credential 变成 Shared Payment Token；OpenRouter 作为 provider/seller 使用 token 创建自己的 PaymentIntent。Projects 公开的 spend surface 只有 provider-month aggregate，当前文档没有建立 generation、SPT、provider PaymentIntent/receipt、charge cadence、retry/refund 与 bank/card posting 的稳定关联。因此它不能描述成 Stripe 销售余额直接给 agent 充值，也不能单独作为 provider cost ledger。
3. **Wallet-native earn-to-spend：x402 范围内可用。** agent 的付费 endpoint 可以把 USDC 收入送到一个 wallet，再从同一 wallet 支付另一个 x402 endpoint。Coinbase Agentic Wallet MCP 允许 agent 在 user-set per-call/session limit 内付款，但不允许 agent 自己 onramp、任意转账或修改限额。

其他收款轨道改变的是交付时间和责任分配，不会自动创造 agent 法律身份：Square 等 PSP 仍使用 verified seller account；Paddle/Lemon Squeezy 等 MoR 对最终客户承担 merchant 责任后再周期性 payout 给 supplier；bank invoice 适合高客单 B2B 但不适合即时微支付。x402 的 wallet address 是可编程 protocol identity，不等同于法律主体、银行账户、税务身份或 provider Customer。

主流平台当前没有建立一个通用的、公开支持的 credit-purchase API：OpenAI 公开 Admin API 提供 usage/cost 读取而购买在 Billing portal；Claude 的购买和 auto-reload 由 Billing/Admin UI 配置；OpenRouter 的 `GET /api/v1/credits` 只读余额，旧 `POST /api/v1/credits/coinbase` 已返回 410。公开 reference 的缺失是有界结论，不排除未来或 enterprise 私有能力。

因此首版的正确主张是：**operator-owned agent can economically finance its next API usage under pre-authorized limits**，而不是“agent 独立拥有账户并给自己充值”。但“可预授权”也不能替代外部对账：Stripe Projects 应被视为 provisioning、credential delegation 和 outer cap；generation usage、OpenRouter billing、SPT/payment evidence 与 bank/card posting 必须分别捕获并匹配。Projects `spend` 只做 aggregate cross-check。完整收款路径见：[收款路径与 API self-funding](notes/2026-08-24T00-59-44Z-collection-rails-and-api-self-funding.md)；SPT 对象链、状态与 capped live test 见：[Stripe Projects + OpenRouter 账单对象与最小可对账证据](notes/2026-08-24T01-44-21Z-stripe-projects-openrouter-reconciliation.md)。

## 7. 建议重写的 MVP 实验

### 7.1 更严谨的研究问题

> 在预先定义的输入范围、确定性验收、固定权限和真实全成本核算下，一个自动化测试改进服务能否以正贡献毛利完成足够多的真实付费任务，并把所需人工操作压低到预设阈值？

这比“30 天后智能体是否还活着”更好，因为它能把失败拆成：需求不足、价格不足、交付失败、成本失控、退款过高或人工依赖。

### 7.2 首个服务应改为“改进已有测试”，不是开放式代码服务

建议输入：

- 一个函数或小模块；
- 已存在、可运行的测试框架；
- 锁定依赖；
- 明确语言和仓库大小上限；
- 无网络、无生产密钥。

只有同时满足以下条件才验收：

- 原有测试继续通过；
- 新测试连续运行多次无 flaky；
- 目标覆盖率或 branch coverage 增加；
- mutation score 达到最低提升；
- patch 大小和允许文件范围合规；
- 静态检查与依赖策略通过；
- 产物 hash 与执行记录完整。

这条服务路线与 TestGen-LLM 的工业证据最接近。自动 PR review 不应作为第一个主要收入项目。

### 7.3 正确的单位经济公式

```text
contribution_per_job = settled_revenue
  - model_input_cost
  - model_output_and_reasoning_cost
  - sandbox_cpu_ram_storage_cost
  - payment_and_facilitator_cost
  - expected_retry_cost
  - expected_refund_and_failure_cost
  - allocated_fixed_infrastructure_cost
  - human_operations_cost
```

另行报告税费、合规成本、客户获取成本和安全事件准备金。不能用免费 credits 将任一项变成零。

### 7.4 把一个实验拆成三个实验

1. **技术可行性**：在冻结的内部任务集上测成功率、成本、路由和安全。
2. **单位经济**：只针对已成交任务测真实贡献毛利。
3. **市场需求**：测曝光 → quote → 付款 → 复购，不允许把测试流量当客户需求。

三者全部通过，才能开始“有限资本生存实验”。

### 7.5 修正样本量

网站当前的“连续 10 个任务正贡献”只能证明流程能跑，不能证明可靠性。即便 10 次都没有退款，按照常用 rule of three，真实失败率的单侧 95% 上界仍约为 30%。若希望在零失败情况下把失败率上界压到 5% 左右，需要约 59–60 次独立任务。

正式实验应预注册：

- 可接受成功率与不可接受成功率；
- 最大样本量；
- 允许失败数；
- 提前停止规则；
- 退款、超预算、安全或对账差异的硬停止条件；
- 每个指标的置信区间。

来源：[NIST — binary performance threshold](https://www.nist.gov/publications/confirming-performance-threshold-binary-experimental-response)、[NIST proportion confidence intervals](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/propconf.htm)、[NIST rule-of-three references](https://www.nist.gov/document/iyer-presentationpdf)。

## 8. 对六个页面的内容改写方向

### Home

- 将确定性口号降级为研究问题。
- 清楚区分 `SUPPORTED`, `HYPOTHESIS`, `TARGET`, `LIVE RESULT`。
- 所有金额必须标记 `illustrative`、`simulated` 或 `live`。
- “frontier intelligence free to humans”改成有条件的长期目标。

建议核心句：

> Can a bounded software service earn enough to cover the real cost of its own computation?

### Thesis

- 引入 bounded optimality 与 value of computation，替代“求生压力”式拟人叙事。
- 将共享 treasury 定义为运营实体的受限预算池，而不是智能体法律人格。
- 加入反证条件：如果市场需求、可靠性或人工成本不成立，命题即失败。

### Architecture

- 把模型层、策略层、执行层、钱包签名层严格拆开。
- 修正 x402 为 prepay/refund 或额外 escrow。
- 将 `immutable ledger` 改为 `append-only, reconciled, tamper-evident ledger`。
- 加入 prompt injection、DoW、重复事件、refund failure 与密钥轮换威胁模型。

### Economics

- 删除没有 token、模型、时长和固定成本来源的 `$0.30 / $0.045 / $0.025` 硬编码示例，或明确标为 illustrative scenario。
- 同时展示单位经济与需求漏斗。
- 将免费额度按市场价计成本。
- “60% margin”必须说明是目标，不是观测值。

### Build

- 将首个服务改为测试改进管线。
- 增加 mutation testing、flaky reruns、dependency lock、network-off sandbox。
- 增加 policy engine、signed mandate、refund transaction、daily signed checkpoint。
- 把 10 个任务定位为工程验收，而不是经济证明。

### Experiment

- 改为三阶段实验，并预注册统计规则。
- 把 $20 与 $5 最大损失保留为纪律工具，但不要把 30 天作为唯一成功判据。
- 同时公布现金账、应计成本、donated credits、人工分钟和需求数据。

## 8.5 双轨路线：现在跑通，同时定义未来缺口

SELF/FUNDING 不能在“立刻可做的小产品”和“未来自主经济主体”之间二选一。正确的方法是两个不同证据标准的研究轨道：

### Horizon A — 现在能够跑通

使用今天已经存在的制度和产品：经过验证的 operator 是唯一 merchant of record；agent 是受限电子执行者；Stripe 或其他受监管轨道处理收款；内部账本记录目的和义务；确定性策略与隔离凭证控制支出；一个真实付款、一次失败退款和一次完整对账构成首个闭环。

这个轨道的输出必须是可以构建的决策、实验、数据或明确 blocker，不能只继续生产概念。

### Horizon B — 未来需要具备什么

长期目标需要逐项研究目前缺失的基础设施：

- 可持续、可撤销且可归责的机器身份；
- 能表达用途、限额、期限与恢复规则的 policy-native custody；
- 对电子代理行为的跨平台授权和可验证 mandate；
- 税务、责任、保险、争议、破产和善后机制；
- 能证明运行代码、模型、策略版本与签名边界的 attestation；
- 能升级规则但不能悄悄侵占资金的治理结构；
- 当 operator、支付轨道或模型供应商失效时的 continuity 与 recovery。

每项未来主张必须写明：今天为什么不成立、缺少哪一个 primitive、什么证据算它已经出现，以及今天可以先做哪个 bridge experiment。未来愿景不能成为推迟首笔真实交易的理由。

## 9. 下一轮必须回答的研究问题

研究顺序改为先打通资金闭环，再研究增长：

1. 第一笔付款何时才算最终到账，而不是待结算、可撤销或仍承担退款责任？
2. 哪个法律实体持有资金、签约、收款、纳税和承担缺陷责任？
3. 银行账户、稳定币钱包和内部账本分别扮演什么角色，哪些余额必须隔离？
4. 模型可以提出哪些支出，确定性策略可以批准哪些支出，哪些动作必须由独立的人批准？
5. 如何处理预付款、验收、失败退款、重复事件、退款失败、密钥泄漏和支付轨道中断？
6. 如何把外部资金轨道、内部复式账、供应商账单、税务记录和每日余额对账？
7. 在确认可用盈余后，运行储备、退款准备金、算力支出和免费人类服务的优先顺序是什么？
8. 完成上述设计后，谁是第一个真实买家，他们愿意为“测试覆盖提升”支付多少？
9. 什么输入限制能使成功率、报价误差和安全风险稳定？
10. 在何种观测结果下，我们必须承认“自我融资”在当前条件下失败？

## 10. 当前研究判断

这个项目最强的地方不是它已经证明了一个自主机器经济，而是它可以把一个宏大说法变成一个诚实、有限、可失败、可复现的实验。

真正值得建立的不是“一个会赚钱的 AI”形象，而是一套能够先解释钱、再解释增长的系统：

- 客户付的钱何时真正到账，落在哪个受法律约束的账户或钱包？
- 谁可以提议、批准、签署和撤销一笔支出？
- 收入何时从待履约款变成可使用盈余？
- 外部余额、内部账本、供应商账单和退款是否每日一致？
- 这项工作由谁购买？
- 结果是否被客观验收？
- 所有成本是否真实入账？
- 模型是否被权限系统约束？
- 失败是否自动停止损失？
- 盈余是否在重复样本中存在？

如果这些答案最终为“是”，SELF/FUNDING 才获得比口号更有价值的东西：一项可被他人复验的经济事实。
