import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, ChevronRight, Lock, Eye, FileText, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Serralheria Metal Arts" },
      {
        name: "description",
        content:
          "Transparência e segurança no tratamento dos seus dados pessoais. Conheça nossa política de privacidade em total conformidade com a LGPD (Lei nº 13.709/2018).",
      },
      { property: "og:title", content: "Política de Privacidade — Serralheria Metal Arts" },
      {
        property: "og:description",
        content:
          "Conheça as diretrizes de privacidade, segurança e direitos do titular na Serralheria Metal Arts.",
      },
      { property: "og:url", content: "https://www.serralheriametalarts.com.br/privacidade" },
    ],
    links: [{ rel: "canonical", href: "https://www.serralheriametalarts.com.br/privacidade" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="container-page pt-24 pb-16 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">
          Página Inicial
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-bold text-foreground">Política de Privacidade</span>
      </nav>

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-border/60">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Shield className="h-3.5 w-3.5" /> LGPD · Lei 13.709/2018
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Política de Privacidade e Governança de Dados
        </h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: Setembro de 2026 · Versão 1.0
        </p>
      </header>

      {/* Conteúdo Institucional */}
      <div className="mt-8 space-y-10 text-foreground/90 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> 1. Quem Somos e Controlador dos Dados
          </h2>
          <p>
            A <strong>Serralheria Metal Arts</strong> (“nós”, “nosso”), ateliê dedicado à marcenaria
            fina, móveis em madeira maciça nobre e serralheria artística sob medida, atua na
            qualidade de <strong>Controladora</strong> dos dados pessoais coletados neste catálogo
            online, sendo responsável por definir as finalidades e os meios de tratamento, nos
            termos do art. 5º, VI, da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 —
            LGPD).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> 2. Dados Coletados e Finalidades do Tratamento
          </h2>
          <p>
            Em respeito ao princípio da necessidade e minimização de dados, coletamos estritamente
            as informações necessárias para viabilizar nosso relacionamento comercial e o
            atendimento personalizado sob medida:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">
                Dados de Contato (Nome e Telefone/WhatsApp):
              </strong>{" "}
              Coletados quando você inicia uma cotação pelo botão de WhatsApp ou checkout do
              catálogo. Finalidade: identificação do cliente e elaboração de orçamento sob medida.
              Base Legal: Execução de Contrato e Procedimentos Preliminares (Art. 7º, V, LGPD).
            </li>
            <li>
              <strong className="text-foreground">E-mail (opcional):</strong> Coletado se informado
              espontaneamente. Finalidade: envio de orçamentos técnicos e, mediante seu
              consentimento prévio e expresso, comunicação de lançamentos e condições especiais.
              Base Legal: Consentimento (Art. 7º, I, LGPD).
            </li>
            <li>
              <strong className="text-foreground">Dados de Navegação e Carrinho:</strong> Itens
              favoritados e produtos adicionados à lista de cotação ficam armazenados exclusivamente
              no seu navegador via{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">localStorage</code>, sem
              transferência a servidores até que você clique para orçar.
            </li>
            <li>
              <strong className="text-foreground">Cookies de Desempenho e Métricas:</strong>{" "}
              Coletados apenas quando você aceita ativamente nosso aviso de cookies. Finalidade:
              mensurar audiência de páginas e velocidade de carregamento de forma agregada e
              anônima. Base Legal: Consentimento (Art. 7º, I, LGPD).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" /> 3. Consentimento para Comunicações de
            Marketing
          </h2>
          <p>
            Nosso compromisso é o respeito à sua caixa de entrada e WhatsApp. O consentimento para
            receber ofertas e catálogos é sempre{" "}
            <strong>opcional, transparente e não condicionado</strong> à realização de pedidos. Você
            pode revogar seu consentimento a qualquer instante pelo canal de direitos do titular.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> 4. Compartilhamento e Armazenamento dos
            Dados
          </h2>
          <p>
            A Serralheria Metal Arts <strong>não comercializa, não aluga e não cede</strong> seus
            dados pessoais a terceiros. O compartilhamento ocorre exclusivamente com prestadores de
            infraestrutura tecnológica essenciais à operação (banco de dados em nuvem criptografado
            Supabase/PostgreSQL com Row Level Security) e aplicativo WhatsApp durante o
            encaminhamento do seu pedido.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Prazo de Retenção</h2>
          <p>
            Os dados de leads e orçamentos são mantidos pelo período estritamente necessário para
            concluir a negociação do projeto (prazo padrão de até 12 meses após a última interação)
            ou até a manifestação de exclusão pelo titular, ressalvadas as obrigações legais de
            guarda fiscal ou contábil decorrentes de contratos formalizados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            6. Seus Direitos como Titular (Art. 18 LGPD)
          </h2>
          <p>
            Você tem total controle sobre seus dados pessoais. A qualquer momento, você pode exercer
            os seguintes direitos:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card">
              <span className="font-bold text-sm block mb-1">Acesso e Confirmação</span>
              <p className="text-xs text-muted-foreground">
                Saber se tratamos seus dados e solicitar uma cópia dos registros armazenados.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card">
              <span className="font-bold text-sm block mb-1">Correção e Atualização</span>
              <p className="text-xs text-muted-foreground">
                Retificar telefones, nomes ou dados inexatos ou incompletos.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card">
              <span className="font-bold text-sm block mb-1">Exclusão e Revogação</span>
              <p className="text-xs text-muted-foreground">
                Solicitar a eliminação dos seus dados ou retirar o consentimento de marketing.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/70 bg-card">
              <span className="font-bold text-sm block mb-1">Informações sobre Cookies</span>
              <p className="text-xs text-muted-foreground">
                Revisar ou alterar suas preferências de cookies a qualquer momento.
              </p>
            </div>
          </div>
        </section>

        {/* CTA de Direitos */}
        <section className="rounded-2xl border border-emerald-600/30 bg-emerald-950/10 dark:bg-emerald-950/20 p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600" /> Canal de Atendimento ao Titular
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para exercer qualquer um dos seus direitos ou esclarecer dúvidas sobre esta Política de
            Privacidade, utilize nosso canal direto de solicitações ou entre em contato com nosso
            Encarregado de Proteção de Dados (DPO):
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link to="/direitos-titular">Exercer Direitos do Titular</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/cookies">Gerenciar Cookies</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
