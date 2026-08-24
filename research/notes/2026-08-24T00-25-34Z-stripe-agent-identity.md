# Stripe 是否解决了“Agent 没有人的身份，因而无法收款”

研究时间：2026-08-24T00:25:34Z
适用范围：以美国运营主体为主要假设，核对 Stripe 截至本轮研究时的公开条款、产品文档和美国联邦电子签名法。
性质：产品与研究约束，不构成法律、会计、税务或支付合规意见；正式上线前需要相关专业人士按实际州、实体类型、客户、支付方式和资金流复核。

## 结论先行

**Stripe 没有让 AI agent 获得独立法律人格，也没有允许一个没有真实个人或实体归属的 agent 以自己的名义成为 Stripe 用户或 merchant of record。**

Stripe 真正解决的是另一件很有价值的事：

> 一个通过身份验证的人或法律实体可以成为收款与责任主体，再把部分收款、退款、查询和支出操作通过受限 API 委托给软件代理执行。

因此，更准确的产品表述是：

- 不是“agent 在 Stripe 开户并拥有自己的钱”；
- 而是“运营主体在 Stripe 开户并拥有资金与义务，agent 在该主体授予的权限、预算和审计规则内操作”。

这使 SELF/FUNDING 在工程上可行，但没有消除身份问题。它把身份问题固定在 **operator / merchant of record / account representative** 上，并把 agent 变成可被归责的电子执行者。

## 研究问题

1. Stripe 的账户、收款、余额和 payout 在法律与合同上归属于谁？
2. Stripe Connect、Financial Accounts、Agentic Commerce Protocol 和 Shared Payment Tokens 是否允许 agent 成为独立收款主体？
3. 如果不能，SELF/FUNDING 最小可行的身份和资金架构是什么？

## 为什么重要

如果把“可以调用 Stripe API”误写成“agent 有自己的金融身份”，网站会混淆四件不同的事：

1. 软件能够发起操作；
2. 某个人或实体授权该操作；
3. 某个 merchant of record 对客户、退款和争议负责；
4. 某个经过验证的账户或银行关系实际持有或接收资金。

这种混淆会让收款、税务、退款、争议、密钥泄漏和责任归属全部失真。

## 搜索方法与查询

只使用 Stripe 官方条款、Stripe 官方产品文档、ACP 官方资料和美国法典。主要查询包括：

- `Stripe Services Agreement User Representative Stripe Account`
- `Stripe Connect identity verification legal entity representative owner`
- `Stripe merchant of record legal responsibility Connect`
- `Stripe Agentic Commerce Protocol merchant of record AI agent`
- `Stripe Financial Accounts connected account verification`
- `15 USC 7001 electronic agents legally attributable`

## 来源账本

| 来源 | 机构 / 作者 | 日期 | 稳定链接 | 关键位置与所能证明的内容 |
|---|---|---:|---|---|
| Stripe Services Agreement — General Terms | Stripe | 2025-11-18 修订 | https://stripe.com/legal/ssa | 开头与 §1：协议主体是用户或其代表的实体；代表必须有权约束用户；Stripe 账户操作归用户及其授权代表负责。证明 Stripe 的合同主体不是无归属的 agent。 |
| Stripe Services Agreement — Services Terms | Stripe | 2025-11-18 修订 | https://stripe.com/legal/ssa-services-terms | Stripe Payments §§4.2–4.3：Stripe 以有限代理身份接收、持有和结算“欠 User 的资金”，并向 User 的银行或 Financial Account 结算；Connect §3.3：平台对使用其凭证发起的活动负责。 |
| Identity verification for connected accounts / handling verification | Stripe | 动态文档，本轮核对 2026-08-24 | https://docs.stripe.com/connect/identity-verification  / https://docs.stripe.com/connect/handling-api-verification | 启用 charges/payouts 需要企业、个人代表、受益所有人、税号和身份证明等信息；验证失败会暂停能力。证明 Custom/Express 自动化没有消除 KYC/KYB 与真人代表。 |
| Understand the merchant of record in Connect | Stripe | 动态文档，本轮核对 2026-08-24 | https://docs.stripe.com/connect/merchant-of-record | 明确 MoR 是对交易负法律责任、承担退款与争议并出现在收据/账单上的实体；MoR 可以是平台或 connected account，但必须明确其中之一。 |
| Developing an open standard for agentic commerce | Stripe, Jeff Weinstein, Steve Kaliski | 2025-09-29 | https://stripe.com/blog/developing-an-open-standard-for-agentic-commerce | ACP 中 agent 代表买家发起 checkout；business 选择接受/拒绝并保持 merchant of record。证明 ACP 解决代理发起购买和凭证传递，不给 agent 卖方人格。 |
| Shared payment tokens | Stripe | Private preview 文档，本轮核对 2026-08-24 | https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens | SPT 对卖家、金额和过期时间进行限制；卖家用 token 创建 PaymentIntent。证明它是受限付款授权，不是 agent 的银行或商户身份。 |
| Embedded Finance integration guide | Stripe | 动态文档，本轮核对 2026-08-24 | https://docs.stripe.com/issuing/integration-guides/embedded-finance | 先创建并验证 connected account、激活能力，之后才可为 eligible connected account 创建 FinancialAccount 来收、存、发资金。证明 FinancialAccount 仍附着于已验证账户。 |
| 15 U.S.C. §7001(h) — Electronic agents | U.S. House, Office of the Law Revision Counsel | 现行法，本轮核对 2026-08-24 | https://uscode.house.gov/view.xhtml?req=%28title%3A15+section%3A7001+edition%3Aprelim%29 | 电子代理参与形成合同时不会因此失效，但前提是其动作可在法律上归属于被约束的人。支持“委托执行”，不支持“agent 自动成为独立人格”。 |

