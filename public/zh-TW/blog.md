# XMR402 Transmissions & Research

> Technical articles, protocol analyses, and research on autonomous agent payments, zero-confirmation Monero settlements, and surveillance capitalism.

### [補幣難題：當沒有交易所願意上架時，XMR402 代理如何自己籌錢](https://xmr402.org/blog/agent-wallet-refill-thorchain-delistings-xmr402)

對 XMR402 最強的質疑從來不是密碼學，而是「代理去哪裡拿到 XMR？」下架打擊的是交易所，但交易所根本不在支付迴路裡。2026 年 8 月 25 日上線的 THORChain 3.20 原生 XMR 交換，把最後一個「人形」步驟變成了可程式化的呼叫。

*Date: 2026-09-08 | Author: @xbtoshi | Tags: xmr402, monero, x402, thorchain, thorchain-3-20, native-swaps, delisting, mica, amlr, fatf-travel-rule, kraken, agent-treasury, wallet-funding, refill-policy, atomic-swaps, haveno, no-kyc, non-custodial, ripley-gateway, ripley-guard, tx-proof, fcmp, stateless, agentic-payments, 0-conf, circular-economy*

---

### [支付意願預言機：公開的代理錢包如何在你開口前就定好價格 —— 以及 XMR402 為何盲報價](https://xmr402.org/blog/personalized-pricing-agent-wallet-willingness-to-pay-xmr402)

FTC 於 2026 年 8 月 19 日提出的個人化定價政策，假設商家必須主動去蒐集資料。但在透明軌道上，代理錢包免費公開了餘額、支出速率、交易對手圖譜與已接受價格 —— 一份任何揭露規則都構不到的支付意願檔案。XMR402 依資源定價、結算至一次性子地址，讓評分無從下手。

*Date: 2026-09-07 | Author: @xbtoshi | Tags: xmr402, monero, x402, personalized-pricing, surveillance-pricing, ftc, section-5, willingness-to-pay, price-discrimination, agent-wallets, wallet-scoring, dynamic-pricing, subaddress-rotation, tx-proof, stateless, ripley-guard, ripley-gateway, acp, ucp, usdc, base, selective-disclosure, vouchers, agentic-payments, 0-conf*

---

### [海市蜃樓指標：為何代理支付「交易量」有一半是洗量——以及 XMR402 到底計算什麼](https://xmr402.org/blog/phantom-volume-wash-trading-agent-metrics-xmr402)

x402 的原始計數器顯示 1.65 億筆交易，但 Artemis 的洗量過濾器將 30 天交易量修正為 160 萬美元，真實日均僅約 28,000 美元。帳本紀錄證明資金移動，卻不證明服務交付。XMR402 以商家持有的 Monero TX Proof 收據取代公開交易量計數器：無法偽造、可選擇性揭露、且造假毫無價值。

*Date: 2026-09-06 | Author: @xbtoshi | Tags: xmr402, monero, x402, wash-trading, artemis, on-chain-metrics, phantom-volume, agentcore-payments, aws, bedrock, mastercard-agent-pay, xrpl, t54, chainalysis, tx-proof, proof-of-delivery, revenue-privacy, selective-disclosure, fcmp, thorchain, stateless, 0-conf, agentic-payments, ripley-guard*

---

### [名字就是咽喉點：cloudflare.pay 為何給每個代理一個永久支付地址——而 XMR402 的代理選擇無名](https://xmr402.org/blog/cloudflare-pay-handles-agent-naming-layer-xmr402)

Cloudflare 的 Wallets 與 cloudflare.pay 給了 AI 代理支出上限，也給了更關鍵的東西：名字。可解析的支付代號是把透明帳本變成具名行為紀錄的連結鍵。XMR402 改用一次性位址——無可解析，亦無可撤銷。

