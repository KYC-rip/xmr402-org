# XMR402 Transmissions & Research

> Technical articles, protocol analyses, and research on autonomous agent payments, zero-confirmation Monero settlements, and surveillance capitalism.

### [Проблема пополнения: как агенты XMR402 финансируют себя, когда их деньги никто не хочет листить](https://xmr402.org/blog/agent-wallet-refill-thorchain-delistings-xmr402)

Сильнейшее возражение против XMR402 никогда не было криптографическим — это вопрос «где агент берёт XMR?». Делистинги бьют по бирже, но биржи нет в платёжном контуре. Нативные свопы XMR в THORChain 3.20 от 25 августа 2026 года превратили последний «человекообразный» шаг в программируемый вызов.

*Date: 2026-09-08 | Author: @xbtoshi | Tags: xmr402, monero, x402, thorchain, thorchain-3-20, native-swaps, delisting, mica, amlr, fatf-travel-rule, kraken, agent-treasury, wallet-funding, refill-policy, atomic-swaps, haveno, no-kyc, non-custodial, ripley-gateway, ripley-guard, tx-proof, fcmp, stateless, agentic-payments, 0-conf, circular-economy*

---

### [Оракул готовности платить: как публичные кошельки агентов назначают цену до того, как вы спросите — и почему XMR402 котирует вслепую](https://xmr402.org/blog/personalized-pricing-agent-wallet-willingness-to-pay-xmr402)

Политика FTC от 19 августа 2026 года исходит из того, что продавец должен добыть данные. На прозрачных рельсах кошелёк агента бесплатно публикует баланс, скорость трат, граф контрагентов и принятые цены — досье готовности платить, до которого не дотягивается ни одно правило раскрытия. XMR402 считает цену от ресурса и рассчитывается на одноразовый субадрес.

*Date: 2026-09-07 | Author: @xbtoshi | Tags: xmr402, monero, x402, personalized-pricing, surveillance-pricing, ftc, section-5, willingness-to-pay, price-discrimination, agent-wallets, wallet-scoring, dynamic-pricing, subaddress-rotation, tx-proof, stateless, ripley-guard, ripley-gateway, acp, ucp, usdc, base, selective-disclosure, vouchers, agentic-payments, 0-conf*

---

### [Метрика-мираж: почему половина «объёма» агентных платежей — это отмывочные транзакции, и что вместо этого считает XMR402](https://xmr402.org/blog/phantom-volume-wash-trading-agent-metrics-xmr402)

Сырые счётчики x402 показывали 165 млн транзакций, но фильтр отмывочных сделок Artemis снизил 30-дневный объём до $1,6 млн при реальном спросе около $28 тыс. в день. Запись в реестре доказывает движение денег, а не оказание услуги. XMR402 заменяет публичный счётчик объёма квитанциями Monero TX Proof, которые хранит сам продавец.

*Date: 2026-09-06 | Author: @xbtoshi | Tags: xmr402, monero, x402, wash-trading, artemis, on-chain-metrics, phantom-volume, agentcore-payments, aws, bedrock, mastercard-agent-pay, xrpl, t54, chainalysis, tx-proof, proof-of-delivery, revenue-privacy, selective-disclosure, fcmp, thorchain, stateless, 0-conf, agentic-payments, ripley-guard*

---

### [Имя — это узкое место: почему cloudflare.pay даёт каждому агенту постоянный платёжный адрес, а агенты XMR402 остаются безымянными](https://xmr402.org/blog/cloudflare-pay-handles-agent-naming-layer-xmr402)

Cloudflare Wallets и cloudflare.pay дали ИИ-агентам лимиты трат — и кое-что более значимое: имена. Разрешаемый платёжный хэндл и есть ключ связывания, превращающий прозрачный реестр в именованную поведенческую запись. XMR402 вместо этого создаёт одноразовый адрес: нечего разрешать и нечего отзывать.

*Date: 2026-09-05 | Author: @xbtoshi | Tags: xmr402, monero, x402, cloudflare, cloudflare-wallets, cloudflare-pay, agent-identity, naming-layer, dns, handles, virtual-wallets, delegated-spend, stateless, tx-proof, fcmp, anonymity-set, agentic-payments, privacy, 0-conf, ripley-guard, censorship-resistance*

