import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageField } from "@/components/admin/ImageField";
import {
  getServicesSectionData,
  getAboutSectionData,
  type ServiceCardItem,
  type NobleWoodItem,
  type DifferentialItem,
} from "@/lib/store.functions";
import { toast } from "sonner";
import { Store, Hammer, BookOpen, Save, Sparkles, TreePine } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: AdminSettings,
});

type FormState = {
  // 1. Dados Gerais
  name: string;
  logo_url: string;
  primary_color: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  address: string;
  max_installments: string;

  // 2. Nossos Serviços & Especialidades
  services_title: string;
  services_subtitle: string;
  services_description: string;
  services_items: ServiceCardItem[];
  services_woods: NobleWoodItem[];

  // 3. Sobre a Nossa Empresa
  about_title: string;
  about_subtitle: string;
  about_description: string;
  about_image_url: string;
  about_badge_text: string;
  about_differentials: DifferentialItem[];
};

function AdminSettings() {
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: ["admin", "settings"], queryFn: adminApi.settings });
  const [form, setForm] = useState<FormState | null>(null);
  const [activeTab, setActiveTab] = useState<string>("geral");

  useEffect(() => {
    if (!settings.data || form) return;
    const servicesData = getServicesSectionData(settings.data);
    const aboutData = getAboutSectionData(settings.data);

    setForm({
      name: settings.data.name,
      logo_url: settings.data.logo_url ?? "",
      primary_color: settings.data.primary_color,
      whatsapp_number: settings.data.whatsapp_number,
      instagram_url: settings.data.instagram_url ?? "",
      facebook_url: settings.data.facebook_url ?? "",
      address: settings.data.address ?? "",
      max_installments: settings.data.max_installments?.toString() ?? "12",

      services_title: servicesData.title,
      services_subtitle: servicesData.subtitle,
      services_description: servicesData.description,
      services_items: servicesData.items,
      services_woods: servicesData.woods,

      about_title: aboutData.title,
      about_subtitle: aboutData.subtitle,
      about_description: aboutData.description,
      about_image_url: aboutData.imageUrl,
      about_badge_text: aboutData.badgeText,
      about_differentials: aboutData.differentials,
    });
  }, [settings.data, form]);

  const save = useMutation({
    mutationFn: async () => {
      if (!settings.data || !form) throw new Error("Configurações não carregadas.");

      const servicesHeader = JSON.stringify({
        title: form.services_title.trim(),
        subtitle: form.services_subtitle.trim(),
        description: form.services_description.trim(),
      });
      const servicesItems = JSON.stringify(form.services_items);
      const servicesWoods = JSON.stringify(form.services_woods);
      const aboutDiffs = JSON.stringify(form.about_differentials);

      await adminApi.saveSettings({
        id: settings.data.id,
        name: form.name.trim() || "Minha Loja",
        logo_url: form.logo_url || null,
        primary_color: form.primary_color,
        whatsapp_number: form.whatsapp_number.replace(/\D/g, ""),
        instagram_url: form.instagram_url.trim() || null,
        facebook_url: form.facebook_url.trim() || null,
        address: form.address.trim() || null,
        max_installments: form.max_installments ? parseInt(form.max_installments, 10) : null,

        // Seção Sobre
        about_title: form.about_title.trim() || null,
        about_description: form.about_description.trim() || null,
        about_image_url: form.about_image_url || null,
        trust_badge_4: form.about_subtitle.trim() || null,
        catalog_banner_url: form.about_badge_text.trim() || null,
        trust_badge_3: aboutDiffs,

        // Seção Serviços & Madeiras
        announcement_text: servicesHeader,
        trust_badge_1: servicesItems,
        trust_badge_2: servicesWoods,
      });
    },
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!form) return <p className="text-sm text-muted-foreground p-6">Carregando configurações…</p>;

  function updateService(index: number, field: keyof ServiceCardItem, value: string) {
    if (!form) return;
    const next = [...form.services_items];
    next[index] = { ...next[index], [field]: value } as ServiceCardItem;
    setForm({ ...form, services_items: next });
  }

  function updateWood(index: number, field: keyof NobleWoodItem, value: string) {
    if (!form) return;
    const next = [...form.services_woods];
    next[index] = { ...next[index], [field]: value } as NobleWoodItem;
    setForm({ ...form, services_woods: next });
  }

  function updateDifferential(index: number, field: keyof DifferentialItem, value: string) {
    if (!form) return;
    const next = [...form.about_differentials];
    next[index] = { ...next[index], [field]: value } as DifferentialItem;
    setForm({ ...form, about_differentials: next });
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações da Loja</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personalize todas as informações visuais, institucionais e editoriais do catálogo.
          </p>
        </div>

        <Button
          size="lg"
          className="font-bold uppercase tracking-wider gap-2 shadow-md"
          onClick={() => save.mutate()}
          disabled={save.isPending}
        >
          <Save className="w-4 h-4" />
          {save.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full max-w-3xl h-auto p-1 bg-muted/70 gap-1 rounded-xl">
          <TabsTrigger value="geral" className="py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4" />
            Dados Gerais
          </TabsTrigger>
          <TabsTrigger value="servicos" className="py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Hammer className="w-4 h-4" />
            Nossos Serviços & Madeiras
          </TabsTrigger>
          <TabsTrigger value="sobre" className="py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Sobre a Empresa
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: DADOS GERAIS */}
        <TabsContent value="geral" className="space-y-6">
          <Card className="shadow-sm border-border/80">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">Identidade da Loja</h2>
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input
                    id="storeName"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <ImageField
                  value={form.logo_url}
                  onChange={(value) => setForm({ ...form, logo_url: value })}
                  label="Logotipo da Loja"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="color">Cor Principal da Marca</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        type="color"
                        className="h-10 w-14 p-1 cursor-pointer"
                        value={form.primary_color}
                        onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                      />
                      <Input
                        value={form.primary_color}
                        onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                        aria-label="Código da cor principal"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whats">WhatsApp de Vendas (com DDD, apenas dígitos)</Label>
                    <Input
                      id="whats"
                      value={form.whatsapp_number}
                      onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                      placeholder="5511999999999"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="max_installments">Máximo de Parcelas nos Cards</Label>
                  <Input
                    id="max_installments"
                    type="number"
                    min="0"
                    max="12"
                    value={form.max_installments}
                    onChange={(e) => setForm({ ...form, max_installments: e.target.value })}
                    placeholder="Ex: 12 (0 para ocultar)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Define o número de parcelas exibido nos cards de produto. Se 0, o texto de parcelamento fica oculto.
                  </p>
                </div>
              </div>

              {/* Redes Sociais & Endereço */}
              <div className="pt-4 border-t space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">Canais & Localização</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ig">Link do Instagram</Label>
                    <Input
                      id="ig"
                      value={form.instagram_url}
                      onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/sualoja"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fb">Link do Facebook</Label>
                    <Input
                      id="fb"
                      value={form.facebook_url}
                      onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/sualoja"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Físico / Ateliê</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Ex: Rua das Madeiras, 100 - São Paulo, SP"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 2: NOSSOS SERVIÇOS & ESPECIALIDADES */}
        <TabsContent value="servicos" className="space-y-6">
          {/* 1. Cabeçalho Geral da Seção */}
          <Card className="shadow-sm border-border/80">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                <Hammer className="w-5 h-5 text-emerald-600" />
                Cabeçalho da Seção de Serviços
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="services_title">Título da Seção</Label>
                  <Input
                    id="services_title"
                    value={form.services_title}
                    onChange={(e) => setForm({ ...form, services_title: e.target.value })}
                    placeholder="Ex: Nossos Serviços & Especialidades"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services_subtitle">Subtítulo em Itálico</Label>
                  <Input
                    id="services_subtitle"
                    value={form.services_subtitle}
                    onChange={(e) => setForm({ ...form, services_subtitle: e.target.value })}
                    placeholder="Ex: Do corte milimétrico ao acabamento acetinado..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="services_desc">Texto Introdutório</Label>
                <Textarea
                  id="services_desc"
                  value={form.services_description}
                  onChange={(e) => setForm({ ...form, services_description: e.target.value })}
                  placeholder="Descrição institucional dos serviços de marcenaria..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Os 3 Serviços Principais */}
          <div className="space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Os 3 Serviços Principais da Marcenaria
            </h3>

            <div className="grid gap-6 md:grid-cols-3">
              {form.services_items.map((service, idx) => (
                <Card key={idx} className="shadow-sm border-border/80 relative">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Serviço 0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label>Etiqueta / Tag</Label>
                      <Input
                        value={service.badge}
                        onChange={(e) => updateService(idx, "badge", e.target.value)}
                        placeholder="Ex: Projetos Sob Medida"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Título do Serviço</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(idx, "title", e.target.value)}
                        placeholder="Ex: Móveis e Bancadas Personalizadas"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição do Serviço</Label>
                      <Textarea
                        value={service.desc}
                        onChange={(e) => updateService(idx, "desc", e.target.value)}
                        placeholder="Descreva este serviço..."
                        className="min-h-[90px] text-xs"
                      />
                    </div>

                    <ImageField
                      value={service.imageUrl}
                      onChange={(value) => updateService(idx, "imageUrl", value)}
                      label="Foto do Serviço"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 3. As 3 Madeiras Nobres */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TreePine className="w-4 h-4 text-emerald-600" />
              As 3 Madeiras Nobres & Suas Características
            </h3>

            <div className="grid gap-6 md:grid-cols-3">
              {form.services_woods.map((wood, idx) => (
                <Card key={idx} className="shadow-sm border-border/80">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Madeira 0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label>Nome Comercial da Madeira</Label>
                      <Input
                        value={wood.name}
                        onChange={(e) => updateWood(idx, "name", e.target.value)}
                        placeholder="Ex: Cumaru Dourado"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Nome Científico</Label>
                        <Input
                          value={wood.scientificName}
                          onChange={(e) => updateWood(idx, "scientificName", e.target.value)}
                          placeholder="Ex: Dipteryx odorata"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Etiqueta / Destaque</Label>
                        <Input
                          value={wood.tag}
                          onChange={(e) => updateWood(idx, "tag", e.target.value)}
                          placeholder="Ex: Mais Procurada"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tonalidade Natural</Label>
                      <Input
                        value={wood.colorTone}
                        onChange={(e) => updateWood(idx, "colorTone", e.target.value)}
                        placeholder="Ex: Castanho-dourado quente"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Melhor Indicação de Uso</Label>
                      <Input
                        value={wood.bestFor}
                        onChange={(e) => updateWood(idx, "bestFor", e.target.value)}
                        placeholder="Ex: Mesas de jantar e aparadores"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição da Madeira</Label>
                      <Textarea
                        value={wood.description}
                        onChange={(e) => updateWood(idx, "description", e.target.value)}
                        placeholder="Propriedades e toque da madeira..."
                        className="min-h-[80px] text-xs"
                      />
                    </div>

                    <ImageField
                      value={wood.imageUrl}
                      onChange={(value) => updateWood(idx, "imageUrl", value)}
                      label="Foto da Madeira / Amostra"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ABA 3: SOBRE A NOSSA EMPRESA */}
        <TabsContent value="sobre" className="space-y-6">
          <Card className="shadow-sm border-border/80">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  Narrativa Institucional da Empresa
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="about_title">Título da Seção Sobre</Label>
                    <Input
                      id="about_title"
                      value={form.about_title}
                      onChange={(e) => setForm({ ...form, about_title: e.target.value })}
                      placeholder="Ex: Conheça a Minha Loja: Artesanato & Design Atemporal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about_subtitle">Subtítulo em Itálico</Label>
                    <Input
                      id="about_subtitle"
                      value={form.about_subtitle}
                      onChange={(e) => setForm({ ...form, about_subtitle: e.target.value })}
                      placeholder="Ex: Tradição em marcenaria artesanal e respeito..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about_description">História Completa / Filosofia da Marca</Label>
                  <Textarea
                    id="about_description"
                    value={form.about_description}
                    onChange={(e) => setForm({ ...form, about_description: e.target.value })}
                    placeholder="Conte sobre os métodos artesanais, respeito aos ciclos da madeira..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <ImageField
                    value={form.about_image_url}
                    onChange={(value) => setForm({ ...form, about_image_url: value })}
                    label="Foto Principal da Seção Sobre"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="badgeText">Texto da Etiqueta Flutuante na Imagem</Label>
                    <Input
                      id="badgeText"
                      value={form.about_badge_text}
                      onChange={(e) => setForm({ ...form, about_badge_text: e.target.value })}
                      placeholder="Ex: Madeira Maciça & Bordas Vivas"
                    />
                    <p className="text-xs text-muted-foreground">
                      Aparece no canto inferior da foto principal junto com o nome da loja.
                    </p>
                  </div>
                </div>
              </div>

              {/* Diferenciais da Empresa */}
              <div className="pt-4 border-t space-y-4">
                <h3 className="text-base font-semibold border-b pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Diferenciais Competitivos da Empresa
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {form.about_differentials.map((diff, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Diferencial 0{idx + 1}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Título do Diferencial</Label>
                        <Input
                          value={diff.title}
                          onChange={(e) => updateDifferential(idx, "title", e.target.value)}
                          placeholder="Ex: 100% Madeira Legal & Rastreável"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Descrição Curta</Label>
                        <Textarea
                          value={diff.description}
                          onChange={(e) => updateDifferential(idx, "description", e.target.value)}
                          placeholder="Explicação do diferencial..."
                          className="min-h-[70px] text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Barra de Ação Fixa / Inferior */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          size="lg"
          className="font-bold uppercase tracking-wider gap-2 shadow-md px-8"
          onClick={() => save.mutate()}
          disabled={save.isPending}
        >
          <Save className="w-4 h-4" />
          {save.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
