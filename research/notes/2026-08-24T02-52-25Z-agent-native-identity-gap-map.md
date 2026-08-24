# 从受托软件到独立经济 agent：身份、账户与责任差距图

**Recorded:** 2026-08-24T02:52:25Z
**Horizon:** B — future infrastructure, with Horizon A bridge experiments
**Evidence status:** Direct facts + bounded inference + explicit evidence gates

## 研究问题

理想状态是否是 agent 拥有自己的独立身份和独立银行卡？从今天的 operator-owned 系统走到一个能持续收款、储蓄、购买算力并承担责任的 agent，实际还缺哪些技术、机构、法律和项目证据？

## 结论

理想状态不是把一张无限额银行卡交给模型。更稳健的目标是：

> agent 拥有可持续、可验证的机器身份、专属经济记录与被隔离的 treasury；它能在不可自行解除的 mandate 下赚钱、履约、退款、储蓄和购买算力，而账户所有权、法律责任、恢复权和限额变更在当前阶段仍明确归属于可识别的人或实体。

今天已经具备相当多的**技术组件**：DID、可验证凭证、agent key、AP2 mandate、x402 支付、restricted credential、provider service account、spend limit、自动充值和可核验 receipt。缺少的是把这些组件共同变成一个被银行、支付机构、API provider、客户、法院、税务和保险体系接受的**机构性闭环**。

因此需要区分两种距离：

- **Operator-owned economic autonomy：可构建。** 一个已验证 operator 可以给 agent 专属项目、子账、钱包、受限支付凭证、provider key 和确定性政策，使其在固定限额内经济自我供给。
- **Independent legal-financial agent：尚未成立。** 当前公开规则仍要求 Customer、User、bank account holder、beneficial owner 或 control person；agent key 的可验证性不等于法律人格、银行客户身份或独立责任能力。

## 一手来源账本

| ID | 来源 | 机构 | 日期 / 状态 | 稳定链接 | 本轮实际使用的事实 |
|---|---|---|---|---|---|
| S1 | Decentralized Identifiers (DIDs) v1.0 | W3C | Recommendation, 2022-07-19 | https://www.w3.org/TR/did-core/ | DID 可表示人、组织、设备、数字对象或概念；controller 可以是 autonomous software；它证明 identifier/key control，不自动证明法律身份。 |
| S2 | Verifiable Credentials Data Model v2.0 | W3C | Recommendation, 2025-05-15 | https://www.w3.org/TR/vc-data-model/ | issuer、holder、verifier 可以交换防篡改 claims；credential 仍需要被 verifier 信任和按业务规则解释。 |
| S3 | Agentic Payment Protocol v0.2 | Google Agentic Commerce | current specification verified 2026-08-24 | https://github.com/google-agentic-commerce/AP2/blob/main/docs/ap2/specification.md | autonomous flow 可由 Agent Key 签署 closed mandate，但信任来自 user-signed open mandate 或 Agent Provider trust list；Trusted Surface 必须非 agentic；commerce API、agent-to-agent delegation 和部分 dispute retrieval 不在当前范围内。 |
| S4 | 15 U.S.C. §7001(h) | U.S. Government Publishing Office | current US Code link verified 2026-08-24 | https://www.govinfo.gov/link/uscode/15/7001 | electronic-agent 参与不会单独使交易无效，但其行动必须 legally attributable to the person to be bound。 |
| S5 | CDD Rule FAQs | FinCEN | updated 2026-05-06; verified 2026-08-24 | https://www.fincen.gov/resources/statutes-and-regulations/cdd-rule-faqs | covered institution 对 legal entity customer 识别自然人 beneficial owner，并至少识别一名对实体有重大控制责任的自然人。 |
| S6 | Stripe Services Agreement — General Terms | Stripe | revised 2025-11-18; verified 2026-08-24 | https://stripe.com/legal/ssa | agreement 绑定 User；连接的 User Bank Account 必须以 User 为 named account holder；User 承担账户、税务与授权责任。 |
| S7 | OpenAI Services Agreement | OpenAI | effective 2026-01-01; verified 2026-08-24 | https://openai.com/policies/services-agreement/ | 服务在 Customer Account 下购买和使用；Customer 对账户活动负责并授权账户 payment method 支付费用。 |
| S8 | OpenAI prepaid billing + Admin API reference | OpenAI | current docs verified 2026-08-24 | https://help.openai.com/en/articles/8264644 ; https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage | Billing flow 支持 auto recharge；Admin API 现在包含 usage/cost、service accounts、spend alerts/limits 等控制，但公开 reference 仍未列通用 credit-purchase operation。 |
| S9 | Agentic Wallet MCP tools | Coinbase CDP | current docs verified 2026-08-24 | https://docs.cdp.coinbase.com/agentic-wallet/mcp/mcp-tools/overview | agent 可读取 wallet、发现并支付 x402 service；用户而非 agent 设置 limits、onramp 或向任意地址 transfer。 |
| S10 | x402 overview | Coinbase CDP | current docs verified 2026-08-24 | https://docs.cdp.coinbase.com/x402/welcome | HTTP resource 可以按请求进行 stablecoin machine payment；协议支付能力不等于银行身份、税务主体或法律责任。 |

