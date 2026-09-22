import { useEffect, useRef, useState, useCallback } from "react";

// ─── Animated canvas ───────────────────────────────────────────────────────────

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    interface Node { x: number; y: number; vx: number; vy: number; r: number; pulse: number; pulseSpeed: number; }
    let nodes: Node[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodes = Array.from({ length: 48 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
        r: 1.5 + Math.random() * 2, pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
      }));
    };
    const onMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.pulse += n.pulseSpeed;
        if (n.x < -50) n.x = canvas.width + 50;
        if (n.x > canvas.width + 50) n.x = -50;
        if (n.y < -50) n.y = canvas.height + 50;
        if (n.y > canvas.height + 50) n.y = -50;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 210) {
            const a = (1 - dist / 210) * 0.14;
            const blend = (nodes[i].x + nodes[j].x) / 2 / canvas.width;
            ctx.strokeStyle = blend > 0.5 ? `rgba(0,212,170,${a})` : `rgba(59,158,255,${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const dx = n.x - mouseRef.current.x, dy = n.y - mouseRef.current.y;
        const prox = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 170);
        const a = 0.2 + 0.2 * Math.sin(n.pulse) + prox * 0.65;
        const blend = n.x / canvas.width;
        const r = Math.round(59 + (0 - 59) * blend), g = Math.round(158 + (212 - 158) * blend), b = Math.round(255 + (170 - 255) * blend);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + prox * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`; ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0,
      background: "radial-gradient(ellipse 85% 65% at 50% 40%, #0a1120 0%, #060910 100%)",
    }} />
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BLUE = "var(--blue)";
const TEAL = "var(--teal)";
const PURPLE = "#a78bfa";

// ─── Tipografia padronizada (página 01 como referência) ───
// Display: Plus Jakarta Sans | Corpo: Inter (via body em index.css)
const FONT_DISPLAY = "var(--font-display)";

function Badge({ children, color = BLUE }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "0.22rem 0.8rem", borderRadius: 999,
      fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
      color,
      fontFamily: FONT_DISPLAY,
    }}>{children}</span>
  );
}

function Card({ children, style = {}, accent }: { children: React.ReactNode; style?: React.CSSProperties; accent?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: `1px solid ${accent ? accent + "28" : "rgba(255,255,255,0.07)"}`,
      backdropFilter: "blur(16px)", borderRadius: "1.1rem",
      ...(accent ? { boxShadow: `0 0 30px ${accent}14` } : {}),
      ...style,
    }}>{children}</div>
  );
}

function Tick({ color }: { color: string }) {
  return <span style={{ color, marginTop: 2, flexShrink: 0 }}>✓</span>;
}

function Chevron({ color }: { color: string }) {
  return <span style={{ color, marginTop: 2, flexShrink: 0 }}>›</span>;
}

// ─── Slides ───────────────────────────────────────────────────────────────────

function S1() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2.5rem", maxWidth: 780 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(3rem,7vw,5.5rem)", color: "#fff", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.05 }}>
          Re<span style={{ color: BLUE }}>Vecta</span>
        </h1>
        <p style={{ margin: 0, fontSize: "1.05rem", color: "#ffffff", fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.5 }}>
          A Plataforma que une Mobilidade Elétrica e Inteligência Financeira — num só lugar.
        </p>
      </div>
      <Card style={{ maxWidth: 620, padding: "1.5rem 2.25rem", border: "1px solid rgba(59,158,255,0.2)" }}>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.85 }}>
          Acabou a complexidade. A ReVecta transforma uma experiência elétrica fragmentada numa gestão simples, transparente e financeiramente inteligente — para condutores e empresas que não querem escolher entre sustentabilidade e eficiência.
        </p>
      </Card>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
        {[
          { label: "Embedded Finance", color: BLUE },
          { label: "Inteligência Artificial", color: BLUE },
          { label: "Vehicle-to-Grid", color: BLUE },
          { label: "Mercado de Carbono", color: BLUE },
          { label: "Frotas Elétricas", color: BLUE },
        ].map(t => (
          <span key={t.label} style={{
            fontSize: "0.72rem", fontWeight: 600, padding: "0.3rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(59,158,255,0.1)",
            border: "1px solid rgba(59,158,255,0.3)",
            color: t.color,
            fontFamily: FONT_DISPLAY,
          }}>{t.label}</span>
        ))}
      </div>
    </div>
  );
}

