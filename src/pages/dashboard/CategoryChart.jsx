import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { CAT_COLORS } from "../../utils/helpers";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { cat, total } = payload[0]?.payload || {};
  return (
    <div className="glass border-glow-cyan p-3 text-xs rounded-lg">
      <p style={{ color: "var(--ink2)", marginBottom: 4 }}>{cat}</p>
      <p className="mono" style={{ color: CAT_COLORS[cat] || "var(--cyan)" }}>{total} units</p>
    </div>
  );
};

export function CategoryChart({ stockByCategory = [] }) {
  const navigate = useNavigate();

  /* Recharts needs { cat, total } — both keys present in each object */
  const data = useMemo(() =>
    stockByCategory.map(c => ({
      cat:   c.cat,
      total: c.total,
      pct:   c.pct,
    })),
  [stockByCategory]);

  if (data.length === 0) {
    return (
      <div className="glass border-glow-cyan p-5 flex items-center justify-center h-full">
        <p style={{ color: "var(--mut)", fontSize: 13 }}>No category data</p>
      </div>
    );
  }

  return (
    <div className="glass border-glow-cyan p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold" style={{ color: "var(--ink)", fontFamily: '"Space Grotesk",sans-serif' }}>
          Stock by Category
        </h3>
        <p style={{ fontSize: 11, color: "var(--mut)", marginTop: 2 }}>Click bar → filter inventory</p>
      </div>

      {/* Recharts BarChart — works with { cat, total } data shape */}
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
          barCategoryGap="30%"
          onClick={(e) => {
            if (e?.activePayload?.[0]?.payload?.cat) {
              navigate(`/inventory?cat=${e.activePayload[0].payload.cat}`);
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="cat"
            tick={{ fill: "var(--mut)", fontSize: 9, fontFamily: '"JetBrains Mono",monospace' }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: "var(--mut)", fontSize: 9, fontFamily: '"JetBrains Mono",monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,255,255,0.04)" }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((entry) => (
              <Cell
                key={entry.cat}
                fill={CAT_COLORS[entry.cat] || "#6B74E8"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Progress bars below the chart */}
      <div className="mt-4 flex flex-col gap-2">
        {data.map(({ cat, total, pct }) => (
          <button
            key={cat}
            onClick={() => navigate(`/inventory?cat=${cat}`)}
            className="w-full text-left group btn-base"
            type="button"
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 11, color: "var(--ink2)" }} className="group-hover:text-white transition-colors">
                {cat}
              </span>
              <span className="mono" style={{ fontSize: 11, color: "var(--mut)" }}>{total}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: CAT_COLORS[cat] || "#6B74E8" }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