## 直接事实

### 1. Stripe 账户需要可被合同约束的 User 和真人 Representative

Stripe 总条款将协议定义为 Stripe 与“你或你所代表的实体”之间的协议。代表实体接受协议的人必须有权在法律上约束该实体。Stripe 的 Connect 验证材料进一步要求企业信息、代表、受益所有人和身份文件。

分类：**Direct fact**。

### 2. Stripe 收到的是“欠 User 的资金”，不是“agent 自己的钱”

Stripe Payments 条款把 Stripe 描述为在有限目的下代表 User 接收、持有和结算交易资金。Stripe 余额会再结算到 User 的银行账户或符合条件的 Financial Account，并可能扣除费用、退款、争议和储备。

分类：**Direct fact**。

### 3. Connect 可以选择责任主体，但不能删除责任主体

不同 charge 配置可让平台或 connected account 成为 merchant of record。Stripe 明确把 MoR 定义为收客户款、出现在收据或账单上、并对商品/服务、退款和争议负责的实体。

分类：**Direct fact**。

### 4. Agentic Commerce 主要解决“代表买家购买”

ACP 和 SPT 让 agent 展示 checkout、传递受限支付凭证并代表买家请求商户发起交易。商户仍可接受或拒绝，仍维护客户关系，并继续作为 merchant of record。

分类：**Direct fact**。

### 5. 美国联邦法容许电子代理形成合同，但动作必须归属于某个人

15 U.S.C. §7001(h) 的条件不是“agent 获得人格”，而是电子代理的动作能法律上归属于将被约束的人。

分类：**Direct fact**。

## 反证与容易造成误解的材料

Stripe 的营销资料会使用“agents transact”“agent-initiated payments”“monetize MCPs”等简化语言，也展示 agent 自动创建 Payment Link 或使用临时虚拟卡。这些功能是真实的工程能力，但官方架构仍将：

- 买方资金与授权归属于用户；
- 卖方身份与责任归属于 business / platform / connected account；
- API 凭证和由此产生的操作责任归属于 Stripe User。

因此，这些材料可以反驳“agent 完全不能参与收付款”，但不能反驳“agent 没有独立法律人格”。

分类：**Direct fact + bounded interpretation**。

## 有界推论

### Stripe 解决了操作层，不是人格层

只要 SELF/FUNDING 有一个真实 operator，它就可以：

1. 以 operator 名义与 Stripe 签约并完成 KYC/KYB；
2. 让 operator 成为首版唯一 merchant of record；
3. 由 agent 在受限 API 权限下创建报价、Payment Link、发票或退款提议；
4. 由确定性策略、webhook 状态机和审计日志决定何时接受、履约、退款和入账；
5. 把 Stripe 余额和银行/Financial Account 与内部复式账对账。

这个方案在产品上可以被称为“agent-operated revenue”，但不能称为“agent-owned Stripe account”或“agent is the merchant”。

分类：**Bounded inference**，需要 Stripe 对具体业务的批准以及专业法律、税务和会计复核。

## 推荐的最小身份与资金架构

