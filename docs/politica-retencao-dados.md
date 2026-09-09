# Política de Retenção e Descarte de Dados — Serralheria Metal Arts

**Versão:** 1.0  
**Data:** Setembro de 2026

Esta diretriz estabelece os períodos máximos de armazenamento e os critérios técnicos de expurgo ou anonimização de dados pessoais no Catálogo Metal Arts, em conformidade com o Art. 16 da Lei nº 13.709/2018 (LGPD).

---

## 1. Princípio Geral

Nenhum dado pessoal é mantido em nossas bases sem finalidade legítima ou além do tempo necessário para cumprimento das obrigações pré-contratuais e contratuais.

---

## 2. Prazos de Retenção por Categoria

| Categoria                                            | Prazo de Retenção       | Critério / Justificativa Legal                                                      | Ação ao Fim do Prazo                                                       |
| :--------------------------------------------------- | :---------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| **Leads de Cotação sem Conversão**                   | 12 meses                | Prazo padrão para negociação de projetos sob medida e contato sazonal.              | Expurgo automatizado via rotina de retenção (`purgeOldLeads`).             |
| **Leads com Consentimento de Marketing**             | Até revogação           | Consentimento ativo do titular (Art. 7º, I, LGPD).                                  | Desativação imediata (`marketing_consent = false`) ou exclusão definitiva. |
| **Logs de Auditoria Administrativa**                 | 24 meses a 5 anos       | Obrigação legal de registro de acesso e segurança (Marco Civil da Internet / LGPD). | Arquivamento histórico seguro e restrito a super-administradores.          |
| **Dados em Dispositivo Local (carrinho, favoritos)** | Gerenciado pelo usuário | Dados estritamente locais no navegador (`localStorage`).                            | O próprio usuário limpa o navegador ou clica em limpar carrinho.           |

---

## 3. Procedimento Operacional de Expurgo

Os administradores autorizados dispõem do comando de expurgo na API administrativa (`adminApi.purgeOldLeads(dias)`), que:

1. Filtra registros anteriores à data limite;
2. Deleta os registros com segurança do PostgreSQL;
3. Gera registro imutável em `audit_logs` documentando a quantidade de registros eliminados, data e usuário executor.