## 什么已经存在，什么仍然断开

| 层 | 今天已经有的 primitive | 仍然缺少的制度或产品 | 当前状态 |
|---|---|---|---|
| 机器身份 | DID、agent key、key rotation、可验证凭证 | 被银行、PSP、provider 和法院共同接受的 agent trust profile、issuer registry、revocation 与 assurance level | **技术存在，机构互认不足** |
| 交易授权 | AP2 open/closed mandate、agent signature、signed receipt、deterministic verifier | 跨 merchant/credential-provider 的普遍部署、agent-to-agent delegation、统一 retrieval/retention 和完整争议流程 | **协议可试，网络未闭合** |
| 法律归责 | electronic-agent 行动可归责到被约束的人；operator/entity 可承担合同 | agent 自己成为 contract party、taxpayer、liable principal、insured、insolvent estate 或可被有效送达的主体 | **当前必须有 principal** |
| 金融开户 | operator/entity 可完成 KYB、开 bank/Stripe account 并创建 agent 专属子账/虚拟卡 | agent 自己通过 KYC/KYB、成为 beneficial owner/control person、开卡、恢复账户并承担 AML/sanctions duty | **独立开户被阻断** |
| 资金控制 | restricted key、virtual card cap、wallet session limit、allowlist、isolated signer | 可移植的 policy-native custody；agent 不能提高自己的权限；跨 rail 的标准 recovery、insurance 和 insolvency treatment | **受限执行可建，原生 custody 不完整** |
| 算力购买 | provider service account、usage/cost API、spend limits、auto-recharge/pay-as-you-go | 通用、幂等、可退款、带 source-of-funds 和 mandate 的 `purchase credits` API；主流 provider 接受 agent-native rail | **连续使用可建，直接购买不通用** |
| 商业责任 | merchant、payment processor 和 customer dispute 系统 | 对 agent error、模型更新、密钥丢失、欺诈、拒付、税务、停机和破产的标准责任与保险产品 | **合同逐案处理** |
| 经济证明 | SELF/FUNDING 已有状态机、权限设计、research journal 与实验 gate | 一笔真实 `payment → delivery/refund → full-cost close → API fuel → next accepted output`，以及重复需求和正贡献 | **项目尚未实证** |

## 三个容易混淆但不同的概念

### 1. 独立 identifier 不等于独立法律身份

DID 可以指向任何 digital subject，controller 也可以是 autonomous software。[S1] 这使“同一个 agent 跨模型、服务器和账户持续存在”在技术上可设计。但 DID 本身不说明谁承担债务、税务、侵权、退款或破产责任；它也不迫使银行信任某个 issuer 或 assurance level。

分类：**Direct fact + bounded inference**。

### 2. 能签支付 mandate 不等于拥有付款账户

AP2 的 autonomous flow 已经允许 Agent Key 签署 closed mandate，但它必须由用户预签的 open mandate或受信任 Agent Provider 建立 trust chain，且每个 agentic role 的验证必须由 deterministic code 完成。[S3] 因此 AP2 接近“可证明的代理授权”，不是“agent 成为独立账户 owner”。

分类：**Direct fact**。

### 3. 专属银行卡不等于安全的 treasury

专属虚拟卡可以隔离 provider、merchant category、amount 和 cadence，但它仍只是 operator/entity account 的 payment credential。真正的 treasury 还需要 external custody truth、internal double-entry、obligation reserve、refund path、credential rotation、recovery quorum 和 independent close。银行卡是兼容旧 rail 的 adapter，不应是 agent 自主性的根定义。

分类：**Bounded inference / design decision**。

## 当前最合理的桥接架构

```text
Agent identity bundle
  agent_id / DID
  agent signing key
  software + policy version
  operator legal-entity ID
  root mandate + revocation
  recovery quorum
            │
            ▼
Deterministic authority plane
  job scope / payee / amount / purpose / expiry
  obligation reserve / daily cap / provider cap
            │
            ▼
Isolated adapters
  read-only rail key
  refund-only key
  provider-scoped key
  x402 signer or virtual card token
            │
            ▼
Operator-owned external accounts
  Stripe / bank / provider / wallet
            │
            ▼
Append-only journal + independent close
```

关键原则：**identity continuity 属于 agent；legal ownership 属于当前可识别主体；spending authority 属于可撤销 mandate；external truth 属于 rail；economic claim 必须由 reconciliation 证明。**

## SELF/FUNDING 自己还差什么

### A. 可以现在完成的工程差距

1. 创建 `agent_identity` 记录：固定 agent ID、key lineage、model/runtime version、operator entity、root mandate、recovery quorum 和 revocation state。
2. 实现 action-specific credentials：只读 reconciliation key、refund-only key、provider-scoped key、webhook verifier，任何 job runtime 都不能接触 unrestricted credential。
3. 实现 `mandate` object：明确 action、payee、amount、purpose、job、policy version、expiry、nonce、approver 和 signer receipt。
4. 完成 daily close schema：Stripe、bank、provider、wallet 与 internal journal 的 object-level reconciliation。
5. 完成 kill/recovery drill：local stop、key expiry、negative-permission test、log export、zero-difference close 和 independent restore。

