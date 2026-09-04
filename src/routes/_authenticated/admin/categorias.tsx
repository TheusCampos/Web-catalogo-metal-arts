import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { adminApi, type CategoryRow } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: AdminCategories,
});

function AdminCategories() {
  const queryClient = useQueryClient();
  const categories = useQuery({ queryKey: ["admin", "categories"], queryFn: adminApi.categories });
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  };

  const create = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Informe o nome da categoria.");
      await adminApi.saveCategory({
        name: name.trim(),
        image_url: imageUrl || null,
        sort_order: categories.data?.length ?? 0,
      });
    },
    onSuccess: () => {
      setName("");
      setImageUrl("");
      toast.success("Categoria criada");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const save = useMutation({
    mutationFn: (input: {
      id: string;
      name: string;
      sort_order: number;
      image_url?: string | null;
    }) => adminApi.saveCategory(input),
    onSuccess: () => {
      toast.success("Categoria salva");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      toast.success("Categoria excluída");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as categorias de produtos e defina as imagens de capa exibidas na tela inicial.
        </p>
      </div>

      {/* Formulário de Criação de Categoria */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Nova Categoria
          </h2>
          <div className="space-y-2">
            <Label htmlFor="categoryName">Nome da categoria</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tênis, Camisas, Acessórios..."
            />
          </div>

          <ImageField
            value={imageUrl}
            onChange={setImageUrl}
            label="Imagem de Capa (Exibida na Home)"
          />

          <Button
            onClick={() => create.mutate()}
            disabled={create.isPending}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Categoria
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Categorias Existentes */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">
          Categorias Cadastradas ({categories.data?.length ?? 0})
        </h2>

        {(categories.data ?? []).map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onSave={(updated) => save.mutate(updated)}
            onDelete={() => remove.mutate(category.id)}
          />
        ))}

        {categories.data?.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Nenhuma categoria cadastrada.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CategoryItem({
  category,
  onSave,
  onDelete,
}: {
  category: CategoryRow;
  onSave: (updated: {
    id: string;
    name: string;
    sort_order: number;
    image_url?: string | null;
  }) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [sortOrder, setSortOrder] = useState(category.sort_order);
  const [imageUrl, setImageUrl] = useState(category.image_url ?? "");
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    onSave({
      id: category.id,
      name: name.trim() || category.name,
      sort_order: Number(sortOrder) || 0,
      image_url: imageUrl || null,
    });
    setDirty(false);
  };

  return (
    <Card className="overflow-hidden border border-border">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 w-full space-y-2">
            <Label className="text-xs text-muted-foreground">Nome</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDirty(true);
              }}
            />
          </div>
          <div className="w-full sm:w-24 space-y-2">
            <Label className="text-xs text-muted-foreground">Ordem</Label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(Number(e.target.value));
                setDirty(true);
              }}
            />
          </div>
          <div className="flex items-center gap-2 pt-6 shrink-0">
            {dirty && (
              <Button size="sm" onClick={handleSave}>
                Salvar
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm(`Excluir "${category.name}"?`)) onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ImageField
          value={imageUrl}
          onChange={(newVal) => {
            setImageUrl(newVal);
            onSave({
              id: category.id,
              name: name.trim() || category.name,
              sort_order: Number(sortOrder) || 0,
              image_url: newVal || null,
            });
          }}
          label="Imagem da Categoria"
        />
      </CardContent>
    </Card>
  );
}