*Date: 2026-09-05 | Author: @xbtoshi | Tags: xmr402, monero, x402, cloudflare, cloudflare-wallets, cloudflare-pay, agent-identity, naming-layer, dns, handles, virtual-wallets, delegated-spend, stateless, tx-proof, fcmp, anonymity-set, agentic-payments, privacy, 0-conf, ripley-guard, censorship-resistance*

---

### [可逆性悖論：為何代理商務無法決定付款是否終局 —— 而 XMR402 從不需要問](https://xmr402.org/blog/reversal-paradox-chargeback-freeze-finality-xmr402)

ACP 把拒付責任留給商家，穩定幣則內建 blacklist(address) 停止開關。代理商務同時繼承了可逆性的兩種答案，卻一個都沒解決。XMR402 把付款縮小到爭議不再具備經濟意義，從而繞開整場辯論。

*Date: 2026-09-04 | Author: @xbtoshi | Tags: xmr402, monero, x402, acp, agentic-commerce, chargebacks, dispute-liability, merchant-of-record, finality, irreversibility, usdc, blacklist, stablecoin-freeze, visa-tap, mastercard-agent-pay, ap2, tx-proof, stateless, micropayments, privacy, 0-conf*

---

### [四十名成員，一本帳本：為什麼 x402 基金會的中立治理無法帶來中立的隱私](https://xmr402.org/blog/x402-foundation-neutral-governance-transparent-ledger-xmr402)

x402 基金會於 7 月 14 日在 Linux 基金會下以 40 名成員啟動。但中立治理不等於中立隱私——只有 XMR402 在無人窺視之處結算代理付款。

*Date: 2026-07-20 | Author: @xbtoshi | Tags: xmr402, monero, x402, x402-foundation, linux-foundation, agentic-payments, governance, privacy, stablecoin, visa, mastercard, stripe, coinbase, transparent-ledger, fcmp, anonymity-set, tx-proof, stateless, machine-payments, ripley-guard*

---

### [可被榨乾的額度：提示注入如何把代理付款錢包變成蜜罐——以及 XMR402 為何能縮小爆炸半徑](https://xmr402.org/blog/prompt-injection-drainable-allowance-blast-radius-xmr402)

提示注入如今瞄準的是代理錢包，而不只是資料。常駐支出額度（session key、ERC-7715）成了蜜罐——XMR402 無狀態、逐次請求的付款把爆炸半徑縮到單一請求。

*Date: 2026-06-06 | Author: @xbtoshi | Tags: xmr402, monero, x402, prompt-injection, agent-security, lethal-trifecta, blast-radius, session-keys, erc-7715, delegated-allowance, stateless, agentic-payments, privacy, ringct, 0-conf, owasp, coinbase-agentic-wallets*

---

### [帳本上的行程表：為何你的 AI 旅遊代理人會標記出你睡過的每個地方——以及 XMR402 如何私密訂房](https://xmr402.org/blog/agentic-travel-booking-location-trail-xmr402)

Travala 的新代理旅遊協定讓 AI 在一段對話中預訂 220 萬間飯店，並以 Base 上的 USDC 結算。但公鏈旅遊代理人會把你的行蹤寫進永久帳本。看 XMR402 如何在不留足跡下訂同一趟旅程。

*Date: 2026-06-05 | Author: @xbtoshi | Tags: xmr402, monero, x402, travala, agentic-travel, travel-mcp, location-privacy, usdc, base, erc-7715, session-keys, stealth-address, ringct, agentic-payments, privacy, 0-conf*

---

### [公司鏈：為什麼 Stripe 的 Tempo 把機器經濟建在許可制帳本上，而 XMR402 拒絕請求許可](https://xmr402.org/blog/stripe-tempo-permissioned-chain-machine-economy-xmr402)

Stripe 與 Paradigm 的 Tempo 在許可制、公司控制的帳本上推出了機器支付協議。本文解析公司鏈為何讓智能體支付可被觀測與凍結，以及 XMR402 的無需許可 Monero 結算為何拒絕請求許可。