function S2() {
  const items = [
    {
      icon: "",
      title: "Reembolso Doméstico Complexo",
      color: BLUE,
      quote: "Processamento manual de tarifários e perdas de eficiência anulam a poupança potencial ( 30 – 60% ).",
    },
    {
      icon: "",
      title: "Défice de Literacia de Condução",
      color: TEAL,
      quote: "Manuseamento desadequado do veículo elétrico, resultando em custos acrescidos de manutenção e desgaste da frota.",
    },
    {
      icon: "",
      title: "Fragmentação da Experiência de Carregamento",
      color: PURPLE,
      quote: "Informação e serviços dispersos por diferentes aplicações e operadores obrigam o condutor a realizar múltiplos passos e a cruzar dados para decidir onde, quando e como carregar.",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "1020px", display: "flex", flexDirection: "column", gap: "1rem", color: "#ffffff" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={BLUE}>02 — Problema B2B2C</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Barreiras à adoção da mobilidade elétrica{" "}
          <span style={{ color: BLUE }}>B2C + B2B</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {items.map((item) => (
          <Card key={item.title} accent={item.color} style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: item.color, lineHeight: 1.3 }}>
              {item.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65 }}>
                {item.quote}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function S4() {
  const b2c = [
    { title: "Clareza sobre autonomia, carregamentos e custos reais de utilização.", desc: "" },
    { title: "Apoio à escolha do veículo ou modo de transporte mais adequado a cada deslocação.", desc: "" },
    { title: "Onboarding, literacia e orientação para uma condução elétrica mais eficiente.", desc: "" },
  ];
  const b2b = [
    { title: "Gestão centralizada da frota e da respectiva operação.", desc: "" },
    { title: "Automatização de reembolsos, controlo de custos e acompanhamento da manutenção.", desc: "" },
    { title: "Monitorização do desempenho operacional e do impacto ambiental.", desc: "" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "980px", display: "flex", flexDirection: "column", gap: "1rem", color: "#fff", textAlign: "left" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={BLUE}>03 — Solução</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          O Ecossistema Unificado <span style={{ color: BLUE }}>ReVecta</span>
        </h2>
      </div>

      <Card accent={BLUE} style={{ width: "100%", boxSizing: "border-box", padding: "0.9rem 1.25rem", textAlign: "left" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: BLUE, marginBottom: "0.25rem" }}>
          O MVP
        </div>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>
          A ReVecta unifica numa única plataforma a experiência do condutor e da empresa.
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* B2C */}
        <Card accent={BLUE} style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: BLUE, textTransform: "uppercase", letterSpacing: "0.08em" }}>B2C — Condutor</div>
          {b2c.map((f) => (
            <div key={f.title} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65 }}>{f.title}</div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </Card>

        {/* B2B */}
        <Card accent={TEAL} style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: TEAL, textTransform: "uppercase", letterSpacing: "0.08em" }}>B2B — Gestor de Frota</div>
          {b2b.map((f) => (
            <div key={f.title} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65 }}>{f.title}</div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Bottom — Visão de Futuro */}
      <Card style={{ padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid rgba(167,139,250,0.25)", background: "rgba(167,139,250,0.06)" }}>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: PURPLE, marginBottom: "0.35rem" }}>Visão de Escalabilidade</div>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#fff", lineHeight: 1.65 }}>
            A arquitetura da plataforma ficará preparada para integrar <strong style={{ color: PURPLE, fontWeight: 700 }}>Smart Charging e Vehicle-to-Grid</strong>, permitindo rentabilizar a energia armazenada nos veículos durante os períodos que se encontram estacionados. Em paralelo, um <strong style={{ color: PURPLE, fontWeight: 700 }}>Mercado de Créditos de Carbono</strong> permitirá também valorizar os quilómetros percorridos com energia sustentável.
          </p>
        </div>
      </Card>
    </div>
  );
}