---

### [Парадокс отмены: почему агентная коммерция не может решить, окончателен ли платёж — и почему XMR402 не пришлось спрашивать](https://xmr402.org/blog/reversal-paradox-chargeback-freeze-finality-xmr402)

ACP оставляет ответственность за чарджбэки продавцу, а стейблкоины несут рубильник blacklist(address). Агентная коммерция унаследовала оба ответа об отмене и не разрешила ни одного. XMR402 обходит спор, уменьшая платёж до размера, при котором споры теряют экономический смысл.

*Date: 2026-09-04 | Author: @xbtoshi | Tags: xmr402, monero, x402, acp, agentic-commerce, chargebacks, dispute-liability, merchant-of-record, finality, irreversibility, usdc, blacklist, stablecoin-freeze, visa-tap, mastercard-agent-pay, ap2, tx-proof, stateless, micropayments, privacy, 0-conf*

---

### [Сорок участников, один реестр: почему нейтральное управление Фонда x402 не даёт нейтральной приватности](https://xmr402.org/blog/x402-foundation-neutral-governance-transparent-ledger-xmr402)

14 июля под эгидой Linux Foundation запущен Фонд x402 с 40 участниками. Но нейтральное управление — это не нейтральная приватность, и лишь XMR402 рассчитывает платежи агентов там, где никто не смотрит.

*Date: 2026-07-20 | Author: @xbtoshi | Tags: xmr402, monero, x402, x402-foundation, linux-foundation, agentic-payments, governance, privacy, stablecoin, visa, mastercard, stripe, coinbase, transparent-ledger, fcmp, anonymity-set, tx-proof, stateless, machine-payments, ripley-guard*

---

### [Опустошаемый лимит: как инъекция промпта превращает платёжные кошельки агентов в приманки — и почему XMR402 сужает радиус поражения](https://xmr402.org/blog/prompt-injection-drainable-allowance-blast-radius-xmr402)

Инъекция промпта теперь нацелена на кошельки агентов, а не только на данные. Постоянные лимиты трат (сессионные ключи, ERC-7715) становятся приманками — безсессионные поэтапные платежи XMR402 сужают радиус поражения до одного запроса.

*Date: 2026-06-06 | Author: @xbtoshi | Tags: xmr402, monero, x402, prompt-injection, agent-security, lethal-trifecta, blast-radius, session-keys, erc-7715, delegated-allowance, stateless, agentic-payments, privacy, ringct, 0-conf, owasp, coinbase-agentic-wallets*

---

### [Маршрут в реестре: почему след вашего ИИ-турагента отмечает каждое место ночлега — и как XMR402 бронирует приватно](https://xmr402.org/blog/agentic-travel-booking-location-trail-xmr402)

Новый агентский тревел-протокол Travala позволяет ИИ бронировать 2,2 млн отелей и платить в USDC на Base. Но агент в публичной сети записывает ваши перемещения в вечный реестр. Как XMR402 бронирует ту же поездку без следа.

*Date: 2026-06-05 | Author: @xbtoshi | Tags: xmr402, monero, x402, travala, agentic-travel, travel-mcp, location-privacy, usdc, base, erc-7715, session-keys, stealth-address, ringct, agentic-payments, privacy, 0-conf*

---

### [Корпоративная цепь: почему Tempo от Stripe строит машинную экономику на разрешительном реестре — а XMR402 отказывается просить разрешения](https://xmr402.org/blog/stripe-tempo-permissioned-chain-machine-economy-xmr402)

Tempo от Stripe и Paradigm запустил Machine Payments Protocol на разрешительном корпоративном реестре. Почему корпоративная цепь делает платежи агентов наблюдаемыми и замораживаемыми — и почему безразрешительный расчёт XMR402 на Monero не просит разрешения.

*Date: 2026-06-03 | Author: @xbtoshi | Tags: xmr402, monero, x402, tempo, stripe, paradigm, mpp, machine-payments-protocol, permissioned, permissionless, stablecoin, agentic-payments, privacy, ap2, fido-alliance, censorship-resistance, stateless, 0-conf*