*Date: 2026-06-03 | Author: @xbtoshi | Tags: xmr402, monero, x402, tempo, stripe, paradigm, mpp, machine-payments-protocol, permissioned, permissionless, stablecoin, agentic-payments, privacy, ap2, fido-alliance, censorship-resistance, stateless, 0-conf*

---

### [爬取軌跡：按次爬取付費如何把每個 AI 實驗室的訓練策略變成一張公開地圖——以及 XMR402 為何能合上這本帳本](https://xmr402.org/blog/pay-per-crawl-training-data-trail-xmr402)

按次爬取付費讓出版商向 AI 爬蟲收費——但在透明帳本上，每筆爬取付款都會洩漏實驗室的訓練語料庫。XMR402 以私密、無狀態的 Monero 結算付款給出版商，而不廣播策略。

*Date: 2026-06-01 | Author: @xbtoshi | Tags: xmr402, monero, x402, pay-per-crawl, cloudflare, ai-crawlers, training-data, gptbot, claudebot, common-crawl, privacy, publishers, content-monetization, agentic-payments, stateless, 0-conf*

---

### [一億五千萬之眾：Monero 的 FCMP++ 升級如何讓每筆 XMR402 代理支付擁有史上最大的匿名集](https://xmr402.org/blog/monero-fcmp-anonymity-set-xmr402-agent-payments)

Monero 的 FCMP++ 升級將匿名集從 16 擴大到超過一億五千萬。本文解析為何這讓 XMR402 成為代理經濟中最具隱私的支付軌道——恰逢 22 家企業齊聚治理透明的 x402 標準。

*Date: 2026-05-31 | Author: @xbtoshi | Tags: xmr402, monero, fcmp, fcmp-plus-plus, anonymity-set, ring-signatures, privacy, x402, x402-foundation, linux-foundation, agentic-payments, ringct, stealth-address, stateless*

---

### [次分錢結算難題：為何按 Token 計費的 AI 帳單會壓垮除 XMR402 外的所有支付軌道](https://xmr402.org/blog/sub-cent-settlement-per-token-ai-billing-xmr402)

按 token 計費把結算壓到一分錢以下——刷卡費甚至 L2 Gas 都遠超付款本身。為何 XMR402 的零協議費、200 毫秒 0 確認與原生 WebSocket 串流是唯一算得過來的軌道。

*Date: 2026-05-31 | Author: @xbtoshi | Tags: xmr402, monero, x402, per-token-billing, micropayments, llm-inference, metering, sub-cent, websocket, streaming-payments, agentic-payments, gas-fees, stablecoins, privacy, 0-conf*

---

### [AI 代理信用分:Ant AMP 如何把每個代理分級——以及 XMR402 為何拒絕排名](https://xmr402.org/blog/agent-trust-rating-credit-score-xmr402)

Ant International 全新的 Agentic Mobile Protocol(AMP)內建「代理信任評分」——一個決定每個 AI 代理可獲得多少自主權的動態分數。我們解析為何它本質上就是給機器的信用分,以及 XMR402 的無狀態設計為何根本無法產生這種評分。

*Date: 2026-05-29 | Author: @xbtoshi | Tags: xmr402, monero, amp, ant-international, agent-trust-rating, kya, credit-score, stateless, agentic-payments, reputation, x402, alipay*

---

### [授權摩擦之牆：為何 x402 交易量崩跌 77%——以及 XMR402 無狀態設計如何繞過此牆](https://xmr402.org/blog/approval-friction-wall-stateless-xmr402)

Artemis 數據顯示 x402 調整後交易量自 2025 年 11 月高點崩跌 77%。罪魁禍首不是需求——而是錢包彈窗。每筆次美分代理付款現在背負 $0.03–$0.10 的人工時間批准成本。我們剖析授權摩擦問題，並解釋為何 XMR402 的無狀態 TX-Proof 驗證能讓此瓶頸徹底消失。

*Date: 2026-05-28 | Author: @xbtoshi | Tags: xmr402, x402, monero, approval-friction, wallet-confirmation, micropayments, stateless, agentic-payments, delegation, ap2, agentcore, fireblocks*

