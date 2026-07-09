import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Palette, Type, Ruler, Square, Layers, LayoutGrid, Sparkles, MousePointerClick,
  FileText, CreditCard, Tag, AlertCircle, Table as TableIcon, MessageSquare,
  Layout, Copy, Check, Sun, Moon, Menu, Home, Search, Bell, User,
  Heart, Star, Settings, Trash, Plus, Download, ArrowRight, Info,
  CheckCircle2, AlertTriangle, XCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { group: "Fundamentos", items: [
    { id: "overview", label: "Visão Geral", icon: Sparkles },
    { id: "principles", label: "Princípios", icon: Sparkles },
  ]},
  { group: "Tokens", items: [
    { id: "colors", label: "Cores", icon: Palette },
    { id: "typography", label: "Tipografia", icon: Type },
    { id: "spacing", label: "Espaçamento", icon: Ruler },
    { id: "radius", label: "Raios e Bordas", icon: Square },
    { id: "shadows", label: "Sombras", icon: Layers },
    { id: "grid", label: "Grid e Layout", icon: LayoutGrid },
    { id: "icons", label: "Ícones", icon: Sparkles },
  ]},
  { group: "Componentes", items: [
    { id: "buttons", label: "Botões", icon: MousePointerClick },
    { id: "inputs", label: "Inputs e Forms", icon: FileText },
    { id: "cards", label: "Cards", icon: CreditCard },
    { id: "badges", label: "Badges", icon: Tag },
    { id: "alerts", label: "Alertas", icon: AlertCircle },
    { id: "tables", label: "Tabelas", icon: TableIcon },
    { id: "dialogs", label: "Modais/Dialogs", icon: MessageSquare },
    { id: "tabs", label: "Tabs", icon: Layout },
    { id: "tooltips", label: "Tooltips/Popovers", icon: Info },
    { id: "avatars", label: "Avatares", icon: User },
    { id: "loading", label: "Loading States", icon: Loader2 },
  ]},
  { group: "Padrões", items: [
    { id: "patterns", label: "Padrões de Página", icon: Layout },
  ]},
];

const TOKEN_COLORS = [
  { name: "background", label: "Background" },
  { name: "foreground", label: "Foreground" },
  { name: "primary", label: "Primary" },
  { name: "primary-foreground", label: "Primary FG" },
  { name: "secondary", label: "Secondary" },
  { name: "secondary-foreground", label: "Secondary FG" },
  { name: "accent", label: "Accent" },
  { name: "accent-foreground", label: "Accent FG" },
  { name: "muted", label: "Muted" },
  { name: "muted-foreground", label: "Muted FG" },
  { name: "card", label: "Card" },
  { name: "popover", label: "Popover" },
  { name: "border", label: "Border" },
  { name: "input", label: "Input" },
  { name: "ring", label: "Ring" },
  { name: "destructive", label: "Destructive" },
  { name: "success", label: "Success" },
];

function copy(text: string) {
  navigator.clipboard.writeText(text);
  toast.success(`Copiado: ${text}`);
}

