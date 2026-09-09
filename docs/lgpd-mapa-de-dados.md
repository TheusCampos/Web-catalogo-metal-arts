# Mapa de Dados Pessoais & Governança LGPD — Serralheria Metal Arts

**Data:** Setembro de 2026  
**Versão:** 1.0  
**Encarregado / DPO / Contato:** privacidade@serralheriametalarts.com.br

Este documento formaliza o inventário de dados pessoais, bases legais, fluxos de tratamento, finalidades e políticas de segurança do catálogo e e-commerce da Serralheria Metal Arts, em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).

---

## 1. Inventário de Dados Pessoais

| Dado Coletado                        | Finalidade Principal                                                        | Base Legal (LGPD)                                                             | Local de Armazenamento                                   | Acesso                            | Prazo de Retenção                            | Procedimento de Exclusão / Anonimização                                         |
| :----------------------------------- | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :------------------------------------------------------- | :-------------------------------- | :------------------------------------------- | :------------------------------------------------------------------------------ |
| **Nome**                             | Identificação do cliente no atendimento e cotação                           | Art. 7º, V (Execução de Contrato / Procedimentos Preliminares)                | Supabase PostgreSQL (`customer_leads`)                   | Administradores autenticados      | 12 meses após último contato                 | Exclusão via painel admin ou mediante requisição pelo canal `/direitos-titular` |
| **Telefone / WhatsApp**              | Contato comercial direto, alinhamento de medidas e orçamento                | Art. 7º, V (Procedimentos Preliminares de Contrato)                           | Supabase PostgreSQL (`customer_leads`)                   | Administradores autenticados      | 12 meses após último contato                 | Exclusão via painel admin ou mediante requisição pelo canal `/direitos-titular` |
| **E-mail (opcional)**                | Envio de orçamentos formais e novidades (se consentido)                     | Art. 7º, V (Execução de Contrato) e Art. 7º, I (Consentimento para marketing) | Supabase PostgreSQL (`customer_leads`)                   | Administradores autenticados      | 12 meses ou até revogação do consentimento   | Revogação via link nos e-mails ou canal `/direitos-titular`                     |
| **Consentimento de Marketing**       | Registro formal de opt-in para comunicação promocional                      | Art. 7º, I (Consentimento do Titular)                                         | Supabase PostgreSQL (`customer_leads.marketing_consent`) | Administradores autenticados      | Vitalício até revogação expressa             | Atualização imediata para `false` a pedido do titular                           |
| **Produto de Interesse / Pedido**    | Contexto para dimensionamento do projeto e precificação                     | Art. 7º, V (Execução de Contrato)                                             | Supabase PostgreSQL (`customer_leads`)                   | Administradores autenticados      | 12 meses                                     | Exclusão conjunta com o lead                                                    |
| **Cookies Necessários**              | Sessão de autenticação do lojista, preferências de cookies e carrinho local | Art. 7º, IX (Legítimo Interesse)                                              | Navegador (`localStorage`, Cookies de sessão Supabase)   | Navegador do titular              | Sessão / Até 12 meses                        | Limpeza manual no navegador ou via menu de preferências                         |
| **Cookies de Analytics (opcional)**  | Métricas de navegação, páginas mais visitadas e desempenho                  | Art. 7º, I (Consentimento)                                                    | Armazenamento do provedor de analytics                   | Restrito à equipe de inteligência | Conforme política do provedor (máx 14 meses) | Revogação a qualquer momento via `/cookies`                                     |
| **Logs de Auditoria Administrativa** | Segurança, rastreabilidade de acessos e cumprimento legal                   | Art. 7º, II (Cumprimento de Obrigação Legal - Marco Civil / LGPD)             | Supabase PostgreSQL (`audit_logs`)                       | Super-administradores             | 6 meses a 5 anos (obrigação legal)           | Arquivamento histórico protegido                                                |

---

## 2. Princípios LGPD Aplicados

1. **Finalidade e Adequação**: Os dados são coletados estritamente para viabilizar a fabricação sob medida, cotação e entrega dos produtos.
2. **Necessidade (Minimização)**: Coletam-se apenas nome, telefone e email opcional. Não são exigidos CPF, RG ou dados sensíveis durante a navegação ou cotação inicial.
3. **Livre Acesso e Transparência**: O titular tem acesso às políticas em `/privacidade`, `/cookies` e ao canal `/direitos-titular`.
4. **Segurança e Prevenção**: Chave de serviço (`SUPABASE_SERVICE_ROLE_KEY`) isolada exclusivamente no backend; banco de dados protegido por RLS (Row Level Security); proteção de tráfego com TLS/HTTPS, CSP e HSTS.

---

## 3. Direitos do Titular (Art. 18 LGPD)

O titular pode a qualquer momento:

- Confirmar a existência de tratamento;
- Acessar seus dados pessoais;
- Corrigir dados incompletos ou inexatos;
- Anonimizar, bloquear ou eliminar dados desnecessários;
- Revogar o consentimento outorgado para comunicações de marketing.

O canal oficial para o exercício desses direitos é a rota pública [`/direitos-titular`](https://www.serralheriametalarts.com.br/direitos-titular) ou o e-mail de privacidade.