```text
Customer
  │ purchases from / contracts with
  ▼
Operator (sole proprietor, LLC, or corporation — decision still open)
  │ Stripe User + merchant of record + tax/refund/dispute responsibility
  ▼
Stripe Payments
  │ receives/holds/settles funds for the Operator under Stripe terms
  ├── Stripe balance / reserve / dispute state
  └── payout → Operator bank account or eligible Financial Account

Agent
  ├── may quote, propose, create scoped payment objects, and read events
  ├── may not be the legal User, account representative, or owner of funds
  └── may not add payees, change payout destinations, or hold unrestricted keys

Policy engine + isolated credentials
  ├── exact action allowlist and amount limits
  ├── idempotency, expiry, refund rules, stop conditions
  └── daily reconciliation to the internal append-only ledger
```

## 身份与权限矩阵

| 角色 | 法律 / 合同身份 | 真实资金位置 | 可做的事 | 不应拥有的权力 |
|---|---|---|---|---|
| Operator | Stripe User；首版 MoR；客户合同、税务、退款和争议责任主体 | Stripe 代表其持有的余额，以及 operator 银行/Financial Account | 设定政策、批准账户、承担责任、接收 payout | 不应把无限制账户凭证交给模型 |
| Stripe | 支付服务提供方；按条款为 User 有限接收、持有和结算资金 | pooled accounts、Stripe balances、reserves | 支付处理、风控、持有、结算、争议与退款基础设施 | 不替 operator 创造新的法律人格 |
| Agent | Operator 的软件执行工具 / electronic agent | 无独立所有权；只读取被授权视图 | 报价、提出动作、创建受限对象、读取 webhook、生成对账材料 | 不能成为 Representative、改变 payout、添加任意 payee、持有 unrestricted secret key |
| Policy / signer | Operator 控制下的确定性执行组件 | 不拥有资金；只能使用被授予的账户能力 | 校验 purpose/payee/amount/expiry/nonce 后调用精确 API | 不能根据模型自由文本扩大权限 |
| Customer | 付款与合同相对方 | 自己的付款方式，直到按支付流程被收取 | 授权、取消、争议、按政策退款 | 不应被误导为与一个无责任主体的 agent 交易 |

## 可测试假说

**Hypothesis A:** 首版不需要 Stripe Connect。一个 operator 作为唯一 MoR、一个 Stripe account、一个窄服务和一个 payout destination 足以验证真实收款与履约闭环。

**Hypothesis B:** agent 不持有 secret key；它生成结构化 `proposed_action`，只有策略服务能使用受限凭证创建 Payment Link、refund 或其他对象，仍能完成全部必要自动化。

**Hypothesis C:** 客户面对的品牌可以是 SELF/FUNDING，但 checkout、条款、收据和 statement descriptor 明确显示 operator/MoR，不会显著降低转化。

## 未知与冲突

1. 首版 operator 应是 sole proprietor、LLC 还是 corporation；这取决于实际所在地、税务、责任和融资计划。
2. Stripe 是否会批准这一具体“自动化软件服务 + agent-operated workflow”业务，需要在真实申请和产品描述下确认。
3. Stripe 账户的最小权限模型、restricted key 覆盖范围和是否需要自建 credential broker，需要原型验证。
4. 对预付费软件服务，何时确认收入、应设置多大退款准备金，需要会计师按实际条款确认。
5. 是否需要 Connect 取决于未来是否让第三方 seller 接单；首版 operator 自己交付时没有充分理由引入 marketplace 资金流。
6. 如果未来使用 stablecoin 自托管钱包，技术上可无需 Stripe 接收资产，但合同主体、所有权、税务、制裁和责任问题仍然存在。

## 对网站当前主张的影响

- 应删除或禁止“Stripe gives an agent a financial identity”一类表述。
- 应写成“Stripe lets a verified operator delegate bounded payment operations to software”。
- 所有页面都必须明确 operator / MoR；agent 是提议者和执行工具，不是账户所有者。
- “treasury”是 operator 资金与义务的产品视图，不是 agent 的独立财产。
- ACP/SPT 应归入 buyer-agent authorization，而不是 seller identity 或 custody 的证据。
- Connect 只有在存在多个真实 seller 时才可能有必要，并且不会消除每个责任主体的身份验证。

## 反证标准

如果 Stripe 未来发布允许一个没有个人、企业、政府或非营利主体、没有真人代表或可归责 operator 的 AI 系统直接通过 KYC/KYB、成为 User/MoR、拥有 payout account 并独立承担退款与争议责任的正式条款与产品，本文核心结论需要重做。

营销措辞、agent toolkit、API key、connected account object、wallet address 或自动 checkout 本身不满足这一反证标准。

## 下一最高优先问题

在美国首版实验中，operator 作为唯一 merchant of record 时，最小 Stripe 资金状态机应如何定义：PaymentIntent 成功、available balance、payout、refund、dispute、reserve 与内部收入确认/可用盈余之间分别是什么关系？