function hslVarToHex(varName: string): string {
  if (typeof window === "undefined") return "";
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`).trim();
  if (!v) return "";
  const [h, s, l] = v.split(" ").map((x) => parseFloat(x.replace("%", "")));
  return hslToHex(h, s, l);
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function ColorSwatch({ token, label }: { token: string; label: string }) {
  const [hex, setHex] = useState("");
  useEffect(() => { setHex(hslVarToHex(token)); });
  const val = `hsl(var(--${token}))`;
  return (
    <button
      onClick={() => copy(`hsl(var(--${token}))`)}
      className="group text-left rounded-lg border border-border overflow-hidden hover:shadow-md transition-all"
    >
      <div className="h-20 w-full" style={{ background: val }} />
      <div className="p-3 bg-card">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground font-mono">--{token}</div>
        <div className="text-xs text-muted-foreground font-mono mt-1 flex items-center gap-1">
          {hex} <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />
        </div>
      </div>
    </button>
  );
}

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 py-10 border-b border-border last:border-0">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-foreground tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Block({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {title && <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">{title}</h3>}
      {children}
    </div>
  );
}

const SPACING = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
const RADII = [
  { name: "none", cls: "rounded-none" },
  { name: "sm", cls: "rounded-sm" },
  { name: "md", cls: "rounded-md" },
  { name: "lg", cls: "rounded-lg" },
  { name: "xl", cls: "rounded-xl" },
  { name: "2xl", cls: "rounded-2xl" },
  { name: "full", cls: "rounded-full" },
];
const SHADOWS = [
  { name: "sm", cls: "shadow-sm" },
  { name: "DEFAULT", cls: "shadow" },
  { name: "md", cls: "shadow-md" },
  { name: "lg", cls: "shadow-lg" },
  { name: "xl", cls: "shadow-xl" },
  { name: "2xl", cls: "shadow-2xl" },
];
const BREAKPOINTS = [
  { name: "sm", value: "640px" },
  { name: "md", value: "768px" },
  { name: "lg", value: "1024px" },
  { name: "xl", value: "1280px" },
  { name: "2xl", value: "1400px" },
];

const ICON_LIST = [
  Home, Search, Bell, User, Heart, Star, Settings, Trash, Plus, Download,
  ArrowRight, Info, CheckCircle2, AlertTriangle, XCircle, Copy, Sun, Moon,
  Palette, Type, Ruler, Square, Layers, LayoutGrid, Sparkles, MousePointerClick,
  FileText, CreditCard, Tag, AlertCircle, TableIcon, MessageSquare, Layout, Menu,
];

export default function DesignSystem() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("overview");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ds-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefers;
    setDark(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("ds-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    SECTIONS.flatMap((g) => g.items).forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const filteredIcons = ICON_LIST.filter((I) =>
    I.displayName?.toLowerCase().includes(query.toLowerCase())
  );

  const Sidebar = () => (
    <nav className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-foreground">Design System</div>
            <div className="text-xs text-muted-foreground">Aqua Delivery</div>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {SECTIONS.map((group) => (
            <div key={group.group}>
              <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={() => setDark(!dark)} className="w-full gap-2">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? "Modo Claro" : "Modo Escuro"}
        </Button>
      </div>
    </nav>
  );

  const activeLabel =
    SECTIONS.flatMap((g) => g.items).find((s) => s.id === active)?.label ?? "";

  return (
    <>
      <Helmet>
        <title>Design System — Referência Visual</title>
        <meta name="description" content="Documentação viva do design system do projeto." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-border bg-card sticky top-0 h-screen">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        <div className="lg:hidden fixed top-3 left-3 z-40">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline"><Menu className="h-4 w-4" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
            <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Design System / {activeLabel}</div>
                <h1 className="text-lg font-semibold text-foreground">{activeLabel}</h1>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">v1.0</Badge>
            </div>
          </header>

          <div className="px-6 lg:px-10 max-w-5xl mx-auto">
            <Section id="overview" title="Visão Geral" description="Documentação viva dos tokens e componentes que garantem consistência em todo o projeto.">
              <Block>
                <p className="text-foreground leading-relaxed">
                  Este design system centraliza cores, tipografia, espaçamento e componentes React
                  usados no projeto. Cada token está mapeado como CSS variable e disponível via
                  Tailwind. Utilize esta página como fonte única da verdade ao construir novas telas.
                </p>
              </Block>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Sparkles, title: "Consistente", desc: "Tokens semânticos únicos" },
                  { icon: Palette, title: "Temável", desc: "Claro e escuro nativos" },
                  { icon: LayoutGrid, title: "Composável", desc: "shadcn/ui + Radix" },
                  { icon: Ruler, title: "Escalável", desc: "Escala tipográfica e spacing" },
                ].map((p) => (
                  <div key={p.title} className="rounded-xl border border-border bg-card p-4">
                    <p.icon className="h-5 w-5 text-primary mb-2" />
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="principles" title="Princípios" description="Diretrizes que guiam decisões de design.">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Sparkles, title: "Clareza", desc: "Interface direta, sem ambiguidade." },
                  { icon: Layers, title: "Hierarquia", desc: "Priorize o que importa via tipografia e cor." },
                  { icon: Palette, title: "Consistência", desc: "Mesmo componente, mesmo comportamento." },
                  { icon: Ruler, title: "Ritmo", desc: "Espaçamento previsível em toda a UI." },
                ].map((p) => (
                  <Block key={p.title}>
                    <p.icon className="h-6 w-6 text-primary mb-3" />
                    <div className="font-semibold text-foreground">{p.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
                  </Block>
                ))}
              </div>
            </Section>

            <Section id="colors" title="Cores" description="Tokens semânticos definidos em src/index.css. Clique para copiar.">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {TOKEN_COLORS.map((c) => (
                  <ColorSwatch key={c.name} token={c.name} label={c.label} />
                ))}
              </div>
              <Block title="Gradientes">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="h-24 rounded-lg" style={{ background: "var(--gradient-water)" }} />
                  <div className="h-24 rounded-lg border border-border" style={{ background: "var(--gradient-subtle)" }} />
                </div>
              </Block>
            </Section>

            <Section id="typography" title="Tipografia" description="Família principal: Inter/Montserrat.">
              <Block>
                <div className="space-y-4">
                  {[
                    { cls: "text-heading-1", label: "Heading 1", spec: "32px / 600" },
                    { cls: "text-heading-2", label: "Heading 2", spec: "24px / 600" },
                    { cls: "text-heading-3", label: "Heading 3", spec: "18px / 500" },
                    { cls: "text-body-lg", label: "Body Large", spec: "16px / 400" },
                    { cls: "text-body-md", label: "Body Medium", spec: "14px / 400" },
                    { cls: "text-body-sm", label: "Body Small", spec: "12px / 400" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-baseline justify-between gap-4 pb-4 border-b border-border last:border-0">
                      <div className={cn(t.cls, "text-foreground")}>{t.label}</div>
                      <div className="text-xs text-muted-foreground font-mono shrink-0">{t.spec}</div>
                    </div>
                  ))}
                </div>
              </Block>
              <Block title="Parágrafo">
                <p className="text-body-md text-foreground max-w-prose">
                  O rápido raposo marrom salta sobre o cachorro preguiçoso. Design system garante
                  consistência entre módulos e acelera a construção de novas features.
                </p>
              </Block>
            </Section>

            <Section id="spacing" title="Espaçamento" description="Escala baseada em 4px (Tailwind).">
              <Block>
                <div className="space-y-2">
                  {SPACING.map((s) => (
                    <div key={s} className="flex items-center gap-4">
                      <div className="w-16 text-xs font-mono text-muted-foreground">{s} · {s * 4}px</div>
                      <div className="h-4 bg-primary rounded" style={{ width: `${s * 4}px` }} />
                    </div>
                  ))}
                </div>
              </Block>
            </Section>

            <Section id="radius" title="Raios e Bordas">
              <Block>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {RADII.map((r) => (
                    <div key={r.name} className="text-center">
                      <div className={cn("h-20 bg-primary/10 border-2 border-primary", r.cls)} />
                      <div className="text-xs mt-2 font-mono text-muted-foreground">{r.name}</div>
                    </div>
                  ))}
                </div>
              </Block>
            </Section>

            <Section id="shadows" title="Sombras">
              <Block>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {SHADOWS.map((s) => (
                    <div key={s.name} className="text-center">
                      <div className={cn("h-24 bg-card rounded-lg", s.cls)} />
                      <div className="text-xs mt-3 font-mono text-muted-foreground">{s.name}</div>
                    </div>
                  ))}
                </div>
              </Block>
            </Section>

            <Section id="grid" title="Grid e Layout">
              <Block title="Breakpoints">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Nome</TableHead><TableHead>Min-width</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {BREAKPOINTS.map((b) => (
                      <TableRow key={b.name}>
                        <TableCell className="font-mono">{b.name}</TableCell>
                        <TableCell className="font-mono">{b.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Block>
              <Block title="Grid 12 colunas">
                <div className="grid grid-cols-12 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-12 bg-primary/10 border border-primary/30 rounded flex items-center justify-center text-xs text-primary">{i + 1}</div>
                  ))}
                </div>
              </Block>
            </Section>

            <Section id="icons" title="Ícones" description="Lucide React. Clique para copiar o nome.">
              <Input
                placeholder="Buscar ícone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-xs"
              />
              <Block>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {filteredIcons.map((Icon, i) => (
                    <button
                      key={i}
                      onClick={() => copy(Icon.displayName || "")}
                      className="aspect-square flex flex-col items-center justify-center gap-1 rounded-lg border border-border hover:bg-muted transition"
                    >
                      <Icon className="h-5 w-5 text-foreground" />
                      <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
                        {Icon.displayName}
                      </span>
                    </button>
                  ))}
                </div>
              </Block>
            </Section>

            <Section id="buttons" title="Botões">
              <Block title="Variantes">
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </Block>
              <Block title="Tamanhos">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="Adicionar"><Plus className="h-4 w-4" /></Button>
                </div>
              </Block>
              <Block title="Estados">
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button disabled><Loader2 className="h-4 w-4 mr-2 animate-spin" />Carregando</Button>
                  <Button><Download className="h-4 w-4 mr-2" />Ícone à esquerda</Button>
                  <Button variant="secondary">Continuar<ArrowRight className="h-4 w-4 ml-2" /></Button>
                </div>
              </Block>
            </Section>

            <Section id="inputs" title="Inputs e Formulários">
              <Block>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ds-input">Text Input</Label>
                    <Input id="ds-input" placeholder="Digite algo..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ds-input-err">Com erro</Label>
                    <Input id="ds-input-err" aria-invalid className="border-destructive" defaultValue="valor inválido" />
                    <p className="text-xs text-destructive">Campo obrigatório</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ds-textarea">Textarea</Label>
                    <Textarea id="ds-textarea" placeholder="Sua mensagem" />
                  </div>
                  <div className="space-y-2">
                    <Label>Select</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Escolha..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a">Opção A</SelectItem>
                        <SelectItem value="b">Opção B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ds-check" /><Label htmlFor="ds-check">Aceito os termos</Label>
                  </div>
                  <RadioGroup defaultValue="1" className="flex gap-4">
                    <div className="flex items-center gap-2"><RadioGroupItem value="1" id="r1" /><Label htmlFor="r1">Opção 1</Label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="2" id="r2" /><Label htmlFor="r2">Opção 2</Label></div>
                  </RadioGroup>
                  <div className="flex items-center gap-2">
                    <Switch id="ds-switch" /><Label htmlFor="ds-switch">Ativar notificações</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Slider</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                </div>
              </Block>
            </Section>

            <Section id="cards" title="Cards">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Título do Card</CardTitle>
                    <CardDescription>Descrição breve</CardDescription>
                  </CardHeader>
                  <CardContent>Conteúdo principal do card.</CardContent>
                  <CardFooter><Button size="sm">Ação</Button></CardFooter>
                </Card>
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader><CardTitle>Card Interativo</CardTitle></CardHeader>
                  <CardContent className="text-muted-foreground">Passe o mouse para ver a elevação.</CardContent>
                </Card>
              </div>
            </Section>

            <Section id="badges" title="Badges">
              <Block>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge className="bg-success text-success-foreground">Success</Badge>
                  <Badge><Star className="h-3 w-3 mr-1" />Com ícone</Badge>
                </div>
              </Block>
            </Section>

            <Section id="alerts" title="Alertas">
              <div className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Informação</AlertTitle>
                  <AlertDescription>Mensagem informativa padrão.</AlertDescription>
                </Alert>
                <Alert className="border-success/50 text-success [&>svg]:text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>Operação concluída.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>Algo deu errado.</AlertDescription>
                </Alert>
              </div>
            </Section>

            <Section id="tables" title="Tabelas">
              <Block>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Nome</TableHead><TableHead>Status</TableHead><TableHead>Valor</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { n: "Pedido #1042", s: "Entregue", v: "R$ 45,00" },
                      { n: "Pedido #1043", s: "Pendente", v: "R$ 30,00" },
                      { n: "Pedido #1044", s: "Cancelado", v: "R$ 60,00" },
                    ].map((r) => (
                      <TableRow key={r.n}>
                        <TableCell>{r.n}</TableCell>
                        <TableCell><Badge variant="outline">{r.s}</Badge></TableCell>
                        <TableCell className="font-mono">{r.v}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Block>
            </Section>

            <Section id="dialogs" title="Modais e Dialogs">
              <Block>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild><Button variant="outline">Abrir Dialog</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar ação</DialogTitle>
                        <DialogDescription>Isto não pode ser desfeito.</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Sheet>
                    <SheetTrigger asChild><Button variant="outline">Abrir Sheet</Button></SheetTrigger>
                    <SheetContent><div className="p-4">Conteúdo lateral</div></SheetContent>
                  </Sheet>
                </div>
              </Block>
            </Section>

            <Section id="tabs" title="Tabs">
              <Block>
                <Tabs defaultValue="a">
                  <TabsList>
                    <TabsTrigger value="a">Aba A</TabsTrigger>
                    <TabsTrigger value="b">Aba B</TabsTrigger>
                    <TabsTrigger value="c">Aba C</TabsTrigger>
                  </TabsList>
                  <TabsContent value="a" className="text-muted-foreground pt-4">Conteúdo A</TabsContent>
                  <TabsContent value="b" className="text-muted-foreground pt-4">Conteúdo B</TabsContent>
                  <TabsContent value="c" className="text-muted-foreground pt-4">Conteúdo C</TabsContent>
                </Tabs>
              </Block>
            </Section>

            <Section id="tooltips" title="Tooltips e Popovers">
              <Block>
                <div className="flex gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
                    <TooltipContent>Tooltip informativo</TooltipContent>
                  </Tooltip>
                  <Popover>
                    <PopoverTrigger asChild><Button variant="outline">Popover</Button></PopoverTrigger>
                    <PopoverContent>Conteúdo do popover com mais detalhes.</PopoverContent>
                  </Popover>
                </div>
              </Block>
            </Section>

            <Section id="avatars" title="Avatares">
              <Block>
                <div className="flex items-center gap-4">
                  <Avatar className="h-8 w-8"><AvatarFallback>SM</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
                  <Avatar className="h-12 w-12"><AvatarFallback>LG</AvatarFallback></Avatar>
                  <Avatar className="h-16 w-16"><AvatarImage src="" /><AvatarFallback>XL</AvatarFallback></Avatar>
                  <div className="flex -space-x-2">
                    {["AB", "CD", "EF"].map((i) => (
                      <Avatar key={i} className="border-2 border-background"><AvatarFallback>{i}</AvatarFallback></Avatar>
                    ))}
                  </div>
                </div>
              </Block>
            </Section>

            <Section id="loading" title="Loading States">
              <Block>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Spinner</span>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <div>
                    <Label>Progress</Label>
                    <Progress value={65} className="mt-2" />
                  </div>
                </div>
              </Block>
            </Section>

            <Section id="patterns" title="Padrões de Página">
              <Block title="Dashboard">
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg border border-border p-4 bg-card">
                      <div className="text-xs text-muted-foreground">Métrica {i}</div>
                      <div className="text-2xl font-semibold text-foreground">R$ {i * 1234}</div>
                    </div>
                  ))}
                </div>
              </Block>
              <Block title="Listagem">
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8"><AvatarFallback>P{i}</AvatarFallback></Avatar>
                        <div>
                          <div className="text-sm font-medium">Item {i}</div>
                          <div className="text-xs text-muted-foreground">Descrição</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Ver</Button>
                    </div>
                  ))}
                </div>
              </Block>
            </Section>

            <div className="py-10 text-center text-xs text-muted-foreground">
              Design System — atualizado em {new Date().toLocaleDateString("pt-BR")}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
