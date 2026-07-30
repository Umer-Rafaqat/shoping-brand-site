const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

export default function ProductTabs({ activeTab, onChange }) {
  return (
    <div className="mt-16 flex items-center justify-center gap-10 border-b border-black/10 sm:justify-start sm:gap-14">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`flex h-14 items-center border-b-2 font-satoshi text-sm sm:text-base ${
            activeTab === tab
              ? "border-black font-medium text-black"
              : "border-transparent text-black/40"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
