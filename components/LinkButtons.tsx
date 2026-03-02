interface Link {
  label: string;
  url: string;
}

export default function LinkButtons({ links }: { links: Link[] }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
      <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3">
        Quick Links
      </h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
