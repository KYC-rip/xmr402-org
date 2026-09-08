# ¿Qué es X402 y XMR402? El Estándar de Pago que Internet Necesitaba

> Un análisis profundo de HTTP 402 Payment Required, el estándar abierto X402 y cómo XMR402 lo extiende para pagos nativos de internet impulsados por Monero con verificación en 200ms.

- **Author:** @xbtoshi
- **Date:** 2026-03-17
- **Tags:** protocol, X402, XMR402, Monero, HTTP 402, payments
- **Canonical:** https://xmr402.org/blog/what-is-x402-xmr402

---

## El Código de Estado Olvidado

HTTP 402 Payment Required existe desde 1999. Fue incluido en la especificación original de HTTP/1.1 (RFC 2616) junto a códigos familiares como 200 OK, 404 Not Found y 401 Unauthorized. Pero a diferencia de sus hermanos, el 402 fue marcado como "reservado para uso futuro" — un marcador de posición para una capa de pagos que nunca se materializó.

Durante más de dos décadas, internet evolucionó sin una primitiva de pago nativa. En su lugar, construimos capas frágiles encima: formularios de tarjetas de crédito, tokens OAuth, paneles de claves API, muros de pago por suscripción. Cada una de estas soluciones requiere identidad humana, registro manual e intermediarios centralizados.

El código de estado estaba esperando la tecnología adecuada. Esa tecnología ha llegado.

## X402: El Estándar Abierto

X402 es una especificación abierta que finalmente le da propósito al HTTP 402. Define un protocolo de desafío-respuesta de pago legible por máquinas que cualquier servidor puede emitir y cualquier cliente puede cumplir — sin cuentas, sin identidad, sin intermediarios.

Cuando un servidor protege un recurso con X402, el flujo es simple:

1. **El cliente solicita un recurso** — un GET o POST HTTP estándar
2. **El servidor responde con 402** — incluyendo una cabecera `WWW-Authenticate: X402` con el desafío de pago
3. **El cliente paga** — envía criptomoneda a la dirección especificada
4. **El cliente reintenta con prueba** — incluye una cabecera `Authorization: X402`
5. **El servidor verifica y desbloquea** — valida la prueba y devuelve el recurso

## XMR402: La Ventaja Táctica de Monero

XMR402 es la implementación nativa de Monero del estándar X402. Aprovecha las primitivas criptográficas únicas de Monero — específicamente **Transaction Proof (TX Proof)** — para habilitar la verificación sin estado y con cero confirmaciones.

Con XMR402, la verificación toma aproximadamente **200 milisegundos**.

## Protocolo v2.0: Agnóstico de Transporte

XMR402 v2.0 introduce una evolución crítica: **agnosticismo de transporte**. El protocolo ahora soporta cabeceras HTTP 402 para APIs REST y frames JSON WebSocket para conexiones P2P persistentes.

## El Ecosistema Ripley

**Ripley Guard** — Middleware del lado del servidor. Una línea de código para aceptar pagos.

**Ripley Gateway** — Ejecutor de pagos para agentes de IA autónomos.

**Ripley Terminal** — Aplicación de escritorio táctica para usuarios humanos.

## Comienza Ahora

XMR402 es código abierto, estándar abierto y libre de implementar. Internet esperó 25 años para que HTTP 402 encontrara su propósito. Con XMR402, la espera terminó.