function S5() {
  const markets = [
    {
      label: "TAM", name: "Mercado Endereçável Total", color: BLUE,
      value: "659.336 VE",
      sub: "Projeção 2030 — Portugal",
      desc: "• Base ( final de 2025 ): 243.954 veículos BEV\n\n• Escala: ~2,7x até 2030 ( CAGR de 22% )\n\n• Impacto: Eletrificação acelerada do parque automóvel nacional.",
    },
    {
      label: "SAM", name: "Mercado Útil Disponível", color: TEAL,
      value: "236.250 VE",
      sub: "Segmento Empresarial B2B — 2026",
      desc: "• Expansão liderada pelo segmento empresarial.\n\n• 85% planeiam instalar postos nas próprias instalações.",
    },
    {
      label: "SOM", name: "Mercado Útil Obtível — Anos 1–3", color: PURPLE,
      value: "1.890 VE",
      sub: "4% do subsegmento-alvo",
      desc: "• Meta de captação focado nos primeiros 3 anos de operação.\n\n• Foco direto no universo de 20% das empresas com soluções de carregamento residencial.",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "920px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={TEAL}>04 — Tamanho de Mercado</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Oportunidade Escalável:{" "}
          <span style={{ color: TEAL }}>Dados Reais, Metas Realistas</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {markets.map((m) => (
          <Card key={m.label} style={{ padding: "1.4rem", textAlign: "center", position: "relative", overflow: "hidden", border: `1px solid ${m.color}33` }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color }} />
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: m.color, fontFamily: FONT_DISPLAY, marginBottom: "0.75rem" }}>{m.label}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "1.65rem", color: "#fff", marginBottom: "0.2rem" }}>{m.value}</div>
            <div style={{ fontSize: "0.75rem", color: m.color, fontWeight: 600, marginBottom: "0.75rem", fontFamily: FONT_DISPLAY }}>{m.sub}</div>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65, whiteSpace: "pre-line" }}>{m.desc}</p>
          </Card>
        ))}
      </div>
      <Card style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid rgba(59,158,255,0.15)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: "#fff", marginBottom: "0.2rem" }}>Porquê Agora?</div>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>
            A <strong style={{ color: BLUE }}>Taxonomia da UE</strong> e as diretivas <strong style={{ color: BLUE }}>ESG/CSRD</strong> forçam as empresas a agir já. A transição para frotas sustentáveis e as metas de descontinuação de novos veículos a combustão criam uma urgência regulatória sem precedentes.
          </p>
        </div>
      </Card>
    </div>
  );
}