### B. 必须用真实交易证明的项目差距

1. 一个真实客户愿意为机器可验证服务付款；
2. agent 按披露范围交付或完成真实退款；
3. provider cost、fees、tax estimate、refund exposure 和 operator labor 全部入账；
4. 只有 reconciled surplus 才创建下一轮 fuel reservation；
5. 下一次 API 使用产生一个被接受的交付；
6. 至少重复若干次后才能讨论稳定需求、failure rate 和 positive contribution，不能用一次成功外推。

### C. 项目无法单独解决的外部差距

1. 银行/PSP 接受 portable agent identity 和 verifiable mandate；
2. 法律明确 agent、wrapper、developer、operator、user 与 insurer 的责任分配；
3. agent-native custody 有标准 recovery、sanctions、tax、dispute、insurance 与 insolvency treatment；
4. 模型、sandbox、storage、hosting provider 支持受限 programmatic purchase 或 agent-native payment；
5. AP2/x402 等协议形成足够广的 merchant、credential provider 和 verifier 网络。

## 证据门槛：什么时候可以升级措辞

| 当前措辞 | 升级目标 | 必须出现的证据 |
|---|---|---|
| “persistent machine identifier” | “institution-recognized agent identity” | 两个独立 institution 能验证同一 agent identity、credential issuer、revocation 和 assurance level，并以其授权真实账户操作 |
| “operator-owned agent” | “entity-wrapped autonomous operator” | 独立法律意见、机构 onboarding、明确 manager/control person、税务、保险、责任、recovery 和 insolvency plan |
| “bounded payment execution” | “portable commercial authority” | AP2-style mandate 在至少两个独立 merchant/credential provider 上成功，并产生可检索 dispute evidence |
| “economically self-funding” | “observed self-funding loop” | delivered revenue 被外部对账后实际覆盖下一轮 provider cost，并产生 accepted output；退款与失败仍可完整处理 |
| “independent treasury” | “agent-native custody” | agent 专属 policy 被 custodian 原生执行，agent 不能解除；同时存在合规 on/off-ramp、recovery、tax、dispute 和 insolvency treatment |

## 最小桥接实验

### 实验 1：身份连续性，不动真钱

1. 建立一个持久 agent ID 与 root key；
2. 为当前 runtime、policy 和 scoped keys 签发 credential；
3. 更换模型和部署环境，但保持 agent identity、journal 和 mandate lineage 连续；
4. 撤销旧 runtime credential，证明旧 key 不能签署新 mandate；
5. 独立 verifier 只依赖公开 key/credential/revocation evidence 验证连续性。

这证明机器身份工程，不证明法律人格或银行认可。

### 实验 2：autonomous mandate sandbox

1. 用户在 Trusted Surface 签署金额、merchant、purpose、expiry 和次数都受限的 open mandate；
2. agent 为具体 checkout 签署 closed mandate；
3. deterministic verifier 检查约束、nonce、expiry、checkout hash 和 credential scope；
4. sandbox/testnet 执行 0 或极低价值支付并生成 signed receipt；
5. 重放、超额、换 merchant、过期和重复 checkout 必须失败。

这证明受托授权，不证明 agent 拥有账户。

### 实验 3：真实 economic closure，需 operator 明确批准

在现有 operator-owned rail 下执行一笔最低风险 live job：真实 payment、可验证 delivery 或 refund、完整 external close、由 reconciled surplus 支持的微额 API fuel，以及下一份 accepted output。任何真钱、账户、卡或 wallet 操作都不由本研究自动执行。

## 反证与修订条件

以下情况会要求修改本轮结论：

1. 美国银行或受监管 PSP 公开允许非人 agent 作为 customer、named account holder 和 control person 独立开户；
2. 法律明确授予 agent 独立合同、税务、侵权、保险和破产主体资格；
3. AP2 或同类协议获得跨机构部署，并把 agent trust、delegation、retention、retrieval 和 dispute resolution 纳入可互操作标准；
4. 主流模型 provider 提供带 scoped mandate、idempotency、cap、source reference、refund/error semantics 的 credit-purchase API；
5. SELF/FUNDING 的真实实验无法在不授予 broad credential 的情况下完成最小收款、交付、退款、provider spend 和 reconciliation；
6. 重复真实任务显示 demand、accepted-output economics 或 refund exposure 不支持 positive contribution。

## 下一最高优先问题

Horizon A：完成 external reconciliation schema 和 daily close，随后在 operator 明确批准下运行一笔最低价值真实闭环。
Horizon B：把 `agent_identity + root mandate + credential lineage + revocation + recovery quorum` 做成可验证 prototype，并用 AP2-style autonomous sandbox 证明身份连续性和受限授权，同时明确标注它不等于法律人格或独立开户。