---

### [След обхода: как оплата за краулинг превращает стратегию обучения каждой ИИ-лаборатории в публичную карту — и почему XMR402 закрывает реестр](https://xmr402.org/blog/pay-per-crawl-training-data-trail-xmr402)

Оплата за краулинг позволяет издателям брать плату с ИИ-краулеров, но в прозрачном реестре каждый платёж за обход выдаёт обучающий корпус лаборатории. Приватный бесстейтный расчёт XMR402 в Monero платит издателю, не раскрывая стратегию.

*Date: 2026-06-01 | Author: @xbtoshi | Tags: xmr402, monero, x402, pay-per-crawl, cloudflare, ai-crawlers, training-data, gptbot, claudebot, common-crawl, privacy, publishers, content-monetization, agentic-payments, stateless, 0-conf*

---

### [150 миллионов в строю: как обновление Monero FCMP++ даёт каждому платежу XMR402 крупнейший набор анонимности в истории](https://xmr402.org/blog/monero-fcmp-anonymity-set-xmr402-agent-payments)

Обновление Monero FCMP++ расширяет набор анонимности с 16 до более 150 миллионов. Почему это делает XMR402 самым приватным рельсом агентной экономики — пока 22 корпорации управляют прозрачным x402.

*Date: 2026-05-31 | Author: @xbtoshi | Tags: xmr402, monero, fcmp, fcmp-plus-plus, anonymity-set, ring-signatures, privacy, x402, x402-foundation, linux-foundation, agentic-payments, ringct, stealth-address, stateless*

---

### [Проблема субцентовых расчётов: почему оплата ИИ по токенам ломает любой платёжный рельс, кроме XMR402](https://xmr402.org/blog/sub-cent-settlement-per-token-ai-billing-xmr402)

Потокенная оплата ИИ опускает расчёт ниже цента, где карточные сборы и даже газ L2 затмевают сам платёж. Почему нулевые комиссии XMR402, 0-conf за 200мс и нативный WebSocket — единственный рельс, сходящийся по арифметике.

*Date: 2026-05-31 | Author: @xbtoshi | Tags: xmr402, monero, x402, per-token-billing, micropayments, llm-inference, metering, sub-cent, websocket, streaming-payments, agentic-payments, gas-fees, stablecoins, privacy, 0-conf*

---

### [Кредитный рейтинг для агента: как AMP от Ant ранжирует каждого ИИ-агента — и почему XMR402 отказывается это делать](https://xmr402.org/blog/agent-trust-rating-credit-score-xmr402)

Новый протокол Ant International — Agentic Mobile Protocol (AMP) — поставляется с Agent Trust Rating: динамической оценкой, определяющей, какую автономию получит каждый ИИ-агент. Разбираемся, почему это кредитный рейтинг для машин, и почему stateless-архитектура XMR402 в принципе не способна его выдать.

*Date: 2026-05-29 | Author: @xbtoshi | Tags: xmr402, monero, amp, ant-international, agent-trust-rating, kya, credit-score, stateless, agentic-payments, reputation, x402, alipay*

---

### [Стена фрикции одобрений: почему объём x402 рухнул на 77% — и почему stateless-архитектура XMR402 её обходит](https://xmr402.org/blog/approval-friction-wall-stateless-xmr402)

Данные Artemis показывают, что скорректированный объём x402 упал на 77% с пика ноября 2025 года. Виновата не спрос — а всплывающие окна кошелька. Каждая субцентовая оплата агента теперь несёт $0,03–$0,10 затрат человеческого времени на одобрение. Мы разбираем проблему фрикции одобрений и объясняем, почему stateless-верификация XMR402 через TX-Proof полностью устраняет это узкое место.

*Date: 2026-05-28 | Author: @xbtoshi | Tags: xmr402, x402, monero, approval-friction, wallet-confirmation, micropayments, stateless, agentic-payments, delegation, ap2, agentcore, fireblocks*

---