function S6() {
  return (
    <div style={{ width: "100%", maxWidth: "920px", display: "flex", flexDirection: "column", gap: "2rem", color: "#ffffff" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={BLUE}>05 — Validação de Conceito & Tecnologia</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em" }}>
          Dados Reais e{" "}
          <span style={{ color: BLUE }}>Tecnologia Comprovada</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "stretch" }}>
        <Card accent={BLUE} style={{ padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem", height: "100%" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: BLUE, lineHeight: 1.25 }}>Investigação Qualitativa</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", flex: 1, justifyContent: "space-between" }}>
            {[
              { label: "Entrevistas Semi-Estruturadas", value: "20" },
              { label: "Período de recolha", value: "13 a 20 Jul 2026" },
              { label: "Amostra — Mulheres", value: "36,8%" },
              { label: "Amostra — Homens", value: "63,2%" },
              { label: "Experiência média com VE", value: "2 anos e 10 meses" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", padding: "0.55rem 0" }}>
                <span style={{ fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.45 }}>{s.label}</span>
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1rem", color: "#ffffff", whiteSpace: "nowrap" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
          <Card accent={TEAL} style={{ padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem", height: "100%" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: BLUE, lineHeight: 1.25 }}>Casos de Sucesso</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", flex: 1, justifyContent: "space-between" }}>
              {[
                { name: "Projeto Galp / Nissan (Portugal)", note: "Em São Miguel, cada veículo poderá gerar uma receita mensal na ordem dos nove euros." },
                { name: "AYR Platform (Portugal)", note: "Dados reais de mobilidade sustentável transformados em tokens de carbono transacionáveis por empresas locais." },
              ].map((r) => (
                <div key={r.name} style={{ display: "flex", flexDirection: "column", gap: "0.45rem", padding: "0.55rem 0" }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.05rem", color: "#ffffff", lineHeight: 1.35, margin: 0 }}>{r.name}</div>
                  <div style={{ fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6, margin: 0 }}>{r.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function S7() {
  const streams = [
    {
      num: "01", color: BLUE, title: "Subscrição B2B (SaaS)",
      desc: "Mensalidade por veículo corporativo integrado na plataforma de gestão de frotas e automação de reembolsos.",
      metrics: [
        { label: "Modelo", value: "Por veículo/mês" },
        { label: "Segmento", value: "PMEs com frota" },
      ],
    },
    {
      num: "02", color: TEAL, title: "Unit Economics V2G (Arbitragem OMIE)",
      desc: "Projeção de receita média diária por veículo com margem retida pela plataforma.",
      metrics: [
        { label: "Receita bruta/veículo/dia", value: "2,00€" },
        { label: "OPEX (incl. degradação)", value: "0,75€" },
        { label: "Desconto ao cliente", value: "1,00€" },
        { label: "Margem retida", value: "0,25€" },
      ],
    },
    {
      num: "03", color: PURPLE, title: "Comissões B2B2C / Serviços Financeiros",
      desc: "Venda de hardware e intermediação de Embedded Finance.",
      metrics: [
        { label: "Wallboxes (hardware)", value: "Venda directa" },
        { label: "Seguros EV", value: "Comissão" },
        { label: "Tokenização de créditos", value: "% transação" },
      ],
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={BLUE}>06 — Modelo de Negócio</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em" }}>
          Receitas{" "}
          <span style={{ color: BLUE }}>Diversificadas e Escaláveis</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {streams.map((s) => (
          <Card key={s.num} accent={s.color} style={{ padding: "1.5rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: s.color, fontFamily: FONT_DISPLAY, textTransform: "uppercase" }}>Stream {s.num}</span>
            </div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: "#fff", marginBottom: "0.4rem" }}>{s.title}</div>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "auto" }}>
              {s.metrics.map((m) => (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", padding: "0.35rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "#ffffff" }}>{m.label}</span>
                  <span style={{ color: s.color, fontFamily: FONT_DISPLAY, fontWeight: 600 }}>{m.value}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Card accent={TEAL} style={{ width: "100%", boxSizing: "border-box", padding: "0.85rem 1.25rem" }}>
        <p style={{ margin: 0, color: "#ffffff", fontSize: "0.8rem", lineHeight: 1.5, fontStyle: "italic" }}>
          *Os valores apresentados no Stream 02 são estimativas meramente ilustrativas para demonstração do modelo de negócio.
        </p>
      </Card>
    </div>
  );
}

function S8() {
  const competitors = [
    { name: "Miio", x: 24, y: 20, category: "App PT" },
    { name: "Via Verde", x: 26, y: 32, category: "App PT" },
    { name: "Geotab", x: 24, y: 68, category: "Telemetria" },
    { name: "Samsara", x: 26, y: 82, category: "Telemetria" },
    { name: "ESG e reporting", x: 72, y: 75, category: "Eixo" },
  ];

  const advantages = [
    "Especialização crescente das plataformas",
    "Dados dispersos entre múltiplos sistemas.",
    "Operações distribuídas por diferentes fornecedores.",
  ];

  return (
    <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={TEAL}>07 — Paisagem Competitiva</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em" }}>
          Benchmark:{" "}
          <span style={{ color: TEAL }}>A Nossa Vantagem Única</span>
        </h2>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>Análise baseada em 27+ intervenientes no ecossistema global</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <Card style={{ padding: "1.4rem", position: "relative", boxSizing: "border-box", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem", textAlign: "center" }}>
            CARREGAMENTO
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 160 }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", left: 6, top: "50%", transform: "translate(-50%,-50%) rotate(-90deg)", transformOrigin: "center", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
              GESTÃO DE FROTAS
            </div>
            <div style={{ position: "absolute", right: 6, top: "50%", transform: "translate(50%,-50%) rotate(90deg)", transformOrigin: "center", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
              SUSTENTABILIDADE
            </div>
            {competitors.map((c) => (
              <div key={c.name} style={{ position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%,-50%)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{c.name}</span>
              </div>
            ))}
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: TEAL, boxShadow: `0 0 16px ${TEAL}` }} />
              <span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 10, color: TEAL, fontFamily: FONT_DISPLAY, fontWeight: 700, marginTop: 4 }}>ReVecta</span>
            </div>
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: TEAL, letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>
            Análise de Mercado
          </div>
          {advantages.map((a) => (
            <Card key={a} style={{ padding: "0.65rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Tick color={TEAL} />
              <span style={{ fontSize: "0.95rem", color: "#ffffff" }}>{a}</span>
            </Card>
          ))}

          <Card style={{ padding: "0.65rem 1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: TEAL }}>O Nosso Posicionamento</div>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>
              Enquanto os líderes do setor se especializam num domínio específico, a ReVecta procura integrar a experiência da mobilidade elétrica numa única camada operacional.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function S9() {
  const channels = [
    {
      icon: "🏛️", color: BLUE, title: "Apoio Institucional",
      desc: "Criação de uma SPV energética como Agregador Independente (ERSE/OMIE), garantindo conformidade e acesso ao mercado energético.",
    },
    {
      icon: "🔌", color: TEAL, title: "Hardware / Modelos FaaS",
      desc: "Cooperação estratégica com fabricantes de Wallbox e desenvolvedores de soluções tecnológicas.",
    },
    {
      icon: "🇵🇹", color: PURPLE, title: "Integração Governamental",
      desc: "Ligação direta à rede MOBI.E para uma utilização pública sem fricções desde o dia 1.",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "920px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={BLUE}>08 — Estratégia Go-To-Market</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em" }}>
          Estratégia GTM e{" "}
          <span style={{ color: BLUE }}>Parcerias Estratégicas</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {channels.map((c) => (
          <Card key={c.title} accent={c.color} style={{ padding: "1.15rem", display: "flex", flexDirection: "column", gap: "0.3rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.color }} />
            <div>
              <div style={{ width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", background: `${c.color}18`, flexShrink: 0, marginBottom: "0.75rem" }}>{c.icon}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: c.color, lineHeight: 1.3, minHeight: "2.75rem", display: "flex", alignItems: "flex-start" }}>{c.title}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <span style={{ fontSize: "1.5rem" }}>🎯</span>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "1.15rem", color: "#fff", marginBottom: "0.3rem" }}>ICP Inicial</div>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>PMEs portuguesas com 5–50 veículos, sectores de serviços e logística, com pressão ESG crescente.</p>
        </div>
      </Card>
    </div>
  );
}

function S10() {
  return (
    <div style={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={TEAL}>09 — Equipa</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Da Academia à Realidade: <span style={{ color: TEAL }}>Quem Somos</span>
        </h2>
      </div>

      <Card accent={BLUE} style={{ width: "100%", boxSizing: "border-box", padding: "1rem 1.25rem" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.05rem", color: BLUE, marginBottom: "0.5rem" }}>
          Porquê nós?
        </div>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.65 }}>
          Somos a equipa certa porque unimos uma visão de produto estrategicamente validada a uma execução técnica robusta. Esta sinergia transatlântica garante uma plataforma perfeitamente desenhada e operacionalmente estável.
        </p>
      </Card>

      {/* Team cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Rebeca */}
        <Card style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem", border: "1px solid rgba(59,158,255,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg,#3B9EFF 0%,#00D4AA 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "1.15rem", color: "#fff", letterSpacing: "-0.02em" }}>RV</div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.05rem", color: "#ffffff", lineHeight: 1.2 }}>Rebeca Venâncio</div>
              <div style={{ fontSize: "0.75rem", color: BLUE, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: "0.25rem" }}>Founder &amp; Head of Product</div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "Conceito acolhido na Divisão de Inovação do Novo Banco",
              "Estudante no IPAM — foco em Service Design e UX/UI",
              "Conduz o User Research e a comunicação estratégica da plataforma",
            ].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {["UX/UI", "Service Design", "User Research", "IPAM"].map(t => (
              <span key={t} style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: "999px", background: "rgba(59,158,255,0.1)", border: "1px solid rgba(59,158,255,0.25)", color: BLUE }}>{t}</span>
            ))}
          </div>
        </Card>

        {/* José */}
        <Card style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem", border: "1px solid rgba(0,212,170,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg,#00D4AA 0%,#3B9EFF 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "1.15rem", color: "#fff", letterSpacing: "-0.02em" }}>JG</div>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.05rem", color: "#ffffff", lineHeight: 1.2 }}>José Flávio Gama</div>
              <div style={{ fontSize: "0.75rem", color: TEAL, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: "0.25rem" }}>Co-Fundador &amp; Tech Lead</div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "Analista Funcional com experiência no Mercado Eletrônico",
              "Lidera a arquitectura técnica e a automação de dados em Python",
              "Garante a estabilidade operacional de todo o ecossistema ReVecta",
            ].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {["Python", "Arquitectura Técnica", "Operações", "Dados"].map(t => (
              <span key={t} style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: "999px", background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.25)", color: TEAL }}>{t}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function S11() {
  const phases = [
    {
      horizon: "MVP", period: "Próximos 6 Meses", color: BLUE,
      items: ["Constituição da empresa e desenvolvimento do MVP", "Integração de dados de utilização, carregamento e custos", "Onboarding, reembolsos e recomendações inteligentes", "Pilotos com PMEs e avaliação dos resultados"],
    },
    {
      horizon: "Médio Prazo", period: "6 a 18 Meses — Capacidades Avançadas", color: TEAL,
      items: ["Integração de APIs de veículos, CPMS e eMSP", "Evolução da IA com aprendizagem contínua", "Otimização dos carregamentos e custos energéticos", "Modelo SaaS e primeiros clientes recorrentes"],
    },
    {
      horizon: "Longo Prazo", period: "18 Meses+ — Evolução Macro", color: PURPLE,
      items: ["Expansão de parceiros e compatibilidade tecnológica", "Operacionalização do V2G em ambientes controlados", "Valorização verificável das emissões evitadas", "Lançamento progressivo do Mercado de Créditos de Carbono"],
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "960px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={PURPLE}>10 — Cronograma de Desenvolvimento</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0.5rem", letterSpacing: "-0.02em" }}>
          Roadmap de{" "}
          <span style={{ color: PURPLE }}>Implementação e Visão</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {phases.map((p, i) => (
          <Card key={p.horizon} accent={p.color} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.color }} />
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, fontFamily: FONT_DISPLAY, marginBottom: "0.2rem" }}>
                Fase {i + 1}
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: "#fff" }}>{p.horizon}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>{p.period}</div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {p.items.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.5 }}>
                  <Chevron color={p.color} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0" }}>
        {phases.map((p, i) => (
          <div key={p.horizon} style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
            <div style={{ height: 2, flex: 1, background: i < 2 ? `linear-gradient(90deg,${p.color},${phases[i + 1]?.color ?? p.color})` : p.color, opacity: 0.3 }} />
          </div>
        ))}
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
      </div>
    </div>
  );
}

function BlankSlide() {
  const asks = [
    {
      title: "Capacitação tecnológica", color: BLUE,
      desc: "Contacto com parceiros de desenvolvimento ou apoio no recrutamento para escalar a nossa infraestrutura.",
    },
    {
      title: "Aconselhamento regulatório", color: TEAL,
      desc: "Mentoria jurídica especializada para o enquadramento do modelo V2G junto da ERSE e OMIE no mercado energético português.",
    },
    {
      title: "Acesso ao mercado B2B", color: PURPLE,
      desc: "Ligação da ReVecta à rede de PMEs da incubadora para a realização de testes-piloto da nossa funcionalidade de automação de reembolsos.",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "1000px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <Badge color={BLUE}>11 — Pedido de Incubação</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Pedido de Incubação{" "}
          <span style={{ color: BLUE }}>(The Ask)</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", width: "100%" }}>
        {asks.map((a) => (
          <Card key={a.title} accent={a.color} style={{ padding: "1.5rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: a.color }} />
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "1.15rem", color: a.color, lineHeight: 1.3 }}>{a.title}</div>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#ffffff", lineHeight: 1.6 }}>{a.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function S12() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem", maxWidth: 640 }}>
      <div>
        <Badge color={TEAL}>12 — Fecho</Badge>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.8rem)", color: "#fff", margin: "0.75rem 0 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          O Futuro não Gasta Energia.
          <br /><span style={{ color: TEAL }}>Rentabiliza-a.</span>
        </h2>
      </div>
      <p style={{ fontSize: "0.88rem", color: "#ffffff", lineHeight: 1.75, maxWidth: 500, margin: 0 }}>
        Junte-se a nós para redefinir o paradigma da mobilidade na Ibéria, unindo Finanças, Energia e Sustentabilidade de forma lucrativa e inteligente.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%" }}>
        <Card style={{ padding: "1.1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "1.5rem" }}>✉️</span>
          <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", fontFamily: FONT_DISPLAY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Email</div>
          <div style={{ fontSize: "0.78rem", color: BLUE }}>hello@revecta.pt</div>
        </Card>
        {/* Sem URL de protótipo definida ainda — card informativo, não um link.
            Quando existir o link (Figma / TestFlight / vídeo demo), trocar por <a href={URL}>. */}
        <div style={{ borderRadius: "1rem", background: "linear-gradient(135deg,rgba(0,212,170,0.15),rgba(59,158,255,0.1))", border: "1px solid rgba(0,212,170,0.35)", padding: "1.1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", boxShadow: "0 0 24px rgba(0,212,170,0.12)" }}>
          <span style={{ fontSize: "1.5rem" }}>▶</span>
          <div style={{ fontSize: "0.62rem", fontWeight: 600, color: TEAL, fontFamily: FONT_DISPLAY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Ver Protótipo</div>
          <div style={{ fontSize: "0.72rem", color: "#ffffff", fontWeight: 500 }}>Explorar o MVP →</div>
        </div>
      </div>
      <Card style={{ padding: "0.85rem 1.75rem", border: "1px solid rgba(0,212,170,0.2)", boxShadow: "0 0 30px rgba(0,212,170,0.07)" }}>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: "#fff" }}>ReVecta</span>
          {" "}— A Plataforma Integrada de Mobilidade Elétrica e Gestão Financeira
        </p>
      </Card>
    </div>
  );
}

// ─── Slide engine ─────────────────────────────────────────────────────────────

const SLIDES = [S1, S2, S4, S5, S6, S7, S8, S9, S10, S11, BlankSlide, S12];
const LABELS = ["Capa", "Problema B2C", "Solução", "Mercado", "Validação", "Modelo de Negócio", "Competitivo", "Go-To-Market", "Equipa", "Roadmap", "", "Fecho"];
type SlideState = "enter" | "exit" | "below";

function SlideWrapper({ state, children }: { state: SlideState; children: React.ReactNode }) {
  return (
    <div className={`slide ${state === "enter" ? "slide-enter" : state === "exit" ? "slide-exit" : "slide-below"}`}>
      {children}
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<"fwd" | "bwd">("fwd");

  const go = useCallback((next: number) => {
    if (next < 0 || next >= SLIDES.length || next === current) return;
    setDir(next > current ? "fwd" : "bwd");
    setPrev(current);
    setCurrent(next);
    setTimeout(() => setPrev(null), 560);
  }, [current]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") go(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(current - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [current, go]);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      <AnimatedBackground />

      {/* Slides */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1 }}>
        {SLIDES.map((Comp, i) => {
          let state: SlideState;
          if (i === current) state = "enter";
          else if (i === prev) state = dir === "fwd" ? "exit" : "below";
          else state = i < current ? "exit" : "below";
          return <SlideWrapper key={i} state={state}><Comp /></SlideWrapper>;
        })}
      </div>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 20, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,var(--blue),var(--teal))", width: `${((current + 1) / SLIDES.length) * 100}%`, transition: "width 0.5s ease", borderRadius: "0 2px 2px 0" }} />
      </div>

      {/* Top left — slide info */}
      <div style={{ position: "fixed", top: "1.25rem", left: "2rem", zIndex: 10, display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "0.75rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>
          {String(current + 1).padStart(2, "0")} / {SLIDES.length}
        </span>
        <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontFamily: FONT_DISPLAY, fontWeight: 500 }}>{LABELS[current]}</span>
      </div>

      {/* Top right — logo */}
      <div style={{ position: "fixed", top: "1.25rem", right: "2rem", zIndex: 10, display: "flex", alignItems: "center", gap: "0.45rem" }}>
      </div>

      {/* Dot nav */}
      <div style={{ position: "fixed", bottom: "1.75rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: "0.35rem" }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{
            width: i === current ? 22 : 5, height: 5, borderRadius: 999, border: "none",
            background: i === current ? "var(--blue)" : "rgba(255,255,255,0.14)",
            cursor: "pointer", transition: "all 0.3s ease", padding: 0,
          }} />
        ))}
      </div>

      {/* Prev / Next */}
      {[
        { side: "left", disabled: current === 0, icon: "‹", onClick: () => go(current - 1) },
        { side: "right", disabled: current === SLIDES.length - 1, icon: "›", onClick: () => go(current + 1) },
      ].map((btn) => (
        <button key={btn.side} onClick={btn.onClick} disabled={btn.disabled} style={{
          position: "fixed", [btn.side]: "1.25rem", top: "50%", transform: "translateY(-50%)", zIndex: 10,
          width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)",
          color: btn.disabled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.55)",
          cursor: btn.disabled ? "default" : "pointer", fontSize: "1.1rem",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
        }}>{btn.icon}</button>
      ))}
    </div>
  );
}
