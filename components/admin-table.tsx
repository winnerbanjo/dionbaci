type AdminTableProps = {
  title: string;
  columns: string[];
  rows: string[][];
};

export function AdminTable({ title, columns, rows }: AdminTableProps) {
  return (
    <section className="border border-line bg-paper shadow-card">
      <div className="border-b border-line px-6 py-5 sm:px-8">
        <p className="text-sm uppercase tracking-[0.24em]">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-line">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-[11px] uppercase tracking-[0.22em] text-mist sm:px-8"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`} className="border-b border-line last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="px-6 py-5 text-sm text-ink sm:px-8">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