### [Неделя, когда большие технологические компании поставили на агентские платежи — и почему все они ошиблись на счет конфиденциальности](https://xmr402.org/blog/big-tech-agentic-payment-land-grab)

В марте 2026 года Visa, Google и Stripe запустили конкурирующие решения для агентских платежей в течение нескольких дней. Однако все три жертвуют конфиденциальностью ради удобства. Только XMR402 предлагает действительно конфиденциальную, не требующую состояния и бесплатную альтернативу.

*Date: 2026-03-20 | Author: @xbtoshi | Tags: agentic-payments, privacy, xmr402, monero, payment-protocols, fintech, cryptocurrency, agent-economy, x402, visa, google, stripe*

---

### [Ловушка идентичности: почему автономные агенты не нуждаются в паспортах человеческой идентичности](https://xmr402.org/blog/identity-trap-agentkit-mpp-privacy)

AgentKit от World (17 марта) и Machine Payments Protocol от Stripe (18 марта) оба требуют инфраструктуры, привязанной к идентичности. Мы рассматриваем, почему привязка биометрической идентичности к каждой транзакции агента создает последний рубеж капитализма надзора—и почему подход XMR402 без идентичности представляет философский водораздел для автономных систем.

*Date: 2026-03-19 | Author: @xbtoshi | Tags: xmr402, monero, privacy, agentkit, world, stripe, mpp, identity, autonomous-agents*

---

### [Налог на слежку: почему ИИ-агенты не могут позволить себе прозрачные платёжные следы](https://xmr402.org/blog/privacy-vs-surveillance-agent-economy)

Протоколы агентных платежей на основе стейблкоинов создают постоянные публичные следы слежки. Узнайте, почему приватные платежи через XMR402 — это не роскошь, а необходимая инфраструктура агентной экономики.

*Date: 2026-03-18 | Author: @xbtoshi | Tags: privacy, surveillance, XMR402, x402, Monero, agentic-economy, KYA, machine-payments, competitive-intelligence*

---

### [XMR402 против агентского платёжного стека: разбор по протоколам](https://xmr402.org/blog/xmr402-vs-agentic-payment-protocols)

Гонка за доминирование в агентских платежах началась. x402 (Coinbase), ACP (OpenAI/Stripe) и AP2 (Google) борются за AI-нативные платежи. Разбираем, как XMR402 сравнивается с ними — и почему конфиденциальность и stateless-архитектура меняют всё.

*Date: 2026-03-18 | Author: @xbtoshi | Tags: protocol-comparison, x402, ACP, agentic-payments, Monero, XMR402, privacy, stablecoins*

---

### [Почему XMR402 важен каждый день: невидимый двигатель машинной экономики](https://xmr402.org/blog/why-xmr402-matters-every-day)

От утренних новостных лент до полуночных пакетных задач — XMR402 ежедневно обеспечивает тысячи транзакций между агентами и сервисами. Вот почему этот stateless-примитив платежей на Monero становится основой автономного интернета.

*Date: 2026-03-17 | Author: @xbtoshi | Tags: XMR402, agentic-economy, daily-use, micropayments, Monero, machine-payments, privacy*

---

### [Что такое X402 и XMR402? Платёжный стандарт, которого не хватало интернету](https://xmr402.org/blog/what-is-x402-xmr402)

Глубокий разбор HTTP 402 Payment Required, открытого стандарта X402 и того, как XMR402 расширяет его для нативных интернет-платежей на Monero с верификацией за 200 мс.

*Date: 2026-03-17 | Author: @xbtoshi | Tags: protocol, X402, XMR402, Monero, HTTP 402, payments*

---

### [Агентская экономика: как AI-агенты будут платить за интернет](https://xmr402.org/blog/agentic-economy-ai-payments)

Появляются автономные AI-агенты, которые самостоятельно просматривают интернет, пишут код, проводят исследования и совершают транзакции. Но они не могут использовать кредитные карты или регистрировать аккаунты. XMR402 и Monero решают проблему машинных платежей.

*Date: 2026-03-15 | Author: @xbtoshi | Tags: agentic-economy, AI, autonomous-payments, Monero, machine-to-machine, XMR402*

---