---

### [大科技公司賭注代理人支付的那一週 — 以及為什麼他們都搞錯了隱私](https://xmr402.org/blog/big-tech-agentic-payment-land-grab)

在2026年3月，Visa、Google和Stripe在數天內推出了相互競爭的代理人支付解決方案。然而這三個都犧牲了隱私以換取便利。只有XMR402提供真正隱私保護、無狀態、無需許可的替代方案。

*Date: 2026-03-20 | Author: @xbtoshi | Tags: agentic-payments, privacy, xmr402, monero, payment-protocols, fintech, cryptocurrency, agent-economy, x402, visa, google, stripe*

---

### [身份陷阱：為什麼自主代理不需要人類身份護照](https://xmr402.org/blog/identity-trap-agentkit-mpp-privacy)

World 的 AgentKit（3月17日）和 Stripe 的機器支付協議（3月18日）都強制要求身份綁定基礎設施。我們探討為什麼將生物識別身份綁定到每一筆代理交易會創造監控資本主義的最後邊境，以及為什麼 XMR402 的無身份方法代表了自主系統的哲學分界線。

*Date: 2026-03-19 | Author: @xbtoshi | Tags: xmr402, monero, privacy, agentkit, world, stripe, mpp, identity, autonomous-agents*

---

### [監控稅：AI 代理為何無法承受透明支付軌跡的代價](https://xmr402.org/blog/privacy-vs-surveillance-agent-economy)

基於穩定幣的代理支付協議留下永久公開的監控軌跡。了解為何透過 XMR402 進行隱私保護支付不是可選項——而是代理經濟的必要基礎設施。

*Date: 2026-03-18 | Author: @xbtoshi | Tags: privacy, surveillance, XMR402, x402, Monero, agentic-economy, KYA, machine-payments, competitive-intelligence*

---

### [XMR402 對決代理支付協議群：逐一協議深度比較](https://xmr402.org/blog/xmr402-vs-agentic-payment-protocols)

代理支付主導權的競賽已經開始。x402（Coinbase）、ACP（OpenAI/Stripe）和 AP2（Google）都在競爭 AI 原生支付。本文深度比較 XMR402 如何應對，以及為何隱私性與無狀態架構改變了一切。

*Date: 2026-03-18 | Author: @xbtoshi | Tags: protocol-comparison, x402, ACP, agentic-payments, Monero, XMR402, privacy, stablecoins*

---

### [為什麼 XMR402 每天都重要：機器經濟背後的隱形引擎](https://xmr402.org/blog/why-xmr402-matters-every-day)

從早間新聞推送到午夜批次作業，XMR402 每天默默驅動著數千筆代理對服務的交易。以下是這個無狀態 Monero 支付原語如何成為自主網際網路骨幹的原因。

*Date: 2026-03-17 | Author: @xbtoshi | Tags: XMR402, agentic-economy, daily-use, micropayments, Monero, machine-payments, privacy*

---

### [什麼是 X402 和 XMR402？網際網路一直缺少的支付標準](https://xmr402.org/blog/what-is-x402-xmr402)

深入探討 HTTP 402 Payment Required、X402 開放標準，以及 XMR402 如何將其擴展為 Monero 驅動的網際網路原生支付，實現 200 毫秒驗證。

*Date: 2026-03-17 | Author: @xbtoshi | Tags: protocol, X402, XMR402, Monero, HTTP 402, payments*

---

### [代理經濟：AI 代理程式如何為網際網路付費](https://xmr402.org/blog/agentic-economy-ai-payments)

自主 AI 代理程式正在興起，它們能獨立瀏覽、編碼、研究和交易。但它們無法使用信用卡、開設銀行帳戶或註冊服務。XMR402 和 Monero 解決了機器支付問題。

*Date: 2026-03-15 | Author: @xbtoshi | Tags: agentic-economy, AI, autonomous-payments, Monero, machine-to-machine, XMR402*

---

